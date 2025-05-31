# Baserow API Summary

## Overview
- **API Version**: 1.33.3
- **OpenAPI Version**: 3.0.3
- **Base URL**: https://api.baserow.io (inferred from the schema URL)
- **Documentation**: https://baserow.io/docs/apis%2Frest-api

## Authentication Methods

### 1. JWT Token (Primary)
- **Type**: Bearer token
- **Format**: `Authorization: Bearer JWT your_jwt_token`
- **Usage**: For authenticated user operations
- **Endpoints**: Most API endpoints support JWT authentication

### 2. Database Token
- **Type**: Bearer token  
- **Format**: `Authorization: Bearer Token your_database_token`
- **Usage**: For database operations (CRUD on tables/rows)
- **Management Endpoints**:
  - `GET /api/database/tokens/` - List tokens
  - `POST /api/database/tokens/` - Create token
  - `GET /api/database/tokens/{token_id}/` - Get specific token
  - `PATCH /api/database/tokens/{token_id}/` - Update token
  - `DELETE /api/database/tokens/{token_id}/` - Delete token
  - `GET /api/database/tokens/check/` - Validate token

### 3. UserSource JWT
- **Type**: Bearer token
- **Format**: `Authorization: Bearer JWT your_token`
- **Usage**: For user source authentication

## Core API Endpoints

### Workspaces (formerly Groups)
- `GET /api/workspaces/` - List workspaces
- `POST /api/workspaces/` - Create workspace
- `PATCH /api/workspaces/{workspace_id}/` - Update workspace
- `DELETE /api/workspaces/{workspace_id}/` - Delete workspace
- `POST /api/workspaces/{workspace_id}/export/async/` - Export workspace
- `POST /api/workspaces/{workspace_id}/import/async/` - Import workspace

### Applications (Databases)
- `GET /api/applications/` - List all applications
- `GET /api/applications/workspace/{workspace_id}/` - List workspace applications
- `POST /api/applications/workspace/{workspace_id}/` - Create application
- `GET /api/applications/{application_id}/` - Get application
- `PATCH /api/applications/{application_id}/` - Update application
- `DELETE /api/applications/{application_id}/` - Delete application
- `POST /api/applications/{application_id}/duplicate/async/` - Duplicate application

### Database Tables
- `GET /api/database/tables/all-tables/` - List all tables
- `GET /api/database/tables/database/{database_id}/` - List database tables
- `POST /api/database/tables/database/{database_id}/` - Create table
- `GET /api/database/tables/{table_id}/` - Get table
- `PATCH /api/database/tables/{table_id}/` - Update table
- `DELETE /api/database/tables/{table_id}/` - Delete table
- `POST /api/database/tables/{table_id}/duplicate/async/` - Duplicate table
- `POST /api/database/tables/{table_id}/import/async/` - Import data to table

### Table Fields
- `GET /api/database/fields/table/{table_id}/` - List table fields
- `POST /api/database/fields/table/{table_id}/` - Create field
- `GET /api/database/fields/{field_id}/` - Get field
- `PATCH /api/database/fields/{field_id}/` - Update field
- `DELETE /api/database/fields/{field_id}/` - Delete field
- `POST /api/database/fields/{field_id}/duplicate/async/` - Duplicate field

### Table Rows (CRUD Operations)
- `GET /api/database/rows/table/{table_id}/` - List rows (with pagination)
- `POST /api/database/rows/table/{table_id}/` - Create row
- `GET /api/database/rows/table/{table_id}/{row_id}/` - Get row
- `PATCH /api/database/rows/table/{table_id}/{row_id}/` - Update row
- `DELETE /api/database/rows/table/{table_id}/{row_id}/` - Delete row
- `PATCH /api/database/rows/table/{table_id}/batch/` - Batch update rows
- `POST /api/database/rows/table/{table_id}/batch/` - Batch create rows
- `POST /api/database/rows/table/{table_id}/batch-delete/` - Batch delete rows
- `PATCH /api/database/rows/table/{table_id}/{row_id}/move/` - Move row
- `GET /api/database/rows/table/{table_id}/{row_id}/history/` - Get row history

### User Management
- `POST /api/user/` - Create user account
- `PATCH /api/user/account/` - Update account
- `POST /api/user/change-password/` - Change password
- `GET /api/user/dashboard/` - Get user dashboard
- `PATCH /api/user/undo/` - Undo last action
- `PATCH /api/user/redo/` - Redo last undone action

## Request/Response Patterns

### Common Headers
- `Authorization`: Bearer token (JWT or Database token)
- `Content-Type`: application/json
- `ClientSessionId`: Optional UUID for undo/redo functionality

### Pagination
Most list endpoints support pagination with:
- `page`: Page number
- `size`: Items per page
- `search`: Search query
- `sorts`: Sort fields (e.g., `+name,-created`)

### Error Response Format
```json
{
  "error": "ERROR_CODE",
  "detail": "Human readable error message or object with details"
}
```

### Common Error Codes
- `ERROR_USER_NOT_IN_GROUP` - User lacks workspace access
- `ERROR_REQUEST_BODY_VALIDATION` - Invalid request data
- `ERROR_GROUP_DOES_NOT_EXIST` - Workspace not found
- `ERROR_TABLE_DOES_NOT_EXIST` - Table not found
- `ERROR_ROW_DOES_NOT_EXIST` - Row not found
- `ERROR_INVALID_SORT_ATTRIBUTE` - Invalid sort parameter
- `ERROR_PAGE_SIZE_LIMIT` - Page size exceeds limit

## Data Models

### Workspace
- `id`: Integer
- `name`: String
- `created_on`: DateTime
- `storage_usage`: Integer
- `row_count`: Integer
- `application_count`: Integer

### Application (Database)
- `id`: Integer
- `name`: String
- `workspace`: Workspace reference
- `order`: Integer
- `type`: String (e.g., "database")

### Table
- `id`: Integer
- `name`: String
- `order`: Integer
- `database_id`: Integer
- `row_count`: Integer

### Field
- `id`: Integer
- `table_id`: Integer
- `name`: String
- `order`: Integer
- `type`: String (e.g., "text", "number", "boolean", etc.)
- `primary`: Boolean
- Field-type specific properties

### Row
- `id`: Integer
- `order`: String (decimal for precise ordering)
- Dynamic field values based on table schema

## Important Notes

1. **Authentication**: Most endpoints require authentication via JWT or Database token
2. **Workspace vs Group**: The API uses "workspace" terminology, though some endpoints still reference "group"
3. **Async Operations**: Large operations (export, import, duplicate) are handled asynchronously
4. **Undo/Redo**: Supported via ClientSessionId header
5. **Public Views**: Some endpoints support public access to views without authentication
6. **Enterprise Features**: Audit logs and some advanced features require enterprise license
7. **Rate Limiting**: Not explicitly documented in the schema but likely implemented