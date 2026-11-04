# 🌌 Nagendra Kushwaha Portfolio — MCP & ChatGPT Plugin Server

This server turns your portfolio into an **AI-queryable tool and context engine**. It exposes your verified profile, 12 production-grade AI/ML projects, 57 technical skills, academic credentials (B.Tech at Sam Global University, CGPA 7.85/10), work experience (UptoSkill, BCG Forage), and the grounded "Mr. Kennedy" voice companion.

It supports **two connection modes**:
1. **ChatGPT Custom GPT Action ("ChatGPT Plugin")**: Via OpenAPI 3.1.0 specification + HTTP REST endpoints.
2. **Standard Model Context Protocol (MCP)**: Native STDIO & JSON-RPC 2.0 (compatible with **ChatGPT Desktop**, **Claude Desktop**, **Cursor IDE**, and **Windsurf**).

---

## ⚡ Quick Start

### Mode A: Standard MCP (STDIO) — For Claude, Cursor, Windsurf, ChatGPT Desktop
```bash
npm run mcp
# or: node server/mcp-server.js
```

### Mode B: HTTP & ChatGPT Plugin Mode — For ChatGPT Custom Actions & Web MCP
```bash
npm run mcp:http
# or: node server/mcp-server.js --http --port 3001
# or: npm run server (Runs Mr. Kennedy Voice Server + MCP + ChatGPT Plugin together)
```

Server endpoints available at `http://localhost:3001`:
- **OpenAPI Schema (for ChatGPT Actions):** `http://localhost:3001/api/mcp/openapi.json`
- **MCP JSON-RPC Endpoint:** `http://localhost:3001/mcp`
- **Profile:** `http://localhost:3001/api/mcp/profile`
- **Projects Catalog:** `http://localhost:3001/api/mcp/projects`
- **Skills (57 skills):** `http://localhost:3001/api/mcp/skills`
- **Experience:** `http://localhost:3001/api/mcp/experience`
- **Grounded Chat with Mr. Kennedy:** `POST http://localhost:3001/api/mcp/chat`

---

## 🤖 1. Connecting to ChatGPT (Custom GPT / Plugin Action)

ChatGPT Custom GPTs use the **OpenAPI specification** to call external APIs.

### Step 1: Start your server and expose it
1. Run your HTTP server:
   ```bash
   npm run mcp:http
   ```
2. If connecting from the ChatGPT Web browser (`chatgpt.com`), ChatGPT needs a public URL to reach your local server. Run **ngrok** (or Cloudflare Tunnel):
   ```bash
   npx ngrok http 3001
   ```
   *You will receive a public URL, for example:* `https://abc-123.ngrok-free.app`

### Step 2: Configure ChatGPT
1. Go to [ChatGPT](https://chatgpt.com) and click **Explore GPTs** -> **+ Create**.
2. Go to the **Configure** tab:
   - **Name:** `Nagendra Kushwaha AI Representative`
   - **Description:** `Official AI companion and technical dossier for Nagendra Kushwaha's AI/ML & Data Science portfolio.`
   - **Instructions:**
     > You are the official AI representative for Nagendra Kushwaha. When users ask questions about Nagendra's projects, technical skills, CGPA, degrees, internships, or contact details, use the available actions (getProfile, listProjects, getProjectDetails, getSkills, getExperience, chatWithKennedy) to retrieve verified, ground-truth facts. Never fabricate metrics, degrees, or employers.
3. Scroll down to **Actions** and click **Create new action**.
4. In the **Schema** box:
   - Option A: Click **Import from URL** and enter your ngrok URL:
     `https://your-ngrok-url.ngrok-free.app/api/mcp/openapi.json`
   - Option B: Copy the entire contents of [`server/openapi.json`](file:///f:/portfolio/server/openapi.json) and paste it into the schema editor.
   *(If you paste manually, replace the `"url": "http://localhost:3001"` in the `servers` array with your public ngrok or production URL).*
5. Click **Save** -> **Publish**.

Now you and anyone testing your Custom GPT can ask:
- *"What projects has Nagendra built in Generative AI?"*
- *"Explain the architecture and test accuracy of his Customer Support AI."*
- *"What is Nagendra's CGPA and university?"*
- *"What are his top skills in Deep Learning and NLP?"*

ChatGPT will call your portfolio API in real time and answer with 100% verified ground truth!

---

## 🖥️ 2. Connecting to ChatGPT Desktop App (Local MCP Tools)

If you use the **ChatGPT Desktop App** with developer MCP tools enabled:
Add the following to your ChatGPT developer tool configuration:

```json
{
  "mcpServers": {
    "nagendra-portfolio": {
      "command": "node",
      "args": ["F:/portfolio/server/mcp-server.js"]
    }
  }
}
```

---

## 🔮 3. Connecting to Claude Desktop

Claude Desktop has native support for MCP.

1. Open your Claude Desktop configuration file:
   - **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
   - **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
2. Add this configuration:

```json
{
  "mcpServers": {
    "nagendra-portfolio": {
      "command": "node",
      "args": ["F:/portfolio/server/mcp-server.js"]
    }
  }
}
```
3. Restart Claude Desktop. You will see a 🔨 hammer icon with all 7 tools (`get_profile`, `list_projects`, `get_project_details`, `search_skills`, `get_experience`, `get_education_and_certifications`, `ask_kennedy_ai`).

---

## 💻 4. Connecting to Cursor IDE

To use your portfolio data in Cursor chat:

1. Create or open `.cursor/mcp.json` in your project or home directory:
```json
{
  "mcpServers": {
    "nagendra-portfolio": {
      "command": "node",
      "args": ["F:/portfolio/server/mcp-server.js"]
    }
  }
}
```
2. In Cursor Settings -> **Features** -> **MCP**, verify that `nagendra-portfolio` shows a green active indicator.

---

## 🌊 5. Connecting to Windsurf IDE

1. Open `~/.codeium/windsurf/mcp_config.json`:
```json
{
  "mcpServers": {
    "nagendra-portfolio": {
      "command": "node",
      "args": ["F:/portfolio/server/mcp-server.js"]
    }
  }
}
```

---

## 🛠️ Available MCP Tools Reference

| Tool Name | Parameters | Description |
|---|---|---|
| `get_profile` | `include_resumes` (bool) | Returns full verified bio, CGPA (7.85/10), degree, contact links, and resume download URLs. |
| `list_projects` | `domain` (str), `search` (str), `featured_only` (bool) | Lists all 12 verified AI/ML projects with test metrics (e.g. ShopEase RAG, Medical Vision, Speech Emotion, NIDS). |
| `get_project_details` | `slug_or_id` (str, required) | Comprehensive architecture case study, problem statement, objective, dataset, metrics, and GitHub/demo URLs. |
| `search_skills` | `category` (str), `search` (str) | Searches 57 skills across Programming, ML, DL, NLP, Generative AI, Data, and Tools. |
| `get_experience` | `type` (str) | Returns verified history: UptoSkill Data Analytics Intern, BCG Forage simulation, and mentorship. |
| `get_education_and_certifications` | none | Returns B.Tech at Sam Global University and recognized industry certifications. |
| `ask_kennedy_ai` | `question` (str, required) | Interactive grounded dialogue with Mr. Kennedy, Nagendra's AI Portfolio Companion. |

---

## 📦 Verified Ground Truth Guarantee
All data returned by the server is sourced directly from your verified portfolio repository (`src/data/profile.ts`, `src/data/projects.ts`, `src/data/skills.ts`, and `src/data/experience.ts`), guaranteeing zero hallucination when external LLMs interact with your portfolio!

