'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check,
  Loader2,
  Circle,
  Terminal,
  Copy,
  CheckCheck,
  Rocket,
  FolderOpen,
  ExternalLink,
} from 'lucide-react'
import { Card } from './ui/Card'
import { Button } from './ui/Button'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export function BuildProgress() {
  const { config, buildStatus, buildSteps, buildOutput, setBuildStatus, updateBuildStep, appendBuildOutput } = useAppStore()
  const [copied, setCopied] = useState(false)

  // Simulate build process
  useEffect(() => {
    if (buildStatus !== 'building') return

    const runBuild = async () => {
      for (let i = 0; i < buildSteps.length; i++) {
        const step = buildSteps[i]
        updateBuildStep(step.id, { status: 'running' })
        appendBuildOutput(`\n> ${step.title}...\n`)

        // Simulate step duration
        await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000))

        updateBuildStep(step.id, { status: 'complete' })
        appendBuildOutput(`✓ ${step.title} complete\n`)
      }

      setBuildStatus('complete')
      appendBuildOutput('\n🎉 Build complete!\n')
    }

    runBuild()
  }, [buildStatus])

  const copyCommand = () => {
    const command = `cd ${config.appName} && npm run dev`
    navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold"
        >
          {buildStatus === 'complete' ? 'Build Complete!' : 'Building Your App'}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-2 text-muted-foreground"
        >
          {buildStatus === 'complete'
            ? 'Your app is ready to run'
            : 'This may take a few minutes...'}
        </motion.p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <div className="space-y-4">
              {buildSteps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center gap-4"
                >
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center transition-all',
                      step.status === 'complete' && 'bg-green-500/10',
                      step.status === 'running' && 'bg-primary/10',
                      step.status === 'pending' && 'bg-muted'
                    )}
                  >
                    {step.status === 'complete' && (
                      <Check className="w-4 h-4 text-green-500" />
                    )}
                    {step.status === 'running' && (
                      <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    )}
                    {step.status === 'pending' && (
                      <Circle className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-sm',
                      step.status === 'complete' && 'text-green-500',
                      step.status === 'running' && 'text-primary font-medium',
                      step.status === 'pending' && 'text-muted-foreground'
                    )}
                  >
                    {step.title}
                  </span>
                  {step.status === 'running' && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 2 }}
                      className="flex-1 h-1 bg-primary/20 rounded-full overflow-hidden"
                    >
                      <motion.div
                        className="h-full bg-primary rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 2 }}
                      />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Terminal Output */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-0 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
              <Terminal className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Build Output</span>
            </div>
            <div className="p-4 bg-black/50 font-mono text-sm text-green-400 min-h-[200px] max-h-[300px] overflow-auto">
              <pre className="whitespace-pre-wrap">{buildOutput || '> Starting build...'}</pre>
            </div>
          </Card>
        </motion.div>

        {/* Success Actions */}
        <AnimatePresence>
          {buildStatus === 'complete' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <Card variant="gradient" className="border-green-500/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Rocket className="w-6 h-6 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-green-500">Ready to Launch!</h3>
                    <p className="text-sm text-muted-foreground">
                      Your {config.template?.name} is ready
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-black/30 font-mono text-sm">
                  <div className="flex items-center justify-between">
                    <code>
                      cd {config.appName} && npm run dev
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyCommand}
                      className="ml-2"
                    >
                      {copied ? (
                        <CheckCheck className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <Button className="flex-1">
                    <FolderOpen className="w-4 h-4 mr-2" />
                    Open in Editor
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View in Browser
                  </Button>
                </div>
              </Card>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Check the terminal for the generated Claude Code command to continue building
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
