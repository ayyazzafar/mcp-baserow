# Advanced Scenarios with Baserow MCP Server

This guide covers advanced use cases and integration patterns.

## Multi-Workspace Operations

### Switching Between Workspaces

```javascript
// Scenario: Copy data between workspaces
"List all my workspaces"
"Set workspace 111111 as active"
"Export all data from the Products table"
"Set workspace 222222 as active"
"Import the data into the Products table here"
```

### Cross-Workspace Reporting

```
"Show me the total row count across all my workspaces"
"List all databases that contain a table named 'Customers'"
```

## Database Token Usage

### Restricted Access Scenarios

When using database tokens for specific integrations:

```
"Set my database token: Token_abc123xyz"
"Check what operations I can perform"
"List all tables I have access to"
```

### Switching Authentication Methods

```
"Login with my Baserow credentials: username@example.com"
"Now show me all workspaces" // This works with JWT
"Switch to database token: Token_xyz789"
"Try to create a workspace" // This will fail - database tokens can't create workspaces
```

## Complex Data Operations

### Dynamic Field Creation

```
"Analyze the CSV data I'm about to paste and create appropriate fields in table 567890"
"Create fields for: CustomerID (number), Name (text), Email (email), JoinDate (date), IsActive (boolean)"
```

### Conditional Batch Updates

```
"Update all rows in the Orders table where:
- OrderDate is in the last 30 days
- Status is 'Pending'
- TotalAmount is greater than 1000
Set their Priority to 'High' and assign to 'Senior Team'"
```

### Data Validation Queries

```
"Find all rows in the Customers table where:
- Email field is empty or invalid
- Phone number doesn't match standard format
- Country code is not in ISO format"
```

## Integration Patterns

### Webhook Preparation

```
"List all unique values in the Status field of table 567890"
"For each status, count how many records exist"
"Create a summary table with Status and Count columns"
```

### Data Export Scenarios

```
"Export all customer data from the last quarter:
- Include only active customers
- Sort by total purchase amount
- Group by customer tier"
```

### Audit Trail Implementation

```
"Create an Audit table with fields:
- TableName (text)
- RowID (number)
- Action (single select: Create/Update/Delete)
- Timestamp (date)
- UserEmail (email)
- OldValues (long text)
- NewValues (long text)"
```

## Performance Optimization

### Pagination Strategies

```
"Count total rows in table 567890"
"If more than 1000, fetch in batches of 100"
"Process each batch and track progress"
```

### Efficient Bulk Operations

```
// Instead of individual updates:
"Update row 1 status to 'Complete'"
"Update row 2 status to 'Complete'"
"Update row 3 status to 'Complete'"

// Use batch update:
"Update rows 1, 2, 3 in table 567890 and set all their status to 'Complete'"
```

### Selective Field Retrieval

```
"Get only the ID and Email fields from the Customers table where Country is 'USA'"
"Don't include the other 20 fields to save bandwidth"
```

## Error Recovery Patterns

### Transaction Simulation

```
"Before making changes:
1. Export current state of table 567890
2. Make the required updates
3. If something goes wrong, I can restore from the export"
```

### Validation Before Execution

```
"First, show me a preview of what will happen if I:
- Delete all rows where LastActive is older than 1 year
- Don't actually delete yet, just show me the count and some examples"
```

## Custom Workflows

### CRM Pipeline Management

```
"Every Monday morning:
1. Find all leads created last week
2. Check if they have been contacted
3. If not contacted within 48 hours, set Priority to 'High'
4. Create a summary report of neglected leads"
```

### Inventory Management

```
"When stock levels change:
1. Update the Products table
2. If stock < reorder_level, create a PurchaseOrder row
3. If stock = 0, update product Status to 'Out of Stock'
4. Notify relevant team members"
```

### Data Quality Monitoring

```
"Daily data quality check:
1. Find duplicate emails in Customers table
2. Identify orders without customer links
3. Check for products with price = 0
4. Generate a data quality report"
```

## API Limits and Best Practices

### Rate Limiting Awareness

```
"How many API calls have I made in the last hour?"
"Batch these 500 individual updates into 5 calls of 100 each"
```

### Optimal Batch Sizes

```
"What's the maximum number of rows I can create in one batch?"
"Split this 1000-row import into optimal batch sizes"
```

### Caching Strategies

```
"Cache the workspace list since it rarely changes"
"Refresh table structure only when fields are modified"
```

## Security Considerations

### Token Rotation

```
"Generate a new database token for the Orders table"
"Revoke the old token after confirming the new one works"
```

### Audit Logging

```
"Log all delete operations to an audit table"
"Track who made changes and when"
```

### Permission Testing

```
"Test what operations are available with this database token"
"Verify that sensitive tables are not accessible"
```

Remember: These advanced scenarios demonstrate the flexibility of combining Baserow's API with AI-powered natural language understanding. Always test complex operations on non-production data first!