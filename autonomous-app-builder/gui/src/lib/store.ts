import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AgentPhase, AgentLog, AgentAction, AGENT_STEPS } from './agent'

export type AppTemplate = {
  id: string
  name: string
  description: string
  category: 'fullstack' | 'web' | 'mobile'
  techStack: string[]
  features: string[]
  icon: string
  color: string
}

export type BuildConfig = {
  appName: string
  template: AppTemplate | null
  requirements: string
  supabase: {
    enabled: boolean
    url: string
    anonKey: string
    serviceKey: string
  }
  ai: {
    enabled: boolean
    provider: 'openai' | 'anthropic' | 'gemini' | 'perplexity'
    apiKey: string
    model: string
  }
  features: {
    auth: boolean
    darkMode: boolean
    analytics: boolean
    payments: boolean
    realtime: boolean
    storage: boolean
  }
  projectPath: string
}

export type BuildStatus = 'idle' | 'configuring' | 'building' | 'reviewing' | 'fixing' | 'testing' | 'iterating' | 'complete' | 'error'

export type BuildStep = {
  id: string
  title: string
  status: 'pending' | 'running' | 'complete' | 'error' | 'skipped'
  output?: string
  duration?: number
}

export type ProjectFile = {
  path: string
  name: string
  type: 'file' | 'folder'
  content?: string
  language?: string
  children?: ProjectFile[]
}

export type FileEdit = {
  id: string
  filePath: string
  instruction: string
  originalContent: string
  newContent: string
  status: 'pending' | 'applied' | 'reverted'
  timestamp: Date
}

export type ReviewResult = {
  scores: {
    codeQuality: number
    uiux: number
    performance: number
    security: number
    functionality: number
  }
  overallScore: number
  issues: Array<{
    severity: 'critical' | 'high' | 'medium' | 'low'
    file: string
    issue: string
    fix: string
  }>
  improvements: string[]
}

export type SavedProject = {
  id: string
  name: string
  template: string
  path: string
  createdAt: Date
  status: 'building' | 'complete' | 'error'
  config: BuildConfig
}

interface AppState {
  // Current step in the wizard
  currentStep: number
  setCurrentStep: (step: number) => void

  // Build configuration
  config: BuildConfig
  updateConfig: (updates: Partial<BuildConfig>) => void
  setTemplate: (template: AppTemplate) => void

  // Build status
  buildStatus: BuildStatus
  setBuildStatus: (status: BuildStatus) => void

  // Agent state
  agentPhase: AgentPhase
  setAgentPhase: (phase: AgentPhase) => void
  agentLogs: AgentLog[]
  addAgentLog: (log: Omit<AgentLog, 'timestamp'>) => void
  clearAgentLogs: () => void
  currentAction: AgentAction | null
  setCurrentAction: (action: AgentAction | null) => void
  iterationCount: number
  incrementIteration: () => void

  // Build steps/progress
  buildSteps: BuildStep[]
  updateBuildStep: (id: string, updates: Partial<BuildStep>) => void
  resetBuildSteps: () => void

  // Build output
  buildOutput: string
  appendBuildOutput: (output: string) => void
  clearBuildOutput: () => void

  // Project files
  projectFiles: ProjectFile[]
  setProjectFiles: (files: ProjectFile[]) => void
  selectedFile: ProjectFile | null
  setSelectedFile: (file: ProjectFile | null) => void
  fileContent: string
  setFileContent: (content: string) => void

  // File edits
  fileEdits: FileEdit[]
  addFileEdit: (edit: Omit<FileEdit, 'id' | 'timestamp'>) => void
  updateFileEdit: (id: string, updates: Partial<FileEdit>) => void

  // Review results
  reviewResult: ReviewResult | null
  setReviewResult: (result: ReviewResult | null) => void

  // Project history
  projects: SavedProject[]
  addProject: (project: Omit<SavedProject, 'id' | 'createdAt'>) => void
  updateProject: (id: string, updates: Partial<SavedProject>) => void

  // View mode
  viewMode: 'wizard' | 'editor' | 'terminal' | 'review' | 'files'
  setViewMode: (mode: AppState['viewMode']) => void

  // Auto mode settings
  autoMode: {
    autoFix: boolean
    autoTest: boolean
    autoReview: boolean
    autoIterate: boolean
    maxIterations: number
    autoSupabase: boolean
    autoAI: boolean
  }
  updateAutoMode: (updates: Partial<AppState['autoMode']>) => void

  // Terminal
  terminalOutput: string[]
  addTerminalOutput: (line: string) => void
  clearTerminal: () => void

  // Claude command
  claudeCommand: string
  setClaudeCommand: (cmd: string) => void

  // Reset
  reset: () => void
}

const initialConfig: BuildConfig = {
  appName: '',
  template: null,
  requirements: '',
  supabase: {
    enabled: true,
    url: '',
    anonKey: '',
    serviceKey: '',
  },
  ai: {
    enabled: true,
    provider: 'anthropic',
    apiKey: '',
    model: 'claude-sonnet-4-20250514',
  },
  features: {
    auth: true,
    darkMode: true,
    analytics: false,
    payments: false,
    realtime: true,
    storage: true,
  },
  projectPath: './projects',
}

const initialAutoMode = {
  autoFix: true,
  autoTest: true,
  autoReview: true,
  autoIterate: true,
  maxIterations: 3,
  autoSupabase: true,
  autoAI: true,
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentStep: 0,
      setCurrentStep: (step) => set({ currentStep: step }),

      config: initialConfig,
      updateConfig: (updates) =>
        set((state) => ({
          config: { ...state.config, ...updates },
        })),
      setTemplate: (template) =>
        set((state) => ({
          config: {
            ...state.config,
            template,
            // Auto-enable Supabase and AI for all templates
            supabase: { ...state.config.supabase, enabled: true },
            ai: { ...state.config.ai, enabled: true },
          },
        })),

      buildStatus: 'idle',
      setBuildStatus: (status) => set({ buildStatus: status }),

      agentPhase: 'planning',
      setAgentPhase: (phase) => set({ agentPhase: phase }),
      agentLogs: [],
      addAgentLog: (log) =>
        set((state) => ({
          agentLogs: [...state.agentLogs, { ...log, timestamp: new Date() }],
        })),
      clearAgentLogs: () => set({ agentLogs: [] }),
      currentAction: null,
      setCurrentAction: (action) => set({ currentAction: action }),
      iterationCount: 0,
      incrementIteration: () =>
        set((state) => ({ iterationCount: state.iterationCount + 1 })),

      buildSteps: AGENT_STEPS,
      updateBuildStep: (id, updates) =>
        set((state) => ({
          buildSteps: state.buildSteps.map((step) =>
            step.id === id ? { ...step, ...updates } : step
          ),
        })),
      resetBuildSteps: () =>
        set({
          buildSteps: AGENT_STEPS.map((s) => ({ ...s, status: 'pending' as const })),
        }),

      buildOutput: '',
      appendBuildOutput: (output) =>
        set((state) => ({
          buildOutput: state.buildOutput + output,
        })),
      clearBuildOutput: () => set({ buildOutput: '' }),

      projectFiles: [],
      setProjectFiles: (files) => set({ projectFiles: files }),
      selectedFile: null,
      setSelectedFile: (file) => set({ selectedFile: file }),
      fileContent: '',
      setFileContent: (content) => set({ fileContent: content }),

      fileEdits: [],
      addFileEdit: (edit) =>
        set((state) => ({
          fileEdits: [
            ...state.fileEdits,
            { ...edit, id: crypto.randomUUID(), timestamp: new Date() },
          ],
        })),
      updateFileEdit: (id, updates) =>
        set((state) => ({
          fileEdits: state.fileEdits.map((edit) =>
            edit.id === id ? { ...edit, ...updates } : edit
          ),
        })),

      reviewResult: null,
      setReviewResult: (result) => set({ reviewResult: result }),

      projects: [],
      addProject: (project) =>
        set((state) => ({
          projects: [
            ...state.projects,
            { ...project, id: crypto.randomUUID(), createdAt: new Date() },
          ],
        })),
      updateProject: (id, updates) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),

      viewMode: 'wizard',
      setViewMode: (mode) => set({ viewMode: mode }),

      autoMode: initialAutoMode,
      updateAutoMode: (updates) =>
        set((state) => ({
          autoMode: { ...state.autoMode, ...updates },
        })),

      terminalOutput: [],
      addTerminalOutput: (line) =>
        set((state) => ({
          terminalOutput: [...state.terminalOutput, line],
        })),
      clearTerminal: () => set({ terminalOutput: [] }),

      claudeCommand: '',
      setClaudeCommand: (cmd) => set({ claudeCommand: cmd }),

      reset: () =>
        set({
          currentStep: 0,
          config: initialConfig,
          buildStatus: 'idle',
          agentPhase: 'planning',
          agentLogs: [],
          currentAction: null,
          iterationCount: 0,
          buildSteps: AGENT_STEPS.map((s) => ({ ...s, status: 'pending' as const })),
          buildOutput: '',
          projectFiles: [],
          selectedFile: null,
          fileContent: '',
          fileEdits: [],
          reviewResult: null,
          viewMode: 'wizard',
          terminalOutput: [],
          claudeCommand: '',
        }),
    }),
    {
      name: 'app-builder-store',
      partialize: (state) => ({
        projects: state.projects,
        autoMode: state.autoMode,
        config: {
          supabase: { enabled: state.config.supabase.enabled },
          ai: { enabled: state.config.ai.enabled, provider: state.config.ai.provider },
          features: state.config.features,
          projectPath: state.config.projectPath,
        },
      }),
    }
  )
)
