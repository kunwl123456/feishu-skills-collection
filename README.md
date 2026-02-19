# OpenClaw Feishu Skills Collection

[中文文档 (Chinese Documentation)](README.zh-CN.md)

This repository contains a curated collection of **OpenClaw Agent Skills** specifically designed for deep integration with **Feishu (Lark)**.

These skills enable AI agents to read/write documents, manage spreadsheets (Bitable), handle permissions, send rich messages, and interact with the Feishu ecosystem seamlessly.

## 📦 Installation

To install these skills into your OpenClaw agent workspace:

### Method 1: Git Clone (Recommended)
Navigate to your agent's workspace `skills` directory and clone this repository:

```bash
cd /home/node/.openclaw/workspace/skills
# Clone specific folders or the whole repo
git clone https://github.com/kunwl123456/feishu-skills-collection.git feishu_suite
```

*Note: You may need to move the inner folders up one level depending on your OpenClaw configuration, or map them directly.*

### Method 2: Manual Copy
1. Download the repository.
2. Copy the skill folders (e.g., `feishu-doc`, `feishu-bitable`) into your agent's `skills/` directory.
3. Ensure the `common/` folder is also copied, as some skills share dependencies.

## 🛠 Usage Instructions (For AI Agents)

**System Prompt Injection:**
Ensure your agent discovers these skills by scanning the `skills/` directory. The agent should read the `SKILL.md` file within each folder to understand its capabilities.

### Key Skills & Triggers

| Skill Name | Directory | Trigger / Capability |
| :--- | :--- | :--- |
| **Feishu Doc** | `feishu-doc` | Read/Write Docs, Sheets, Bitables. *Trigger: "Read this doc", "Update the table"* |
| **Feishu Drive** | `feishu-drive` | Manage Cloud Drive files/folders. *Trigger: "Create a folder", "Move file"* |
| **Feishu Wiki** | `feishu-wiki` | Knowledge Base navigation. *Trigger: "Search wiki", "Find node"* |
| **Feishu PM** | `feishu-pm` | Project Management in Bitable. *Trigger: "Add task", "List project status"* |
| **Feishu Sticker** | `feishu-sticker` | Send native stickers/images. *Trigger: "Send a meme"* |

### Dependency Management
Some skills require shared libraries located in the `common/` directory. If you encounter "Module not found" errors, ensure `npm install` has been run in the respective skill directory or the root.

## 🤖 AI Context
When acting as an agent:
1. **Check Capabilities:** Use `ls skills/` to see available tools.
2. **Read Instructions:** Use `read skills/<skill-name>/SKILL.md` to learn how to use a specific tool.
3. **Execute:** Call the tools defined in the skill (e.g., `feishu_doc`, `feishu_bitable_get_record`).
