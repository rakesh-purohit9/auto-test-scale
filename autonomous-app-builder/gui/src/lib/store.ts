import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { RuntimeState } from './runtime-engine'
import { AppType } from '../components/AppTypeSelector'

// ============================================================================
// TYPES - Minimal, everything else is dynamic
// ============================================================================

export type BuildConfig = {
  appType: AppType | null  // Just a hint for Claude, no code attached
  appName: string
  requirements: string
  projectPath: string
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
  }
}

export type BuildStatus =
  | 'idle'
  | 'analyzing'
  | 'designing'
  | 'planning'
  | 'building'
  | 'testing'
  | 'reviewing'
  | 'fixing'
  | 'complete'
  | 'error'

// For backward compatibility with existing components
export type BuildStep = {
  id: string
  title: string
  status: 'pending' | 'running' | 'complete' | 'error' | 'skipped'
  output?: string
  duration?: number
}

// ============================================================================
// STORE
// ============================================================================

interface AppState {
  // Wizard step
  currentStep: number
  setCurrentStep: (step: number) => void

  // Build configuration (user inputs)
  config: BuildConfig
  updateConfig: (updates: Partial<BuildConfig>) => void

  // Build status
  buildStatus: BuildStatus
  setBuildStatus: (status: BuildStatus) => void

  // Runtime state from engine (dynamic, decided at runtime)
  runtimeState: RuntimeState | null
  setRuntimeState: (state: RuntimeState | null) => void

  // View mode for build step
  viewMode: 'agent' | 'terminal' | 'review' | 'files'
  setViewMode: (mode: AppState['viewMode']) => void

  // Claude command for execution
  claudeCommand: string
  setClaudeCommand: (cmd: string) => void

  // Terminal output
  terminalOutput: string
  appendTerminalOutput: (output: string) => void
  clearTerminalOutput: () => void

  // For backward compatibility - dynamic build steps
  buildSteps: BuildStep[]
  updateBuildStep: (id: string, updates: Partial<BuildStep>) => void
  setBuildSteps: (steps: BuildStep[]) => void

  // Reset
  reset: () => void
}

const initialConfig: BuildConfig = {
  appType: null,
  appName: '',
  requirements: '',
  projectPath: './projects',
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
  },
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

      buildStatus: 'idle',
      setBuildStatus: (status) => set({ buildStatus: status }),

      runtimeState: null,
      setRuntimeState: (state) => set({ runtimeState: state }),

      viewMode: 'agent',
      setViewMode: (mode) => set({ viewMode: mode }),

      claudeCommand: '',
      setClaudeCommand: (cmd) => set({ claudeCommand: cmd }),

      terminalOutput: '',
      appendTerminalOutput: (output) =>
        set((state) => ({
          terminalOutput: state.terminalOutput + output,
        })),
      clearTerminalOutput: () => set({ terminalOutput: '' }),

      buildSteps: [],
      updateBuildStep: (id, updates) =>
        set((state) => ({
          buildSteps: state.buildSteps.map((step) =>
            step.id === id ? { ...step, ...updates } : step
          ),
        })),
      setBuildSteps: (steps) => set({ buildSteps: steps }),

      reset: () =>
        set({
          currentStep: 0,
          config: initialConfig,
          buildStatus: 'idle',
          runtimeState: null,
          viewMode: 'agent',
          claudeCommand: '',
          terminalOutput: '',
          buildSteps: [],
        }),
    }),
    {
      name: 'app-builder-store',
      partialize: (state) => ({
        config: {
          projectPath: state.config.projectPath,
          supabase: { enabled: state.config.supabase.enabled },
          ai: {
            enabled: state.config.ai.enabled,
            provider: state.config.ai.provider
          },
        },
      }),
    }
  )
)
