# Contributing to n8n-nodes-letta

Thank you for your interest in contributing! Here are some guidelines to help you get started.

## Development Setup

### Prerequisites

- Node.js 18+ and npm
- n8n installed locally or via Docker
- Letta account with API token
- Git

### Quick n8n Setup
1. Install n8n globally if you haven't already:
   ```bash
   npm install -g n8n
   ```
   
2. Start n8n:
   ```bash
    npx n8n
    ```

### Quick Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/yourusername/letta-n8n-node.git
   cd letta-n8n-node
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the TypeScript code**
   ```bash
   npm run build
   ```
   This compiles files from `credentials/` and `nodes/` into JavaScript in the `dist/` directory.

4. **Test in n8n**

   First, link the package in this project directory:
   ```bash
   npm link
   ```

   Then navigate to your n8n installation directory and link the package:
   ```bash
   cd ~/.n8n/
   npm link @letta-ai/n8n-nodes-letta
   ```

   Start or restart n8n:
   ```bash
   npx n8n
   ```

### Making Changes

- Edit files in `credentials/` or `nodes/`
- Follow the existing code style
- Add TypeScript types where appropriate
- Run `npm run build` after making changes
- Restart n8n to see your changes

## Code Standards

- **TypeScript**: All code must be written in TypeScript
- **Formatting**: Use Prettier (`npm run format`)
- **Linting**: Code must pass ESLint (`npm run lint`)
- **Documentation**: Add JSDoc comments for all public methods
- **Error Handling**: Use proper error handling with `NodeOperationError`

## Adding New Operations

To add a new operation to the Letta node:

### 1. Create the Action File

Create a new file in `nodes/Letta/actions/` for your operation (e.g., `yourOperation.ts`):

```typescript
import { IExecuteFunctions, INodeExecutionData, JsonObject, NodeOperationError } from 'n8n-workflow';

/**
 * Description of what your operation does
 *
 * @param this - The execution context
 * @returns Array of execution data for all input items
 */
export async function yourOperation(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const items = this.getInputData();
  const returnData: INodeExecutionData[] = [];

  for (let i = 0; i < items.length; i++) {
    try {
      // Get credentials
      const credentials = await this.getCredentials('lettaApi');
      const baseUrl = credentials.baseUrl as string;

      // Get parameters
      const param1 = this.getNodeParameter('param1', i) as string;

      // Make API request
      const response = await this.helpers.httpRequestWithAuthentication.call(
        this,
        'lettaApi',
        {
          method: 'POST',
          url: `${baseUrl}/v1/your-endpoint`,
          body: { param1 },
          json: true,
        },
      );

      // Add response to return data
      returnData.push({
        json: response as JsonObject,
        pairedItem: { item: i },
      });
    } catch (error) {
      if (this.continueOnFail()) {
        returnData.push({
          json: {
            error: typeof error === 'string' ? error : JSON.stringify(error),
          },
          pairedItem: { item: i },
        });
        continue;
      }
      throw new NodeOperationError(this.getNode(), error as Error, {
        itemIndex: i,
      });
    }
  }

  return returnData;
}
```

### 2. Add to Letta.node.ts

1. **Import the action** at the top of `nodes/Letta/Letta.node.ts`:
   ```typescript
   import { yourOperation } from './actions/yourOperation';
   ```

2. **Add the operation option** in the `properties` array:
   ```typescript
   {
     name: 'Your Operation',
     value: 'yourOperation',
     description: 'Description of what it does',
     action: 'Perform your operation',
   }
   ```

3. **Add parameters** with `displayOptions` to show them only for your operation:
   ```typescript
   {
     displayName: 'Parameter Name',
     name: 'param1',
     type: 'string',
     required: true,
     displayOptions: {
       show: {
         operation: ['yourOperation'],
       },
     },
     default: '',
     description: 'Parameter description',
   }
   ```

4. **Hook up the action** in the `execute()` method:
   ```typescript
   if (operation === 'yourOperation') {
     returnData = await yourOperation.call(this);
   }
   ```

### 3. Test and Document

1. Build the project: `npm run build`
2. Test in n8n (see Quick Setup above)
3. Add tests in `__tests__/` directory
4. Update README.md with operation documentation

## Pull Request Process

1. Update the README.md with details of changes if applicable
1. Create a pull request with a clear description of the changes
1. Wait for review and address any feedback

## Questions?

Feel free to open an issue for any questions or concerns.
