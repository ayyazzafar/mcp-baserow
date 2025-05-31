import { BaserowClient } from '../baserow-client.js';
import { Tool } from '@modelcontextprotocol/sdk/types.js';

export function getWorkspaceToolSchemas(): Tool[] {
  return [
    {
      name: 'baserow_list_workspaces',
      description: 'List all available workspaces',
      inputSchema: {
        type: 'object',
        properties: {}
      }
    },
    {
      name: 'baserow_get_workspace',
      description: 'Get details of a specific workspace',
      inputSchema: {
        type: 'object',
        properties: {
          workspace_id: {
            type: 'number',
            description: 'The ID of the workspace'
          }
        },
        required: ['workspace_id']
      }
    },
    {
      name: 'baserow_create_workspace',
      description: 'Create a new workspace',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Name of the new workspace'
          }
        },
        required: ['name']
      }
    },
    {
      name: 'baserow_set_workspace',
      description: 'Set the active workspace for subsequent operations',
      inputSchema: {
        type: 'object',
        properties: {
          workspace_id: {
            type: 'number',
            description: 'The ID of the workspace to set as active'
          }
        },
        required: ['workspace_id']
      }
    }
  ];
}

export async function handleWorkspaceTools(
  client: BaserowClient,
  toolName: string,
  args: any
): Promise<{ content: Array<{ type: string; text: string }> }> {
  let result: any;

  switch (toolName) {
    case 'baserow_list_workspaces':
      result = await client.listWorkspaces();
      break;

    case 'baserow_get_workspace':
      if (!args?.workspace_id) {
        throw new Error('workspace_id is required');
      }
      result = await client.getWorkspace(args.workspace_id);
      break;

    case 'baserow_create_workspace':
      if (!args?.name) {
        throw new Error('name is required');
      }
      result = await client.createWorkspace({ name: args.name });
      break;

    case 'baserow_set_workspace':
      if (!args?.workspace_id) {
        throw new Error('workspace_id is required');
      }
      client.setActiveWorkspace(args.workspace_id);
      result = {
        success: true,
        message: `Active workspace set to ID: ${args.workspace_id}`,
        workspace_id: args.workspace_id
      };
      break;

    default:
      throw new Error(`Unknown workspace tool: ${toolName}`);
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2)
      }
    ]
  };
}