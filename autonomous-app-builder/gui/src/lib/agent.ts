/**
 * Autonomous Agent Orchestrator
 *
 * This agent manages the entire app building process autonomously:
 * - Executes commands automatically
 * - Reviews and iterates on code
 * - Fixes errors automatically
 * - Tests the application
 * - Implements Supabase auth and AI integration
 */

import { BuildConfig, BuildStep } from './store'

export type AgentPhase =
  | 'planning'
  | 'scaffolding'
  | 'dependencies'
  | 'configuration'
  | 'database'
  | 'auth'
  | 'components'
  | 'pages'
  | 'features'
  | 'ai-integration'
  | 'testing'
  | 'review'
  | 'fixing'
  | 'iteration'
  | 'complete'

export type AgentAction = {
  type: 'command' | 'write' | 'edit' | 'review' | 'test' | 'fix'
  description: string
  target?: string
  content?: string
  command?: string
}

export type AgentLog = {
  timestamp: Date
  phase: AgentPhase
  action: string
  status: 'running' | 'success' | 'error' | 'warning'
  details?: string
  output?: string
}

export type AgentState = {
  phase: AgentPhase
  isRunning: boolean
  currentAction: string
  progress: number
  logs: AgentLog[]
  errors: string[]
  projectPath: string
  iterationCount: number
  reviewScore: number
  testsPassed: boolean
}

// Mega prompt sections for comprehensive building
export const MEGA_PROMPT_SECTIONS = {
  planning: `
## Phase 1: Intelligent Planning

Analyze the requirements and create a comprehensive build plan:

1. **Parse Requirements**:
   - Extract core features from user description
   - Identify implicit requirements
   - Determine data models and relationships
   - Map user flows and navigation

2. **Architecture Decision**:
   - Choose optimal folder structure
   - Plan component hierarchy
   - Design state management approach
   - Determine API structure

3. **Database Schema**:
   - Design tables based on features
   - Plan relationships (1:1, 1:N, N:N)
   - Create RLS policies for security
   - Plan indexes for performance

4. **AI Integration Points**:
   - Identify where AI adds value
   - Choose appropriate AI tasks (chat, analysis, generation)
   - Plan prompt templates
   - Design fallback behaviors
`,

  scaffolding: `
## Phase 2: Project Scaffolding

Create the project with optimal configuration:

1. **Initialize Project**:
   - Create with latest framework version
   - Configure TypeScript strict mode
   - Set up path aliases
   - Configure environment handling

2. **Install Core Dependencies**:
   - Framework essentials
   - UI library (Tailwind + shadcn)
   - State management (Zustand)
   - Form handling (React Hook Form + Zod)
   - Data fetching (TanStack Query)

3. **Project Structure**:
   - Create all necessary directories
   - Set up component organization
   - Configure absolute imports
   - Add utility files
`,

  database: `
## Phase 3: Database & Supabase Setup

Implement complete Supabase integration:

1. **Schema Creation**:
   - Create all tables with proper types
   - Add foreign key relationships
   - Create indexes for queries
   - Add created_at/updated_at triggers

2. **Row Level Security**:
   - Enable RLS on all tables
   - Create policies for CRUD operations
   - Implement team/org-based access
   - Add admin bypass policies

3. **Storage Buckets**:
   - Create buckets for file uploads
   - Set up access policies
   - Configure file size limits
   - Add allowed MIME types

4. **Edge Functions** (if needed):
   - Create serverless functions
   - Set up webhook handlers
   - Implement background jobs
`,

  auth: `
## Phase 4: Authentication System

Implement complete auth flow:

1. **Auth Provider Setup**:
   - Configure Supabase Auth
   - Set up OAuth providers (Google, GitHub)
   - Configure magic link emails
   - Set up password reset flow

2. **Auth Components**:
   - Login page with all auth methods
   - Registration with validation
   - Password reset flow
   - Email verification handling

3. **Auth Context**:
   - Create auth provider
   - Implement session management
   - Add loading states
   - Handle auth errors

4. **Protected Routes**:
   - Create middleware for protection
   - Implement role-based access
   - Add redirect logic
   - Handle expired sessions
`,

  components: `
## Phase 5: UI Components (10x Quality)

Build stunning, reusable components:

1. **Design System**:
   - Configure color palette
   - Set up typography scale
   - Define spacing system
   - Create animation tokens

2. **Base Components**:
   - Button (all variants, sizes, states)
   - Input (with validation, icons)
   - Card (with hover, selection)
   - Modal (with animations)
   - Toast (success, error, info)
   - Loading (skeleton, spinner)

3. **Layout Components**:
   - Sidebar (collapsible, responsive)
   - Header (with search, user menu)
   - Footer (with links)
   - Page wrapper

4. **Feature Components**:
   - Data tables (sort, filter, paginate)
   - Forms (multi-step, validation)
   - Charts (if needed)
   - File upload (drag & drop)
`,

  aiIntegration: `
## Phase 6: AI Integration

Implement intelligent AI features:

1. **AI Client Setup**:
   - Configure selected provider
   - Set up streaming support
   - Implement error handling
   - Add retry logic

2. **Chat Interface** (if applicable):
   - Create chat component
   - Implement message history
   - Add typing indicators
   - Support markdown rendering

3. **AI Features**:
   - Content generation
   - Data analysis
   - Smart suggestions
   - Auto-categorization

4. **Prompt Engineering**:
   - Create system prompts
   - Build prompt templates
   - Implement context injection
   - Add output parsing
`,

  testing: `
## Phase 7: Automated Testing

Implement comprehensive testing:

1. **Unit Tests**:
   - Test utility functions
   - Test hooks
   - Test state logic
   - Mock external services

2. **Component Tests**:
   - Test rendering
   - Test interactions
   - Test accessibility
   - Test responsive behavior

3. **Integration Tests**:
   - Test API routes
   - Test database operations
   - Test auth flows
   - Test form submissions

4. **E2E Tests**:
   - Test critical user flows
   - Test navigation
   - Test error handling
   - Test mobile views
`,

  review: `
## Phase 8: 10x Quality Review

Perform comprehensive quality audit:

1. **Code Quality**:
   - Check TypeScript strictness
   - Verify no unused code
   - Ensure consistent patterns
   - Validate error handling

2. **UI/UX Quality**:
   - Verify responsive design
   - Check animations smoothness
   - Validate accessibility
   - Test dark/light modes

3. **Performance**:
   - Check bundle size
   - Verify lazy loading
   - Optimize images
   - Check Core Web Vitals

4. **Security**:
   - Verify RLS policies
   - Check input validation
   - Validate auth flows
   - Review API security

5. **Scoring**:
   - Rate each category 1-10
   - Calculate overall score
   - Identify improvements
   - Prioritize fixes
`,
}

// Generate mega prompt for building
export function generateMegaPrompt(config: BuildConfig): string {
  const { template, requirements, appName, supabase, ai, features } = config

  return `
# AUTONOMOUS APP BUILDER - MEGA PROMPT
# =====================================

You are an elite autonomous app builder. Your mission is to create a **production-ready, 10x quality** application with ZERO human intervention.

## PROJECT CONFIGURATION

**App Name**: ${appName}
**Template**: ${template?.name} (${template?.id})
**Tech Stack**: ${template?.techStack.join(', ')}

## USER REQUIREMENTS

${requirements}

## INTEGRATIONS

### Supabase: ${supabase.enabled ? 'ENABLED' : 'DISABLED'}
${supabase.enabled ? `
- URL: ${supabase.url || 'Configure in .env.local'}
- Features: Database, Auth, Storage, Realtime
- Implement complete RLS policies
- Auto-create auth system
` : ''}

### AI Integration: ${ai.enabled ? 'ENABLED' : 'DISABLED'}
${ai.enabled ? `
- Provider: ${ai.provider}
- Implement streaming chat if applicable
- Add smart features based on app type
` : ''}

### Features
- Authentication: ${features.auth ? 'YES' : 'NO'}
- Dark Mode: ${features.darkMode ? 'YES' : 'NO'}
- Analytics: ${features.analytics ? 'YES' : 'NO'}
- Payments: ${features.payments ? 'YES' : 'NO'}

---

${MEGA_PROMPT_SECTIONS.planning}

${MEGA_PROMPT_SECTIONS.scaffolding}

${supabase.enabled ? MEGA_PROMPT_SECTIONS.database : ''}

${features.auth ? MEGA_PROMPT_SECTIONS.auth : ''}

${MEGA_PROMPT_SECTIONS.components}

${ai.enabled ? MEGA_PROMPT_SECTIONS.aiIntegration : ''}

${MEGA_PROMPT_SECTIONS.testing}

${MEGA_PROMPT_SECTIONS.review}

---

## AUTONOMOUS EXECUTION RULES

1. **Never Stop**: Continue until the app is complete and working
2. **Auto-Fix**: If any error occurs, fix it immediately
3. **Test Everything**: Run tests after each major change
4. **Review & Iterate**: After completion, review and improve
5. **No Placeholders**: Implement everything fully, no TODOs
6. **10x Quality**: Every element must be polished and professional

## OUTPUT REQUIREMENTS

Save all files to: ./projects/${appName}/

After completion, provide:
1. Full project structure
2. Setup instructions
3. Environment variables needed
4. Feature summary
5. Quality score (1-100)
6. Suggested improvements

---

BEGIN AUTONOMOUS BUILD NOW.
`
}

// Generate file edit prompt
export function generateFileEditPrompt(
  filePath: string,
  currentContent: string,
  userInstruction: string
): string {
  return `
# FILE EDIT REQUEST

**File**: ${filePath}

## Current Content:
\`\`\`
${currentContent}
\`\`\`

## User Instruction:
${userInstruction}

## Requirements:
1. Apply the requested changes
2. Maintain code quality and consistency
3. Preserve existing functionality unless changing it
4. Add proper TypeScript types
5. Follow project conventions

## Output:
Provide the complete updated file content.
`
}

// Generate review prompt
export function generateReviewPrompt(projectPath: string): string {
  return `
# 10x QUALITY REVIEW

Review the project at: ${projectPath}

## Review Checklist:

### 1. Code Quality (0-10)
- TypeScript strictness
- No unused imports/variables
- Consistent code style
- Proper error handling
- Clean abstractions

### 2. UI/UX Quality (0-10)
- Responsive design
- Smooth animations
- Loading states
- Error states
- Empty states
- Accessibility

### 3. Performance (0-10)
- Bundle size
- Lazy loading
- Image optimization
- Caching
- Core Web Vitals

### 4. Security (0-10)
- Auth implementation
- RLS policies
- Input validation
- XSS prevention
- CSRF protection

### 5. Functionality (0-10)
- All features work
- Edge cases handled
- Forms validate
- Navigation works
- Data persists

## Output Format:
\`\`\`json
{
  "scores": {
    "codeQuality": 0,
    "uiux": 0,
    "performance": 0,
    "security": 0,
    "functionality": 0
  },
  "overallScore": 0,
  "issues": [
    { "severity": "critical|high|medium|low", "file": "", "issue": "", "fix": "" }
  ],
  "improvements": []
}
\`\`\`
`
}

// Generate test prompt
export function generateTestPrompt(projectPath: string): string {
  return `
# AUTOMATED TESTING

Run comprehensive tests for: ${projectPath}

## Test Execution:

1. **Lint Check**:
   \`\`\`bash
   npm run lint
   \`\`\`

2. **Type Check**:
   \`\`\`bash
   npm run type-check
   \`\`\`

3. **Build Test**:
   \`\`\`bash
   npm run build
   \`\`\`

4. **Unit Tests**:
   \`\`\`bash
   npm run test
   \`\`\`

5. **E2E Tests** (if available):
   \`\`\`bash
   npm run test:e2e
   \`\`\`

## For Each Failure:
1. Identify the root cause
2. Apply the fix
3. Re-run the test
4. Repeat until all pass

## Output:
Report all test results and any fixes applied.
`
}

// Generate fix prompt
export function generateFixPrompt(error: string, context: string): string {
  return `
# AUTO-FIX ERROR

## Error:
\`\`\`
${error}
\`\`\`

## Context:
${context}

## Instructions:
1. Analyze the error message
2. Identify the root cause
3. Determine the correct fix
4. Apply the fix
5. Verify it works

## Rules:
- Fix the actual problem, not symptoms
- Don't break other functionality
- Maintain code quality
- Add error handling if needed

## Output:
Provide the fix with explanation.
`
}

// Agent execution steps
export const AGENT_STEPS: BuildStep[] = [
  { id: 'planning', title: 'Analyzing Requirements', status: 'pending' },
  { id: 'scaffolding', title: 'Creating Project Structure', status: 'pending' },
  { id: 'dependencies', title: 'Installing Dependencies', status: 'pending' },
  { id: 'database', title: 'Setting Up Database', status: 'pending' },
  { id: 'auth', title: 'Implementing Authentication', status: 'pending' },
  { id: 'components', title: 'Building UI Components', status: 'pending' },
  { id: 'pages', title: 'Creating Pages', status: 'pending' },
  { id: 'features', title: 'Implementing Features', status: 'pending' },
  { id: 'ai', title: 'Adding AI Integration', status: 'pending' },
  { id: 'testing', title: 'Running Tests', status: 'pending' },
  { id: 'review', title: '10x Quality Review', status: 'pending' },
  { id: 'fixing', title: 'Auto-Fixing Issues', status: 'pending' },
  { id: 'complete', title: 'Finalizing Build', status: 'pending' },
]

// Simulated agent actions for demo
export function getAgentActionsForPhase(phase: AgentPhase): AgentAction[] {
  const actions: Record<AgentPhase, AgentAction[]> = {
    planning: [
      { type: 'review', description: 'Analyzing user requirements' },
      { type: 'review', description: 'Identifying core features' },
      { type: 'review', description: 'Planning database schema' },
      { type: 'review', description: 'Designing component architecture' },
    ],
    scaffolding: [
      { type: 'command', description: 'Creating project', command: 'npx create-next-app@latest' },
      { type: 'write', description: 'Configuring TypeScript' },
      { type: 'write', description: 'Setting up Tailwind CSS' },
      { type: 'write', description: 'Creating folder structure' },
    ],
    dependencies: [
      { type: 'command', description: 'Installing UI dependencies', command: 'npm install' },
      { type: 'command', description: 'Installing Supabase', command: 'npm install @supabase/supabase-js' },
      { type: 'command', description: 'Installing state management', command: 'npm install zustand' },
    ],
    configuration: [
      { type: 'write', description: 'Creating environment config' },
      { type: 'write', description: 'Setting up Supabase client' },
      { type: 'write', description: 'Configuring AI provider' },
    ],
    database: [
      { type: 'write', description: 'Creating database schema' },
      { type: 'write', description: 'Setting up RLS policies' },
      { type: 'write', description: 'Creating storage buckets' },
      { type: 'command', description: 'Running migrations', command: 'supabase db push' },
    ],
    auth: [
      { type: 'write', description: 'Creating auth provider' },
      { type: 'write', description: 'Building login page' },
      { type: 'write', description: 'Building signup page' },
      { type: 'write', description: 'Creating auth middleware' },
      { type: 'write', description: 'Implementing OAuth handlers' },
    ],
    components: [
      { type: 'write', description: 'Creating Button component' },
      { type: 'write', description: 'Creating Input component' },
      { type: 'write', description: 'Creating Card component' },
      { type: 'write', description: 'Creating Modal component' },
      { type: 'write', description: 'Creating Sidebar component' },
      { type: 'write', description: 'Creating Header component' },
    ],
    pages: [
      { type: 'write', description: 'Creating layout' },
      { type: 'write', description: 'Building home page' },
      { type: 'write', description: 'Building dashboard' },
      { type: 'write', description: 'Creating feature pages' },
    ],
    features: [
      { type: 'write', description: 'Implementing core features' },
      { type: 'write', description: 'Adding CRUD operations' },
      { type: 'write', description: 'Creating API routes' },
      { type: 'write', description: 'Adding real-time updates' },
    ],
    'ai-integration': [
      { type: 'write', description: 'Setting up AI client' },
      { type: 'write', description: 'Creating chat interface' },
      { type: 'write', description: 'Implementing AI features' },
      { type: 'write', description: 'Adding prompt templates' },
    ],
    testing: [
      { type: 'command', description: 'Running linter', command: 'npm run lint' },
      { type: 'command', description: 'Running type check', command: 'npm run type-check' },
      { type: 'command', description: 'Building project', command: 'npm run build' },
      { type: 'command', description: 'Running tests', command: 'npm run test' },
    ],
    review: [
      { type: 'review', description: 'Reviewing code quality' },
      { type: 'review', description: 'Checking UI/UX standards' },
      { type: 'review', description: 'Auditing performance' },
      { type: 'review', description: 'Validating security' },
      { type: 'review', description: 'Calculating 10x score' },
    ],
    fixing: [
      { type: 'fix', description: 'Fixing identified issues' },
      { type: 'fix', description: 'Improving code quality' },
      { type: 'fix', description: 'Enhancing UI polish' },
    ],
    iteration: [
      { type: 'review', description: 'Re-reviewing after fixes' },
      { type: 'test', description: 'Re-running tests' },
    ],
    complete: [
      { type: 'review', description: 'Final verification' },
      { type: 'write', description: 'Generating documentation' },
    ],
  }

  return actions[phase] || []
}
