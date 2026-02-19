const axios = require('axios');
const fs = require('fs');
const path = require('path');
const minimist = require('minimist');

// --- Helper: Get Config ---
function getConfig() {
    // 1. Try Environment Variables
    if (process.env.FEISHU_APP_ID && process.env.FEISHU_APP_SECRET) {
        return { appId: process.env.FEISHU_APP_ID, appSecret: process.env.FEISHU_APP_SECRET };
    }

    // 2. Try OpenClaw Config (Standard Path)
    const configPath = '/home/node/.openclaw/gateway/config.json';
    if (fs.existsSync(configPath)) {
        try {
            const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            if (config.channels && config.channels.feishu) {
                return {
                    appId: config.channels.feishu.appId,
                    appSecret: config.channels.feishu.appSecret
                };
            }
        } catch (e) {
            console.warn("Failed to parse gateway config:", e.message);
        }
    }
    
    // 3. Try Local config.json
    if (fs.existsSync('config.json')) {
         try {
            const localConfig = JSON.parse(fs.readFileSync('config.json', 'utf8'));
            return { appId: localConfig.app_id, appSecret: localConfig.app_secret };
        } catch (e) {}
    }

    throw new Error("Feishu credentials not found. Set FEISHU_APP_ID/SECRET env vars or configure OpenClaw.");
}

// --- Helper: Get Tenant Token ---
async function getTenantAccessToken(appId, appSecret) {
    try {
        const res = await axios.post('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
            "app_id": appId,
            "app_secret": appSecret
        });
        if (res.data.code === 0) {
            return res.data.tenant_access_token;
        }
        throw new Error(`Auth Failed: ${res.data.msg}`);
    } catch (error) {
        throw new Error(`Network Error during Auth: ${error.message}`);
    }
}

// --- Action: Get Sheet Meta ---
async function getSheetMeta(token, accessToken) {
    const url = `https://open.feishu.cn/open-apis/sheets/v3/spreadsheets/${token}/sheets/query`;
    const res = await axios.get(url, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    if (res.data.code === 0) {
        return res.data.data.sheets;
    }
    throw new Error(`Meta API Failed: ${JSON.stringify(res.data)}`);
}

// --- Action: Read Range ---
async function readSheetRange(token, range, accessToken) {
    // Note: V2 API is often simpler for raw values
    const url = `https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/${token}/values/${range}`;
    const res = await axios.get(url, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    if (res.data.code === 0) {
        return res.data.data.valueRange.values;
    }
    throw new Error(`Read API Failed: ${JSON.stringify(res.data)}`);
}

// --- Main Logic ---
async function main() {
    const args = minimist(process.argv.slice(2));
    const action = args.action || 'read'; // read, meta
    const token = args.token;
    
    if (!token) {
        console.error("Error: --token <spreadsheet_token> is required.");
        process.exit(1);
    }

    try {
        const { appId, appSecret } = getConfig();
        const accessToken = await getTenantAccessToken(appId, appSecret);

        if (action === 'meta') {
            const sheets = await getSheetMeta(token, accessToken);
            console.log(JSON.stringify(sheets, null, 2));
        } 
        else if (action === 'read') {
            let range = args.range;
            
            // If no range provided, fetch meta to find the first sheet
            if (!range) {
                const sheets = await getSheetMeta(token, accessToken);
                if (!sheets || sheets.length === 0) throw new Error("No sheets found.");
                const firstSheetId = sheets[0].sheet_id;
                // Default range: FirstSheet!A1:Z100 (Safe default)
                range = `${firstSheetId}!A1:Z100`;
                console.log(`No range specified. Defaulting to first sheet: ${range}`);
            }

            const values = await readSheetRange(token, range, accessToken);
            console.log(JSON.stringify(values, null, 2));
        } else {
            console.error(`Unknown action: ${action}`);
        }

    } catch (err) {
        console.error("Execution Failed:", err.message);
        process.exit(1);
    }
}

main();
