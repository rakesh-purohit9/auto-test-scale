'use client'

import { motion } from 'framer-motion'
import {
  Layers,
  ShoppingCart,
  Users,
  Brain,
  LayoutDashboard,
  Globe,
  Sparkles,
  Wrench,
  Smartphone,
  Check,
} from 'lucide-react'
import { Card } from './ui/Card'
import { templates, getTemplatesByCategory } from '@/lib/templates'
import { useAppStore, type AppTemplate } from '@/lib/store'
import { cn } from '@/lib/utils'

const iconMap: Record<string, React.ElementType> = {
  Layers,
  ShoppingCart,
  Users,
  Brain,
  LayoutDashboard,
  Globe,
  Sparkles,
  Wrench,
  Smartphone,
}

const categoryLabels = {
  fullstack: 'Full-Stack Applications',
  web: 'Web Applications',
  mobile: 'Mobile Applications',
}

export function TemplateSelector() {
  const { config, setTemplate } = useAppStore()
  const templatesByCategory = getTemplatesByCategory()

  return (
    <div className="space-y-8">
      <div className="text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold"
        >
          Choose Your Template
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-2 text-muted-foreground"
        >
          Select a template that matches your project type
        </motion.p>
      </div>

      {Object.entries(templatesByCategory).map(([category, categoryTemplates], categoryIndex) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * (categoryIndex + 1) }}
        >
          <h3 className="text-lg font-semibold mb-4 text-muted-foreground">
            {categoryLabels[category as keyof typeof categoryLabels]}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryTemplates.map((template, index) => (
              <TemplateCard
                key={template.id}
                template={template}
                selected={config.template?.id === template.id}
                onClick={() => setTemplate(template)}
                delay={0.05 * index}
              />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

interface TemplateCardProps {
  template: AppTemplate
  selected: boolean
  onClick: () => void
  delay?: number
}

function TemplateCard({ template, selected, onClick, delay = 0 }: TemplateCardProps) {
  const Icon = iconMap[template.icon] || Layers

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        hover
        selected={selected}
        onClick={onClick}
        className="relative h-full"
      >
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
          >
            <Check className="w-4 h-4 text-primary-foreground" />
          </motion.div>
        )}

        <div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
            'bg-gradient-to-br',
            template.color
          )}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>

        <h4 className="text-lg font-semibold mb-2">{template.name}</h4>
        <p className="text-sm text-muted-foreground mb-4">{template.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {template.techStack.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 text-xs rounded-md bg-muted text-muted-foreground"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-1">
          {template.features.map((feature) => (
            <span
              key={feature}
              className="px-2 py-0.5 text-xs rounded bg-primary/10 text-primary"
            >
              {feature}
            </span>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}
