'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Rocket, Check } from 'lucide-react'
import { Header } from './Header'
import { TemplateSelector } from './TemplateSelector'
import { RequirementsForm } from './RequirementsForm'
import { ConfigurationPanel } from './ConfigurationPanel'
import { BuildProgress } from './BuildProgress'
import { Button } from './ui/Button'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const steps = [
  { id: 0, title: 'Template', description: 'Choose your app type' },
  { id: 1, title: 'Requirements', description: 'Describe your app' },
  { id: 2, title: 'Configure', description: 'Set up integrations' },
  { id: 3, title: 'Build', description: 'Generate your app' },
]

export function AppWizard() {
  const { currentStep, setCurrentStep, config, buildStatus, setBuildStatus } = useAppStore()

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return config.template !== null
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
      setBuildStatus('building')
    } else if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
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
        {/* Progress Steps */}
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
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </motion.div>

                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'w-16 sm:w-24 h-0.5 mx-2 transition-all duration-300',
                      currentStep > step.id ? 'bg-green-500' : 'bg-border'
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 0 && <TemplateSelector />}
            {currentStep === 1 && <RequirementsForm />}
            {currentStep === 2 && <ConfigurationPanel />}
            {currentStep === 3 && <BuildProgress />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation Footer */}
      {buildStatus !== 'building' && buildStatus !== 'complete' && (
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
              {config.template && (
                <span className="text-sm text-muted-foreground hidden sm:block">
                  Building: <span className="text-foreground font-medium">{config.template.name}</span>
                </span>
              )}
            </div>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
            >
              {currentStep === 2 ? (
                <>
                  <Rocket className="w-4 h-4 mr-2" />
                  Build App
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
