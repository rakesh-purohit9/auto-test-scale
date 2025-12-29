# MCP Server Integration Guide

## Overview
Model Context Protocol (MCP) servers extend Claude Code's capabilities with additional tools and context. This guide covers setting up and using MCP servers in your autonomous app builds.

---

## 1. MCP Configuration

### Claude Code MCP Settings
```json
// ~/.claude/settings.json or project .mcp.json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-filesystem", "/path/to/allowed/dir"]
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://user:pass@localhost:5432/db"
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-github"],
      "env": {
        "GITHUB_TOKEN": "your_github_token"
      }
    },
    "web": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-fetch"]
    },
    "memory": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-memory"]
    },
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "your_brave_api_key"
      }
    }
  }
}
```

---

## 2. Useful MCP Servers for App Building

### Filesystem Server
Access and manipulate files beyond the standard tools.
```json
{
  "filesystem": {
    "command": "npx",
    "args": ["-y", "@anthropic/mcp-server-filesystem", "./src", "./public"]
  }
}
```

### PostgreSQL/Supabase Server
Direct database access for schema management.
```json
{
  "postgres": {
    "command": "npx",
    "args": ["-y", "@anthropic/mcp-server-postgres"],
    "env": {
      "DATABASE_URL": "${SUPABASE_DB_URL}"
    }
  }
}
```

### GitHub Server
Create issues, PRs, and manage repositories.
```json
{
  "github": {
    "command": "npx",
    "args": ["-y", "@anthropic/mcp-server-github"],
    "env": {
      "GITHUB_TOKEN": "${GITHUB_TOKEN}"
    }
  }
}
```

### Puppeteer/Browser Server
For visual testing and screenshots.
```json
{
  "puppeteer": {
    "command": "npx",
    "args": ["-y", "@anthropic/mcp-server-puppeteer"]
  }
}
```

### Sentry Server
Error monitoring integration.
```json
{
  "sentry": {
    "command": "npx",
    "args": ["-y", "@anthropic/mcp-server-sentry"],
    "env": {
      "SENTRY_AUTH_TOKEN": "${SENTRY_AUTH_TOKEN}"
    }
  }
}
```

---

## 3. Custom MCP Server Template

Create custom MCP servers for specific app needs:

### Basic MCP Server Structure
```typescript
// mcp-servers/custom-server/index.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'

const server = new Server(
  { name: 'custom-server', version: '1.0.0' },
  { capabilities: { tools: {} } }
)

// Define available tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'custom_action',
      description: 'Performs a custom action for your app',
      inputSchema: {
        type: 'object',
        properties: {
          input: {
            type: 'string',
            description: 'Input for the action'
          }
        },
        required: ['input']
      }
    }
  ]
}))

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params

  switch (name) {
    case 'custom_action': {
      const { input } = args as { input: string }
      // Your custom logic here
      const result = await performCustomAction(input)
      return {
        content: [{ type: 'text', text: JSON.stringify(result) }]
      }
    }
    default:
      throw new Error(`Unknown tool: ${name}`)
  }
})

async function performCustomAction(input: string) {
  // Implement your logic
  return { success: true, result: input.toUpperCase() }
}

// Start server
async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
}

main().catch(console.error)
```

### Package.json for Custom Server
```json
{
  "name": "custom-mcp-server",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
```

---

## 4. MCP Server Use Cases for App Building

### Database Schema Management
```
Using MCP postgres server to:
1. Create tables with proper structure
2. Set up RLS policies
3. Create indexes for performance
4. Add triggers and functions
```

### Automated Testing
```
Using MCP puppeteer server to:
1. Take screenshots of each page
2. Test responsive layouts
3. Verify navigation flows
4. Check form submissions
```

### Documentation Generation
```
Using MCP filesystem server to:
1. Read all source files
2. Generate API documentation
3. Create README files
4. Build component storybook
```

### Deployment Automation
```
Using MCP GitHub server to:
1. Create deployment branches
2. Set up GitHub Actions
3. Configure environments
4. Manage secrets
```

---

## 5. Project MCP Configuration Template

```json
// .mcp.json - Place in project root
{
  "mcpServers": {
    "project-files": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-filesystem", "./src", "./public", "./supabase"],
      "description": "Access project source files"
    },
    "database": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-postgres"],
      "env": {
        "DATABASE_URL": "${SUPABASE_DB_URL}"
      },
      "description": "Direct database access for schema management"
    },
    "browser": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-puppeteer"],
      "description": "Browser automation for visual testing"
    },
    "search": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "${BRAVE_API_KEY}"
      },
      "description": "Web search for documentation and examples"
    }
  }
}
```

---

## 6. MCP Server Interaction Patterns

### Pattern 1: Database-First Development
```markdown
1. Use postgres MCP to design schema
2. Generate TypeScript types from schema
3. Create Supabase migrations
4. Build UI components matching data model
```

### Pattern 2: Visual Testing Loop
```markdown
1. Build component
2. Use puppeteer MCP to screenshot
3. Analyze screenshot for issues
4. Fix and repeat
```

### Pattern 3: Documentation Sync
```markdown
1. Use filesystem MCP to read source
2. Extract component interfaces
3. Generate documentation
4. Keep README updated
```

### Pattern 4: External API Integration
```markdown
1. Use fetch MCP to test APIs
2. Understand response structures
3. Build TypeScript interfaces
4. Create wrapper functions
```

---

## 7. Environment Variables for MCP

```bash
# .env.local - MCP-related environment variables

# Database
SUPABASE_DB_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres

# GitHub (for github MCP server)
GITHUB_TOKEN=ghp_xxxxxxxxxxxx

# Search (for brave-search MCP server)
BRAVE_API_KEY=BSAxxxxxxxxxxxx

# Sentry (for sentry MCP server)
SENTRY_AUTH_TOKEN=sntrys_xxxxxxxxxxxx
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project
```

---

## 8. MCP Server Health Check

Before building, verify MCP servers are working:

```typescript
// scripts/check-mcp.ts
async function checkMCPServers() {
  const servers = [
    { name: 'filesystem', test: () => listDirectory('./src') },
    { name: 'postgres', test: () => queryDatabase('SELECT 1') },
    { name: 'puppeteer', test: () => takeScreenshot('https://example.com') },
  ]

  for (const server of servers) {
    try {
      await server.test()
      console.log(`✅ ${server.name} is working`)
    } catch (error) {
      console.error(`❌ ${server.name} failed: ${error.message}`)
    }
  }
}
```

---

## 9. Recommended MCP Setup for Different App Types

### SaaS Application
```json
{
  "mcpServers": {
    "filesystem": { /* ... */ },
    "postgres": { /* ... */ },
    "github": { /* ... */ },
    "sentry": { /* ... */ }
  }
}
```

### E-commerce Application
```json
{
  "mcpServers": {
    "filesystem": { /* ... */ },
    "postgres": { /* ... */ },
    "puppeteer": { /* visual testing */ },
    "stripe": { /* payment testing */ }
  }
}
```

### Content Platform
```json
{
  "mcpServers": {
    "filesystem": { /* ... */ },
    "postgres": { /* ... */ },
    "cloudinary": { /* media management */ },
    "search": { /* content indexing */ }
  }
}
```
