'use client'

import { motion } from 'framer-motion'
import { Database, Bot, FolderOpen, Sparkles } from 'lucide-react'
import { Card } from './ui/Card'
import { Input } from './ui/Input'
import { Switch } from './ui/Switch'
import { Select } from './ui/Select'
import { useAppStore } from '@/lib/store'

const aiProviders = [
  { value: 'openai', label: 'OpenAI (GPT-4)' },
  { value: 'anthropic', label: 'Anthropic (Claude)' },
  { value: 'gemini', label: 'Google (Gemini)' },
  { value: 'perplexity', label: 'Perplexity (Sonar)' },
]

export function ConfigurationPanel() {
  const { config, updateConfig } = useAppStore()

  const updateSupabase = (updates: Partial<typeof config.supabase>) => {
    updateConfig({ supabase: { ...config.supabase, ...updates } })
  }

  const updateAI = (updates: Partial<typeof config.ai>) => {
    updateConfig({ ai: { ...config.ai, ...updates } })
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold"
        >
          Configure Integrations
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-2 text-muted-foreground"
        >
          Set up your database and AI provider. Claude will handle everything else dynamically.
        </motion.p>
      </div>

      <div className="space-y-6">
        {/* Dynamic Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card variant="gradient" className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Dynamic AI Decisions</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Claude will analyze your requirements and automatically decide:
            </p>
            <ul className="mt-2 text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>Custom color palette and typography</li>
              <li>Pages and components needed</li>
              <li>Database schema and API structure</li>
              <li>Build phases and implementation order</li>
              <li>Testing and quality review strategy</li>
            </ul>
          </Card>
        </motion.div>

        {/* Project Path */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold">Project Location</h3>
                <p className="text-sm text-muted-foreground">Where to save the project</p>
              </div>
            </div>
            <Input
              label="Output Path"
              placeholder="./projects"
              value={config.projectPath}
              onChange={(e) => updateConfig({ projectPath: e.target.value })}
            />
          </Card>
        </motion.div>

        {/* Supabase Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Database className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Supabase</h3>
                <p className="text-sm text-muted-foreground">Database, Auth & Storage</p>
              </div>
              <Switch
                checked={config.supabase.enabled}
                onCheckedChange={(enabled) => updateSupabase({ enabled })}
              />
            </div>

            {config.supabase.enabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4 pt-4 border-t border-border"
              >
                <Input
                  label="Supabase URL"
                  placeholder="https://xxx.supabase.co"
                  value={config.supabase.url}
                  onChange={(e) => updateSupabase({ url: e.target.value })}
                />
                <Input
                  label="Anon Key"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  type="password"
                  value={config.supabase.anonKey}
                  onChange={(e) => updateSupabase({ anonKey: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Optional: Leave empty to configure later in .env.local
                </p>
              </motion.div>
            )}
          </Card>
        </motion.div>

        {/* AI Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Bot className="w-5 h-5 text-purple-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">AI Integration</h3>
                <p className="text-sm text-muted-foreground">For your app's AI features</p>
              </div>
              <Switch
                checked={config.ai.enabled}
                onCheckedChange={(enabled) => updateAI({ enabled })}
              />
            </div>

            {config.ai.enabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4 pt-4 border-t border-border"
              >
                <Select
                  label="AI Provider"
                  value={config.ai.provider}
                  onValueChange={(provider: any) => updateAI({ provider })}
                  options={aiProviders}
                />
                <Input
                  label="API Key"
                  placeholder="sk-..."
                  type="password"
                  value={config.ai.apiKey}
                  onChange={(e) => updateAI({ apiKey: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Optional: Leave empty to configure later in .env.local
                </p>
              </motion.div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
