import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import {
  BaserowConfig,
  Workspace,
  Application,
  Database,
  Table,
  Field,
  Row,
  PaginationParams,
  PaginatedResponse,
  BaserowError,
  CreateWorkspaceParams,
  CreateDatabaseParams,
  CreateTableParams,
  CreateRowParams,
  UpdateRowParams,
  BatchCreateRowsParams,
  BatchUpdateRowsParams,
  BatchDeleteRowsParams
} from './types/baserow';
import { AuthManager } from './auth-manager.js';

export class BaserowClient {
  private axios: AxiosInstance;
  private config: BaserowConfig;
  private authManager: AuthManager;

  constructor(config: BaserowConfig) {
    this.config = config;
    this.authManager = new AuthManager(config.auth, config.apiUrl);
    
    this.axios = axios.create({
      baseURL: config.apiUrl,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Add auth interceptor to inject authorization header
    this.axios.interceptors.request.use(
      async (config) => {
        const authHeader = await this.authManager.getAuthHeader();
        config.headers.Authorization = authHeader;
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axios.interceptors.response.use(
      response => response,
      this.handleError
    );
  }

  private handleError(error: AxiosError<BaserowError>): Promise<never> {
    if (error.response?.data) {
      const errorData = error.response.data;
      const message = typeof errorData.detail === 'string' 
        ? errorData.detail 
        : JSON.stringify(errorData.detail);
      
      throw new Error(`Baserow API Error [${errorData.error}]: ${message}`);
    }
    throw error;
  }

  // Workspace operations
  async listWorkspaces(): Promise<Workspace[]> {
    const response = await this.axios.get<Workspace[]>('/api/workspaces/');
    return response.data;
  }

  async getWorkspace(workspaceId: number): Promise<Workspace> {
    const response = await this.axios.get<Workspace>(`/api/workspaces/${workspaceId}/`);
    return response.data;
  }

  async createWorkspace(params: CreateWorkspaceParams): Promise<Workspace> {
    const response = await this.axios.post<Workspace>('/api/workspaces/', params);
    return response.data;
  }

  // Database/Application operations
  async listDatabases(workspaceId?: number): Promise<Database[]> {
    const url = workspaceId 
      ? `/api/applications/workspace/${workspaceId}/`
      : '/api/applications/';
    
    const response = await this.axios.get<Application[]>(url);
    return response.data.filter(app => app.type === 'database') as Database[];
  }

  async getDatabase(databaseId: number): Promise<Database> {
    const response = await this.axios.get<Database>(`/api/applications/${databaseId}/`);
    return response.data;
  }

  async createDatabase(params: CreateDatabaseParams): Promise<Database> {
    const response = await this.axios.post<Database>(
      `/api/applications/workspace/${params.workspace_id}/`,
      {
        name: params.name,
        type: 'database'
      }
    );
    return response.data;
  }

  // Table operations
  async listTables(databaseId: number): Promise<Table[]> {
    const response = await this.axios.get<Table[]>(
      `/api/database/tables/database/${databaseId}/`
    );
    return response.data;
  }

  async getTable(tableId: number): Promise<Table> {
    const response = await this.axios.get<Table>(`/api/database/tables/${tableId}/`);
    return response.data;
  }

  async createTable(params: CreateTableParams): Promise<Table> {
    const response = await this.axios.post<Table>(
      `/api/database/tables/database/${params.database_id}/`,
      { name: params.name }
    );
    return response.data;
  }

  async getTableFields(tableId: number): Promise<Field[]> {
    const response = await this.axios.get<Field[]>(
      `/api/database/fields/table/${tableId}/`
    );
    return response.data;
  }

  // Row operations
  async listRows(
    tableId: number, 
    params?: PaginationParams
  ): Promise<PaginatedResponse<Row>> {
    const response = await this.axios.get<PaginatedResponse<Row>>(
      `/api/database/rows/table/${tableId}/`,
      { params }
    );
    return response.data;
  }

  async getRow(tableId: number, rowId: number): Promise<Row> {
    const response = await this.axios.get<Row>(
      `/api/database/rows/table/${tableId}/${rowId}/`
    );
    return response.data;
  }

  async createRow(params: CreateRowParams): Promise<Row> {
    const response = await this.axios.post<Row>(
      `/api/database/rows/table/${params.table_id}/`,
      params.data
    );
    return response.data;
  }

  async updateRow(params: UpdateRowParams): Promise<Row> {
    const response = await this.axios.patch<Row>(
      `/api/database/rows/table/${params.table_id}/${params.row_id}/`,
      params.data
    );
    return response.data;
  }

  async deleteRow(tableId: number, rowId: number): Promise<void> {
    await this.axios.delete(
      `/api/database/rows/table/${tableId}/${rowId}/`
    );
  }

  // Batch operations
  async batchCreateRows(params: BatchCreateRowsParams): Promise<Row[]> {
    const response = await this.axios.post<{ items: Row[] }>(
      `/api/database/rows/table/${params.table_id}/batch/`,
      { items: params.rows }
    );
    return response.data.items;
  }

  async batchUpdateRows(params: BatchUpdateRowsParams): Promise<Row[]> {
    const response = await this.axios.patch<{ items: Row[] }>(
      `/api/database/rows/table/${params.table_id}/batch/`,
      { items: params.rows }
    );
    return response.data.items;
  }

  async batchDeleteRows(params: BatchDeleteRowsParams): Promise<void> {
    await this.axios.post(
      `/api/database/rows/table/${params.table_id}/batch-delete/`,
      { items: params.row_ids }
    );
  }

  // Configuration
  setActiveWorkspace(workspaceId: number): void {
    this.config.activeWorkspaceId = workspaceId;
  }

  getActiveWorkspace(): number | undefined {
    return this.config.activeWorkspaceId;
  }

  // Authentication management
  getAuthManager(): AuthManager {
    return this.authManager;
  }
}