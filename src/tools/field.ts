import { BaserowClient } from '../baserow-client.js';
import { Tool } from '@modelcontextprotocol/sdk/types.js';

export function getFieldToolSchemas(): Tool[] {
  return [
    {
      name: 'baserow_create_field',
      description: 'Create a new field (column) in a table',
      inputSchema: {
        type: 'object',
        properties: {
          table_id: {
            type: 'number',
            description: 'The ID of the table to add the field to'
          },
          name: {
            type: 'string',
            description: 'Name of the new field'
          },
          type: {
            type: 'string',
            description: 'Field type (e.g. "text", "long_text", "number", "boolean", "date", "link_row", "single_select", "multiple_select", "url", "email", "phone_number", "rating")'
          }
        },
        required: ['table_id', 'name', 'type']
      }
    },
    {
      name: 'baserow_update_field',
      description: 'Update a field (column) - rename it, change its type, or modify type-specific options',
      inputSchema: {
        type: 'object',
        properties: {
          field_id: {
            type: 'number',
            description: 'The ID of the field to update'
          },
          name: {
            type: 'string',
            description: 'New name for the field'
          },
          type: {
            type: 'string',
            description: 'New field type (changes the column type)'
          }
        },
        required: ['field_id']
      }
    },
    {
      name: 'baserow_delete_field',
      description: 'Delete a field (column) from a table. This permanently removes the column and all its data.',
      inputSchema: {
        type: 'object',
        properties: {
          field_id: {
            type: 'number',
            description: 'The ID of the field to delete'
          }
        },
        required: ['field_id']
      }
    }
  ];
}

export async function handleFieldTools(
  client: BaserowClient,
  toolName: string,
  args: any
): Promise<{ content: Array<{ type: string; text: string }> }> {
  let result: any;

  switch (toolName) {
    case 'baserow_create_field':
      if (!args?.table_id || !args?.name || !args?.type) {
        throw new Error('table_id, name, and type are required');
      }
      result = await client.createField(args);
      break;

    case 'baserow_update_field':
      if (!args?.field_id) {
        throw new Error('field_id is required');
      }
      result = await client.updateField(args);
      break;

    case 'baserow_delete_field':
      if (!args?.field_id) {
        throw new Error('field_id is required');
      }
      await client.deleteField(args.field_id);
      result = { success: true, message: `Field ${args.field_id} deleted` };
      break;

    default:
      throw new Error(`Unknown field tool: ${toolName}`);
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
