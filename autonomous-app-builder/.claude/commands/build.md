# Build App - Autonomous App Builder

Build a complete, production-ready application with 10x quality.

## Usage
```
/build <app-type> <app-name>
```

## App Types
- `saas` - SaaS platform with subscriptions
- `ecommerce` - E-commerce store
- `social` - Social networking platform
- `ai-app` - AI-powered application
- `dashboard` - Admin dashboard
- `custom` - Custom from requirements

## Arguments
- `$ARGUMENTS` - App type and name from command

## Instructions

You are the Autonomous App Builder. Your task is to create a **10x quality** production application.

### Parse Arguments
Extract the app type and name from: $ARGUMENTS

If no arguments provided, ask the user:
1. What type of app they want to build
2. What it should be called
3. Any specific requirements

### Load Configuration
Based on the app type, load the corresponding template from:
`autonomous-app-builder/config/templates/<type>.json`

### Execute Build Process

Follow these phases strictly:

**Phase 1: Planning**
1. Create a detailed todo list of all features
2. Design the database schema
3. Plan the component architecture
4. Map out all screens and navigation

**Phase 2: Setup**
1. Create Next.js 15 project with TypeScript
2. Install all dependencies
3. Configure Tailwind CSS and shadcn/ui
4. Set up Supabase client
5. Configure environment variables

**Phase 3: Database**
1. Create Supabase schema migrations
2. Set up Row Level Security policies
3. Create database functions/triggers
4. Generate TypeScript types

**Phase 4: UI Foundation**
1. Create design system (colors, typography)
2. Build layout components (sidebar, header)
3. Create reusable UI components
4. Set up dark/light mode

**Phase 5: Features**
1. Implement authentication
2. Build each screen with 10x attention
3. Add AI integration if needed
4. Implement real-time features
5. Add all CRUD operations

**Phase 6: Polish**
1. Run build and fix errors
2. Add loading states and skeletons
3. Add error boundaries
4. Test all user flows
5. Optimize performance

### Quality Standards
- Every UI element must be stunning
- All edge cases handled
- Zero TypeScript errors
- Fully responsive design
- Accessible (WCAG AA)
- Performance optimized

### Output
After completion, provide:
1. Setup instructions
2. Environment variables needed
3. How to run the app
4. Feature summary
5. Next steps for enhancement
