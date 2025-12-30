/**
 * Mega System Prompts for Autonomous App Building
 * These prompts guide Claude Code to build complete, production-ready applications
 * with unique design systems, proper architecture, and 10x quality standards
 */

import { DesignSystem, getDesignSystem, generateTailwindConfig, generateCSSVariables } from './design-systems'
import { generateAppStructure, generatePagePrompt, analyzeRequirements, AppStructure } from './page-planner'
import { BuildConfig } from './store'

// ============================================================================
// MAIN MEGA PROMPT GENERATOR
// ============================================================================

export function generateMegaSystemPrompt(config: BuildConfig): string {
  const templateId = config.template?.id || 'saas'
  const design = getDesignSystem(templateId)
  const structure = generateAppStructure(templateId, config.requirements)
  const analyzed = analyzeRequirements(config.requirements)

  return `
# 🚀 AUTONOMOUS APP BUILDER - MEGA SYSTEM PROMPT

You are an elite autonomous AI agent specialized in building production-ready applications.
Your mission is to deliver a 10x quality application that exceeds all expectations.

## PROJECT OVERVIEW
- **App Name**: ${config.appName}
- **Template**: ${config.template?.name} (${templateId})
- **Tech Stack**: ${config.template?.techStack.join(', ')}
- **Output Path**: ${config.projectPath}/${config.appName}

## USER REQUIREMENTS
${config.requirements}

## ANALYZED REQUIREMENTS
- **Detected Features**: ${analyzed.features.join(', ') || 'standard'}
- **Key Entities**: ${analyzed.entities.join(', ') || 'users'}
- **Required Actions**: ${analyzed.actions.join(', ') || 'CRUD operations'}
- **Complexity Level**: ${analyzed.complexity}

---

# 🎨 DESIGN SYSTEM: ${design.name.toUpperCase()}

This application MUST follow this unique design system. DO NOT use generic styling.

## Color Palette
\`\`\`
Primary: ${design.colors.primary} (main brand color)
Primary Light: ${design.colors.primaryLight}
Primary Dark: ${design.colors.primaryDark}
Secondary: ${design.colors.secondary}
Accent: ${design.colors.accent} (CTAs, highlights)
Background: ${design.colors.background}
Surface: ${design.colors.surface}
Text: ${design.colors.text}
Text Muted: ${design.colors.textMuted}
Border: ${design.colors.border}
Success: ${design.colors.success}
Warning: ${design.colors.warning}
Error: ${design.colors.error}
Gradient: ${design.colors.gradient}
\`\`\`

## Typography
\`\`\`
Heading Font: ${design.typography.fontFamily.heading}
Body Font: ${design.typography.fontFamily.body}
Mono Font: ${design.typography.fontFamily.mono}

Font Sizes:
- xs: ${design.typography.fontSize.xs}
- sm: ${design.typography.fontSize.sm}
- base: ${design.typography.fontSize.base}
- lg: ${design.typography.fontSize.lg}
- xl: ${design.typography.fontSize.xl}
- 2xl: ${design.typography.fontSize['2xl']}
- 3xl: ${design.typography.fontSize['3xl']}
- 4xl: ${design.typography.fontSize['4xl']}
- 5xl: ${design.typography.fontSize['5xl']}

Letter Spacing: ${design.typography.letterSpacing.tight} for headings, ${design.typography.letterSpacing.normal} for body
\`\`\`

## Spacing & Layout
\`\`\`
Skimming Pattern: ${design.layout.skimmingPattern}
Max Width: ${design.layout.maxWidth}
Grid Columns: ${design.layout.gridColumns}
Sidebar Width: ${design.layout.sidebarWidth}
Header Height: ${design.layout.headerHeight}

Container Padding: ${design.spacing.containerPadding}
Section Gap: ${design.spacing.sectionGap}
Card Padding: ${design.spacing.cardPadding}
\`\`\`

## Border Radius
\`\`\`
sm: ${design.borderRadius.sm}
md: ${design.borderRadius.md}
lg: ${design.borderRadius.lg}
xl: ${design.borderRadius.xl}
2xl: ${design.borderRadius['2xl']}
full: ${design.borderRadius.full}
\`\`\`

## Shadows
\`\`\`
sm: ${design.shadows.sm}
md: ${design.shadows.md}
lg: ${design.shadows.lg}
glow: ${design.shadows.glow}
\`\`\`

## Animations
\`\`\`
Duration Fast: ${design.animation.duration.fast}
Duration Normal: ${design.animation.duration.normal}
Duration Slow: ${design.animation.duration.slow}
Easing: ${design.animation.easing.default}
Bounce: ${design.animation.easing.bounce}
\`\`\`

## Component Styles
\`\`\`
Button: ${design.components.button.style} style, ${design.components.button.size} size, gradient: ${design.components.button.gradient}
Card: ${design.components.card.style} style, hover: ${design.components.card.hover}
Input: ${design.components.input.style} style, focus: ${design.components.input.focus}
Navigation: ${design.components.navigation.style} style, position: ${design.components.navigation.position}
Icon Library: ${design.iconStyle.library}, stroke: ${design.iconStyle.strokeWidth}
\`\`\`

---

# 📄 PAGES TO BUILD

${structure.pages.map((page) => generatePagePrompt(page, design)).join('\n\n---\n\n')}

---

# 🧩 SHARED COMPONENTS

Create these reusable components in \`src/components/ui/\`:

${structure.sharedComponents.map((c) => `
## ${c.name}
- Type: ${c.type}
- Description: ${c.description}
- Props: ${c.props.join(', ') || 'standard'}
- Follow ${design.name} design system exactly
`).join('')}

---

# 📁 PROJECT STRUCTURE

\`\`\`
${config.appName}/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout with providers
│   │   ├── page.tsx            # Home page
│   │   ├── globals.css         # Global styles with CSS variables
${structure.pages.filter(p => p.path !== '/').map(p => `│   │   ├── ${p.path.replace('/', '').replace('[', '_').replace(']', '')}/\n│   │   │   └── page.tsx`).join('\n')}
│   │   └── api/                # API routes
│   ├── components/
│   │   ├── ui/                 # Shared UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── ...
│   │   ├── layouts/            # Layout components
${structure.layouts.map(l => `│   │   │   ├── ${l}.tsx`).join('\n')}
│   │   └── features/           # Feature components
${structure.pages.flatMap(p => p.components.filter(c => c.type === 'feature').map(c => `│   │       ├── ${c.name}.tsx`)).join('\n')}
│   ├── lib/
│   │   ├── supabase.ts         # Supabase client
│   │   ├── ai.ts               # AI provider integration
│   │   ├── utils.ts            # Utility functions
│   │   └── constants.ts        # App constants
│   ├── hooks/
${structure.hooks.map(h => `│   │   ├── ${h}.ts`).join('\n')}
│   ├── types/
${structure.types.map(t => `│   │   ├── ${t}.ts`).join('\n')}
│   └── providers/
${structure.providers.map(p => `│       ├── ${p}.tsx`).join('\n')}
├── public/                     # Static assets
├── .env.local                  # Environment variables
├── tailwind.config.ts          # Tailwind with design system
├── package.json
└── tsconfig.json
\`\`\`

---

# 🔧 INTEGRATIONS

${config.supabase.enabled ? `
## Supabase Integration
${config.supabase.url ? `- URL: ${config.supabase.url}` : '- URL: [Configure in .env.local]'}
${config.supabase.anonKey ? `- Anon Key: [Configured]` : '- Anon Key: [Configure in .env.local]'}

### Database Schema
Create tables based on the detected entities: ${analyzed.entities.join(', ') || 'users'}

### Auth Configuration
- Enable Email/Password authentication
- Enable OAuth providers (Google, GitHub)
- Set up Row Level Security policies
- Create user profiles table

### Realtime
${analyzed.features.includes('chat') ? '- Enable realtime for messages table' : '- Enable realtime for relevant tables'}
` : ''}

${config.ai.enabled ? `
## AI Integration
- Provider: ${config.ai.provider}
${config.ai.apiKey ? '- API Key: [Configured]' : '- API Key: [Configure in .env.local]'}

### AI Features to Implement
${analyzed.features.includes('ai') ? `
- Chat interface with streaming responses
- Document analysis and RAG
- Content generation
- Smart suggestions
` : `
- AI-powered search
- Content summarization
- Smart recommendations
`}

### Multi-Provider Setup
Create a unified AI service that supports:
- OpenAI (gpt-4, gpt-4o, gpt-4o-mini)
- Anthropic (claude-sonnet-4-20250514, claude-3-opus)
- Google (gemini-pro, gemini-1.5-pro)
- Perplexity (sonar-medium, sonar-large)
` : ''}

---

# ⚡ EXECUTION INSTRUCTIONS

## Phase 1: Project Setup
1. Create project directory: \`mkdir -p ${config.projectPath}/${config.appName}\`
2. Initialize Next.js: \`npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"\`
3. Install dependencies based on features

## Phase 2: Configuration
1. Set up Tailwind with custom design system
2. Create CSS variables in globals.css
3. Configure TypeScript paths
4. Set up environment variables

## Phase 3: Core Components
1. Build all shared UI components
2. Create layout components
3. Set up providers (Theme, Auth, etc.)

## Phase 4: Database & Auth
1. Initialize Supabase client
2. Create database schema
3. Set up authentication flows
4. Configure RLS policies

## Phase 5: Feature Development
1. Build each page according to specs
2. Implement all feature components
3. Add animations and interactions
4. Connect to backend/API

## Phase 6: AI Integration
1. Set up AI provider clients
2. Implement streaming chat
3. Add document processing
4. Create smart features

## Phase 7: Polish & Testing
1. Add loading states
2. Implement error handling
3. Optimize performance
4. Run tests

---

# 🎯 10X QUALITY CHECKLIST

## Design Excellence
- [ ] Follows ${design.name} design system exactly
- [ ] Uses correct color palette (no generic colors)
- [ ] Typography matches specifications
- [ ] Spacing is consistent throughout
- [ ] Animations are smooth and purposeful
- [ ] Dark mode works correctly

## Code Quality
- [ ] TypeScript strict mode enabled
- [ ] All types properly defined
- [ ] No any types
- [ ] Consistent naming conventions
- [ ] Proper error handling
- [ ] Clean, readable code

## UX Excellence
- [ ] Fast initial load (< 3s)
- [ ] Smooth interactions
- [ ] Proper loading states
- [ ] Clear error messages
- [ ] Intuitive navigation
- [ ] Mobile responsive

## Functionality
- [ ] All features working
- [ ] Auth flows complete
- [ ] Data persistence works
- [ ] Real-time updates (if applicable)
- [ ] Forms validate properly
- [ ] API calls handled correctly

---

# 🔄 AUTO-ITERATION RULES

If any of these fail, automatically fix and retry:
1. TypeScript compilation errors → Fix types
2. ESLint errors → Fix code style
3. Build failures → Fix imports/dependencies
4. Test failures → Fix implementation
5. Quality score < 90 → Improve implementation

Maximum iterations: 3

---

BEGIN BUILDING THE APPLICATION NOW.
Execute commands, write files, and create a complete, production-ready application.
Do not stop until the entire application is built and working.
`
}

// ============================================================================
// TAILWIND CONFIG GENERATOR FOR PROMPT
// ============================================================================

export function getTailwindConfigContent(templateId: string): string {
  const design = getDesignSystem(templateId)
  return generateTailwindConfig(design)
}

// ============================================================================
// GLOBALS.CSS GENERATOR FOR PROMPT
// ============================================================================

export function getGlobalsCSSContent(templateId: string): string {
  const design = getDesignSystem(templateId)
  return `@tailwind base;
@tailwind components;
@tailwind utilities;

${generateCSSVariables(design)}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
    font-family: var(--font-body);
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    letter-spacing: ${design.typography.letterSpacing.tight};
  }

  code, pre {
    font-family: var(--font-mono);
  }
}

@layer components {
  .gradient-text {
    background: var(--gradient-text);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .gradient-bg {
    background: var(--gradient);
  }

  .card {
    @apply bg-surface rounded-${design.borderRadius.lg.replace('rem', '')} shadow-md;
    padding: var(--card-padding);
  }

  .btn-primary {
    @apply bg-primary text-white font-medium transition-all;
    padding: 0.75rem 1.5rem;
    border-radius: ${design.components.button.style === 'pill' ? '9999px' : design.borderRadius.md};
    ${design.components.button.shadow ? `box-shadow: ${design.shadows.md};` : ''}
    ${design.components.button.gradient ? `background: ${design.colors.gradient};` : ''}
  }

  .btn-primary:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-background-alt);
}

::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-muted);
}
`
}

// ============================================================================
// AI PROVIDER INTEGRATION CODE
// ============================================================================

export function getAIIntegrationCode(): string {
  return `// src/lib/ai.ts
// Unified AI provider integration supporting multiple providers

import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'

export type AIProvider = 'openai' | 'anthropic' | 'gemini' | 'perplexity'

export interface AIConfig {
  provider: AIProvider
  model?: string
  temperature?: number
  maxTokens?: number
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

const DEFAULT_MODELS: Record<AIProvider, string> = {
  openai: 'gpt-4o',
  anthropic: 'claude-sonnet-4-20250514',
  gemini: 'gemini-1.5-pro',
  perplexity: 'sonar-medium-online',
}

// OpenAI Client
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null

// Anthropic Client
const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null

// Gemini Client
const gemini = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null

// Perplexity Client (uses OpenAI-compatible API)
const perplexity = process.env.PERPLEXITY_API_KEY
  ? new OpenAI({
      apiKey: process.env.PERPLEXITY_API_KEY,
      baseURL: 'https://api.perplexity.ai',
    })
  : null

export async function chat(
  messages: ChatMessage[],
  config: AIConfig
): Promise<string> {
  const model = config.model || DEFAULT_MODELS[config.provider]
  const temperature = config.temperature ?? 0.7
  const maxTokens = config.maxTokens ?? 4096

  switch (config.provider) {
    case 'openai':
      if (!openai) throw new Error('OpenAI not configured')
      const openaiResponse = await openai.chat.completions.create({
        model,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
        temperature,
        max_tokens: maxTokens,
      })
      return openaiResponse.choices[0]?.message?.content || ''

    case 'anthropic':
      if (!anthropic) throw new Error('Anthropic not configured')
      const systemMessage = messages.find((m) => m.role === 'system')
      const userMessages = messages.filter((m) => m.role !== 'system')
      const anthropicResponse = await anthropic.messages.create({
        model,
        max_tokens: maxTokens,
        system: systemMessage?.content || '',
        messages: userMessages.map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      })
      return anthropicResponse.content[0].type === 'text'
        ? anthropicResponse.content[0].text
        : ''

    case 'gemini':
      if (!gemini) throw new Error('Gemini not configured')
      const geminiModel = gemini.getGenerativeModel({ model })
      const chat = geminiModel.startChat({
        history: messages.slice(0, -1).map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        })),
      })
      const lastMessage = messages[messages.length - 1]
      const geminiResponse = await chat.sendMessage(lastMessage.content)
      return geminiResponse.response.text()

    case 'perplexity':
      if (!perplexity) throw new Error('Perplexity not configured')
      const perplexityResponse = await perplexity.chat.completions.create({
        model,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
        temperature,
        max_tokens: maxTokens,
      })
      return perplexityResponse.choices[0]?.message?.content || ''

    default:
      throw new Error(\`Unknown provider: \${config.provider}\`)
  }
}

export async function* streamChat(
  messages: ChatMessage[],
  config: AIConfig
): AsyncGenerator<string> {
  const model = config.model || DEFAULT_MODELS[config.provider]
  const temperature = config.temperature ?? 0.7
  const maxTokens = config.maxTokens ?? 4096

  switch (config.provider) {
    case 'openai':
      if (!openai) throw new Error('OpenAI not configured')
      const openaiStream = await openai.chat.completions.create({
        model,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
        temperature,
        max_tokens: maxTokens,
        stream: true,
      })
      for await (const chunk of openaiStream) {
        const content = chunk.choices[0]?.delta?.content
        if (content) yield content
      }
      break

    case 'anthropic':
      if (!anthropic) throw new Error('Anthropic not configured')
      const systemMessage = messages.find((m) => m.role === 'system')
      const userMessages = messages.filter((m) => m.role !== 'system')
      const anthropicStream = await anthropic.messages.stream({
        model,
        max_tokens: maxTokens,
        system: systemMessage?.content || '',
        messages: userMessages.map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      })
      for await (const event of anthropicStream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          yield event.delta.text
        }
      }
      break

    case 'perplexity':
      if (!perplexity) throw new Error('Perplexity not configured')
      const perplexityStream = await perplexity.chat.completions.create({
        model,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
        temperature,
        max_tokens: maxTokens,
        stream: true,
      })
      for await (const chunk of perplexityStream) {
        const content = chunk.choices[0]?.delta?.content
        if (content) yield content
      }
      break

    default:
      // Fallback to non-streaming for providers without streaming support
      yield await chat(messages, config)
  }
}

// Utility functions
export function getAvailableProviders(): AIProvider[] {
  const providers: AIProvider[] = []
  if (openai) providers.push('openai')
  if (anthropic) providers.push('anthropic')
  if (gemini) providers.push('gemini')
  if (perplexity) providers.push('perplexity')
  return providers
}

export function getModelsForProvider(provider: AIProvider): string[] {
  switch (provider) {
    case 'openai':
      return ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo']
    case 'anthropic':
      return ['claude-sonnet-4-20250514', 'claude-3-opus-20240229', 'claude-3-haiku-20240307']
    case 'gemini':
      return ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-pro']
    case 'perplexity':
      return ['sonar-medium-online', 'sonar-small-online', 'llama-3.1-70b-instruct']
    default:
      return []
  }
}
`
}

// ============================================================================
// SUPABASE INTEGRATION CODE
// ============================================================================

export function getSupabaseIntegrationCode(): string {
  return `// src/lib/supabase.ts
// Supabase client configuration with auth and realtime

import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Browser client for client-side usage
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

// Server client factory for server-side usage
export function createServerClient(cookies: any) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
    },
    cookies,
  })
}

// Types for database tables (auto-generated from schema)
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      // Add more table types based on the app requirements
    }
  }
}

// Auth helpers
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  if (error) throw error
  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

export async function signInWithOAuth(provider: 'google' | 'github' | 'discord') {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: \`\${window.location.origin}/auth/callback\`,
    },
  })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

// Profile helpers
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data
}

export async function updateProfile(userId: string, updates: Database['public']['Tables']['profiles']['Update']) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}

// Realtime subscriptions
export function subscribeToChannel<T>(
  channel: string,
  table: string,
  callback: (payload: { new: T; old: T }) => void
) {
  return supabase
    .channel(channel)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table },
      (payload) => callback(payload as any)
    )
    .subscribe()
}

// Storage helpers
export async function uploadFile(bucket: string, path: string, file: File) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    })
  if (error) throw error
  return data
}

export function getPublicUrl(bucket: string, path: string) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}
`
}
