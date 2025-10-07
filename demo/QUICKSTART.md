# 🚀 Quick Start Guide: Letta n8n Integration

Get started with the Letta n8n node in just 5 minutes! This guide will walk you through setting up your first Letta-powered workflow.

## ⏱️ What You'll Build

A simple chat workflow that sends a message to your Letta agent and displays the response.

**Time Required:** 5 minutes

---

## 📋 Prerequisites

Before you begin, make sure you have:

- [ ] An n8n instance (self-hosted or [n8n Cloud](https://n8n.io/cloud/))
- [ ] A [Letta account](https://app.letta.com)
- [ ] A Letta agent created and ready to use

### Don't have a Letta agent yet?

1. Go to [app.letta.com](https://app.letta.com)
2. Click "Create Agent"
3. Configure your agent's memory and tools
4. Copy the Agent ID (you'll need it later!)

---

## 🎯 Step 1: Install the Letta Node

### Option A: Install via Community Nodes (Recommended)

1. Open n8n and go to **Settings** → **Community Nodes**
2. Click **"Install a community node"**
3. Enter the package name:
   ```
   @letta-ai/n8n-nodes-letta
   ```
4. Click **"Install"**
5. Wait for installation to complete (usually 30-60 seconds)

### Option B: Manual Installation (Self-Hosted)

If you're running n8n with npm:

```bash
cd ~/.n8n
npm install @letta-ai/n8n-nodes-letta
```

For Docker installations, add to your `.env`:
```env
N8N_CUSTOM_EXTENSIONS=@letta-ai/n8n-nodes-letta
```

---

## 🔑 Step 2: Configure Letta API Credentials

1. In n8n, go to **Settings** → **Credentials**
2. Click **"Add Credential"**
3. Search for **"Letta API"** and select it
4. Fill in the credential details:

   | Field | Value | Where to Find |
   |-------|-------|---------------|
   | **API Token** | Your Letta API token | [Letta Dashboard](https://app.letta.com) → Settings → API Keys |
   | **Base URL** | `https://api.letta.com` | Default value (keep unless self-hosting) |

5. Click **"Create"** to save

### Getting Your API Token

1. Go to [app.letta.com](https://app.letta.com)
2. Click on your profile → **Settings**
3. Navigate to **API Keys**
4. Click **"Generate New Key"**
5. Copy the token (you won't see it again!)

---

## 🔨 Step 3: Create Your First Workflow

1. In n8n, click **"Add Workflow"**
2. Give it a name like "My First Letta Chat"

### Add the Nodes

#### 3.1: Add a Manual Trigger

1. Click the **"+"** button
2. Search for **"Manual Trigger"**
3. Click to add it
4. This will let you test the workflow manually

#### 3.2: Add the Letta Node

1. Click the **"+"** button after the trigger
2. Search for **"Letta"**
3. Select the Letta node
4. Configure it:

   **Operation:** `Send Message`

   **Agent ID:** (Enter your Letta agent ID)
   ```
   agent-abc123...
   ```

   **Role:** `user`

   **Message:** (Your message to the agent)
   ```
   Hello! Can you introduce yourself and tell me what you can help me with?
   ```

5. Select your Letta API credentials (created in Step 2)
6. Click **"Execute Node"** to test

#### 3.3: View the Response

The Letta node will return a JSON response containing:
- `messages`: Array of conversation messages
- `usage`: Token and step usage stats
- Additional metadata

---

## ✅ Step 4: Test Your Workflow

1. Make sure all nodes are connected (Manual Trigger → Letta)
2. Click **"Test workflow"** in the top right
3. Watch the execution flow through the nodes
4. Check the output data in the Letta node


## 🎉 Success! What's Next?

Congratulations! You've successfully set up your first Letta workflow. Here are some ideas to explore:

### Beginner Projects

1. **Add Response Formatting**
   - Add a "Code" node after Letta
   - Extract just the assistant's message text
   - Format it for display

2. **Create a Simple Chatbot**
   - Use a Webhook trigger instead of Manual
   - Accept user messages via HTTP POST
   - Return agent responses as JSON

3. **Store Conversation History**
   - Add a database node (PostgreSQL, MySQL, etc.)
   - Save each message exchange
   - Build a conversation log

### Intermediate Projects

4. **Multi-Agent Workflow**
   - Chain multiple Letta agents together
   - Each agent specializes in different tasks
   - Route messages based on intent

5. **Scheduled Reports**
   - Use a Schedule Trigger
   - Ask your agent for daily summaries
   - Send results via Email or Slack

6. **Interactive Forms**
   - Use a Webhook + Form
   - Collect user input
   - Process with Letta agent
   - Display results in a web page

### Advanced Projects

7. **RAG (Retrieval-Augmented Generation)**
   - Connect to a vector database
   - Search relevant documents
   - Pass context to Letta agent
   - Generate informed responses

8. **Multi-Channel Bot**
   - Connect to Slack, Discord, Telegram
   - Route messages to your Letta agent
   - Maintain separate conversation contexts
   - Handle multiple users simultaneously

---

## 📚 Learn More

### Demo Workflows

Check out our ready-to-use example workflows in the [`demo/workflows/`](workflows/) directory:

- 💬 **[Simple Chat](workflows/simple-chat.json)** - Basic interaction pattern
- 🌐 **[Webhook Chat API](workflows/webhook-chat.json)** - Production-ready API endpoint
- 📅 **[Scheduled Summary](workflows/scheduled-summary.json)** - Automated daily reports

Import these workflows to see more advanced patterns!

### Documentation

- 📖 **[Demo Documentation](README.md)** - Detailed workflow explanations
- 🔧 **[Node Reference](../README.md)** - Complete API documentation
- 🧠 **[Letta Docs](https://docs.letta.com)** - Letta platform documentation
- ⚡ **[n8n Docs](https://docs.n8n.io)** - n8n platform documentation

### Community & Support

- **GitHub Issues:** Report bugs or request features
- **n8n Community:** [community.n8n.io](https://community.n8n.io)
- **Letta Discord:** Join the Letta community

---

## 🐛 Troubleshooting

### "Could not find node type 'n8n-nodes-letta.letta'"

**Solution:** The node isn't installed correctly. Try:
1. Reinstall via Community Nodes
2. Restart n8n
3. Clear browser cache

### "Invalid credentials"

**Solution:**
1. Check your API token is correct (no extra spaces)
2. Verify the base URL is `https://api.letta.com`
3. Test your credentials in the Letta Dashboard
4. Generate a new API key if needed

### "Agent not found"

**Solution:**
1. Verify your Agent ID is correct
2. Check the agent exists in your Letta dashboard
3. Ensure the agent is not deleted

### Node execution times out

**Solution:**
1. Increase `max_steps` in Additional Options
2. Check your agent's configuration
3. Verify network connectivity to Letta API

### No response from agent

**Solution:**
1. Check the agent is active in Letta dashboard
2. Review agent logs for errors
3. Try a simpler message to test connectivity


## ✨ You're All Set!

You now have a working Letta integration in n8n. Start experimenting, build amazing workflows, and don't forget to share what you create!

**Happy automating! 🎊**

---

*Having issues? [Open an issue on GitHub](https://github.com/letta-ai/letta-n8n-node/issues)*
