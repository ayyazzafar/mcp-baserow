# Baserow MCP Server - Basic Usage Examples

This guide provides practical examples of using the Baserow MCP Server with any MCP-compatible client.

## Initial Setup

After configuring the MCP server in your client (Claude Desktop, Cursor, Windsurf, etc.), you can start with these commands:

### 1. Check Authentication Status

```
"Check my Baserow authentication status"
```

Expected response:
- Authentication type (credentials/JWT/database token)
- Available capabilities
- Token expiry information (if applicable)

### 2. List Your Workspaces

```
"Show me all my Baserow workspaces"
```

This will display all workspaces you have access to, including their IDs and names.

## Working with Databases

### Set Active Workspace

```
"Set workspace 119788 as my active workspace"
```

### List Databases

```
"List all databases in my workspace"
```

### Create a New Database

```
"Create a new database called 'Customer Management' in my workspace"
```

## Table Operations

### List Tables in a Database

```
"Show me all tables in database 234377"
```

### Create a New Table

```
"Create a table called 'Customers' in database 234377"
```

### View Table Structure

```
"Show me the structure of table 567890 including all fields"
```

## Row Operations

### Add Data

```
"Add a new row to table 567890 with these values:
- Name: John Doe
- Email: john@example.com
- Status: Active"
```

### Search and Filter

```
"Show me all rows in table 567890 where Status is 'Active'"
```

### Update Data

```
"Update row 123 in table 567890 and set Status to 'Inactive'"
```

### Batch Operations

```
"Create 3 new customers in table 567890:
1. Name: Alice, Email: alice@example.com
2. Name: Bob, Email: bob@example.com
3. Name: Charlie, Email: charlie@example.com"
```

## Advanced Examples

### Complex Queries

```
"Show me the first 10 rows from table 567890, sorted by creation date in descending order"
```

### Data Migration

```
"Copy all rows from table 567890 where Status is 'Archived' to table 999999"
```

### Bulk Updates

```
"Update all rows in table 567890 where LastLogin is older than 30 days and set Status to 'Inactive'"
```

## Tips for Natural Language Commands

1. **Be specific with IDs**: When you know the ID, use it for precision
2. **Use descriptive names**: Your AI assistant can help you find IDs based on names
3. **Break complex operations**: Split large tasks into smaller steps
4. **Verify before destructive operations**: Always list/view before deleting

## Error Handling

If you encounter errors, try:

1. **Check workspace context**:
   ```
   "What is my active workspace?"
   ```

2. **Verify permissions**:
   ```
   "Check if I have permission to create tables in this database"
   ```

3. **List available resources**:
   ```
   "Show me what databases I have access to"
   ```

## Best Practices

1. **Set workspace context first**: Always set your active workspace at the beginning of a session
2. **Use batch operations**: For multiple similar operations, use batch commands
3. **Regular backups**: Before major changes, export your data
4. **Test in development**: Try operations on test data first

## Common Workflows

### Project Management Setup

```
1. "Create a new database called 'Project Tracker'"
2. "Create a table called 'Projects' with fields: Name (text), Status (single select), DueDate (date)"
3. "Create a table called 'Tasks' with fields: Title (text), Project (link to Projects), Assignee (text), Done (boolean)"
4. "Add a sample project: Name='Website Redesign', Status='In Progress', DueDate='2024-12-31'"
```

### Customer Database Migration

```
1. "Show me all tables in my current database"
2. "Create a backup of the Customers table"
3. "Add a new field 'CustomerTier' to the Customers table"
4. "Update all customers with TotalPurchases > 1000 and set CustomerTier to 'Gold'"
```

Remember: Your AI assistant understands context, so you can have natural conversations about your data!