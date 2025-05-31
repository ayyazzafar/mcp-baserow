import { BaserowClient } from '../baserow-client.js';
import { Tool } from '@modelcontextprotocol/sdk/types.js';

export function getRowToolSchemas(): Tool[] {
  return [
    {
      name: 'baserow_list_rows',
      description: 'List rows in a table with optional pagination and filtering',
      inputSchema: {
        type: 'object',
        properties: {
          table_id: {
            type: 'number',
            description: 'The ID of the table'
          },
          page: {
            type: 'number',
            description: 'Page number (default: 1)'
          },
          size: {
            type: 'number',
            description: 'Number of rows per page (default: 100)'
          },
          search: {
            type: 'string',
            description: 'Search query to filter rows'
          },
          sorts: {
            type: 'string',
            description: 'Sort fields (e.g., "+field1,-field2")'
          }
        },
        required: ['table_id']
      }
    },
    {
      name: 'baserow_get_row',
      description: 'Get a specific row by ID',
      inputSchema: {
        type: 'object',
        properties: {
          table_id: {
            type: 'number',
            description: 'The ID of the table'
          },
          row_id: {
            type: 'number',
            description: 'The ID of the row'
          }
        },
        required: ['table_id', 'row_id']
      }
    },
    {
      name: 'baserow_create_row',
      description: 'Create a new row in a table',
      inputSchema: {
        type: 'object',
        properties: {
          table_id: {
            type: 'number',
            description: 'The ID of the table'
          },
          data: {
            type: 'object',
            description: 'Row data as key-value pairs where keys are field names',
            additionalProperties: true
          }
        },
        required: ['table_id', 'data']
      }
    },
    {
      name: 'baserow_update_row',
      description: 'Update an existing row',
      inputSchema: {
        type: 'object',
        properties: {
          table_id: {
            type: 'number',
            description: 'The ID of the table'
          },
          row_id: {
            type: 'number',
            description: 'The ID of the row to update'
          },
          data: {
            type: 'object',
            description: 'Updated row data as key-value pairs',
            additionalProperties: true
          }
        },
        required: ['table_id', 'row_id', 'data']
      }
    },
    {
      name: 'baserow_delete_row',
      description: 'Delete a row from a table',
      inputSchema: {
        type: 'object',
        properties: {
          table_id: {
            type: 'number',
            description: 'The ID of the table'
          },
          row_id: {
            type: 'number',
            description: 'The ID of the row to delete'
          }
        },
        required: ['table_id', 'row_id']
      }
    },
    {
      name: 'baserow_batch_create_rows',
      description: 'Create multiple rows in a single request',
      inputSchema: {
        type: 'object',
        properties: {
          table_id: {
            type: 'number',
            description: 'The ID of the table'
          },
          rows: {
            type: 'array',
            description: 'Array of row data objects',
            items: {
              type: 'object',
              additionalProperties: true
            }
          }
        },
        required: ['table_id', 'rows']
      }
    },
    {
      name: 'baserow_batch_update_rows',
      description: 'Update multiple rows in a single request',
      inputSchema: {
        type: 'object',
        properties: {
          table_id: {
            type: 'number',
            description: 'The ID of the table'
          },
          rows: {
            type: 'array',
            description: 'Array of row objects with id and updated data',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'number',
                  description: 'Row ID'
                }
              },
              additionalProperties: true,
              required: ['id']
            }
          }
        },
        required: ['table_id', 'rows']
      }
    },
    {
      name: 'baserow_batch_delete_rows',
      description: 'Delete multiple rows in a single request',
      inputSchema: {
        type: 'object',
        properties: {
          table_id: {
            type: 'number',
            description: 'The ID of the table'
          },
          row_ids: {
            type: 'array',
            description: 'Array of row IDs to delete',
            items: {
              type: 'number'
            }
          }
        },
        required: ['table_id', 'row_ids']
      }
    }
  ];
}

export async function handleRowTools(
  client: BaserowClient,
  toolName: string,
  args: any
): Promise<{ content: Array<{ type: string; text: string }> }> {
  let result: any;

  switch (toolName) {
    case 'baserow_list_rows':
      if (!args?.table_id) {
        throw new Error('table_id is required');
      }
      result = await client.listRows(args.table_id, {
        page: args?.page,
        size: args?.size,
        search: args?.search,
        sorts: args?.sorts
      });
      break;

    case 'baserow_get_row':
      if (!args?.table_id || !args?.row_id) {
        throw new Error('table_id and row_id are required');
      }
      result = await client.getRow(args.table_id, args.row_id);
      break;

    case 'baserow_create_row':
      if (!args?.table_id || !args?.data) {
        throw new Error('table_id and data are required');
      }
      result = await client.createRow({
        table_id: args.table_id,
        data: args.data
      });
      break;

    case 'baserow_update_row':
      if (!args?.table_id || !args?.row_id || !args?.data) {
        throw new Error('table_id, row_id, and data are required');
      }
      result = await client.updateRow({
        table_id: args.table_id,
        row_id: args.row_id,
        data: args.data
      });
      break;

    case 'baserow_delete_row':
      if (!args?.table_id || !args?.row_id) {
        throw new Error('table_id and row_id are required');
      }
      await client.deleteRow(args.table_id, args.row_id);
      result = {
        success: true,
        message: `Row ${args.row_id} deleted successfully`
      };
      break;

    case 'baserow_batch_create_rows':
      if (!args?.table_id || !args?.rows || !Array.isArray(args.rows)) {
        throw new Error('table_id and rows array are required');
      }
      result = await client.batchCreateRows({
        table_id: args.table_id,
        rows: args.rows
      });
      break;

    case 'baserow_batch_update_rows':
      if (!args?.table_id || !args?.rows || !Array.isArray(args.rows)) {
        throw new Error('table_id and rows array are required');
      }
      result = await client.batchUpdateRows({
        table_id: args.table_id,
        rows: args.rows
      });
      break;

    case 'baserow_batch_delete_rows':
      if (!args?.table_id || !args?.row_ids || !Array.isArray(args.row_ids)) {
        throw new Error('table_id and row_ids array are required');
      }
      await client.batchDeleteRows({
        table_id: args.table_id,
        row_ids: args.row_ids
      });
      result = {
        success: true,
        message: `${args.row_ids.length} rows deleted successfully`
      };
      break;

    default:
      throw new Error(`Unknown row tool: ${toolName}`);
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