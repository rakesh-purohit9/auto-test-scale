'use client'

import { motion } from 'framer-motion'
import { Database, Bot, Lock, Moon, BarChart, CreditCard } from 'lucide-react'
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

  const updateFeatures = (updates: Partial<typeof config.features>) => {
    updateConfig({ features: { ...config.features, ...updates } })
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
          Set up your database, AI, and feature preferences
        </motion.p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Supabase Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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
                  Leave empty to configure later in .env.local
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
                <p className="text-sm text-muted-foreground">Chat, Analysis & Generation</p>
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
                  Leave empty to configure later in .env.local
                </p>
              </motion.div>
            )}
          </Card>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <h3 className="font-semibold mb-4">Additional Features</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-blue-500" />
                </div>
                <Switch
                  label="Authentication"
                  description="User login and registration"
                  checked={config.features.auth}
                  onCheckedChange={(auth) => updateFeatures({ auth })}
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                  <Moon className="w-4 h-4 text-indigo-500" />
                </div>
                <Switch
                  label="Dark Mode"
                  description="Light and dark theme toggle"
                  checked={config.features.darkMode}
                  onCheckedChange={(darkMode) => updateFeatures({ darkMode })}
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <BarChart className="w-4 h-4 text-amber-500" />
                </div>
                <Switch
                  label="Analytics"
                  description="Usage tracking and insights"
                  checked={config.features.analytics}
                  onCheckedChange={(analytics) => updateFeatures({ analytics })}
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-green-500" />
                </div>
                <Switch
                  label="Payments"
                  description="Stripe integration for billing"
                  checked={config.features.payments}
                  onCheckedChange={(payments) => updateFeatures({ payments })}
                />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
