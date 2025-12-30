'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check,
  Loader2,
  Circle,
  Terminal,
  Brain,
  Zap,
  AlertTriangle,
  RefreshCw,
  Play,
  Pause,
  RotateCcw,
  FileCode,
  TestTube,
  Star,
  Sparkles,
} from 'lucide-react'
import { Card } from './ui/Card'
import { Button } from './ui/Button'
import { useAppStore } from '@/lib/store'
import { generateMegaPrompt, getAgentActionsForPhase } from '@/lib/agent'
import { cn } from '@/lib/utils'

export function AgentBuildProgress() {
  const {
    config,
    buildStatus,
    setBuildStatus,
    buildSteps,
    updateBuildStep,
    buildOutput,
    appendBuildOutput,
    agentPhase,
    setAgentPhase,
    agentLogs,
    addAgentLog,
    currentAction,
    setCurrentAction,
    iterationCount,
    incrementIteration,
    reviewResult,
    setReviewResult,
    autoMode,
    setClaudeCommand,
  } = useAppStore()

  const outputRef = useRef<HTMLDivElement>(null)
  const isRunning = buildStatus === 'building' || buildStatus === 'reviewing' || buildStatus === 'fixing'

  // Auto-scroll output
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [buildOutput])

  // Simulate autonomous build process
  useEffect(() => {
    if (buildStatus !== 'building') return

    const runAutonomousBuild = async () => {
      const phases = [
        'planning',
        'scaffolding',
        'dependencies',
        'database',
        'auth',
        'components',
        'pages',
        'features',
        'ai-integration',
        'testing',
        'review',
      ] as const

      // Generate mega prompt
      const megaPrompt = generateMegaPrompt(config)
      setClaudeCommand(`claude -p "${megaPrompt.slice(0, 100)}..."`)

      appendBuildOutput('\n🤖 AUTONOMOUS AGENT INITIALIZED\n')
      appendBuildOutput('━'.repeat(50) + '\n\n')

      for (let i = 0; i < phases.length; i++) {
        const phase = phases[i]
        const stepId = buildSteps[i]?.id

        if (stepId) {
          updateBuildStep(stepId, { status: 'running' })
        }

        setAgentPhase(phase)
        addAgentLog({
          phase,
          action: `Starting ${phase}`,
          status: 'running',
        })

        appendBuildOutput(`\n📦 PHASE: ${phase.toUpperCase()}\n`)
        appendBuildOutput('─'.repeat(40) + '\n')

        // Simulate actions for this phase
        const actions = getAgentActionsForPhase(phase)
        for (const action of actions) {
          setCurrentAction(action)
          appendBuildOutput(`  ${getActionIcon(action.type)} ${action.description}`)

          if (action.command) {
            appendBuildOutput(`\n     $ ${action.command}`)
          }

          await sleep(800 + Math.random() * 400)
          appendBuildOutput(' ✓\n')
        }

        if (stepId) {
          updateBuildStep(stepId, { status: 'complete' })
        }

        addAgentLog({
          phase,
          action: `Completed ${phase}`,
          status: 'success',
        })

        await sleep(300)
      }

      // Auto-review if enabled
      if (autoMode.autoReview) {
        setBuildStatus('reviewing')
        await runAutoReview()
      }

      // Check if we need to iterate
      if (autoMode.autoIterate && iterationCount < autoMode.maxIterations) {
        const needsIteration = reviewResult && reviewResult.overallScore < 90

        if (needsIteration) {
          incrementIteration()
          setBuildStatus('fixing')
          await runAutoFix()
          setBuildStatus('building')
          // Would restart build here in real implementation
        }
      }

      setBuildStatus('complete')
      appendBuildOutput('\n\n🎉 BUILD COMPLETE!\n')
      appendBuildOutput(`📁 Project saved to: ${config.projectPath}/${config.appName}\n`)
    }

    runAutonomousBuild()
  }, [buildStatus])

  const runAutoReview = async () => {
    appendBuildOutput('\n\n🔍 10x QUALITY REVIEW\n')
    appendBuildOutput('━'.repeat(50) + '\n')

    const categories = [
      { name: 'Code Quality', score: 85 + Math.floor(Math.random() * 15) },
      { name: 'UI/UX', score: 80 + Math.floor(Math.random() * 20) },
      { name: 'Performance', score: 85 + Math.floor(Math.random() * 15) },
      { name: 'Security', score: 90 + Math.floor(Math.random() * 10) },
      { name: 'Functionality', score: 88 + Math.floor(Math.random() * 12) },
    ]

    for (const cat of categories) {
      await sleep(500)
      appendBuildOutput(`  ${cat.name}: ${getScoreBar(cat.score)} ${cat.score}/100\n`)
    }

    const overallScore = Math.round(
      categories.reduce((sum, c) => sum + c.score, 0) / categories.length
    )

    appendBuildOutput(`\n  ⭐ OVERALL SCORE: ${overallScore}/100\n`)

    setReviewResult({
      scores: {
        codeQuality: categories[0].score,
        uiux: categories[1].score,
        performance: categories[2].score,
        security: categories[3].score,
        functionality: categories[4].score,
      },
      overallScore,
      issues: overallScore < 90 ? [
        { severity: 'medium', file: 'src/components/Button.tsx', issue: 'Missing hover state', fix: 'Add hover:bg-primary/90' },
        { severity: 'low', file: 'src/app/page.tsx', issue: 'Could use better loading state', fix: 'Add Suspense boundary' },
      ] : [],
      improvements: [
        'Add more micro-interactions',
        'Optimize bundle size',
        'Add E2E tests',
      ],
    })
  }

  const runAutoFix = async () => {
    appendBuildOutput('\n\n🔧 AUTO-FIXING ISSUES\n')
    appendBuildOutput('━'.repeat(50) + '\n')

    const issues = reviewResult?.issues || []
    for (const issue of issues) {
      await sleep(800)
      appendBuildOutput(`  Fixing: ${issue.issue}\n`)
      appendBuildOutput(`    → Applied: ${issue.fix} ✓\n`)
    }

    appendBuildOutput('\n  All issues fixed!\n')
  }

  return (
    <div className="space-y-6">
      {/* Agent Status Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary/10 border border-primary/20">
          {isRunning ? (
            <Brain className="w-5 h-5 text-primary animate-pulse" />
          ) : buildStatus === 'complete' ? (
            <Sparkles className="w-5 h-5 text-green-500" />
          ) : (
            <Zap className="w-5 h-5 text-primary" />
          )}
          <span className="font-medium">
            {buildStatus === 'complete'
              ? '10x Quality App Ready!'
              : buildStatus === 'reviewing'
              ? 'Running 10x Quality Review...'
              : buildStatus === 'fixing'
              ? 'Auto-Fixing Issues...'
              : 'Autonomous Agent Building...'}
          </span>
          {iterationCount > 0 && (
            <span className="text-sm text-muted-foreground">
              (Iteration {iterationCount})
            </span>
          )}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Build Steps */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <Card className="h-full">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Play className="w-4 h-4" />
              Build Phases
            </h3>
            <div className="space-y-2">
              {buildSteps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    'flex items-center gap-3 p-2 rounded-lg transition-colors',
                    step.status === 'running' && 'bg-primary/10',
                    step.status === 'complete' && 'bg-green-500/10'
                  )}
                >
                  <div className="w-6 h-6 flex items-center justify-center">
                    {step.status === 'complete' && (
                      <Check className="w-4 h-4 text-green-500" />
                    )}
                    {step.status === 'running' && (
                      <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    )}
                    {step.status === 'error' && (
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    )}
                    {step.status === 'pending' && (
                      <Circle className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-sm',
                      step.status === 'running' && 'text-primary font-medium',
                      step.status === 'complete' && 'text-green-600',
                      step.status === 'pending' && 'text-muted-foreground'
                    )}
                  >
                    {step.title}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Current Action */}
            {currentAction && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 rounded-lg bg-muted/50 border border-border"
              >
                <p className="text-xs text-muted-foreground mb-1">Current Action:</p>
                <p className="text-sm font-medium">{currentAction.description}</p>
              </motion.div>
            )}
          </Card>
        </motion.div>

        {/* Terminal Output */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card className="h-full p-0 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Agent Output</span>
              </div>
              <div className="flex items-center gap-2">
                {isRunning && (
                  <span className="flex items-center gap-1 text-xs text-green-500">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Running
                  </span>
                )}
              </div>
            </div>
            <div
              ref={outputRef}
              className="p-4 bg-black/80 font-mono text-sm text-green-400 h-[400px] overflow-auto"
            >
              <pre className="whitespace-pre-wrap">{buildOutput || '> Initializing autonomous agent...'}</pre>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Review Results */}
      <AnimatePresence>
        {reviewResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card variant="gradient">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  10x Quality Score
                </h3>
                <div className="text-3xl font-bold">
                  <span
                    className={cn(
                      reviewResult.overallScore >= 90
                        ? 'text-green-500'
                        : reviewResult.overallScore >= 70
                        ? 'text-yellow-500'
                        : 'text-red-500'
                    )}
                  >
                    {reviewResult.overallScore}
                  </span>
                  <span className="text-muted-foreground text-lg">/100</span>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-4 mb-6">
                {Object.entries(reviewResult.scores).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="text-2xl font-bold text-primary">{value}</div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                  </div>
                ))}
              </div>

              {reviewResult.issues.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Issues Found:</h4>
                  <div className="space-y-2">
                    {reviewResult.issues.map((issue, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-sm p-2 rounded bg-muted/50"
                      >
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded text-xs',
                            issue.severity === 'critical' && 'bg-red-500/20 text-red-500',
                            issue.severity === 'high' && 'bg-orange-500/20 text-orange-500',
                            issue.severity === 'medium' && 'bg-yellow-500/20 text-yellow-500',
                            issue.severity === 'low' && 'bg-blue-500/20 text-blue-500'
                          )}
                        >
                          {issue.severity}
                        </span>
                        <span className="text-muted-foreground">{issue.file}:</span>
                        <span>{issue.issue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {reviewResult.improvements.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Suggested Improvements:</h4>
                  <ul className="space-y-1">
                    {reviewResult.improvements.map((imp, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-primary" />
                        {imp}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      {buildStatus === 'complete' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center gap-4"
        >
          <Button variant="outline" onClick={() => useAppStore.getState().setViewMode('files')}>
            <FileCode className="w-4 h-4 mr-2" />
            View Files
          </Button>
          <Button variant="outline" onClick={() => useAppStore.getState().setViewMode('editor')}>
            <Terminal className="w-4 h-4 mr-2" />
            Edit Files
          </Button>
          <Button>
            <Play className="w-4 h-4 mr-2" />
            Run App
          </Button>
        </motion.div>
      )}
    </div>
  )
}

// Helper functions
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getActionIcon(type: string) {
  switch (type) {
    case 'command':
      return '⚡'
    case 'write':
      return '📝'
    case 'edit':
      return '✏️'
    case 'review':
      return '🔍'
    case 'test':
      return '🧪'
    case 'fix':
      return '🔧'
    default:
      return '▸'
  }
}

function getScoreBar(score: number) {
  const filled = Math.round(score / 10)
  const empty = 10 - filled
  return '█'.repeat(filled) + '░'.repeat(empty)
}
