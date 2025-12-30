'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Rocket,
  Check,
  Terminal,
  Star,
  FolderTree,
  RotateCcw,
  Brain,
  Sparkles,
  LayoutGrid,
} from 'lucide-react'
import { Header } from './Header'
import { AppTypeSelector } from './AppTypeSelector'
import { RequirementsForm } from './RequirementsForm'
import { ConfigurationPanel } from './ConfigurationPanel'
import { DynamicBuildProgress } from './DynamicBuildProgress'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'

// Steps with app type selection for better context
const steps = [
  { id: 0, title: 'App Type', description: 'What are you building?' },
  { id: 1, title: 'Describe', description: 'Tell us the details' },
  { id: 2, title: 'Configure', description: 'Set up integrations' },
  { id: 3, title: 'Build', description: 'AI builds your app' },
]

const viewModes = [
  { id: 'agent' as const, label: 'Agent', icon: Brain },
  { id: 'terminal' as const, label: 'Terminal', icon: Terminal },
  { id: 'files' as const, label: 'Files', icon: FolderTree },
  { id: 'review' as const, label: 'Review', icon: Star },
]

export function AppWizard() {
  const {
    currentStep,
    setCurrentStep,
    config,
    buildStatus,
    setBuildStatus,
    viewMode,
    setViewMode,
    reset,
    runtimeState,
    terminalOutput,
    claudeCommand,
  } = useAppStore()

  const isBuilding =
    buildStatus === 'analyzing' ||
    buildStatus === 'designing' ||
    buildStatus === 'planning' ||
    buildStatus === 'building' ||
    buildStatus === 'reviewing' ||
    buildStatus === 'fixing' ||
    buildStatus === 'testing'

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return config.appType !== null // App type selected
      case 1:
        return config.appName.trim() !== '' && config.requirements.trim() !== ''
      case 2:
        return true
      default:
        return false
    }
  }

  const handleNext = () => {
    if (currentStep === 2) {
      setCurrentStep(3)
      // Build will start when DynamicBuildProgress mounts
    } else if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleReset = () => {
    reset()
  }

  const renderBuildContent = () => {
    switch (viewMode) {
      case 'agent':
        return <DynamicBuildProgress />
      case 'files':
        return (
          <Card className="p-8 text-center">
            <FolderTree className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Project Files</h3>
            <p className="text-muted-foreground">
              Files will appear here once the build is complete.
            </p>
            {config.projectPath && (
              <p className="mt-4 text-sm">
                Project Path:{' '}
                <code className="px-2 py-1 bg-muted rounded">
                  {config.projectPath}/{config.appName}
                </code>
              </p>
            )}
          </Card>
        )
      case 'terminal':
        return (
          <Card className="p-0 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
              <Terminal className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Terminal Output</span>
            </div>
            <div className="p-4 bg-black/80 font-mono text-sm text-green-400 min-h-[500px] max-h-[600px] overflow-auto">
              <pre className="whitespace-pre-wrap">
                {terminalOutput || '> Waiting for build to start...'}
              </pre>
            </div>
            {claudeCommand && (
              <div className="px-4 py-3 bg-muted/30 border-t border-border">
                <p className="text-xs text-muted-foreground mb-1">
                  Claude Code Command:
                </p>
                <code className="text-xs text-primary">{claudeCommand}</code>
              </div>
            )}
          </Card>
        )
      case 'review':
        return (
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-6 h-6 text-yellow-500" />
              <h3 className="text-lg font-semibold">10x Quality Review</h3>
            </div>
            {runtimeState?.qualityScore !== null ? (
              <div className="space-y-6">
                <div className="text-center p-6 bg-muted/30 rounded-xl">
                  <div className="text-5xl font-bold mb-2">
                    <span
                      className={cn(
                        runtimeState.qualityScore >= 90
                          ? 'text-green-500'
                          : runtimeState.qualityScore >= 70
                          ? 'text-yellow-500'
                          : 'text-red-500'
                      )}
                    >
                      {runtimeState.qualityScore}
                    </span>
                    <span className="text-muted-foreground text-2xl">/100</span>
                  </div>
                  <p className="text-muted-foreground">Overall Quality Score</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Review results will appear after the build completes</p>
              </div>
            )}
          </Card>
        )
      default:
        return <DynamicBuildProgress />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <main className="container mx-auto px-4 pt-24 pb-32">
        {/* Hero for first step */}
        {currentStep === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">100% Dynamic AI-Powered</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              What Are You Building?
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Select an app type to help Claude understand your vision.
              All design, architecture, and code decisions are still made dynamically at runtime.
            </p>
          </motion.div>
        )}

        {/* Progress Steps */}
        {currentStep < 3 && (
          <div className="max-w-3xl mx-auto mb-12">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col items-center"
                  >
                    <div
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
                        currentStep > step.id
                          ? 'bg-green-500 text-white'
                          : currentStep === step.id
                          ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {currentStep > step.id ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <span className="text-sm font-medium">{step.id + 1}</span>
                      )}
                    </div>
                    <div className="mt-2 text-center hidden sm:block">
                      <p
                        className={cn(
                          'text-sm font-medium',
                          currentStep >= step.id
                            ? 'text-foreground'
                            : 'text-muted-foreground'
                        )}
                      >
                        {step.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>

                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        'w-24 sm:w-32 h-0.5 mx-2 transition-all duration-300',
                        currentStep > step.id ? 'bg-green-500' : 'bg-border'
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* View Mode Tabs for Build Step */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg">
                {viewModes.map((mode) => {
                  const Icon = mode.icon
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setViewMode(mode.id)}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all',
                        viewMode === mode.id
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {mode.label}
                    </button>
                  )
                })}
              </div>
              <div className="flex items-center gap-2">
                {buildStatus === 'complete' && (
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    New Project
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep === 3 ? `step-3-${viewMode}` : currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className={currentStep === 3 ? 'max-w-5xl mx-auto' : currentStep === 0 ? 'max-w-6xl mx-auto' : 'max-w-2xl mx-auto'}
          >
            {currentStep === 0 && (
              <AppTypeSelector
                selectedType={config.appType}
                onSelect={(type) => useAppStore.getState().updateConfig({ appType: type })}
              />
            )}
            {currentStep === 1 && <RequirementsForm />}
            {currentStep === 2 && <ConfigurationPanel />}
            {currentStep === 3 && renderBuildContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation Footer */}
      {!isBuilding && buildStatus !== 'complete' && currentStep < 3 && (
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/80 backdrop-blur-xl"
        >
          <div className="container mx-auto px-4 h-20 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:block">
                Everything is decided by AI at runtime
              </span>
            </div>

            <Button onClick={handleNext} disabled={!canProceed()}>
              {currentStep === 2 ? (
                <>
                  <Rocket className="w-4 h-4 mr-2" />
                  Start Build
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </motion.footer>
      )}
    </div>
  )
}
