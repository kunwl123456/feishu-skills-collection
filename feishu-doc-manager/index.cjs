const axios = require('axios');
const fs = require('fs');

async function getToken() {
    const res = await axios.post('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
        app_id: process.env.FEISHU_APP_ID,
        app_secret: process.env.FEISHU_APP_SECRET
    });
    return res.data.tenant_access_token;
}

// Simple Markdown to Blocks Parser
function parseMarkdown(text) {
    const lines = text.split('\n');
    const blocks = [];

    for (const lineRaw of lines) {
        if (!lineRaw.trim()) continue;
        
        // Clean line for text processing (Keep structure markers but clean bold/italic markers)
        let line = lineRaw;

        if (line.startsWith('# ')) {
            blocks.push({ block_type: 3, heading1: { elements: [{ text_run: { content: line.substring(2).replace(/\*/g, '') } }], style: {} } });
        } else if (line.startsWith('## ')) {
            blocks.push({ block_type: 4, heading2: { elements: [{ text_run: { content: line.substring(3).replace(/\*/g, '') } }], style: {} } });
        } else if (line.startsWith('### ')) {
            blocks.push({ block_type: 5, heading3: { elements: [{ text_run: { content: line.substring(4).replace(/\*/g, '') } }], style: {} } });
        } else if (line.startsWith('- ')) {
            // Fallback: Use Text for bullets
            blocks.push({ block_type: 2, text: { elements: [{ text_run: { content: "• " + line.substring(2).replace(/\*/g, '') } }] } });
        } else if (line.startsWith('> ')) {
            // Fallback: Use Text for quotes
            blocks.push({ block_type: 2, text: { elements: [{ text_run: { content: "▌ " + line.substring(2).replace(/\*/g, '') } }] } });
        } else {
            // Aggressively clean text
            const cleanText = line.replace(/\*\*/g, '').replace(/\*/g, '');
            blocks.push({ block_type: 2, text: { elements: [{ text_run: { content: cleanText } }] }, style: {} });
        }
    }
    return blocks;
}

async function main() {
    const args = process.argv.slice(2);
    const action = args[0]; // 'write'
    const docToken = args[1];
    const filePath = args[2];

    if (!docToken || !filePath) {
        console.error("Usage: node index.js write <doc_token> <file_path>");
        return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const blocks = parseMarkdown(content);
    const token = await getToken();

    // 1. Get Root Block
    const blocksRes = await axios.get(`https://open.feishu.cn/open-apis/docx/v1/documents/${docToken}/blocks`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const rootBlock = blocksRes.data.data.items.find(b => b.block_type === 1); // Page block
    const rootBlockId = rootBlock ? rootBlock.block_id : blocksRes.data.data.items[0].block_id;

    console.log("Skipping clear (API unstable). Appending new content.");

    console.log(`Writing ${blocks.length} blocks to ${docToken}...`);
    
    // Batch insert (limit 50 per request)
    const BATCH_SIZE = 50;
    for (let i = 0; i < blocks.length; i += BATCH_SIZE) {
        const chunk = blocks.slice(i, i + BATCH_SIZE);
        await axios.post(`https://open.feishu.cn/open-apis/docx/v1/documents/${docToken}/blocks/${rootBlockId}/children`, {
            children: chunk
        }, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log(`Wrote batch ${i/BATCH_SIZE + 1}`);
    }
    
    console.log("Done!");
}

main();
