# Baserow MCP Server

[![MCP](https://img.shields.io/badge/MCP-1.0-blue.svg)](https://modelcontextprotocol.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22+-green.svg)](https://nodejs.org/)

An MCP (Model Context Protocol) server that provides seamless integration between MCP-compatible clients (Claude Desktop, Cursor, Windsurf, etc.) and Baserow, enabling AI-powered database operations through natural language.

## 🚀 Features

- **🔐 Smart Authentication**: Automatic token refresh with credentials or manual JWT/database tokens
- **🏢 Workspace Management**: List, create, and manage Baserow workspaces
- **🗄️ Database Operations**: Full control over databases within workspaces
- **📊 Table Management**: Create, list, and manage tables with field definitions
- **📝 Row CRUD Operations**: Complete Create, Read, Update, Delete functionality
- **⚡ Batch Operations**: Efficient bulk operations for creating, updating, and deleting rows
- **🔍 Advanced Queries**: Pagination, filtering, and sorting support
- **💡 Natural Language**: Use plain English to interact with your databases

## 📋 Prerequisites

- Node.js v22+ (install via [nvm](https://github.com/nvm-sh/nvm))
- An MCP-compatible client:
  - [Claude Desktop](https://claude.ai/download)
  - [Cursor](https://cursor.sh)
  - [Windsurf](https://codeium.com/windsurf)
  - Any other MCP-compatible AI editor
- [Baserow](https://baserow.io) account (self-hosted or cloud)

## 🛠️ Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ayyazzafar/mcp-baserow.git
   cd mcp-baserow
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure authentication**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your credentials:
   ```env
   # Recommended: Use credentials for automatic token refresh
   BASEROW_USERNAME=your@email.com
   BASEROW_PASSWORD=your_password
   
   # Optional: Override default API URL for self-hosted instances
   # BASEROW_API_URL=https://your-baserow-instance.com
   ```

4. **Build the project**:
   ```bash
   npm run build
   ```

## 🔑 Authentication Options

### Option 1: Username/Password (Recommended)
Provides automatic token refresh and full API access:
```env
BASEROW_USERNAME=your@email.com
BASEROW_PASSWORD=your_password
```

### Option 2: JWT Token
For manual token management (expires after 60 minutes):
```env
BASEROW_API_TOKEN=JWT_your_jwt_token_here
```

### Option 3: Database Token
For database-specific operations (limited scope, never expires):
```env
BASEROW_API_TOKEN=Token_your_database_token_here
```

## ⚙️ Configuration

### MCP Client Setup

<details>
<summary>Claude Desktop</summary>

1. Open configuration:
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
   - Linux: `~/.config/Claude/claude_desktop_config.json`

2. Add the Baserow server:
   ```json
   {
     "mcpServers": {
       "baserow": {
         "command": "/path/to/mcp-baserow/start.sh"
       }
     }
   }
   ```
</details>

<details>
<summary>Cursor</summary>

1. Open Cursor settings
2. Navigate to MCP Servers section
3. Add:
   ```json
   {
     "baserow": {
       "command": "/path/to/mcp-baserow/start.sh"
     }
   }
   ```
</details>

<details>
<summary>Windsurf</summary>

1. Open Windsurf configuration
2. Add to MCP servers:
   ```json
   {
     "baserow": {
       "command": "/path/to/mcp-baserow/start.sh"
     }
   }
   ```
</details>

3. Restart your MCP client

## 📚 Usage Examples

### Natural Language Commands

Once configured, you can use natural language in your MCP client:

- "Show me all my Baserow workspaces"
- "Create a new database called 'Project Tracker' in my workspace"
- "List all tables in the Project Tracker database"
- "Add a new row to the Tasks table with title 'Review PR' and status 'In Progress'"
- "Update row 5 in the Tasks table to mark it as completed"
- "Delete all rows in the Archive table that are older than 30 days"

### Available MCP Tools

<details>
<summary>Authentication Tools (3)</summary>

- `baserow_auth_status` - Check authentication status and capabilities
- `baserow_auth_login` - Login with credentials
- `baserow_auth_set_token` - Manually set JWT or database token
</details>

<details>
<summary>Workspace Tools (4)</summary>

- `baserow_list_workspaces` - List all workspaces
- `baserow_get_workspace` - Get workspace details
- `baserow_create_workspace` - Create new workspace
- `baserow_set_workspace` - Set active workspace for operations
</details>

<details>
<summary>Database Tools (3)</summary>

- `baserow_list_databases` - List databases in workspace
- `baserow_get_database` - Get database details
- `baserow_create_database` - Create new database
</details>

<details>
<summary>Table Tools (3)</summary>

- `baserow_list_tables` - List tables in database
- `baserow_get_table` - Get table with field definitions
- `baserow_create_table` - Create new table
</details>

<details>
<summary>Row Operations (8)</summary>

- `baserow_list_rows` - List rows with pagination/filtering
- `baserow_get_row` - Get single row by ID
- `baserow_create_row` - Create new row
- `baserow_update_row` - Update existing row
- `baserow_delete_row` - Delete row
- `baserow_batch_create_rows` - Create multiple rows
- `baserow_batch_update_rows` - Update multiple rows
- `baserow_batch_delete_rows` - Delete multiple rows
</details>

## 🧪 Development

### Setup Development Environment

```bash
# Install dependencies
npm install

# Run TypeScript compiler in watch mode
npm run dev

# Run tests (when available)
npm test
```

### Project Structure

```
mcp-baserow/
├── src/
│   ├── index.ts          # MCP server entry point
│   ├── auth-manager.ts   # Authentication handling
│   ├── baserow-client.ts # Baserow API client
│   ├── tools/           # MCP tool implementations
│   │   ├── auth.ts      # Authentication tools
│   │   ├── workspace.ts # Workspace operations
│   │   ├── database.ts  # Database operations
│   │   ├── table.ts     # Table operations
│   │   └── row.ts       # Row CRUD operations
│   └── types/           # TypeScript type definitions
├── dist/                # Compiled JavaScript
├── examples/            # Usage examples
└── tests/              # Test files
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Quick Start for Contributors

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes in each version.

## 🐛 Troubleshooting

### Common Issues

1. **"Authentication failed"**
   - Verify your credentials in `.env`
   - Ensure your Baserow account is active
   - Check if you're using the correct API URL

2. **"No workspace_id provided"**
   - Use `baserow_set_workspace` to set an active workspace
   - Or provide `workspace_id` parameter in database operations

3. **"Server disconnected"**
   - Check your MCP client's logs:
     - Claude Desktop: `~/Library/Logs/Claude/mcp-server-baserow.log`
     - Other clients: Check their respective log locations
   - Ensure Node.js v22+ is installed
   - Verify all dependencies are installed

### Debug Mode

Enable debug logging by setting:
```bash
export DEBUG=baserow:*
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Anthropic](https://anthropic.com) for the MCP specification
- [Baserow](https://baserow.io) for the excellent open-source database platform
- The MCP community for examples and best practices

## 🔗 Links

- [MCP Documentation](https://modelcontextprotocol.io)
- [Baserow API Documentation](https://baserow.io/api-docs)
- [Report Issues](https://github.com/ayyazzafar/mcp-baserow/issues)

---

Made with ❤️ by the open-source community