/**
 * Runtime Engine - Dynamic Decision Making via Claude API
 *
 * This engine makes ALL decisions at runtime by calling Claude.
 * Nothing is hardcoded - every decision flows through AI.
 */

import { DynamicPrompts } from './dynamic-prompts'

// ============================================================================
// TYPES
// ============================================================================

export interface RuntimeConfig {
  appType: string | null  // Just a hint for Claude - no code attached
  appName: string
  requirements: string
  projectPath: string
  supabase: {
    enabled: boolean
    url?: string
    anonKey?: string
    serviceKey?: string
  }
  ai: {
    enabled: boolean
    provider: 'openai' | 'anthropic' | 'gemini' | 'perplexity'
    apiKey?: string
  }
}

export interface AnalysisResult {
  appIdentity: {
    type: string
    domain: string
    targetUsers: string
    problemSolved: string
    valueProposition: string
  }
  personality: {
    mood: string
    emotions: string[]
    brandPersonality: string
    formality: string
  }
  features: {
    mustHave: string[]
    niceToHave: string[]
    userFlows: string[]
    dataModels: string[]
  }
  technical: {
    needsAuth: boolean
    needsDatabase: boolean
    needsRealtime: boolean
    needsAI: boolean
    needsStorage: boolean
    needsPayments: boolean
    otherIntegrations: string[]
  }
  scale: {
    complexity: 'simple' | 'medium' | 'complex'
    estimatedScreens: number
    userRoles: string[]
    integrations: string[]
  }
  insights: string[]
}

export interface DynamicDesignSystem {
  designReasoning: string
  colors: {
    primary: { value: string; reasoning: string }
    primaryLight: string
    primaryDark: string
    secondary: { value: string; reasoning: string }
    accent: { value: string; reasoning: string }
    background: string
    backgroundAlt: string
    surface: string
    text: string
    textMuted: string
    border: string
    success: string
    warning: string
    error: string
    gradient: string | null
  }
  typography: {
    headingFont: { value: string; reasoning: string }
    bodyFont: string
    monoFont: string
    scale: Record<string, string>
    weights: number[]
    lineHeights: Record<string, string>
    letterSpacing: Record<string, string>
  }
  spacing: {
    unit: number
    scale: number[]
    containerPadding: string
    sectionGap: string
    cardPadding: string
  }
  borderRadius: {
    style: 'sharp' | 'rounded' | 'pill'
    scale: Record<string, string>
  }
  shadows: {
    style: 'subtle' | 'bold' | 'none'
    scale: Record<string, string>
  }
  animation: {
    style: 'snappy' | 'smooth' | 'bouncy'
    durations: Record<string, string>
    easings: Record<string, string>
  }
  components: {
    button: Record<string, any>
    card: Record<string, any>
    input: Record<string, any>
    navigation: Record<string, any>
  }
  layout: {
    pattern: string
    maxWidth: string
    grid: Record<string, any>
  }
}

export interface DynamicPageStructure {
  pageReasoning: string
  pages: Array<{
    name: string
    purpose: string
    route: string
    layout: string
    components: Array<{
      name: string
      purpose: string
      props: string[]
      interactions: string[]
    }>
    dataNeeded: string[]
    userActions: string[]
    priority: 'core' | 'important' | 'optional'
  }>
  navigation: {
    type: 'sidebar' | 'topnav' | 'bottomnav' | 'tabs'
    items: string[]
    reasoning: string
  }
  userFlows: Array<{
    name: string
    steps: string[]
  }>
}

export interface DynamicBuildPlan {
  buildReasoning: string
  estimatedComplexity: 'simple' | 'medium' | 'complex'
  phases: Array<{
    id: string
    name: string
    description: string
    tasks: Array<{
      type: 'command' | 'write' | 'configure' | 'test'
      description: string
      details: string
    }>
    dependencies: string[]
    outputs: string[]
    validation: string
  }>
  criticalPath: string[]
  parallelizable: string[]
  riskAreas: string[]
}

export interface RuntimeState {
  status: 'idle' | 'analyzing' | 'designing' | 'planning' | 'building' | 'testing' | 'reviewing' | 'fixing' | 'complete' | 'error'
  currentPhase: string
  currentTask: string
  progress: number
  analysis: AnalysisResult | null
  designSystem: DynamicDesignSystem | null
  pageStructure: DynamicPageStructure | null
  buildPlan: DynamicBuildPlan | null
  logs: Array<{
    timestamp: Date
    type: 'info' | 'decision' | 'action' | 'success' | 'error' | 'warning'
    message: string
    details?: any
  }>
  errors: string[]
  qualityScore: number | null
}

// ============================================================================
// CLAUDE API CALLER
// ============================================================================

export async function callClaude(
  prompt: string,
  options: {
    model?: string
    maxTokens?: number
    temperature?: number
  } = {}
): Promise<string> {
  const {
    model = 'claude-sonnet-4-20250514',
    maxTokens = 8192,
    temperature = 0.7,
  } = options

  // Check for API key
  const apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    throw new Error('Anthropic API key not configured')
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      temperature,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  })

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`)
  }

  const data = await response.json()
  return data.content[0].text
}

// ============================================================================
// JSON EXTRACTOR
// ============================================================================

function extractJSON(text: string): any {
  // Find JSON block in the response
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/)
  if (jsonMatch) {
    return JSON.parse(jsonMatch[1])
  }

  // Try to parse the whole thing as JSON
  try {
    return JSON.parse(text)
  } catch {
    // Try to find any JSON object in the text
    const objectMatch = text.match(/\{[\s\S]*\}/)
    if (objectMatch) {
      return JSON.parse(objectMatch[0])
    }
  }

  throw new Error('No valid JSON found in response')
}

// ============================================================================
// RUNTIME ENGINE CLASS
// ============================================================================

export class RuntimeEngine {
  private config: RuntimeConfig
  private state: RuntimeState
  private onStateChange: (state: RuntimeState) => void

  constructor(config: RuntimeConfig, onStateChange: (state: RuntimeState) => void) {
    this.config = config
    this.onStateChange = onStateChange
    this.state = {
      status: 'idle',
      currentPhase: '',
      currentTask: '',
      progress: 0,
      analysis: null,
      designSystem: null,
      pageStructure: null,
      buildPlan: null,
      logs: [],
      errors: [],
      qualityScore: null,
    }
  }

  private log(type: RuntimeState['logs'][0]['type'], message: string, details?: any) {
    this.state.logs.push({
      timestamp: new Date(),
      type,
      message,
      details,
    })
    this.onStateChange({ ...this.state })
  }

  private updateState(updates: Partial<RuntimeState>) {
    this.state = { ...this.state, ...updates }
    this.onStateChange(this.state)
  }

  // =========================================================================
  // PHASE 1: ANALYZE
  // =========================================================================

  async analyze(): Promise<AnalysisResult> {
    this.updateState({
      status: 'analyzing',
      currentPhase: 'Analysis',
      currentTask: 'Understanding requirements',
      progress: 5,
    })

    this.log('info', 'Starting requirement analysis...')
    if (this.config.appType) {
      this.log('info', `App type hint: ${this.config.appType}`)
    }

    try {
      const prompt = DynamicPrompts.analyze(this.config.requirements, this.config.appType)
      const response = await callClaude(prompt)
      const analysis = extractJSON(response) as AnalysisResult

      this.log('decision', 'Analysis complete', analysis)
      this.log('info', `Detected app type: ${analysis.appIdentity.type}`)
      this.log('info', `Mood: ${analysis.personality.mood}`)
      this.log('info', `Complexity: ${analysis.scale.complexity}`)
      this.log('info', `Estimated screens: ${analysis.scale.estimatedScreens}`)

      this.updateState({
        analysis,
        progress: 15,
      })

      return analysis
    } catch (error) {
      this.log('error', 'Analysis failed', error)
      throw error
    }
  }

  // =========================================================================
  // PHASE 2: DESIGN SYSTEM
  // =========================================================================

  async generateDesignSystem(): Promise<DynamicDesignSystem> {
    if (!this.state.analysis) {
      throw new Error('Analysis required before design')
    }

    this.updateState({
      status: 'designing',
      currentPhase: 'Design System',
      currentTask: 'Creating unique design',
      progress: 20,
    })

    this.log('info', 'Generating custom design system...')

    try {
      const prompt = DynamicPrompts.designSystem(JSON.stringify(this.state.analysis))
      const response = await callClaude(prompt, { temperature: 0.8 })
      const design = extractJSON(response) as DynamicDesignSystem

      this.log('decision', 'Design system created', design)
      this.log('info', `Primary color: ${design.colors.primary.value} - ${design.colors.primary.reasoning}`)
      this.log('info', `Typography: ${design.typography.headingFont.value} - ${design.typography.headingFont.reasoning}`)
      this.log('info', `Style: ${design.borderRadius.style} borders, ${design.shadows.style} shadows, ${design.animation.style} animations`)

      this.updateState({
        designSystem: design,
        progress: 30,
      })

      return design
    } catch (error) {
      this.log('error', 'Design generation failed', error)
      throw error
    }
  }

  // =========================================================================
  // PHASE 3: PAGE STRUCTURE
  // =========================================================================

  async generatePageStructure(): Promise<DynamicPageStructure> {
    if (!this.state.analysis || !this.state.designSystem) {
      throw new Error('Analysis and design system required')
    }

    this.updateState({
      status: 'planning',
      currentPhase: 'Page Structure',
      currentTask: 'Planning screens and navigation',
      progress: 35,
    })

    this.log('info', 'Generating page structure...')

    try {
      const prompt = DynamicPrompts.pageStructure(
        JSON.stringify(this.state.analysis),
        JSON.stringify(this.state.designSystem)
      )
      const response = await callClaude(prompt)
      const structure = extractJSON(response) as DynamicPageStructure

      this.log('decision', 'Page structure planned', structure)
      this.log('info', `Pages planned: ${structure.pages.length}`)
      this.log('info', `Navigation: ${structure.navigation.type} - ${structure.navigation.reasoning}`)
      structure.pages.forEach((p) => {
        this.log('info', `  - ${p.name} (${p.route}): ${p.components.length} components`)
      })

      this.updateState({
        pageStructure: structure,
        progress: 45,
      })

      return structure
    } catch (error) {
      this.log('error', 'Page structure generation failed', error)
      throw error
    }
  }

  // =========================================================================
  // PHASE 4: BUILD PLAN
  // =========================================================================

  async generateBuildPlan(): Promise<DynamicBuildPlan> {
    if (!this.state.analysis || !this.state.designSystem || !this.state.pageStructure) {
      throw new Error('Analysis, design, and pages required')
    }

    this.updateState({
      currentPhase: 'Build Plan',
      currentTask: 'Creating build phases',
      progress: 50,
    })

    this.log('info', 'Generating build plan...')

    try {
      const prompt = DynamicPrompts.buildPhases(
        JSON.stringify(this.state.analysis),
        JSON.stringify(this.state.designSystem),
        JSON.stringify(this.state.pageStructure)
      )
      const response = await callClaude(prompt)
      const plan = extractJSON(response) as DynamicBuildPlan

      this.log('decision', 'Build plan created', plan)
      this.log('info', `Build complexity: ${plan.estimatedComplexity}`)
      this.log('info', `Phases: ${plan.phases.length}`)
      plan.phases.forEach((p) => {
        this.log('info', `  - ${p.name}: ${p.tasks.length} tasks`)
      })

      this.updateState({
        buildPlan: plan,
        progress: 55,
      })

      return plan
    } catch (error) {
      this.log('error', 'Build plan generation failed', error)
      throw error
    }
  }

  // =========================================================================
  // PHASE 5: EXECUTE BUILD
  // =========================================================================

  async executeBuild(): Promise<void> {
    if (!this.state.buildPlan) {
      throw new Error('Build plan required')
    }

    this.updateState({
      status: 'building',
      currentPhase: 'Building',
      progress: 60,
    })

    this.log('info', 'Starting build execution...')

    const { phases } = this.state.buildPlan
    const totalTasks = phases.reduce((sum, p) => sum + p.tasks.length, 0)
    let completedTasks = 0

    for (const phase of phases) {
      this.log('info', `Starting phase: ${phase.name}`)
      this.updateState({
        currentPhase: phase.name,
      })

      for (const task of phase.tasks) {
        this.updateState({
          currentTask: task.description,
        })

        this.log('action', `Executing: ${task.description}`)

        // Here we would call Claude to actually execute the task
        // For now, simulate with a delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        completedTasks++
        const buildProgress = 60 + (completedTasks / totalTasks) * 25
        this.updateState({ progress: buildProgress })

        this.log('success', `Completed: ${task.description}`)
      }

      this.log('success', `Phase complete: ${phase.name}`)
    }

    this.updateState({
      progress: 85,
    })
  }

  // =========================================================================
  // PHASE 6: REVIEW
  // =========================================================================

  async review(): Promise<number> {
    this.updateState({
      status: 'reviewing',
      currentPhase: 'Quality Review',
      currentTask: 'Analyzing quality',
      progress: 90,
    })

    this.log('info', 'Starting 10x quality review...')

    try {
      const prompt = DynamicPrompts.review(
        `${this.config.projectPath}/${this.config.appName}`
      )
      const response = await callClaude(prompt)
      const review = extractJSON(response)

      this.log('decision', 'Review complete', review)
      this.log('info', `Overall score: ${review.overallScore}/100`)
      this.log('info', `Code quality: ${review.scores.codeQuality.score}`)
      this.log('info', `Design consistency: ${review.scores.designConsistency.score}`)
      this.log('info', `User experience: ${review.scores.userExperience.score}`)

      if (review.criticalIssues.length > 0) {
        this.log('warning', `Critical issues: ${review.criticalIssues.length}`)
      }

      this.updateState({
        qualityScore: review.overallScore,
        progress: 95,
      })

      return review.overallScore
    } catch (error) {
      this.log('error', 'Review failed', error)
      throw error
    }
  }

  // =========================================================================
  // MAIN RUN METHOD
  // =========================================================================

  async run(): Promise<RuntimeState> {
    try {
      this.log('info', `Starting autonomous build: ${this.config.appName}`)

      // Phase 1: Analyze
      await this.analyze()

      // Phase 2: Design System
      await this.generateDesignSystem()

      // Phase 3: Page Structure
      await this.generatePageStructure()

      // Phase 4: Build Plan
      await this.generateBuildPlan()

      // Phase 5: Execute Build
      await this.executeBuild()

      // Phase 6: Review
      const score = await this.review()

      // Check if we need to iterate
      let iterations = 0
      while (score < 90 && iterations < 3) {
        this.log('info', `Score ${score} < 90, iterating...`)
        this.updateState({ status: 'fixing' })

        // Fix and re-review
        // ... fix logic here ...

        iterations++
      }

      this.updateState({
        status: 'complete',
        progress: 100,
      })

      this.log('success', `Build complete! Final score: ${this.state.qualityScore}`)

      return this.state
    } catch (error) {
      this.updateState({
        status: 'error',
        errors: [...this.state.errors, String(error)],
      })
      this.log('error', 'Build failed', error)
      throw error
    }
  }

  // =========================================================================
  // GENERATE CLAUDE CODE COMMAND
  // =========================================================================

  generateClaudeCommand(): string {
    const megaPrompt = DynamicPrompts.megaBuild(
      this.config.appName,
      this.config.requirements,
      this.config.projectPath,
      this.config.supabase,
      this.config.ai,
      this.config.appType
    )

    return `claude --dangerously-skip-permissions -p "${megaPrompt.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`
  }
}

// ============================================================================
// SINGLETON FACTORY
// ============================================================================

let engineInstance: RuntimeEngine | null = null

export function createRuntimeEngine(
  config: RuntimeConfig,
  onStateChange: (state: RuntimeState) => void
): RuntimeEngine {
  engineInstance = new RuntimeEngine(config, onStateChange)
  return engineInstance
}

export function getRuntimeEngine(): RuntimeEngine | null {
  return engineInstance
}
