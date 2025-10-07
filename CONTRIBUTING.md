# Contributing to n8n-nodes-letta

Thank you for your interest in contributing! Here are some guidelines to help you get started.

## Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/yourusername/letta-n8n-node.git
   cd letta-n8n-node
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Make your changes**
   - Edit files in `credentials/` or `nodes/`
   - Follow the existing code style
   - Add TypeScript types where appropriate

4. **Build and test**
   ```bash
   npm run build
   npm run lint
   ```

5. **Test in n8n**
   ```bash
   npm link
   cd /path/to/n8n
   npm link @letta/n8n-nodes-letta
   ```

## Code Standards

- **TypeScript**: All code must be written in TypeScript
- **Formatting**: Use Prettier (`npm run format`)
- **Linting**: Code must pass ESLint (`npm run lint`)
- **Documentation**: Add JSDoc comments for all public methods
- **Error Handling**: Use proper error handling with `NodeOperationError`

## Adding New Operations

To add a new operation to the Letta node:

1. Add the operation to the options array in `Letta.node.ts`
2. Add the required parameters with `displayOptions`
3. Implement the operation logic in the `execute()` method
4. Update the README.md with documentation
5. Test thoroughly

## Pull Request Process

1. Update the README.md with details of changes if applicable
2. Update the version number in package.json following [Semantic Versioning](https://semver.org/)
3. Create a pull request with a clear description of the changes
4. Wait for review and address any feedback

## Questions?

Feel free to open an issue for any questions or concerns.
