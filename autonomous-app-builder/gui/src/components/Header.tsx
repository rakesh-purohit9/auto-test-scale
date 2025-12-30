'use client'

import { motion } from 'framer-motion'
import { Zap, Github, Moon, Sun } from 'lucide-react'
import { Button } from './ui/Button'

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-purple-500 to-pink-500 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">App Builder</h1>
            <p className="text-xs text-muted-foreground">10x Quality</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <a href="https://github.com" target="_blank" rel="noopener">
              <Github className="w-4 h-4" />
            </a>
          </Button>
          <Button variant="ghost" size="sm">
            <Moon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.header>
  )
}
