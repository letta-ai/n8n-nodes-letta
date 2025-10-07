**This project is in PREVIEW and has not been officially released, try it out and create issues**


# n8n-nodes-letta

[![npm version](https://img.shields.io/npm/v/@letta-ai/n8n-nodes-letta.svg)](https://www.npmjs.com/package/@letta-ai/n8n-nodes-letta)
[![npm downloads](https://img.shields.io/npm/dm/@letta-ai/n8n-nodes-letta.svg)](https://www.npmjs.com/package/@letta-ai/n8n-nodes-letta)
[![Test](https://github.com/letta-ai/letta-n8n-node/actions/workflows/test.yml/badge.svg)](https://github.com/letta-ai/letta-n8n-node/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


This is the official n8n node that allows you to integrate [Letta](https://letta.com) AI agents into your n8n workflows.

[n8n](https://n8n.io/) is a fair-code licensed workflow automation platform.

[Letta](https://letta.com) is a platform for building stateful AI agents with long-term memory.

## Quick Start

**New to this node?** Check out our [5-minute Quick Start Guide](demo/QUICKSTART.md) and [demo workflows](demo/) to get started quickly!

**Developers:** See [DEVELOPMENT.md](DEVELOPMENT.md) for local testing and development setup.

## Installation

### Community Node (Recommended)

1. Go to **Settings** > **Community Nodes** in your n8n instance
2. Select **Install**
3. Enter `@letta-ai/n8n-nodes-letta` in **Enter npm package name**
4. Agree to the risks of using community nodes
5. Select **Install**

### Manual Installation

To get started install the package in your n8n root directory:

```bash
npm install @letta-ai/n8n-nodes-letta
```

For Docker-based n8n installations, add the following line before the `$N8N_CUSTOM_EXTENSIONS` variable in your `.env` file:

```env
N8N_CUSTOM_EXTENSIONS=@letta-ai/n8n-nodes-letta
```

## Configuration

### Credentials

This node requires Letta API credentials:

1. Go to your [Letta dashboard](https://app.letta.com)
2. Navigate to API settings and generate an API token
3. In n8n, create new Letta API credentials:
   - **API Token**: Your Letta API token
   - **Base URL**: `https://api.letta.com` (default) or your self-hosted instance URL

## Operations

### Send Message

Send a message to a Letta agent and receive a response.

#### Parameters

**Required:**
- **Agent ID**: The ID of your Letta agent (e.g., `agent_abc123`)
- **Role**: The role of the message sender
  - `user`: Message from the user
  - `system`: System message
  - `assistant`: Message from the assistant
- **Message**: The message content to send

**Optional:**
- **Max Steps**: Maximum number of steps the agent can take (1-100, default: 10)
- **Use Assistant Message**: Include assistant message in response (default: true)
- **Enable Thinking**: Enable agent's thinking process in response (default: false)
- **Return Message Types**: Filter message types in response
  - Internal Monologue
  - Function Call
  - Function Return
  - Reasoning

#### Output

The node returns the complete response from the Letta API, including:
- **messages**: Array of messages from the agent
- **stop_reason**: Reason for ending the conversation
- **usage**: Token and step usage statistics

## Demo Workflows

We provide ready-to-use example workflows in the [`demo/`](demo/) directory:

1. **[Simple Chat](demo/workflows/simple-chat.json)** - Basic message sending and response handling
2. **[Webhook Chat API](demo/workflows/webhook-chat.json)** - REST API endpoint for chat applications
3. **[Scheduled Summary](demo/workflows/scheduled-summary.json)** - Automated daily summaries via email

📚 **[View Full Demo Documentation](demo/README.md)** with detailed setup instructions, usage examples, and best practices.

### Quick Example: Simple Chat

```
┌─────────┐     ┌──────────┐     ┌─────────┐
│ Trigger │────▶│  Letta   │────▶│ Display │
└─────────┘     └──────────┘     └─────────┘
```

1. **Manual Trigger**: Click to test
2. **Letta Node**: Sends message to agent
3. **Display**: Shows agent response

[Import this workflow](demo/workflows/simple-chat.json)

## API Reference

This node uses the Letta Messages API:
- **Endpoint**: `POST /v1/agents/{agent_id}/messages`
- **Documentation**: https://docs.letta.com/api-reference/agents/messages/create

## Compatibility

- n8n version: 1.0.0+
- Letta API version: v1

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Letta documentation](https://docs.letta.com)
- [Letta API reference](https://docs.letta.com/api-reference)

## Development

### Setup

```bash
# Install dependencies
npm install

# Build the node
npm run build

# Watch for changes during development
npm run dev

# Lint code
npm run lint

# Format code
npm run format
```

### Project Structure

```
letta-n8n-node/
├── credentials/
│   └── LettaApi.credentials.ts    # API credentials definition
├── nodes/
│   └── Letta/
│       ├── Letta.node.ts          # Main node implementation
│       └── letta.svg              # Node icon
├── dist/                          # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── README.md
```

### Testing in n8n

To test your changes locally:

1. Build the node: `npm run build`
2. Link to your n8n installation: `npm link`
3. In your n8n directory: `npm link @letta-ai/n8n-nodes-letta`
4. Restart n8n

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](LICENSE.md)

## Support

For issues and questions:
- **Node issues**: Open an issue in this repository
- **n8n questions**: [n8n community forum](https://community.n8n.io)
- **Letta questions**: [Letta documentation](https://docs.letta.com)

