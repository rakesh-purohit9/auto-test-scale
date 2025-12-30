'use client'

import { motion } from 'framer-motion'
import { Lightbulb, Sparkles } from 'lucide-react'
import { Input } from './ui/Input'
import { Textarea } from './ui/Textarea'
import { Card } from './ui/Card'
import { useAppStore } from '@/lib/store'

const examplePrompts = [
  {
    template: 'saas',
    examples: [
      'A project management tool with kanban boards, team collaboration, and time tracking',
      'An email marketing platform with campaign builder, analytics, and subscriber management',
      'A customer support ticketing system with AI-powered responses and knowledge base',
    ],
  },
  {
    template: 'ecommerce',
    examples: [
      'A fashion store with product variants (size, color), wishlist, and reviews',
      'A food delivery marketplace connecting restaurants with customers',
      'A digital products store selling courses, ebooks, and templates',
    ],
  },
  {
    template: 'react-webapp',
    examples: [
      'A task management app with drag-and-drop kanban boards',
      'A weather dashboard with location search and forecasts',
      'A note-taking app with markdown support and tagging',
    ],
  },
  {
    template: 'nextjs-website',
    examples: [
      'A landing page for an AI startup with demo section and pricing',
      'A portfolio website for a design agency with case studies',
      'A SaaS marketing site with feature comparison and testimonials',
    ],
  },
  {
    template: 'flutter-mobile',
    examples: [
      'A fitness tracking app with workout plans and progress charts',
      'A recipe app with meal planning and grocery lists',
      'A habit tracker with streaks, reminders, and statistics',
    ],
  },
  {
    template: 'internal-tool',
    examples: [
      'An inventory management system with stock tracking and alerts',
      'An employee directory with org chart and contact info',
      'A CRM for tracking leads, deals, and customer interactions',
    ],
  },
]

export function RequirementsForm() {
  const { config, updateConfig } = useAppStore()
  const templateExamples =
    examplePrompts.find((e) => e.template === config.template?.id)?.examples || []

  return (
    <div className="space-y-8">
      <div className="text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold"
        >
          Describe Your App
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-2 text-muted-foreground"
        >
          Tell us what you want to build. The more detail, the better!
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-2xl mx-auto space-y-6"
      >
        <Input
          label="App Name"
          placeholder="my-awesome-app"
          value={config.appName}
          onChange={(e) => updateConfig({ appName: e.target.value })}
          hint="This will be used as the project folder name"
        />

        <Textarea
          label="Requirements"
          placeholder="Describe what you want to build. Include:
• Main purpose and target users
• Key features and functionality
• Any specific design preferences
• Integrations needed (auth, payments, etc.)"
          value={config.requirements}
          onChange={(e) => updateConfig({ requirements: e.target.value })}
          className="min-h-[200px]"
        />

        {templateExamples.length > 0 && (
          <Card variant="glass" className="p-4">
            <div className="flex items-center gap-2 text-primary mb-3">
              <Lightbulb className="w-4 h-4" />
              <span className="text-sm font-medium">Example prompts</span>
            </div>
            <div className="space-y-2">
              {templateExamples.map((example, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  onClick={() => updateConfig({ requirements: example })}
                  className="w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-sm"
                >
                  <Sparkles className="w-3 h-3 inline-block mr-2 text-primary" />
                  {example}
                </motion.button>
              ))}
            </div>
          </Card>
        )}
      </motion.div>
    </div>
  )
}
