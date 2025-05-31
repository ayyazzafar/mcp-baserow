# Changelog

All notable changes to the Baserow MCP Server will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Future features and improvements will be listed here

## [0.1.0] - 2024-05-31

### Added
- Initial release of Baserow MCP Server
- Smart authentication system with automatic token refresh
- Support for JWT tokens, database tokens, and credentials
- Workspace management tools (list, get, create, set active)
- Database operations (list, get, create)
- Table management (list, get with fields, create)
- Row CRUD operations (create, read, update, delete)
- Batch operations for efficient bulk data handling
- Pagination, filtering, and sorting support
- Natural language interaction through Claude Desktop
- Comprehensive error handling and logging
- TypeScript implementation for type safety
- Full API documentation and examples

### Security
- Secure token storage in environment variables
- Automatic token refresh before expiration
- Support for both user-level and database-level authentication

### Developer Experience
- Easy setup with environment configuration
- TypeScript types for all Baserow API entities
- Modular architecture for easy extension
- Comprehensive README with usage examples
- Contributing guidelines for open-source collaboration

## Upgrade Guide

### From Manual Installation to v0.1.0

1. Backup your current `.env` file
2. Update to use the new authentication format:
   ```env
   # Old format
   BASEROW_API_TOKEN=your_token
   
   # New format (recommended)
   BASEROW_USERNAME=your@email.com
   BASEROW_PASSWORD=your_password
   ```
3. Rebuild the project: `npm run build`
4. Restart Claude Desktop

[Unreleased]: https://github.com/ayyazzafar/mcp-baserow/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/ayyazzafar/mcp-baserow/releases/tag/v0.1.0