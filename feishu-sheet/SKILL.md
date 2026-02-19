# Feishu Sheet Skill

Read content from Feishu Sheets (spreadsheets) using raw API to avoid SDK limitations.

## Usage

```bash
# Read default range (First Sheet A1:Z100)
node index.js --token <spreadsheet_token>

# Read specific range
node index.js --token <spreadsheet_token> --range <sheetId>!A1:B10

# Get Metadata (List sheets)
node index.js --action meta --token <spreadsheet_token>
```

## Features
- **Auto-Auth**: Automatically finds `appId` and `appSecret` from OpenClaw's global config or environment variables.
- **Raw API**: Uses `axios` to bypass potential SDK network issues.
- **Smart Defaults**: If no range is specified, it fetches metadata to find the first sheet ID and reads a default range.
