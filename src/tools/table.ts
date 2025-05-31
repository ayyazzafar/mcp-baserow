import { BaserowClient } from '../baserow-client.js';
import { Tool } from '@modelcontextprotocol/sdk/types.js';

export function getTableToolSchemas(): Tool[] {
  return [
    {
      name: 'baserow_list_tables',
      description: 'List all tables in a database',
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
      name: 'baserow_get_table',
      description: 'Get details of a specific table including its fields',
      inputSchema: {
        type: 'object',
        properties: {
          table_id: {
            type: 'number',
            description: 'The ID of the table'
          },
          include_fields: {
            type: 'boolean',
            description: 'Whether to include field definitions (default: true)'
          }
        },
        required: ['table_id']
      }
    },
    {
      name: 'baserow_create_table',
      description: 'Create a new table in a database',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Name of the new table'
          },
          database_id: {
            type: 'number',
            description: 'ID of the database to create the table in'
          }
        },
        required: ['name', 'database_id']
      }
    }
  ];
}

export async function handleTableTools(
  client: BaserowClient,
  toolName: string,
  args: any
): Promise<{ content: Array<{ type: string; text: string }> }> {
  let result: any;

  switch (toolName) {
    case 'baserow_list_tables':
      if (!args?.database_id) {
        throw new Error('database_id is required');
      }
      result = await client.listTables(args.database_id);
      break;

    case 'baserow_get_table':
      if (!args?.table_id) {
        throw new Error('table_id is required');
      }
      const table = await client.getTable(args.table_id);
      
      // Include fields by default unless explicitly set to false
      if (args?.include_fields !== false) {
        const fields = await client.getTableFields(args.table_id);
        result = {
          ...table,
          fields: fields
        };
      } else {
        result = table;
      }
      break;

    case 'baserow_create_table':
      if (!args?.name || !args?.database_id) {
        throw new Error('name and database_id are required');
      }
      result = await client.createTable({
        name: args.name,
        database_id: args.database_id
      });
      break;

    default:
      throw new Error(`Unknown table tool: ${toolName}`);
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