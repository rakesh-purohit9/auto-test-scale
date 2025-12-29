# 🚀 Autonomous App Builder - Quick Start Guide

Build production-ready apps with 10x quality using Claude Code.

## Prerequisites

- Node.js 18+
- Claude Code CLI (`npm install -g @anthropic-ai/claude-code`)
- Supabase account (free tier works)
- AI API key (OpenAI, Anthropic, or Gemini)

## Quick Start

### Option 1: Use Slash Commands

```bash
# Navigate to your projects directory
cd ~/projects

# Start Claude Code
claude

# Build a SaaS app
/build saas my-saas-app

# Build an e-commerce store
/build ecommerce my-store

# Build a React web app
/build react-webapp my-app

# Build a landing page/website
/build nextjs-website my-site

# Build a Flutter mobile app
/build flutter-mobile my-mobile-app

# Build an internal tool
/build internal-tool my-tool

# Build an AI app
/build ai-app my-ai-chat
```

### Option 2: Use the Builder Script

```bash
# Clone and navigate to builder
cd autonomous-app-builder

# Make script executable
chmod +x scripts/build-app.sh

# Build with a template
./scripts/build-app.sh -t saas -o ../my-new-app

# Build with custom config
./scripts/build-app.sh -c config/my-config.json -o ../my-app
```

### Option 3: Direct Prompt

```bash
# Start Claude Code with the builder prompt
claude -p "$(cat autonomous-app-builder/prompts/build-app.md)"

# Then describe your app requirements
```

## Configuration

### Create Custom Config

```json
{
  "app": {
    "name": "My Awesome App",
    "type": "custom"
  },
  "requirements": {
    "features": [
      "User authentication",
      "Dashboard with analytics",
      "CRUD for main entities"
    ]
  },
  "integrations": {
    "supabase": { "enabled": true },
    "ai": { "provider": "anthropic" }
  }
}
```

### Environment Variables

Create `.env.local` in your new app:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# AI Provider (choose one)
OPENAI_API_KEY=sk-xxx
ANTHROPIC_API_KEY=sk-ant-xxx
GEMINI_API_KEY=xxx
```

## Available Templates

### Full-Stack Applications (Next.js + TypeScript + Supabase)
| Template | Description | Key Features |
|----------|-------------|--------------|
| `saas` | SaaS Platform | Subscriptions, Teams, Analytics, Billing |
| `ecommerce` | Online Store | Products, Cart, Checkout, Orders |
| `social` | Social Network | Posts, Follows, Messaging, Notifications |
| `ai-app` | AI Application | Multi-model Chat, Documents, RAG |
| `dashboard` | Admin Panel | Charts, Tables, Reports, RBAC |

### Web Applications
| Template | Tech Stack | Key Features |
|----------|------------|--------------|
| `react-webapp` | React + Tailwind + JS | SPA, Routing, State, Forms |
| `nextjs-website` | Next.js + Tailwind + TS | Landing Pages, SEO, Animations |
| `internal-tool` | React + Tailwind + JS | Data Tables, Forms, Export |

### Mobile Applications
| Template | Tech Stack | Key Features |
|----------|------------|--------------|
| `flutter-mobile` | Flutter + Dart | iOS & Android, Material 3, Offline

## Slash Commands

| Command | Description |
|---------|-------------|
| `/build <type> <name>` | Build a new app |
| `/10x-review` | Review for 10x quality |
| `/fix-errors` | Auto-fix all errors |

## 10x Quality Features

Every app built includes:

- ✨ Stunning, polished UI with micro-interactions
- 🎨 Professional color schemes and typography
- 📱 Fully responsive (mobile, tablet, desktop)
- 🌓 Dark/light mode support
- ⚡ Optimized performance (Lighthouse 90+)
- ♿ Accessible (WCAG AA compliant)
- 🔒 Secure by default (RLS, auth, validation)
- 🧪 Testing setup (unit, integration, e2e)
- 📝 TypeScript with strict mode
- 🔄 Real-time updates where applicable

## Folder Structure

Generated apps follow this structure:

```
my-app/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   │   ├── ui/          # Base UI components
│   │   └── features/    # Feature-specific components
│   ├── lib/             # Utilities and configs
│   │   ├── supabase/    # Supabase clients
│   │   └── ai/          # AI provider clients
│   ├── hooks/           # Custom React hooks
│   ├── stores/          # Zustand stores
│   └── types/           # TypeScript types
├── supabase/
│   └── migrations/      # Database migrations
├── public/              # Static assets
└── tests/              # Test files
```

## After Building

```bash
# Navigate to your new app
cd my-new-app

# Install dependencies (if not already done)
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## Troubleshooting

### Build Errors
Run `/fix-errors` to automatically detect and fix issues.

### Missing Dependencies
```bash
npm install
```

### Type Errors
```bash
npm run type-check
```

### Supabase Connection Issues
- Verify your Supabase URL and keys
- Check RLS policies are set up correctly

## Getting Help

- Check the prompts in `prompts/` for detailed instructions
- Review template configs in `config/templates/`
- Open an issue on GitHub

---

Built with ❤️ by the Autonomous App Builder
