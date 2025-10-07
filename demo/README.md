# Letta n8n Node Demo Workflows

This directory contains example workflows demonstrating how to use the Letta n8n node in different scenarios.

## 🚀 Quick Start

New to Letta n8n integration? Start with our [5-minute Quick Start Guide](QUICKSTART.md) to get up and running quickly!

## 📋 Available Workflows

### 1. Simple Chat
**File:** [`workflows/simple-chat.json`](workflows/simple-chat.json)

A basic workflow demonstrating how to send a message to a Letta agent and format the response.

**Use Case:**
- Testing your Letta integration
- Simple conversational interactions
- Understanding the basic request/response flow

**Workflow Structure:**
```
Manual Trigger → Letta Node → Format Response
```

**How to Use:**
1. Import the workflow into n8n
2. Configure your Letta API credentials
3. Update the `agentId` parameter with your agent ID
4. Click "Test workflow" to execute

**Expected Output:**
```json
{
  "response": "Hello! I can help you with...",
  "allMessages": [...],
  "usage": {
    "step_count": 1
  }
}
```

---

### 2. Webhook Chat API
**File:** [`workflows/webhook-chat.json`](workflows/webhook-chat.json)

A production-ready REST API endpoint for chat applications using Letta agents.

**Use Case:**
- Building chat interfaces (web, mobile, Slack bots, etc.)
- Creating conversational APIs
- Integrating Letta into existing applications

**Workflow Structure:**
```
Webhook → Extract Input → Letta Node → Format Response → Return JSON
                             ↓
                       Error Handler → Error Response
```

**API Endpoint:**
- **Method:** POST
- **Path:** `/webhook/letta-chat`
- **Request Body:**
  ```json
  {
    "agentId": "agent-123",
    "message": "Hello, how are you?",
    "role": "user"
  }
  ```

**Response:**
- **Success (200):**
  ```json
  {
    "success": true,
    "response": "I'm doing well, thank you!",
    "messages": [...],
    "usage": {...}
  }
  ```
- **Error (500):**
  ```json
  {
    "success": false,
    "error": "Error message"
  }
  ```

**Testing with curl:**
```bash
curl -X POST https://your-n8n-instance.com/webhook/letta-chat \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "agent-123",
    "message": "Hello!",
    "role": "user"
  }'
```

**Features:**
- ✅ Error handling with proper HTTP status codes
- ✅ JSON request/response format
- ✅ Customizable agent selection per request
- ✅ Production-ready error responses

---

### 3. Scheduled Summary
**File:** [`workflows/scheduled-summary.json`](workflows/scheduled-summary.json)

An automated workflow that generates daily conversation summaries and sends them via email.

**Use Case:**
- Daily team updates
- Automated reporting
- Conversation analytics
- Meeting summaries

**Workflow Structure:**
```
Schedule Trigger → Prepare Data → Letta Node → Format Summary → Send Email
```

**Schedule:**
- **Default:** Daily at 9:00 AM
- **Cron Expression:** `0 9 * * *`

**Configuration:**
1. Update the schedule in "Schedule Trigger" node
2. Set your agent ID in "Prepare Data" node
3. Configure SMTP credentials in "Send Email" node
4. Customize email recipients and subject

**Email Output:**
```
Subject: Daily Summary - 2025-01-06

Daily Summary for 2025-01-06

[Agent-generated summary of conversations, decisions, and action items]

Generated at 2025-01-07T09:00:00.000Z
```

**Customization Options:**
- Change schedule frequency (hourly, weekly, etc.)
- Modify summary prompt in Letta node
- Add Slack/Discord notifications instead of email
- Store summaries in a database

---

## 🔧 Setup Instructions

### Prerequisites

1. **n8n instance** (self-hosted or cloud)
2. **Letta account** with API access
3. **Letta agent** created and ready to use

### Installation Steps

1. **Install the Letta n8n node:**
   ```bash
   # In n8n Settings > Community Nodes
   @letta-ai/n8n-nodes-letta
   ```

2. **Configure Letta API credentials:**
   - Go to n8n Settings > Credentials
   - Click "Add Credential" → "Letta API"
   - Enter your API token and base URL
   - Test the connection

3. **Import a demo workflow:**
   - Download a workflow JSON file from the `workflows/` directory
   - In n8n, go to Workflows
   - Click "Import from File"
   - Select the downloaded JSON file

4. **Configure the workflow:**
   - Update agent IDs to match your agents
   - Configure any additional credentials (SMTP for email, etc.)
   - Test the workflow

### Finding Your Agent ID

1. Go to [Letta Dashboard](https://app.letta.com)
2. Navigate to your agents list
3. Click on an agent to view details
4. Copy the Agent ID (format: `agent-abc123...`)

---

## 💡 Best Practices

### Agent Configuration
- Use specific, descriptive agent IDs
- Set appropriate `max_steps` based on complexity (5-15 is typical)
- Enable `enable_thinking` for debugging, disable for production

### Error Handling
- Always implement error handling in production workflows
- Use "Continue on Fail" setting for non-critical paths
- Log errors to monitoring systems

### Performance
- Cache agent responses when possible
- Limit `max_steps` to prevent long-running requests
- Use webhooks asynchronously for better UX

### Security
- Store API tokens securely in n8n credentials
- Validate webhook inputs before sending to Letta
- Implement rate limiting for public endpoints

---

## 🎨 Customization Ideas

### Extend the Simple Chat Workflow
- Add conversation history storage (database, file, etc.)
- Implement multi-turn conversations
- Add sentiment analysis of responses

### Enhance the Webhook API
- Add authentication/API keys
- Implement conversation sessions
- Add rate limiting
- Support streaming responses

### Improve Scheduled Summaries
- Generate summaries for specific topics
- Send to multiple channels (Email, Slack, Discord)
- Create PDF reports
- Store historical summaries

---

## 📚 Additional Resources

- **[Quick Start Guide](QUICKSTART.md)** - Get started in 5 minutes
- **[Letta Documentation](https://docs.letta.com)** - Full Letta platform docs
- **[Letta API Reference](https://docs.letta.com/api-reference)** - API documentation
- **[n8n Documentation](https://docs.n8n.io)** - n8n platform docs
- **[Node Documentation](../README.md)** - Letta n8n node reference

---

## 🐛 Troubleshooting

### Workflow doesn't execute
- Check that Letta credentials are configured
- Verify agent ID is correct
- Check n8n execution logs

### Agent not responding
- Verify API token is valid
- Check agent status in Letta dashboard
- Increase `max_steps` if agent is being cut off

### Webhook returns errors
- Validate request body structure
- Check webhook URL is correct
- Review n8n logs for detailed error messages

### Email not sending
- Verify SMTP credentials
- Check email addresses are valid
- Test SMTP connection in n8n

---

## 🤝 Contributing

Have a cool workflow to share? We'd love to see it!

1. Create your workflow
2. Test thoroughly
3. Document the use case and setup
4. Submit a PR with your workflow JSON and documentation

---

## 📝 License

These demo workflows are provided as-is under the MIT license. Feel free to use, modify, and distribute them.
