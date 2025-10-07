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

### 2. Turn on N8N with NPX
```bash
npx n8n
```   

### 3. Link to n8n

```bash
# In this project directory
npm link

# Navigate to your n8n installation directory
cd ~/.n8n/

# Link the package
npm link @letta/n8n-nodes-letta

# Restart n8n
npx n8n
```


