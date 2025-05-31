export interface BaserowConfig {
  apiUrl: string;
  activeWorkspaceId?: number;
  auth: BaserowAuthConfig;
}

export interface BaserowAuthConfig {
  type: 'jwt' | 'credentials' | 'database_token';
  token?: string;
  username?: string;
  password?: string;
  refreshToken?: string;
  tokenExpiry?: number;
}

export interface AuthTokenResponse {
  token: string;
  refresh_token: string;
}

export interface AuthRefreshResponse {
  token: string;
}

export interface Workspace {
  id: number;
  name: string;
  created_on: string;
  storage_usage?: number;
  row_count?: number;
  application_count?: number;
}

export interface Application {
  id: number;
  name: string;
  workspace: number;
  order: number;
  type: string;
}

export interface Database extends Application {
  type: 'database';
}

export interface Table {
  id: number;
  name: string;
  order: number;
  database_id: number;
  row_count?: number;
}

export interface Field {
  id: number;
  table_id: number;
  name: string;
  order: number;
  type: string;
  primary: boolean;
  read_only?: boolean;
  [key: string]: any; // Field-type specific properties
}

export interface Row {
  id: number;
  order: string;
  [key: string]: any; // Dynamic field values
}

export interface PaginationParams {
  page?: number;
  size?: number;
  search?: string;
  sorts?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}

export interface BaserowError {
  error: string;
  detail: string | Record<string, any>;
}

export interface CreateWorkspaceParams {
  name: string;
}

export interface CreateDatabaseParams {
  name: string;
  workspace_id: number;
}

export interface CreateTableParams {
  name: string;
  database_id: number;
}

export interface CreateRowParams {
  table_id: number;
  data: Record<string, any>;
}

export interface UpdateRowParams {
  table_id: number;
  row_id: number;
  data: Record<string, any>;
}

export interface BatchRowOperation {
  id?: number;
  [key: string]: any;
}

export interface BatchCreateRowsParams {
  table_id: number;
  rows: Record<string, any>[];
}

export interface BatchUpdateRowsParams {
  table_id: number;
  rows: BatchRowOperation[];
}

export interface BatchDeleteRowsParams {
  table_id: number;
  row_ids: number[];
}