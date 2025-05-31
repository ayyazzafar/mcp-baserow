import { BaserowClient } from '../baserow-client.js';
import { Tool } from '@modelcontextprotocol/sdk/types.js';

export function getDatabaseToolSchemas(): Tool[] {
  return [
    {
      name: 'baserow_list_databases',
      description: 'List all databases in the active workspace or a specific workspace',
      inputSchema: {
        type: 'object',
        properties: {
          workspace_id: {
            type: 'number',
            description: 'Optional workspace ID. If not provided, uses the active workspace'
          }
        }
      }
    },
    {
      name: 'baserow_get_database',
      description: 'Get details of a specific database',
      inputSchema: {
        type: 'object',
        properties: {
          database_id: {
            type: 'number',
            description: 'The ID of the database'
          }
        },
        required: ['database_id']
      }
    },
    {
      name: 'baserow_create_database',
      description: 'Create a new database in a workspace',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Name of the new database'
          },
          workspace_id: {
            type: 'number',
            description: 'ID of the workspace. If not provided, uses the active workspace'
          }
        },
        required: ['name']
      }
    }
  ];
}

export async function handleDatabaseTools(
  client: BaserowClient,
  toolName: string,
  args: any
): Promise<{ content: Array<{ type: string; text: string }> }> {
  let result: any;

  switch (toolName) {
    case 'baserow_list_databases':
      const workspaceId = args?.workspace_id || client.getActiveWorkspace();
      if (!workspaceId) {
        throw new Error('No workspace_id provided and no active workspace set. Use baserow_set_workspace first.');
      }
      result = await client.listDatabases(workspaceId);
      break;

    case 'baserow_get_database':
      if (!args?.database_id) {
        throw new Error('database_id is required');
      }
      result = await client.getDatabase(args.database_id);
      break;

    case 'baserow_create_database':
      if (!args?.name) {
        throw new Error('name is required');
      }
      const createWorkspaceId = args?.workspace_id || client.getActiveWorkspace();
      if (!createWorkspaceId) {
        throw new Error('No workspace_id provided and no active workspace set. Use baserow_set_workspace first.');
      }
      result = await client.createDatabase({
        name: args.name,
        workspace_id: createWorkspaceId
      });
      break;

    default:
      throw new Error(`Unknown database tool: ${toolName}`);
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