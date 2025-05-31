# Contributing to Baserow MCP Server

First off, thank you for considering contributing to the Baserow MCP Server! It's people like you that make this tool better for everyone.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Process](#development-process)
- [Style Guidelines](#style-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)

## 🤝 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code:

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/baserow-mcp-server.git
   cd baserow-mcp-server
   ```
3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/original-owner/baserow-mcp-server.git
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```
5. **Create a branch** for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 🎯 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Your environment details (OS, Node.js version, etc.)
- Any relevant logs or error messages

### Suggesting Enhancements

Enhancement suggestions are welcome! Please provide:

- A clear and descriptive title
- A detailed description of the proposed enhancement
- Explain why this enhancement would be useful
- List any alternative solutions you've considered

### Your First Code Contribution

Unsure where to begin? Look for issues labeled:

- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `documentation` - Documentation improvements

### Pull Requests

1. **Follow the style guidelines** (see below)
2. **Write tests** for your changes
3. **Update documentation** as needed
4. **Ensure all tests pass**: `npm test`
5. **Write clear commit messages** (see below)

## 💻 Development Process

### Setting Up Your Development Environment

1. **Use Node.js v22+** (install via nvm)
2. **Enable TypeScript watch mode**:
   ```bash
   npm run dev
   ```
3. **Test your changes** with your MCP client
4. **Run linting** before committing:
   ```bash
   npm run lint
   ```

### Project Structure

```
src/
├── index.ts          # Entry point - avoid major changes
├── auth-manager.ts   # Authentication logic
├── baserow-client.ts # API client wrapper
├── tools/           # MCP tool implementations
│   ├── auth.ts      # Authentication tools
│   ├── workspace.ts # Workspace operations
│   ├── database.ts  # Database operations
│   ├── table.ts     # Table operations
│   └── row.ts       # Row CRUD operations
└── types/           # TypeScript definitions
```

### Adding New Tools

1. Add the tool schema to the appropriate file in `src/tools/`
2. Implement the handler function
3. Export from the tool file
4. Import and register in `src/index.ts`
5. Update README.md with the new tool

Example:
```typescript
// In src/tools/table.ts
export function getTableToolSchemas(): Tool[] {
  return [
    // ... existing tools
    {
      name: 'baserow_your_new_tool',
      description: 'Clear description of what it does',
      inputSchema: {
        type: 'object',
        properties: {
          // Define parameters
        },
        required: ['required_params']
      }
    }
  ];
}
```

## 📝 Style Guidelines

### TypeScript Style

- Use TypeScript strict mode
- Define interfaces for all data structures
- Avoid `any` types - use `unknown` if necessary
- Use async/await over promises
- Handle errors appropriately

### Code Style

```typescript
// Good
export async function createTable(
  client: BaserowClient,
  params: CreateTableParams
): Promise<Table> {
  try {
    return await client.createTable(params);
  } catch (error) {
    throw new Error(`Failed to create table: ${error.message}`);
  }
}

// Avoid
export function createTable(client, params) {
  return client.createTable(params).then(res => res);
}
```

### Documentation

- Document all exported functions
- Use JSDoc for complex functions
- Keep comments concise and relevant
- Update README.md for user-facing changes

## 📌 Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): subject

body

footer
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(auth): add support for refresh tokens

Implements automatic token refresh for JWT authentication.
Tokens are now refreshed 5 minutes before expiry.

Closes #123
```

```
fix(rows): handle empty response in batch operations

Batch delete now correctly handles empty responses
from the Baserow API.
```

## 🔄 Pull Request Process

1. **Update your branch** with the latest upstream changes:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Push your branch** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create a Pull Request** with:
   - Clear title describing the change
   - Description of what changed and why
   - Link to any relevant issues
   - Screenshots if applicable

4. **Address review feedback** promptly

5. **Ensure CI passes** before requesting review

### PR Checklist

- [ ] Code follows the style guidelines
- [ ] Tests have been added/updated
- [ ] Documentation has been updated
- [ ] Commit messages follow conventions
- [ ] PR description clearly explains changes
- [ ] All CI checks pass

## 🎉 Recognition

Contributors will be recognized in:
- The project README
- Release notes
- GitHub contributors page

## ❓ Questions?

Feel free to:
- Open an issue for discussion
- Reach out to maintainers
- Join community discussions

Thank you for contributing to Baserow MCP Server! 🚀