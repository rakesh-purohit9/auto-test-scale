'use client'

import { motion } from 'framer-motion'
import {
  ShoppingBag,
  MessageSquare,
  BarChart3,
  GraduationCap,
  Briefcase,
  Heart,
  Gamepad2,
  Music,
  Camera,
  Utensils,
  Plane,
  Home,
  Car,
  Dumbbell,
  BookOpen,
  Palette,
  Code,
  Sparkles
} from 'lucide-react'

// Simple app types - just labels to hint Claude, no code attached
export const APP_TYPES = [
  { id: 'ecommerce', label: 'E-Commerce', icon: ShoppingBag, hint: 'Online store, marketplace, product catalog' },
  { id: 'social', label: 'Social Platform', icon: MessageSquare, hint: 'Social network, community, messaging' },
  { id: 'dashboard', label: 'Dashboard / Analytics', icon: BarChart3, hint: 'Data visualization, metrics, admin panel' },
  { id: 'education', label: 'Education / Learning', icon: GraduationCap, hint: 'Courses, tutorials, LMS, quizzes' },
  { id: 'saas', label: 'SaaS / Business Tool', icon: Briefcase, hint: 'Productivity, workflow, team collaboration' },
  { id: 'healthcare', label: 'Healthcare / Wellness', icon: Heart, hint: 'Medical, fitness tracking, mental health' },
  { id: 'gaming', label: 'Gaming / Entertainment', icon: Gamepad2, hint: 'Games, streaming, interactive media' },
  { id: 'music', label: 'Music / Audio', icon: Music, hint: 'Streaming, podcasts, audio creation' },
  { id: 'photography', label: 'Photography / Media', icon: Camera, hint: 'Photo sharing, editing, galleries' },
  { id: 'food', label: 'Food / Restaurant', icon: Utensils, hint: 'Ordering, recipes, restaurant management' },
  { id: 'travel', label: 'Travel / Booking', icon: Plane, hint: 'Trip planning, reservations, experiences' },
  { id: 'realestate', label: 'Real Estate / Property', icon: Home, hint: 'Listings, property management, rentals' },
  { id: 'automotive', label: 'Automotive', icon: Car, hint: 'Vehicle sales, rentals, services' },
  { id: 'fitness', label: 'Fitness / Sports', icon: Dumbbell, hint: 'Workout tracking, coaching, competitions' },
  { id: 'content', label: 'Blog / Content', icon: BookOpen, hint: 'Publishing, CMS, news, articles' },
  { id: 'creative', label: 'Creative / Design', icon: Palette, hint: 'Art, design tools, portfolios' },
  { id: 'developer', label: 'Developer Tools', icon: Code, hint: 'APIs, dev utilities, documentation' },
  { id: 'custom', label: 'Custom / Other', icon: Sparkles, hint: 'Unique idea that doesn\'t fit categories' },
] as const

export type AppType = typeof APP_TYPES[number]['id']

interface AppTypeSelectorProps {
  selectedType: AppType | null
  onSelect: (type: AppType) => void
}

export function AppTypeSelector({ selectedType, onSelect }: AppTypeSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">What type of app are you building?</h2>
        <p className="text-zinc-400">
          This helps Claude understand your vision better. All design and code decisions are still made dynamically.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {APP_TYPES.map((type, index) => {
          const Icon = type.icon
          const isSelected = selectedType === type.id

          return (
            <motion.button
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => onSelect(type.id)}
              className={`
                group relative p-4 rounded-xl border-2 transition-all duration-200
                flex flex-col items-center gap-2 text-center
                ${isSelected
                  ? 'border-violet-500 bg-violet-500/20 shadow-lg shadow-violet-500/20'
                  : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-500 hover:bg-zinc-800'
                }
              `}
            >
              <div className={`
                p-3 rounded-lg transition-colors
                ${isSelected ? 'bg-violet-500/30 text-violet-300' : 'bg-zinc-700/50 text-zinc-400 group-hover:text-zinc-300'}
              `}>
                <Icon className="w-6 h-6" />
              </div>

              <div>
                <div className={`font-medium text-sm ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                  {type.label}
                </div>
                <div className="text-xs text-zinc-500 mt-1 line-clamp-2">
                  {type.hint}
                </div>
              </div>

              {isSelected && (
                <motion.div
                  layoutId="selected-indicator"
                  className="absolute -top-1 -right-1 w-4 h-4 bg-violet-500 rounded-full flex items-center justify-center"
                >
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          )
        })}
      </div>

      <div className="text-center text-sm text-zinc-500">
        <p>💡 Don't worry about picking perfectly - Claude will adapt based on your detailed description</p>
      </div>
    </div>
  )
}
