/**
 * Autonomous Agent Orchestrator
 *
 * This agent manages the entire app building process autonomously:
 * - Analyzes requirements and generates unique designs
 * - Executes commands automatically
 * - Reviews and iterates on code
 * - Fixes errors automatically
 * - Tests the application
 * - Implements Supabase auth and AI integration
 * - Uses MCP servers for enhanced capabilities
 */

import { BuildConfig, BuildStep } from './store'
import { getDesignSystem, DesignSystem, generateTailwindConfig, generateCSSVariables } from './design-systems'
import { generateAppStructure, analyzeRequirements, AppStructure, PageSpec, generatePagePrompt } from './page-planner'
import { generateMegaSystemPrompt, getTailwindConfigContent, getGlobalsCSSContent, getAIIntegrationCode, getSupabaseIntegrationCode } from './mega-prompts'

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
  type: 'command' | 'write' | 'edit' | 'review' | 'test' | 'fix' | 'mcp'
  description: string
  target?: string
  content?: string
  command?: string
  mcpServer?: string
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
  designSystem: DesignSystem | null
  appStructure: AppStructure | null
}

// ============================================================================
// CLAUDE CODE COMMAND GENERATOR
// ============================================================================

export function generateClaudeCodeCommand(config: BuildConfig): string {
  const megaPrompt = generateMegaSystemPrompt(config)

  // Escape the prompt for shell usage
  const escapedPrompt = megaPrompt
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\$/g, '\\$')
    .replace(/`/g, '\\`')

  return `claude --dangerously-skip-permissions -p "${escapedPrompt}"`
}

// ============================================================================
// AUTONOMOUS BUILD ORCHESTRATOR
// ============================================================================

export interface BuildContext {
  config: BuildConfig
  designSystem: DesignSystem
  appStructure: AppStructure
  projectPath: string
}

export function createBuildContext(config: BuildConfig): BuildContext {
  const templateId = config.template?.id || 'saas'
  const designSystem = getDesignSystem(templateId)
  const appStructure = generateAppStructure(templateId, config.requirements)
  const projectPath = `${config.projectPath}/${config.appName}`

  return {
    config,
    designSystem,
    appStructure,
    projectPath,
  }
}

// ============================================================================
// PHASE-SPECIFIC PROMPTS WITH DESIGN SYSTEM
// ============================================================================

export function getPhasePrompt(phase: AgentPhase, context: BuildContext): string {
  const { config, designSystem, appStructure, projectPath } = context

  switch (phase) {
    case 'planning':
      return `
# PHASE: INTELLIGENT PLANNING

You are analyzing requirements for: ${config.appName}
Template: ${config.template?.name}

## User Requirements:
${config.requirements}

## Detected Features:
${JSON.stringify(analyzeRequirements(config.requirements), null, 2)}

## Generated App Structure:
${JSON.stringify(appStructure, null, 2)}

## Design System: ${designSystem.name}
- Primary Color: ${designSystem.colors.primary}
- Layout Pattern: ${designSystem.layout.skimmingPattern}
- Typography: ${designSystem.typography.fontFamily.heading}

## Tasks:
1. Validate the detected features
2. Identify any missing requirements
3. Finalize the page structure
4. Confirm database schema needs
5. Output a build plan

## Output:
Provide a detailed JSON build plan with all pages, components, and integrations.
`

    case 'scaffolding':
      return `
# PHASE: PROJECT SCAFFOLDING

Create the project at: ${projectPath}

## Commands to Execute:
\`\`\`bash
mkdir -p ${projectPath}
cd ${projectPath}
npx create-next-app@latest . --typescript --tailwind --app --import-alias "@/*" --no-eslint
\`\`\`

## After Scaffolding:
1. Replace tailwind.config.ts with:
\`\`\`typescript
${getTailwindConfigContent(config.template?.id || 'saas')}
\`\`\`

2. Replace src/app/globals.css with:
\`\`\`css
${getGlobalsCSSContent(config.template?.id || 'saas')}
\`\`\`

3. Create folder structure:
\`\`\`
src/
├── components/
│   ├── ui/
│   ├── layouts/
│   └── features/
├── lib/
├── hooks/
├── types/
└── providers/
\`\`\`

Execute all commands and create all files.
`

    case 'dependencies':
      const deps = getDependenciesForTemplate(config.template?.id || 'saas', config)
      return `
# PHASE: INSTALL DEPENDENCIES

## Core Dependencies:
\`\`\`bash
cd ${projectPath}
npm install ${deps.core.join(' ')}
\`\`\`

## UI Dependencies:
\`\`\`bash
npm install ${deps.ui.join(' ')}
\`\`\`

## Feature Dependencies:
\`\`\`bash
npm install ${deps.features.join(' ')}
\`\`\`

## Dev Dependencies:
\`\`\`bash
npm install -D ${deps.dev.join(' ')}
\`\`\`

Execute all npm install commands.
`

    case 'database':
      return `
# PHASE: DATABASE SETUP

## Supabase Configuration:
${config.supabase.enabled ? `
1. Create Supabase client at ${projectPath}/src/lib/supabase.ts:
\`\`\`typescript
${getSupabaseIntegrationCode()}
\`\`\`

2. Create database schema based on detected entities:
${appStructure.types.map(t => `- ${t}`).join('\n')}

3. Set up Row Level Security policies

4. Create storage buckets if needed
` : 'Supabase is disabled. Skip this phase.'}
`

    case 'auth':
      return `
# PHASE: AUTHENTICATION

${config.features.auth ? `
## Create Auth System:

1. Create auth provider at ${projectPath}/src/providers/AuthProvider.tsx

2. Create auth pages:
   - ${projectPath}/src/app/auth/login/page.tsx
   - ${projectPath}/src/app/auth/signup/page.tsx
   - ${projectPath}/src/app/auth/forgot-password/page.tsx

3. Create auth middleware at ${projectPath}/src/middleware.ts

4. Use design system colors:
   - Primary: ${designSystem.colors.primary}
   - Background: ${designSystem.colors.background}
   - Button style: ${designSystem.components.button.style}

5. Follow ${designSystem.layout.skimmingPattern} layout pattern
` : 'Authentication is disabled. Skip this phase.'}
`

    case 'components':
      return `
# PHASE: UI COMPONENTS

Build all shared components using the ${designSystem.name} design system.

## Design Specifications:
- Colors: Primary ${designSystem.colors.primary}, Secondary ${designSystem.colors.secondary}
- Border Radius: ${designSystem.borderRadius.lg} for cards, ${designSystem.borderRadius.md} for buttons
- Shadows: ${designSystem.shadows.md}
- Animation: ${designSystem.animation.duration.normal} with ${designSystem.animation.easing.default}

## Components to Create:
${appStructure.sharedComponents.map(c => `
### ${c.name}
- Type: ${c.type}
- Path: ${projectPath}/src/components/ui/${c.name}.tsx
- Props: ${c.props.join(', ') || 'standard'}
- Style: Follow ${designSystem.components.button.style} design
`).join('')}

## Component Guidelines:
- Use ${designSystem.iconStyle.library} icons with stroke-width: ${designSystem.iconStyle.strokeWidth}
- Apply ${designSystem.components.card.hover} hover effect to cards
- Use ${designSystem.components.input.style} style for inputs
- Include loading states and animations
`

    case 'pages':
      return `
# PHASE: BUILD PAGES

Create all pages following the ${designSystem.layout.skimmingPattern} layout pattern.

## Pages to Create:
${appStructure.pages.map(page => generatePagePrompt(page, designSystem)).join('\n\n---\n\n')}

## Layout Guidelines:
- Max width: ${designSystem.layout.maxWidth}
- Grid: ${designSystem.layout.gridColumns} columns
- Section gap: ${designSystem.spacing.sectionGap}
- Container padding: ${designSystem.spacing.containerPadding}
`

    case 'features':
      return `
# PHASE: IMPLEMENT FEATURES

## Core Features:
${appStructure.pages
  .flatMap(p => p.features)
  .filter((f, i, arr) => arr.indexOf(f) === i)
  .map(f => `- ${f}`)
  .join('\n')}

## Implementation Order:
1. CRUD operations
2. Form validations
3. API routes
4. Real-time updates
5. Error handling
6. Loading states

## Quality Standards:
- No console.log statements in production
- Proper TypeScript types
- Error boundaries
- Optimistic updates where applicable
`

    case 'ai-integration':
      return `
# PHASE: AI INTEGRATION

${config.ai.enabled ? `
## AI Provider: ${config.ai.provider}

1. Create AI client at ${projectPath}/src/lib/ai.ts:
\`\`\`typescript
${getAIIntegrationCode()}
\`\`\`

2. Create AI features based on app type:
${getAIFeaturesForTemplate(config.template?.id || 'saas')}

3. Implement streaming for chat interfaces

4. Add proper error handling and fallbacks
` : 'AI integration is disabled. Skip this phase.'}
`

    case 'testing':
      return `
# PHASE: AUTOMATED TESTING

## Run All Tests:
\`\`\`bash
cd ${projectPath}
npm run lint
npm run type-check
npm run build
npm run test
\`\`\`

## For Each Failure:
1. Identify the root cause
2. Apply the fix immediately
3. Re-run the failed test
4. Continue until all pass

## Quality Gates:
- Zero TypeScript errors
- Zero ESLint errors
- Build must succeed
- All tests must pass
`

    case 'review':
      return `
# PHASE: 10x QUALITY REVIEW

## Review Criteria:

### Code Quality (Weight: 20%)
- TypeScript strictness
- No unused code
- Consistent patterns
- Proper error handling

### UI/UX (Weight: 25%)
- Matches ${designSystem.name} design system
- Responsive design
- Smooth animations
- Accessibility (WCAG 2.1)

### Performance (Weight: 15%)
- Bundle size < 300KB initial
- Core Web Vitals pass
- Lazy loading implemented
- Image optimization

### Security (Weight: 20%)
- Auth flows secure
- RLS policies correct
- Input validation
- No exposed secrets

### Functionality (Weight: 20%)
- All features work
- Edge cases handled
- Error states work
- Empty states work

## Minimum Score: 90/100

Output a detailed review with scores and issues.
`

    case 'fixing':
      return `
# PHASE: AUTO-FIX ISSUES

Review the issues identified and fix each one:

1. For each issue:
   - Understand the root cause
   - Apply the correct fix
   - Verify the fix works

2. Re-run quality checks after fixes

3. Continue until score >= 90

## Priority:
1. Critical issues first
2. High severity second
3. Medium/Low last
`

    case 'iteration':
      return `
# PHASE: ITERATION

Re-run the quality review after fixes.

If score < 90:
- Identify remaining issues
- Apply additional fixes
- Repeat until passing

Maximum iterations: 3
`

    case 'complete':
      return `
# PHASE: COMPLETION

## Final Tasks:
1. Generate README.md with:
   - Project description
   - Setup instructions
   - Environment variables
   - Available scripts
   - Feature list

2. Create .env.example with all required variables

3. Final verification:
   - Build passes
   - Dev server starts
   - All features work

4. Output:
   - Final quality score
   - Project location: ${projectPath}
   - Next steps for user
`

    default:
      return ''
  }
}

// ============================================================================
// DEPENDENCY RESOLVER
// ============================================================================

interface Dependencies {
  core: string[]
  ui: string[]
  features: string[]
  dev: string[]
}

function getDependenciesForTemplate(templateId: string, config: BuildConfig): Dependencies {
  const baseDeps: Dependencies = {
    core: [
      'zustand',
      'react-hook-form',
      '@hookform/resolvers',
      'zod',
      '@tanstack/react-query',
      'clsx',
      'tailwind-merge',
      'class-variance-authority',
    ],
    ui: [
      'framer-motion',
      'lucide-react',
      'sonner',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-tabs',
      '@radix-ui/react-tooltip',
      '@radix-ui/react-switch',
      '@radix-ui/react-select',
    ],
    features: [],
    dev: [
      '@types/node',
      '@types/react',
      'typescript',
      'prettier',
      'eslint',
    ],
  }

  // Add Supabase deps
  if (config.supabase.enabled) {
    baseDeps.core.push('@supabase/supabase-js', '@supabase/ssr')
  }

  // Add AI deps
  if (config.ai.enabled) {
    switch (config.ai.provider) {
      case 'openai':
        baseDeps.features.push('openai')
        break
      case 'anthropic':
        baseDeps.features.push('@anthropic-ai/sdk')
        break
      case 'gemini':
        baseDeps.features.push('@google/generative-ai')
        break
      case 'perplexity':
        baseDeps.features.push('openai') // Uses OpenAI-compatible API
        break
    }
  }

  // Add template-specific deps
  switch (templateId) {
    case 'ecommerce':
      baseDeps.features.push('@stripe/stripe-js', 'stripe', 'embla-carousel-react')
      break
    case 'social':
      baseDeps.features.push('react-textarea-autosize', 'react-virtuoso')
      break
    case 'ai-app':
      baseDeps.features.push('react-markdown', 'remark-gfm', 'react-syntax-highlighter')
      break
    case 'dashboard':
      baseDeps.features.push('recharts', '@tanstack/react-table', 'react-day-picker', 'date-fns')
      break
    case 'nextjs-website':
      baseDeps.features.push('next-seo', '@vercel/analytics')
      break
    case 'internal-tool':
      baseDeps.features.push('@tanstack/react-table', 'xlsx', 'file-saver')
      break
  }

  // Add payment deps
  if (config.features.payments) {
    baseDeps.features.push('@stripe/stripe-js', 'stripe')
  }

  return baseDeps
}

// ============================================================================
// AI FEATURES BY TEMPLATE
// ============================================================================

function getAIFeaturesForTemplate(templateId: string): string {
  const features: Record<string, string> = {
    saas: `
- Smart content suggestions
- AI-powered search
- Auto-categorization
- Usage analytics insights`,
    ecommerce: `
- Product recommendations
- Smart search with natural language
- Review sentiment analysis
- Automated product descriptions`,
    social: `
- Content moderation
- Smart feed ranking
- Suggested connections
- Caption generation`,
    'ai-app': `
- Multi-model chat interface
- Document analysis (RAG)
- Content generation
- Code assistance
- Streaming responses`,
    dashboard: `
- Natural language queries
- Anomaly detection
- Report generation
- Predictive analytics`,
    'react-webapp': `
- Smart suggestions
- Content generation
- Search enhancement`,
    'nextjs-website': `
- Content optimization
- SEO suggestions
- Copy generation`,
    'flutter-mobile': `
- Smart notifications
- Content personalization
- Voice commands`,
    'internal-tool': `
- Data extraction
- Report generation
- Natural language queries`,
  }

  return features[templateId] || features.saas
}

// ============================================================================
// AGENT STEPS
// ============================================================================

export const AGENT_STEPS: BuildStep[] = [
  { id: 'planning', title: 'Analyzing Requirements & Design', status: 'pending' },
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

// ============================================================================
// AGENT ACTIONS FOR EACH PHASE
// ============================================================================

export function getAgentActionsForPhase(phase: AgentPhase): AgentAction[] {
  const actions: Record<AgentPhase, AgentAction[]> = {
    planning: [
      { type: 'mcp', description: 'Loading sequential thinking MCP', mcpServer: 'sequential-thinking' },
      { type: 'review', description: 'Analyzing user requirements' },
      { type: 'review', description: 'Generating unique design system' },
      { type: 'review', description: 'Planning pages and components' },
      { type: 'review', description: 'Designing database schema' },
    ],
    scaffolding: [
      { type: 'mcp', description: 'Connecting to filesystem MCP', mcpServer: 'filesystem' },
      { type: 'command', description: 'Creating project directory', command: 'mkdir -p' },
      { type: 'command', description: 'Initializing Next.js project', command: 'npx create-next-app@latest' },
      { type: 'write', description: 'Configuring Tailwind with design system' },
      { type: 'write', description: 'Creating CSS variables' },
      { type: 'write', description: 'Setting up folder structure' },
    ],
    dependencies: [
      { type: 'command', description: 'Installing core packages', command: 'npm install zustand react-hook-form' },
      { type: 'command', description: 'Installing UI packages', command: 'npm install framer-motion lucide-react' },
      { type: 'command', description: 'Installing Supabase', command: 'npm install @supabase/supabase-js' },
      { type: 'command', description: 'Installing AI SDK', command: 'npm install openai @anthropic-ai/sdk' },
    ],
    configuration: [
      { type: 'write', description: 'Creating environment configuration' },
      { type: 'write', description: 'Setting up Supabase client' },
      { type: 'write', description: 'Configuring AI providers' },
      { type: 'write', description: 'Setting up path aliases' },
    ],
    database: [
      { type: 'mcp', description: 'Connecting to PostgreSQL MCP', mcpServer: 'postgres' },
      { type: 'write', description: 'Creating database schema' },
      { type: 'write', description: 'Setting up RLS policies' },
      { type: 'write', description: 'Creating storage buckets' },
      { type: 'command', description: 'Running migrations', command: 'supabase db push' },
    ],
    auth: [
      { type: 'write', description: 'Creating AuthProvider' },
      { type: 'write', description: 'Building login page with design system' },
      { type: 'write', description: 'Building signup page' },
      { type: 'write', description: 'Creating auth middleware' },
      { type: 'write', description: 'Implementing OAuth handlers' },
    ],
    components: [
      { type: 'write', description: 'Creating Button with unique styling' },
      { type: 'write', description: 'Creating Card with hover effects' },
      { type: 'write', description: 'Creating Input with validation' },
      { type: 'write', description: 'Creating Modal with animations' },
      { type: 'write', description: 'Creating Sidebar' },
      { type: 'write', description: 'Creating Header' },
      { type: 'write', description: 'Creating Toast notifications' },
    ],
    pages: [
      { type: 'write', description: 'Creating root layout' },
      { type: 'write', description: 'Building landing page' },
      { type: 'write', description: 'Building dashboard' },
      { type: 'write', description: 'Creating feature pages' },
      { type: 'write', description: 'Adding page transitions' },
    ],
    features: [
      { type: 'write', description: 'Implementing CRUD operations' },
      { type: 'write', description: 'Adding form validations' },
      { type: 'write', description: 'Creating API routes' },
      { type: 'write', description: 'Adding real-time updates' },
      { type: 'write', description: 'Implementing error handling' },
    ],
    'ai-integration': [
      { type: 'mcp', description: 'Connecting to fetch MCP', mcpServer: 'fetch' },
      { type: 'write', description: 'Setting up multi-provider AI client' },
      { type: 'write', description: 'Creating chat interface' },
      { type: 'write', description: 'Implementing streaming' },
      { type: 'write', description: 'Adding AI features' },
    ],
    testing: [
      { type: 'command', description: 'Running ESLint', command: 'npm run lint' },
      { type: 'command', description: 'Running TypeScript check', command: 'npx tsc --noEmit' },
      { type: 'command', description: 'Building project', command: 'npm run build' },
      { type: 'command', description: 'Running tests', command: 'npm run test' },
    ],
    review: [
      { type: 'review', description: 'Reviewing code quality' },
      { type: 'review', description: 'Checking design system compliance' },
      { type: 'review', description: 'Auditing performance' },
      { type: 'review', description: 'Validating security' },
      { type: 'review', description: 'Calculating 10x quality score' },
    ],
    fixing: [
      { type: 'fix', description: 'Fixing critical issues' },
      { type: 'fix', description: 'Improving code quality' },
      { type: 'fix', description: 'Enhancing UI polish' },
      { type: 'fix', description: 'Optimizing performance' },
    ],
    iteration: [
      { type: 'review', description: 'Re-reviewing after fixes' },
      { type: 'test', description: 'Re-running all tests' },
      { type: 'review', description: 'Recalculating quality score' },
    ],
    complete: [
      { type: 'write', description: 'Generating README.md' },
      { type: 'write', description: 'Creating .env.example' },
      { type: 'review', description: 'Final verification' },
      { type: 'review', description: 'Outputting project summary' },
    ],
  }

  return actions[phase] || []
}

// ============================================================================
// LEGACY EXPORTS FOR COMPATIBILITY
// ============================================================================

export const MEGA_PROMPT_SECTIONS = {
  planning: `## Phase 1: Intelligent Planning with Unique Design System`,
  scaffolding: `## Phase 2: Project Scaffolding with Custom Configuration`,
  database: `## Phase 3: Database & Supabase Setup with Auto-Auth`,
  auth: `## Phase 4: Complete Authentication System`,
  components: `## Phase 5: UI Components with Unique Styling`,
  aiIntegration: `## Phase 6: Multi-Provider AI Integration`,
  testing: `## Phase 7: Automated Testing`,
  review: `## Phase 8: 10x Quality Review`,
}

export function generateMegaPrompt(config: BuildConfig): string {
  return generateMegaSystemPrompt(config)
}

export function generateFileEditPrompt(
  filePath: string,
  currentContent: string,
  userInstruction: string,
  templateId?: string
): string {
  const design = getDesignSystem(templateId || 'saas')

  return `
# FILE EDIT REQUEST

**File**: ${filePath}
**Design System**: ${design.name}

## Current Content:
\`\`\`
${currentContent}
\`\`\`

## User Instruction:
${userInstruction}

## Design Guidelines:
- Primary Color: ${design.colors.primary}
- Typography: ${design.typography.fontFamily.body}
- Border Radius: ${design.borderRadius.md}
- Animation: ${design.animation.duration.normal}

## Requirements:
1. Apply the requested changes
2. Follow the ${design.name} design system
3. Maintain code quality and consistency
4. Preserve existing functionality unless changing it
5. Add proper TypeScript types
6. Follow project conventions

## Output:
Provide the complete updated file content with the changes applied.
`
}

export function generateReviewPrompt(projectPath: string): string {
  return `
# 10x QUALITY REVIEW

Review the project at: ${projectPath}

## Review Checklist:

### 1. Code Quality (Weight: 20%)
- TypeScript strictness (no any types)
- No unused imports/variables
- Consistent code style
- Proper error handling
- Clean abstractions

### 2. UI/UX Quality (Weight: 25%)
- Follows unique design system
- Responsive design (mobile-first)
- Smooth animations
- Loading states
- Error states
- Empty states
- Accessibility (WCAG 2.1 AA)

### 3. Performance (Weight: 15%)
- Bundle size optimized
- Lazy loading implemented
- Images optimized
- Core Web Vitals passing
- Efficient re-renders

### 4. Security (Weight: 20%)
- Auth implementation secure
- RLS policies correct
- Input validation
- XSS prevention
- No exposed secrets

### 5. Functionality (Weight: 20%)
- All features work correctly
- Edge cases handled
- Forms validate properly
- Navigation works
- Data persists correctly

## Scoring:
Each category: 0-100
Minimum passing score: 90/100 overall

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
  "improvements": [],
  "passed": false
}
\`\`\`
`
}

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
   npx tsc --noEmit
   \`\`\`

3. **Build Test**:
   \`\`\`bash
   npm run build
   \`\`\`

4. **Unit Tests**:
   \`\`\`bash
   npm run test
   \`\`\`

## For Each Failure:
1. Identify the root cause
2. Apply the fix immediately
3. Re-run the failed test
4. Continue until all pass

## Success Criteria:
- Zero lint errors
- Zero TypeScript errors
- Build completes successfully
- All tests pass

## Output:
Report all test results and any fixes applied.
`
}
