'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain,
  Palette,
  Layout,
  Code,
  TestTube,
  Star,
  Wrench,
  CheckCircle,
  AlertCircle,
  Loader2,
  Play,
  Copy,
  Terminal,
  Sparkles,
  Zap,
  RefreshCw,
} from 'lucide-react'
import { Card } from './ui/Card'
import { Button } from './ui/Button'
import { useAppStore } from '@/lib/store'
import { createRuntimeEngine, RuntimeState } from '@/lib/runtime-engine'
import { DynamicPrompts } from '@/lib/dynamic-prompts'
import { cn } from '@/lib/utils'

// Icon mapping for dynamic phases
const phaseIcons: Record<string, any> = {
  analyzing: Brain,
  designing: Palette,
  planning: Layout,
  building: Code,
  testing: TestTube,
  reviewing: Star,
  fixing: Wrench,
  complete: CheckCircle,
  error: AlertCircle,
}

export function DynamicBuildProgress() {
  const {
    config,
    buildStatus,
    setBuildStatus,
    runtimeState,
    setRuntimeState,
    claudeCommand,
    setClaudeCommand,
    terminalOutput,
    appendTerminalOutput,
  } = useAppStore()

  const [isRunning, setIsRunning] = useState(false)
  const [copied, setCopied] = useState(false)
  const logsEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when logs update
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [runtimeState?.logs])

  // Generate Claude command on mount
  useEffect(() => {
    const cmd = DynamicPrompts.megaBuild(
      config.appName,
      config.requirements,
      config.projectPath,
      config.supabase,
      config.ai
    )
    setClaudeCommand(`claude -p "${cmd.substring(0, 200)}..."`)
  }, [config])

  const handleStartBuild = async () => {
    setIsRunning(true)
    setBuildStatus('analyzing')

    const engine = createRuntimeEngine(
      {
        appName: config.appName,
        requirements: config.requirements,
        projectPath: config.projectPath,
        supabase: config.supabase,
        ai: config.ai,
      },
      (state) => {
        setRuntimeState(state)
        setBuildStatus(state.status as any)
      }
    )

    try {
      await engine.run()
    } catch (error) {
      console.error('Build failed:', error)
    } finally {
      setIsRunning(false)
    }
  }

  const handleCopyCommand = () => {
    const fullCommand = DynamicPrompts.megaBuild(
      config.appName,
      config.requirements,
      config.projectPath,
      config.supabase,
      config.ai
    )
    navigator.clipboard.writeText(`claude -p "${fullCommand}"`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getPhaseIcon = (status: string) => {
    const Icon = phaseIcons[status] || Loader2
    return Icon
  }

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-500'
      case 'error':
        return 'text-red-500'
      case 'warning':
        return 'text-yellow-500'
      case 'decision':
        return 'text-purple-500'
      case 'action':
        return 'text-blue-500'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Autonomous Build
          </h2>
          <p className="text-muted-foreground">
            Claude makes all decisions dynamically
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!isRunning && buildStatus === 'idle' && (
            <Button onClick={handleStartBuild}>
              <Play className="w-4 h-4 mr-2" />
              Start Build
            </Button>
          )}
          {buildStatus === 'complete' && (
            <Button variant="outline" onClick={() => setBuildStatus('idle')}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Build Again
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Current Status */}
        <div className="lg:col-span-1 space-y-4">
          {/* Status Card */}
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center',
                  buildStatus === 'complete'
                    ? 'bg-green-500/20'
                    : buildStatus === 'error'
                    ? 'bg-red-500/20'
                    : 'bg-primary/20'
                )}
              >
                {isRunning ? (
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                ) : (
                  (() => {
                    const Icon = getPhaseIcon(buildStatus)
                    return (
                      <Icon
                        className={cn(
                          'w-6 h-6',
                          buildStatus === 'complete'
                            ? 'text-green-500'
                            : buildStatus === 'error'
                            ? 'text-red-500'
                            : 'text-primary'
                        )}
                      />
                    )
                  })()
                )}
              </div>
              <div>
                <h3 className="font-semibold capitalize">
                  {runtimeState?.currentPhase || buildStatus}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {runtimeState?.currentTask || 'Ready to build'}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">
                  {runtimeState?.progress || 0}%
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${runtimeState?.progress || 0}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </Card>

          {/* Analysis Summary */}
          {runtimeState?.analysis && (
            <Card className="p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-500" />
                AI Analysis
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">App Type</span>
                  <span>{runtimeState.analysis.appIdentity.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mood</span>
                  <span>{runtimeState.analysis.personality.mood}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Complexity</span>
                  <span className="capitalize">
                    {runtimeState.analysis.scale.complexity}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Screens</span>
                  <span>{runtimeState.analysis.scale.estimatedScreens}</span>
                </div>
              </div>
            </Card>
          )}

          {/* Design Summary */}
          {runtimeState?.designSystem && (
            <Card className="p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Palette className="w-4 h-4 text-pink-500" />
                Design System
              </h4>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-muted-foreground">Colors</span>
                  <div className="flex gap-1 mt-1">
                    <div
                      className="w-8 h-8 rounded"
                      style={{
                        backgroundColor:
                          runtimeState.designSystem.colors.primary.value,
                      }}
                      title="Primary"
                    />
                    <div
                      className="w-8 h-8 rounded"
                      style={{
                        backgroundColor:
                          runtimeState.designSystem.colors.secondary.value,
                      }}
                      title="Secondary"
                    />
                    <div
                      className="w-8 h-8 rounded"
                      style={{
                        backgroundColor:
                          runtimeState.designSystem.colors.accent.value,
                      }}
                      title="Accent"
                    />
                  </div>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Typography: </span>
                  <span>{runtimeState.designSystem.typography.headingFont.value}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Style: </span>
                  <span className="capitalize">
                    {runtimeState.designSystem.borderRadius.style},{' '}
                    {runtimeState.designSystem.animation.style}
                  </span>
                </div>
              </div>
            </Card>
          )}

          {/* Quality Score */}
          {runtimeState?.qualityScore !== null && (
            <Card className="p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                Quality Score
              </h4>
              <div className="text-center">
                <div
                  className={cn(
                    'text-4xl font-bold',
                    runtimeState.qualityScore >= 90
                      ? 'text-green-500'
                      : runtimeState.qualityScore >= 70
                      ? 'text-yellow-500'
                      : 'text-red-500'
                  )}
                >
                  {runtimeState.qualityScore}
                </div>
                <div className="text-sm text-muted-foreground">/ 100</div>
              </div>
            </Card>
          )}
        </div>

        {/* Right: Live Logs */}
        <Card className="lg:col-span-2 p-0 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Agent Activity</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Zap className="w-3 h-3" />
              All decisions made by AI at runtime
            </div>
          </div>

          <div className="h-[500px] overflow-auto p-4 bg-black/80 font-mono text-sm">
            {!runtimeState?.logs.length ? (
              <div className="text-muted-foreground">
                <p>{'>'} Waiting to start...</p>
                <p>{'>'} Claude will analyze your requirements and make all decisions dynamically.</p>
                <p>{'>'} No hardcoded templates - everything is generated at runtime.</p>
              </div>
            ) : (
              <div className="space-y-1">
                {runtimeState.logs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-2"
                  >
                    <span className="text-muted-foreground text-xs min-w-[70px]">
                      {log.timestamp.toLocaleTimeString()}
                    </span>
                    <span
                      className={cn(
                        'text-xs font-medium uppercase min-w-[70px]',
                        getStatusColor(log.type)
                      )}
                    >
                      [{log.type}]
                    </span>
                    <span className="text-gray-300">{log.message}</span>
                  </motion.div>
                ))}
                <div ref={logsEndRef} />
              </div>
            )}
          </div>

          {/* Claude Command */}
          <div className="px-4 py-3 bg-muted/30 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex-1 mr-4">
                <p className="text-xs text-muted-foreground mb-1">
                  Claude Code Command (copy to run manually):
                </p>
                <code className="text-xs text-primary truncate block">
                  {claudeCommand}
                </code>
              </div>
              <Button variant="outline" size="sm" onClick={handleCopyCommand}>
                <Copy className="w-3 h-3 mr-1" />
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Dynamic Build Plan */}
      {runtimeState?.buildPlan && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Layout className="w-5 h-5 text-primary" />
            Dynamic Build Plan
            <span className="text-xs text-muted-foreground font-normal">
              (Generated at runtime based on analysis)
            </span>
          </h3>
          <div className="space-y-3">
            {runtimeState.buildPlan.phases.map((phase, i) => (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  'p-4 rounded-lg border',
                  runtimeState.currentPhase === phase.name
                    ? 'border-primary bg-primary/5'
                    : 'border-border'
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{phase.name}</h4>
                  <span className="text-xs text-muted-foreground">
                    {phase.tasks.length} tasks
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {phase.description}
                </p>
              </motion.div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
