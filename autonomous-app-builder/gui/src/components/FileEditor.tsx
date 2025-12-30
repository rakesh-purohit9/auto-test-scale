'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  File,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Save,
  Undo,
  Redo,
  Sparkles,
  Send,
  RefreshCw,
  Check,
  X,
  Code,
  FileJson,
  FileType,
  Terminal,
} from 'lucide-react'
import { Card } from './ui/Card'
import { Button } from './ui/Button'
import { Textarea } from './ui/Textarea'
import { useAppStore, ProjectFile } from '@/lib/store'
import { generateFileEditPrompt } from '@/lib/agent'
import { cn } from '@/lib/utils'

// Mock file tree for demonstration
const mockFileTree: ProjectFile[] = [
  {
    path: 'src',
    name: 'src',
    type: 'folder',
    children: [
      {
        path: 'src/app',
        name: 'app',
        type: 'folder',
        children: [
          { path: 'src/app/page.tsx', name: 'page.tsx', type: 'file', language: 'typescript' },
          { path: 'src/app/layout.tsx', name: 'layout.tsx', type: 'file', language: 'typescript' },
          { path: 'src/app/globals.css', name: 'globals.css', type: 'file', language: 'css' },
        ],
      },
      {
        path: 'src/components',
        name: 'components',
        type: 'folder',
        children: [
          { path: 'src/components/Button.tsx', name: 'Button.tsx', type: 'file', language: 'typescript' },
          { path: 'src/components/Card.tsx', name: 'Card.tsx', type: 'file', language: 'typescript' },
          { path: 'src/components/Input.tsx', name: 'Input.tsx', type: 'file', language: 'typescript' },
        ],
      },
      {
        path: 'src/lib',
        name: 'lib',
        type: 'folder',
        children: [
          { path: 'src/lib/supabase.ts', name: 'supabase.ts', type: 'file', language: 'typescript' },
          { path: 'src/lib/utils.ts', name: 'utils.ts', type: 'file', language: 'typescript' },
        ],
      },
    ],
  },
  { path: 'package.json', name: 'package.json', type: 'file', language: 'json' },
  { path: 'tailwind.config.ts', name: 'tailwind.config.ts', type: 'file', language: 'typescript' },
  { path: 'tsconfig.json', name: 'tsconfig.json', type: 'file', language: 'json' },
]

// Mock file content
const mockFileContents: Record<string, string> = {
  'src/app/page.tsx': `import { Button } from '@/components/Button'

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold">Welcome</h1>
      <Button>Get Started</Button>
    </main>
  )
}`,
  'src/components/Button.tsx': `interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  onClick?: () => void
}

export function Button({ children, variant = 'primary', onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={\`px-4 py-2 rounded-lg font-medium
        \${variant === 'primary' ? 'bg-primary text-white' : 'bg-gray-100'}\`}
    >
      {children}
    </button>
  )
}`,
  'src/lib/supabase.ts': `import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)`,
}

export function FileEditor() {
  const {
    projectFiles,
    setProjectFiles,
    selectedFile,
    setSelectedFile,
    fileContent,
    setFileContent,
    addFileEdit,
  } = useAppStore()

  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src']))
  const [editInstruction, setEditInstruction] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [pendingEdit, setPendingEdit] = useState<string | null>(null)

  // Initialize mock files
  useEffect(() => {
    if (projectFiles.length === 0) {
      setProjectFiles(mockFileTree)
    }
  }, [])

  // Load file content when selected
  useEffect(() => {
    if (selectedFile && selectedFile.type === 'file') {
      const content = mockFileContents[selectedFile.path] || `// Content for ${selectedFile.name}`
      setFileContent(content)
    }
  }, [selectedFile])

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(path)) {
      newExpanded.delete(path)
    } else {
      newExpanded.add(path)
    }
    setExpandedFolders(newExpanded)
  }

  const handleAIEdit = async () => {
    if (!selectedFile || !editInstruction.trim()) return

    setIsEditing(true)

    // Simulate AI edit
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generate mock edited content
    const editedContent = `// AI-edited based on: "${editInstruction}"\n${fileContent}`
    setPendingEdit(editedContent)

    // Log the edit
    addFileEdit({
      filePath: selectedFile.path,
      instruction: editInstruction,
      originalContent: fileContent,
      newContent: editedContent,
      status: 'pending',
    })

    setIsEditing(false)
  }

  const applyEdit = () => {
    if (pendingEdit) {
      setFileContent(pendingEdit)
      setPendingEdit(null)
      setEditInstruction('')
    }
  }

  const rejectEdit = () => {
    setPendingEdit(null)
  }

  return (
    <div className="grid grid-cols-12 gap-4 h-[calc(100vh-200px)]">
      {/* File Tree */}
      <div className="col-span-3">
        <Card className="h-full overflow-auto">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Folder className="w-4 h-4" />
            Project Files
          </h3>
          <div className="space-y-1">
            {projectFiles.map((file) => (
              <FileTreeItem
                key={file.path}
                file={file}
                expandedFolders={expandedFolders}
                selectedFile={selectedFile}
                onToggle={toggleFolder}
                onSelect={setSelectedFile}
                depth={0}
              />
            ))}
          </div>
        </Card>
      </div>

      {/* Editor */}
      <div className="col-span-9 flex flex-col gap-4">
        {/* File Header */}
        {selectedFile && (
          <Card className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getFileIcon(selectedFile.language)}
                <span className="font-medium">{selectedFile.path}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Undo className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Redo className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Save className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Code Editor */}
        <Card className="flex-1 p-0 overflow-hidden">
          {selectedFile ? (
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-auto">
                <pre className="p-4 text-sm font-mono bg-black/80 text-gray-200 h-full overflow-auto">
                  <code>{pendingEdit || fileContent}</code>
                </pre>
              </div>

              {/* Pending Edit Actions */}
              <AnimatePresence>
                {pendingEdit && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-border bg-yellow-500/10 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-yellow-600 font-medium">
                        AI Edit Preview - Review changes before applying
                      </span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={rejectEdit}>
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                        <Button size="sm" onClick={applyEdit}>
                          <Check className="w-4 h-4 mr-1" />
                          Apply
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Select a file to edit
            </div>
          )}
        </Card>

        {/* AI Edit Input */}
        {selectedFile && (
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">AI-Powered Edit</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Describe what changes you want to make..."
                value={editInstruction}
                onChange={(e) => setEditInstruction(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAIEdit()}
                className="flex-1 px-4 py-2 rounded-lg border-2 border-border bg-background text-sm focus:outline-none focus:border-primary"
              />
              <Button onClick={handleAIEdit} disabled={isEditing || !editInstruction.trim()}>
                {isEditing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Examples: "Add a loading state" • "Make the button larger" • "Add error handling"
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}

// File Tree Item Component
function FileTreeItem({
  file,
  expandedFolders,
  selectedFile,
  onToggle,
  onSelect,
  depth,
}: {
  file: ProjectFile
  expandedFolders: Set<string>
  selectedFile: ProjectFile | null
  onToggle: (path: string) => void
  onSelect: (file: ProjectFile) => void
  depth: number
}) {
  const isExpanded = expandedFolders.has(file.path)
  const isSelected = selectedFile?.path === file.path

  return (
    <div>
      <button
        onClick={() => {
          if (file.type === 'folder') {
            onToggle(file.path)
          } else {
            onSelect(file)
          }
        }}
        className={cn(
          'w-full flex items-center gap-2 px-2 py-1 rounded text-sm hover:bg-muted/50 transition-colors',
          isSelected && 'bg-primary/10 text-primary'
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {file.type === 'folder' ? (
          <>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
            {isExpanded ? (
              <FolderOpen className="w-4 h-4 text-yellow-500" />
            ) : (
              <Folder className="w-4 h-4 text-yellow-500" />
            )}
          </>
        ) : (
          <>
            <span className="w-4" />
            {getFileIcon(file.language)}
          </>
        )}
        <span>{file.name}</span>
      </button>

      {file.type === 'folder' && isExpanded && file.children && (
        <div>
          {file.children.map((child) => (
            <FileTreeItem
              key={child.path}
              file={child}
              expandedFolders={expandedFolders}
              selectedFile={selectedFile}
              onToggle={onToggle}
              onSelect={onSelect}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function getFileIcon(language?: string) {
  switch (language) {
    case 'typescript':
    case 'javascript':
      return <Code className="w-4 h-4 text-blue-500" />
    case 'json':
      return <FileJson className="w-4 h-4 text-yellow-500" />
    case 'css':
      return <FileType className="w-4 h-4 text-purple-500" />
    default:
      return <File className="w-4 h-4 text-muted-foreground" />
  }
}
