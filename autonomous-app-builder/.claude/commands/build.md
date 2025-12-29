# Build App - Autonomous App Builder

Build a complete, production-ready application with 10x quality.

## Usage
```
/build <app-type> <app-name>
```

Then describe your requirements when prompted.

## App Types

### Full-Stack Applications
- `saas` - SaaS platform with subscriptions, teams, billing
- `ecommerce` - E-commerce store with products, cart, checkout
- `social` - Social network with posts, follows, messaging
- `ai-app` - AI-powered app with chat, documents, analysis
- `dashboard` - Admin dashboard with charts, tables, reports

### Web Applications
- `react-webapp` - React + Tailwind + JavaScript SPA
- `nextjs-website` - Next.js + Tailwind + TypeScript marketing site/landing page
- `internal-tool` - React + Tailwind + JavaScript internal business tool

### Mobile Applications
- `flutter-mobile` - Flutter cross-platform mobile app (iOS & Android)

### Custom
- `custom` - Custom app from scratch based on your requirements

## Arguments
- `$ARGUMENTS` - App type and name from command

---

## Instructions

You are the Autonomous App Builder. Create a **10x quality** production application.

### Step 1: Parse Arguments

Extract from: `$ARGUMENTS`
- **App Type**: One of the types listed above
- **App Name**: Name for the project

If arguments are missing, ask:
1. What type of app do you want to build?
2. What should it be called?

### Step 2: Collect User Requirements

**IMPORTANT**: Always ask the user to describe their specific requirements:

```
Great! You want to build a [type] app called "[name]".

Please describe what you want to build:
- What is the main purpose of this app?
- Who are the target users?
- What are the key features you need?
- Any specific integrations (Supabase, AI, payments)?
- Any design preferences (colors, style)?

The more detail you provide, the better I can build it for you.
```

### Step 3: Load Template and Prompt

Based on the app type, load:
1. **Template**: `autonomous-app-builder/config/templates/<type>.json`
2. **Specialized Prompt**: `autonomous-app-builder/prompts/<type>.md`

Replace `{{USER_REQUIREMENTS}}` in the prompt with the user's description.

### Step 4: Execute Build Process

#### For React/JavaScript Apps (react-webapp, internal-tool)
```
1. Create Vite + React project
2. Install dependencies (tailwindcss, zustand, axios, etc.)
3. Configure Tailwind CSS
4. Build UI components
5. Create pages and routing
6. Add state management
7. Implement features
8. Test and polish
```

#### For Next.js Apps (nextjs-website, saas, ecommerce, etc.)
```
1. Create Next.js 15 project with App Router
2. Install dependencies
3. Configure Tailwind + shadcn/ui
4. Set up Supabase if needed
5. Build layout and sections
6. Create all pages
7. Add animations and polish
8. Optimize for performance/SEO
```

#### For Flutter Apps (flutter-mobile)
```
1. Create Flutter project
2. Add dependencies (riverpod, go_router, dio, etc.)
3. Configure theme
4. Build core widgets
5. Create screens
6. Add state management
7. Implement features
8. Test on both platforms
```

### Step 5: Quality Assurance

Run these checks:
```bash
# For JS/TS projects
npm run build        # Verify builds
npm run lint         # Check code quality
npm run type-check   # TypeScript validation (if applicable)

# For Flutter
flutter analyze      # Analyze code
flutter build        # Verify builds
```

Fix any errors automatically using the auto-fix protocol.

### Step 6: Output Summary

After completion, provide:

```
## ✅ Build Complete!

### Your App: [Name]
[Brief description based on requirements]

### Tech Stack
- Framework: [...]
- Styling: [...]
- State: [...]
- Database: [...]

### Features Implemented
- [Feature 1]
- [Feature 2]
- ...

### Setup Instructions
1. cd [project-name]
2. [Install command]
3. [Configure env variables]
4. [Run command]

### Environment Variables
Create a `.env.local` file with:
```
VARIABLE_1=
VARIABLE_2=
```

### Next Steps
1. [Suggested improvement 1]
2. [Suggested improvement 2]
```

---

## Template-Specific Prompts

### React Web App
Use: `prompts/react-webapp.md`
- Single-page application
- React 18 + Vite
- Tailwind CSS
- JavaScript (ES6+)
- Zustand for state
- React Router for routing

### Next.js Website/Landing Page
Use: `prompts/nextjs-website.md`
- Marketing website
- Next.js 15 + TypeScript
- Tailwind CSS + shadcn/ui
- Framer Motion animations
- SEO optimized
- SSG/SSR

### Flutter Mobile
Use: `prompts/flutter-mobile.md`
- Cross-platform (iOS + Android)
- Flutter 3.24+
- Dart 3.x
- Riverpod state management
- Material Design 3
- GoRouter navigation

### Internal Tool
Use: `prompts/internal-tool.md`
- Business application
- React 18 + Vite
- Tailwind CSS
- JavaScript
- Data tables (TanStack Table)
- Charts (Recharts)
- Export functionality

---

## Quality Standards

Every app must have:
- ✨ Stunning, polished UI
- 📱 Fully responsive design
- 🌓 Dark/light mode (where applicable)
- ⚡ Optimized performance
- ♿ Accessibility compliant
- 🧪 Error handling
- 📝 Clean, organized code

---

Now parse the arguments and begin the build process!
