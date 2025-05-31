import { BaserowClient } from '../baserow-client.js';
import { Tool } from '@modelcontextprotocol/sdk/types.js';

export function getAuthToolSchemas(): Tool[] {
  return [
    {
      name: 'baserow_auth_status',
      description: 'Check current authentication status and capabilities',
      inputSchema: {
        type: 'object',
        properties: {}
      }
    },
    {
      name: 'baserow_auth_login',
      description: 'Login with username and password to get JWT token',
      inputSchema: {
        type: 'object',
        properties: {
          username: {
            type: 'string',
            description: 'Baserow account email/username'
          },
          password: {
            type: 'string',
            description: 'Baserow account password'
          }
        },
        required: ['username', 'password']
      }
    },
    {
      name: 'baserow_auth_set_token',
      description: 'Manually set an authentication token (JWT or Database token)',
      inputSchema: {
        type: 'object',
        properties: {
          token: {
            type: 'string',
            description: 'The authentication token (JWT or Database token)'
          },
          type: {
            type: 'string',
            enum: ['jwt', 'database_token'],
            description: 'Type of token being set'
          }
        },
        required: ['token', 'type']
      }
    }
  ];
}

export async function handleAuthTools(
  client: BaserowClient,
  toolName: string,
  args: any
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const authManager = client.getAuthManager();
  let result: any;

  switch (toolName) {
    case 'baserow_auth_status':
      const status = authManager.getAuthStatus();
      result = {
        ...status,
        activeWorkspace: client.getActiveWorkspace() || null,
        recommendations: getAuthRecommendations(status)
      };
      break;

    case 'baserow_auth_login':
      if (!args?.username || !args?.password) {
        throw new Error('username and password are required');
      }
      
      // Set credentials and force a login
      authManager.setCredentials(args.username, args.password);
      
      // Try to get auth header which will trigger login
      try {
        await authManager.getAuthHeader();
        result = {
          success: true,
          message: 'Successfully logged in with JWT token',
          authStatus: authManager.getAuthStatus()
        };
      } catch (error) {
        throw new Error(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      break;

    case 'baserow_auth_set_token':
      if (!args?.token || !args?.type) {
        throw new Error('token and type are required');
      }
      
      authManager.setToken(args.token, args.type);
      result = {
        success: true,
        message: `Successfully set ${args.type} token`,
        authStatus: authManager.getAuthStatus()
      };
      break;

    default:
      throw new Error(`Unknown auth tool: ${toolName}`);
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

function getAuthRecommendations(status: any): string[] {
  const recommendations: string[] = [];
  
  if (!status.isAuthenticated) {
    recommendations.push('Use baserow_auth_login with credentials or baserow_auth_set_token to authenticate');
  }
  
  if (status.type === 'database_token') {
    recommendations.push('Database tokens have limited scope. Consider using JWT for full API access.');
  }
  
  if (status.type === 'jwt' && status.tokenExpiry) {
    const timeLeft = new Date(status.tokenExpiry).getTime() - Date.now();
    const minutesLeft = Math.floor(timeLeft / 60000);
    
    if (minutesLeft < 10) {
      recommendations.push(`JWT token expires in ${minutesLeft} minutes. Consider using credentials auth for auto-refresh.`);
    }
  }
  
  return recommendations;
}