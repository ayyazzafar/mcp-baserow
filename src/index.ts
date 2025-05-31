#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
  ErrorCode,
  McpError
} from '@modelcontextprotocol/sdk/types.js';
import dotenv from 'dotenv';
import { BaserowClient } from './baserow-client.js';
import { BaserowAuthConfig } from './types/baserow.js';
import { 
  handleWorkspaceTools,
  getWorkspaceToolSchemas 
} from './tools/workspace.js';
import {
  handleDatabaseTools,
  getDatabaseToolSchemas
} from './tools/database.js';
import {
  handleTableTools,
  getTableToolSchemas
} from './tools/table.js';
import {
  handleRowTools,
  getRowToolSchemas
} from './tools/row.js';
import {
  handleAuthTools,
  getAuthToolSchemas
} from './tools/auth.js';

// Load environment variables
dotenv.config();

// Parse authentication configuration from environment
function getAuthConfig(): BaserowAuthConfig {
  // Option 1: Username/Password (preferred)
  if (process.env.BASEROW_USERNAME && process.env.BASEROW_PASSWORD) {
    console.error('Using credentials authentication (auto-refresh enabled)');
    return {
      type: 'credentials',
      username: process.env.BASEROW_USERNAME,
      password: process.env.BASEROW_PASSWORD
    };
  }

  // Option 2: Direct token (JWT or Database)
  if (process.env.BASEROW_API_TOKEN) {
    const token = process.env.BASEROW_API_TOKEN;
    if (token.startsWith('JWT ')) {
      console.error('Using JWT token authentication (expires in 60 minutes)');
      return {
        type: 'jwt',
        token: token.substring(4) // Remove 'JWT ' prefix
      };
    } else if (token.startsWith('Token ')) {
      console.error('Using database token authentication (limited API access)');
      return {
        type: 'database_token',
        token: token // Keep full token with 'Token ' prefix
      };
    } else {
      // Assume JWT if no prefix
      console.error('Using JWT token authentication (expires in 60 minutes)');
      return {
        type: 'jwt',
        token: token
      };
    }
  }

  console.error('Error: No authentication configured. Please set either:');
  console.error('  - BASEROW_USERNAME and BASEROW_PASSWORD (recommended)');
  console.error('  - BASEROW_API_TOKEN (JWT or Database token)');
  process.exit(1);
}

// Initialize Baserow client
const baserowClient = new BaserowClient({
  apiUrl: process.env.BASEROW_API_URL || 'https://api.baserow.io',
  activeWorkspaceId: process.env.BASEROW_DEFAULT_WORKSPACE_ID 
    ? parseInt(process.env.BASEROW_DEFAULT_WORKSPACE_ID) 
    : undefined,
  auth: getAuthConfig()
});

// Create MCP server
const server = new Server(
  {
    name: 'baserow-mcp-server',
    vendor: 'baserow',
    version: '0.1.0',
    description: 'MCP server for Baserow API integration'
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

// Handle list tools request
server.setRequestHandler(ListToolsRequestSchema, async () => {
  const tools: Tool[] = [
    // Configuration tool
    {
      name: 'baserow_configure',
      description: 'Configure Baserow API settings and active workspace',
      inputSchema: {
        type: 'object',
        properties: {
          workspace_id: {
            type: 'number',
            description: 'Set the active workspace ID for subsequent operations'
          }
        }
      }
    },
    // Auth tools
    ...getAuthToolSchemas(),
    // Workspace tools
    ...getWorkspaceToolSchemas(),
    // Database tools
    ...getDatabaseToolSchemas(),
    // Table tools
    ...getTableToolSchemas(),
    // Row tools
    ...getRowToolSchemas()
  ];

  return { tools };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    // Configuration tool
    if (name === 'baserow_configure') {
      if (args?.workspace_id) {
        baserowClient.setActiveWorkspace(Number(args.workspace_id));
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                message: `Active workspace set to ID: ${args.workspace_id}`
              }, null, 2)
            }
          ]
        };
      }
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              activeWorkspace: baserowClient.getActiveWorkspace() || null
            }, null, 2)
          }
        ]
      };
    }

    // Auth tools
    if (name.startsWith('baserow_auth')) {
      return await handleAuthTools(baserowClient, name, args);
    }

    // Workspace tools
    if (name.startsWith('baserow_') && name.includes('workspace')) {
      return await handleWorkspaceTools(baserowClient, name, args);
    }

    // Database tools
    if (name.startsWith('baserow_') && name.includes('database')) {
      return await handleDatabaseTools(baserowClient, name, args);
    }

    // Table tools
    if (name.startsWith('baserow_') && name.includes('table')) {
      return await handleTableTools(baserowClient, name, args);
    }

    // Row tools
    if (name.startsWith('baserow_') && 
        (name.includes('row') || name.includes('batch'))) {
      return await handleRowTools(baserowClient, name, args);
    }

    throw new McpError(
      ErrorCode.MethodNotFound,
      `Unknown tool: ${name}`
    );
  } catch (error) {
    if (error instanceof McpError) {
      throw error;
    }

    throw new McpError(
      ErrorCode.InternalError,
      `Tool execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Baserow MCP server started');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});