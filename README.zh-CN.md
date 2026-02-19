# OpenClaw 飞书 (Feishu) 技能库

[English Documentation](README.md)

本仓库汇集了专为 **OpenClaw AI Agent** 设计的 **飞书 (Lark)** 深度集成技能 (Skills)。

通过这些技能，AI 智能体可以实现读取/编辑飞书文档、管理多维表格 (Bitable)、处理文件权限、发送富文本卡片消息以及与飞书生态系统进行无缝交互。

## 📦 安装指南

将这些技能安装到 OpenClaw 工作区：

### 方法 1: Git Clone (推荐)
进入 Agent 的 `skills` 目录并克隆本仓库：

```bash
cd /home/node/.openclaw/workspace/skills
git clone https://github.com/kunwl123456/feishu-skills-collection.git feishu_suite
```

### 方法 2: 手动复制
1. 下载本仓库代码。
2. 将具体的技能文件夹 (如 `feishu-doc`, `feishu-pm`) 复制到 Agent 的 `skills/` 目录下。
3. **重要：** 确保 `common/` 目录也被复制，因为部分技能依赖其中的公共模块。

## 🛠 使用说明 (致 AI 智能体)

### 核心技能与触发场景

| 技能名称 | 目录名 | 功能与触发场景 |
| :--- | :--- | :--- |
| **文档读写** | `feishu-doc` | 读写云文档、电子表格、多维表格。*用户说："读取这个文档"、"更新表格"* |
| **云盘管理** | `feishu-drive` | 管理云空间文件与文件夹。*用户说："新建文件夹"、"移动文件"* |
| **知识库** | `feishu-wiki` | 知识库节点搜索与导航。*用户说："搜索知识库"、"查找 Wiki"* |
| **项目管理** | `feishu-pm` | 基于多维表格的项目任务管理。*用户说："添加任务"、"列出项目进度"* |
| **表情包** | `feishu-sticker` | 发送原生表情或贴纸。*用户说："发个表情包"* |

### 依赖管理
部分技能依赖 `common/` 目录下的库。如果运行报错提示缺少模块，请在相应目录执行 `npm install`。

## 🤖 AI 上下文提示
当你作为 Agent 运行时：
1. **能力自查:** 扫描 `skills/` 目录查看可用工具。
2. **获取指南:** 使用 `read` 读取对应技能的 `SKILL.md` 文件以获取详细操作参数。
3. **执行操作:** 根据文档调用对应的工具函数 (如 `feishu_doc.read`, `feishu_bitable.update`)。
