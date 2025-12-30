# Autonomous App Builder GUI

A beautiful web interface for the Autonomous App Builder.

## Features

- **Template Selection**: Browse and select from 9 app templates
- **Requirements Form**: Describe your app with example prompts
- **Configuration Panel**: Set up Supabase, AI providers, and features
- **Build Progress**: Real-time build progress with terminal output

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## Tech Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Zustand** - State management
- **Radix UI** - Accessible components

## Screenshots

### Template Selection
Choose from Full-Stack, Web, or Mobile app templates.

### Requirements Form
Describe your app with AI-powered example prompts.

### Configuration
Set up Supabase, AI providers, and toggle features.

### Build Progress
Watch your app being built in real-time.

## Integration with Claude Code

The GUI generates the appropriate Claude Code command based on your selections:

```bash
claude -p "Build a [template] app called [name] with the following requirements: [requirements]"
```

## Development

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Build
npm run build
```
