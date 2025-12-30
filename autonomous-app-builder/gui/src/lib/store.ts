import { create } from 'zustand'

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
  }
  ai: {
    enabled: boolean
    provider: 'openai' | 'anthropic' | 'gemini' | 'perplexity'
    apiKey: string
  }
  features: {
    auth: boolean
    darkMode: boolean
    analytics: boolean
    payments: boolean
  }
}

export type BuildStatus = 'idle' | 'configuring' | 'building' | 'complete' | 'error'

export type BuildStep = {
  id: string
  title: string
  status: 'pending' | 'running' | 'complete' | 'error'
  output?: string
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

  // Build steps/progress
  buildSteps: BuildStep[]
  updateBuildStep: (id: string, updates: Partial<BuildStep>) => void

  // Build output
  buildOutput: string
  appendBuildOutput: (output: string) => void

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
  },
  ai: {
    enabled: false,
    provider: 'anthropic',
    apiKey: '',
  },
  features: {
    auth: true,
    darkMode: true,
    analytics: false,
    payments: false,
  },
}

const initialBuildSteps: BuildStep[] = [
  { id: 'setup', title: 'Project Setup', status: 'pending' },
  { id: 'deps', title: 'Installing Dependencies', status: 'pending' },
  { id: 'config', title: 'Configuring Project', status: 'pending' },
  { id: 'components', title: 'Building Components', status: 'pending' },
  { id: 'pages', title: 'Creating Pages', status: 'pending' },
  { id: 'features', title: 'Implementing Features', status: 'pending' },
  { id: 'polish', title: 'Final Polish', status: 'pending' },
]

export const useAppStore = create<AppState>((set) => ({
  currentStep: 0,
  setCurrentStep: (step) => set({ currentStep: step }),

  config: initialConfig,
  updateConfig: (updates) =>
    set((state) => ({
      config: { ...state.config, ...updates },
    })),
  setTemplate: (template) =>
    set((state) => ({
      config: { ...state.config, template },
    })),

  buildStatus: 'idle',
  setBuildStatus: (status) => set({ buildStatus: status }),

  buildSteps: initialBuildSteps,
  updateBuildStep: (id, updates) =>
    set((state) => ({
      buildSteps: state.buildSteps.map((step) =>
        step.id === id ? { ...step, ...updates } : step
      ),
    })),

  buildOutput: '',
  appendBuildOutput: (output) =>
    set((state) => ({
      buildOutput: state.buildOutput + output,
    })),

  reset: () =>
    set({
      currentStep: 0,
      config: initialConfig,
      buildStatus: 'idle',
      buildSteps: initialBuildSteps,
      buildOutput: '',
    }),
}))
