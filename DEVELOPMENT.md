# Local Development & Testing Guide

This guide walks you through setting up and testing the Letta n8n node locally.

## Prerequisites

- Node.js 18+ and npm
- n8n installed locally or via Docker
- Letta account with API token
- Git

## Quick Setup (5 minutes)

### 1. Build the Node

```bash
# Install dependencies
npm install

# Build the TypeScript code
npm run build
```

This compiles the TypeScript files from `credentials/` and `nodes/` into JavaScript in the `dist/` directory.

### 2. Link to n8n

#### Option A: Local n8n Installation

```bash
# In this project directory
npm link

# Navigate to your n8n installation directory
cd ~/.n8n/

# Link the package
npm link @letta/n8n-nodes-letta

# Restart n8n
n8n start
```

#### Option B: n8n via Docker

```bash
# Build the package
npm run build

# Create a directory for custom nodes
mkdir -p ~/.n8n/custom

# Copy the built files
cp -r dist package.json ~/.n8n/custom/

# Run n8n with custom nodes mounted
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  -v ~/.n8n/custom:/home/node/.n8n/custom \
  -e N8N_CUSTOM_EXTENSIONS=/home/node/.n8n/custom \
  n8nio/n8n
```

#### Option C: Development Mode with n8n Source

```bash
# Clone n8n repository
git clone https://github.com/n8n-io/n8n.git
cd n8n

# Install dependencies
npm install

# Link your node
cd packages/cli
npm link @letta/n8n-nodes-letta

# Start n8n in development mode
npm run dev
```

### 3. Verify Installation

1. Open n8n at `http://localhost:5678`
2. Create a new workflow
3. Click the **+** button to add a node
4. Search for "Letta"
5. You should see the **Letta** node appear

## Testing the Node

### Setup Test Credentials

1. In n8n UI, go to **Credentials** (bottom left)
2. Click **New** > Search "Letta API"
3. Fill in:
   - **API Token**: Your Letta API token
   - **Base URL**: `https://api.letta.com/v1`
4. Click **Test** to verify connection
5. Click **Save**

### Test Method 1: Import Demo Workflow

1. Download `demo/workflows/simple-chat.json`
2. In n8n: **Workflows** > **Import from File**
3. Update the `agentId` in the Letta node
4. Add your credentials
5. Click **Execute Workflow**

### Test Method 2: Create Simple Workflow

1. Create a new workflow
2. Add a **Manual Trigger** node
3. Add a **Letta** node:
   - **Operation**: Send Message
   - **Agent ID**: Your agent ID (e.g., `agent_abc123`)
   - **Role**: user
   - **Message**: "Hello, how are you?"
4. Connect the nodes
5. Add credentials to Letta node
6. Click **Execute Workflow**

### Test Method 3: Using the Webhook

1. Import `demo/workflows/webhook-chat.json`
2. Activate the workflow
3. Copy the webhook URL from the Webhook node
4. Test with cURL:

```bash
curl -X POST http://localhost:5678/webhook-test/letta-chat \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "agent_abc123",
    "message": "Hello!"
  }'
```

## Development Workflow

### Watch Mode for Development

```bash
# Terminal 1: Watch for TypeScript changes
npm run dev

# Terminal 2: Run n8n
n8n start
```

When you make changes to the TypeScript files, they'll automatically recompile. Restart n8n to load the changes.

### Making Changes

1. Edit files in `nodes/` or `credentials/`
2. Save your changes
3. If using watch mode, files auto-compile
4. Otherwise run `npm run build`
5. Restart n8n
6. Test your changes

### Testing Changes

```bash
# Lint your code
npm run lint

# Format code
npm run format

# Build
npm run build
```

## Debugging

### Enable n8n Debug Logging

```bash
# Set environment variable
export N8N_LOG_LEVEL=debug

# Start n8n
n8n start
```

### Check Node Loading

```bash
# List installed nodes
n8n list:workflows

# Check custom extensions
echo $N8N_CUSTOM_EXTENSIONS
```

### Common Issues

#### Node Doesn't Appear in n8n

**Solution:**
```bash
# Rebuild
npm run build

# Re-link
npm unlink
npm link
cd ~/.n8n
npm unlink @letta/n8n-nodes-letta
npm link @letta/n8n-nodes-letta

# Restart n8n
n8n start
```

#### "Cannot find module" Error

**Solution:**
```bash
# Ensure peer dependencies are installed
npm install

# Check n8n-workflow is available
npm list n8n-workflow
```

#### Credentials Not Showing

**Solution:**
- Check `package.json` has correct paths in `n8n.credentials`
- Ensure `dist/credentials/LettaApi.credentials.js` exists
- Restart n8n

#### Changes Not Reflecting

**Solution:**
- Clear n8n cache: `rm -rf ~/.n8n/cache`
- Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)
- Restart n8n completely

## Testing with Mock Data

### Create a Test Script

Create `test/manual-test.js`:

```javascript
const { Letta } = require('../dist/nodes/Letta/Letta.node');

// Mock n8n execution context
const mockContext = {
  getInputData: () => [{ json: {} }],
  getNodeParameter: (param) => {
    const params = {
      operation: 'sendMessage',
      agentId: 'agent_abc123',
      role: 'user',
      message: 'Hello!',
      additionalOptions: {}
    };
    return params[param];
  },
  helpers: {
    httpRequestWithAuthentication: async (credType, options) => {
      console.log('Making request:', options);
      return {
        messages: [{ role: 'assistant', content: 'Test response' }],
        stop_reason: 'max_steps_reached',
        usage: { tokens: 100 }
      };
    }
  },
  continueOnFail: () => false,
  getNode: () => ({ name: 'Letta Test' })
};

// Test execution
const node = new Letta();
node.execute.call(mockContext).then(result => {
  console.log('Test result:', JSON.stringify(result, null, 2));
}).catch(error => {
  console.error('Test failed:', error);
});
```

Run it:
```bash
node test/manual-test.js
```

## Local Testing Checklist

- [ ] Build completes without errors
- [ ] Node appears in n8n UI
- [ ] Credentials can be created and tested
- [ ] Simple workflow executes successfully
- [ ] Parameters are properly validated
- [ ] Error messages are clear and helpful
- [ ] Response data is correctly structured
- [ ] Optional parameters work as expected
- [ ] Webhook workflow functions correctly

## Environment Setup for Testing

Create a `.env` file in the project root:

```bash
# Letta API
LETTA_API_TOKEN=your_token_here
LETTA_AGENT_ID=agent_abc123

# n8n
N8N_PORT=5678
N8N_LOG_LEVEL=debug
```

## Performance Testing

Test with multiple executions:

```bash
# Using Apache Bench
ab -n 100 -c 10 \
  -H "Content-Type: application/json" \
  -p payload.json \
  http://localhost:5678/webhook-test/letta-chat
```

Where `payload.json`:
```json
{
  "agent_id": "agent_abc123",
  "message": "Hello!"
}
```

## Next Steps

After successful local testing:

1. Run through all demo workflows
2. Test error scenarios (invalid agent ID, bad credentials)
3. Test with different message types and parameters
4. Verify all optional parameters work
5. Test continue-on-fail behavior
6. Check memory usage with large responses
7. Prepare for publishing (see main README)

## Resources

- [n8n Node Development Docs](https://docs.n8n.io/integrations/creating-nodes/)
- [n8n Community Forum](https://community.n8n.io/)
- [Letta API Reference](https://docs.letta.com/api-reference)

## Getting Help

- **Node issues**: Check the [GitHub Issues](https://github.com/letta-ai/letta-n8n-node/issues)
- **n8n questions**: [n8n Community](https://community.n8n.io/)
- **Letta API**: [Letta Docs](https://docs.letta.com/)
