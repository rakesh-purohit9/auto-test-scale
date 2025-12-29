# AI Provider Integration Guide

## Overview
This guide covers integration patterns for OpenAI, Anthropic (Claude), Google Gemini, and Perplexity APIs.

---

## 1. Unified AI Client

### Base Configuration
```typescript
// lib/ai/index.ts
import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'

export type AIProvider = 'openai' | 'anthropic' | 'gemini' | 'perplexity'

export interface AIConfig {
  provider: AIProvider
  model?: string
  temperature?: number
  maxTokens?: number
}

// Default models per provider
export const defaultModels: Record<AIProvider, string> = {
  openai: 'gpt-4o',
  anthropic: 'claude-sonnet-4-20250514',
  gemini: 'gemini-2.0-flash',
  perplexity: 'llama-3.1-sonar-large-128k-online'
}

export function getAIClient(provider: AIProvider) {
  switch (provider) {
    case 'openai':
      return new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    case 'anthropic':
      return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    case 'gemini':
      return new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
    case 'perplexity':
      return new OpenAI({
        apiKey: process.env.PERPLEXITY_API_KEY,
        baseURL: 'https://api.perplexity.ai'
      })
    default:
      throw new Error(`Unknown provider: ${provider}`)
  }
}
```

### Unified Chat Interface
```typescript
// lib/ai/chat.ts
import { AIConfig, getAIClient, defaultModels, AIProvider } from './index'
import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'

export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface ChatResponse {
  content: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export async function chat(
  messages: Message[],
  config: AIConfig
): Promise<ChatResponse> {
  const { provider, model, temperature = 0.7, maxTokens = 2048 } = config
  const selectedModel = model || defaultModels[provider]

  switch (provider) {
    case 'openai':
    case 'perplexity': {
      const client = getAIClient(provider) as OpenAI
      const response = await client.chat.completions.create({
        model: selectedModel,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content
        })),
        temperature,
        max_tokens: maxTokens
      })

      return {
        content: response.choices[0]?.message?.content || '',
        usage: response.usage ? {
          promptTokens: response.usage.prompt_tokens,
          completionTokens: response.usage.completion_tokens,
          totalTokens: response.usage.total_tokens
        } : undefined
      }
    }

    case 'anthropic': {
      const client = getAIClient(provider) as Anthropic
      const systemMessage = messages.find(m => m.role === 'system')
      const chatMessages = messages.filter(m => m.role !== 'system')

      const response = await client.messages.create({
        model: selectedModel,
        max_tokens: maxTokens,
        system: systemMessage?.content,
        messages: chatMessages.map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content
        }))
      })

      const textBlock = response.content.find(block => block.type === 'text')
      return {
        content: textBlock?.type === 'text' ? textBlock.text : '',
        usage: {
          promptTokens: response.usage.input_tokens,
          completionTokens: response.usage.output_tokens,
          totalTokens: response.usage.input_tokens + response.usage.output_tokens
        }
      }
    }

    case 'gemini': {
      const client = getAIClient(provider) as GoogleGenerativeAI
      const model = client.getGenerativeModel({ model: selectedModel })

      // Build chat history
      const history = messages.slice(0, -1).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }))

      const chat = model.startChat({ history })
      const lastMessage = messages[messages.length - 1]
      const result = await chat.sendMessage(lastMessage.content)

      return {
        content: result.response.text()
      }
    }

    default:
      throw new Error(`Unknown provider: ${provider}`)
  }
}
```

---

## 2. Streaming Support

### Streaming Chat
```typescript
// lib/ai/stream.ts
import { AIConfig, getAIClient, defaultModels } from './index'
import { Message } from './chat'
import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'

export async function* streamChat(
  messages: Message[],
  config: AIConfig
): AsyncGenerator<string, void, unknown> {
  const { provider, model, temperature = 0.7, maxTokens = 2048 } = config
  const selectedModel = model || defaultModels[provider]

  switch (provider) {
    case 'openai':
    case 'perplexity': {
      const client = getAIClient(provider) as OpenAI
      const stream = await client.chat.completions.create({
        model: selectedModel,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content
        })),
        temperature,
        max_tokens: maxTokens,
        stream: true
      })

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content
        if (content) yield content
      }
      break
    }

    case 'anthropic': {
      const client = getAIClient(provider) as Anthropic
      const systemMessage = messages.find(m => m.role === 'system')
      const chatMessages = messages.filter(m => m.role !== 'system')

      const stream = client.messages.stream({
        model: selectedModel,
        max_tokens: maxTokens,
        system: systemMessage?.content,
        messages: chatMessages.map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content
        }))
      })

      for await (const event of stream) {
        if (event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta') {
          yield event.delta.text
        }
      }
      break
    }

    case 'gemini': {
      // Gemini streaming implementation
      const { GoogleGenerativeAI } = await import('@google/generative-ai')
      const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
      const geminiModel = client.getGenerativeModel({ model: selectedModel })

      const history = messages.slice(0, -1).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }))

      const chat = geminiModel.startChat({ history })
      const lastMessage = messages[messages.length - 1]
      const result = await chat.sendMessageStream(lastMessage.content)

      for await (const chunk of result.stream) {
        yield chunk.text()
      }
      break
    }
  }
}
```

---

## 3. API Routes

### Next.js API Route (App Router)
```typescript
// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { chat, Message } from '@/lib/ai/chat'
import { streamChat } from '@/lib/ai/stream'
import { AIProvider } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const { messages, provider, model, stream } = await request.json() as {
      messages: Message[]
      provider: AIProvider
      model?: string
      stream?: boolean
    }

    if (stream) {
      // Streaming response
      const encoder = new TextEncoder()
      const customReadable = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of streamChat(messages, { provider, model })) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`))
            }
            controller.enqueue(encoder.encode('data: [DONE]\n\n'))
            controller.close()
          } catch (error) {
            controller.error(error)
          }
        }
      })

      return new Response(customReadable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        }
      })
    }

    // Non-streaming response
    const response = await chat(messages, { provider, model })
    return NextResponse.json(response)

  } catch (error: any) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
```

---

## 4. React Hooks

### useChat Hook
```typescript
// hooks/use-chat.ts
"use client"

import { useState, useCallback, useRef } from 'react'
import { Message } from '@/lib/ai/chat'
import { AIProvider } from '@/lib/ai'

interface UseChatOptions {
  provider: AIProvider
  model?: string
  systemPrompt?: string
  onError?: (error: Error) => void
}

interface UseChatReturn {
  messages: Message[]
  input: string
  setInput: (input: string) => void
  isLoading: boolean
  error: Error | null
  sendMessage: (content?: string) => Promise<void>
  regenerate: () => Promise<void>
  clear: () => void
  stop: () => void
}

export function useChat(options: UseChatOptions): UseChatReturn {
  const { provider, model, systemPrompt, onError } = options

  const [messages, setMessages] = useState<Message[]>(
    systemPrompt ? [{ role: 'system', content: systemPrompt }] : []
  )
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(async (content?: string) => {
    const messageContent = content || input
    if (!messageContent.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: messageContent }
    const newMessages = [...messages, userMessage]

    setMessages(newMessages)
    setInput('')
    setIsLoading(true)
    setError(null)

    abortControllerRef.current = new AbortController()

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          provider,
          model,
          stream: true
        }),
        signal: abortControllerRef.current.signal
      })

      if (!response.ok) throw new Error('Chat request failed')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ''

      // Add empty assistant message
      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      while (reader) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') break

            try {
              const parsed = JSON.parse(data)
              assistantMessage += parsed.content
              setMessages(prev => {
                const updated = [...prev]
                updated[updated.length - 1] = {
                  role: 'assistant',
                  content: assistantMessage
                }
                return updated
              })
            } catch {}
          }
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return

      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      onError?.(error)

      // Remove the empty assistant message on error
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }, [input, messages, isLoading, provider, model, onError])

  const regenerate = useCallback(async () => {
    if (messages.length < 2) return

    // Remove last assistant message and regenerate
    const messagesWithoutLast = messages.slice(0, -1)
    setMessages(messagesWithoutLast)

    // Get last user message
    const lastUserMessage = messagesWithoutLast
      .filter(m => m.role === 'user')
      .pop()

    if (lastUserMessage) {
      await sendMessage(lastUserMessage.content)
    }
  }, [messages, sendMessage])

  const clear = useCallback(() => {
    setMessages(systemPrompt ? [{ role: 'system', content: systemPrompt }] : [])
    setError(null)
  }, [systemPrompt])

  const stop = useCallback(() => {
    abortControllerRef.current?.abort()
    setIsLoading(false)
  }, [])

  return {
    messages,
    input,
    setInput,
    isLoading,
    error,
    sendMessage,
    regenerate,
    clear,
    stop
  }
}
```

---

## 5. AI Chat Component

```tsx
// components/ai-chat.tsx
"use client"

import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, StopCircle, RefreshCw, Trash2, User, Bot, Loader2 } from 'lucide-react'
import { useChat } from '@/hooks/use-chat'
import { PremiumButton } from '@/components/ui/premium-button'
import { PremiumInput } from '@/components/ui/premium-input'
import { cn } from '@/lib/utils'
import { AIProvider } from '@/lib/ai'

interface AIChatProps {
  provider: AIProvider
  model?: string
  systemPrompt?: string
  placeholder?: string
  className?: string
}

export function AIChat({
  provider,
  model,
  systemPrompt,
  placeholder = "Type a message...",
  className
}: AIChatProps) {
  const {
    messages,
    input,
    setInput,
    isLoading,
    sendMessage,
    regenerate,
    clear,
    stop
  } = useChat({ provider, model, systemPrompt })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage()
  }

  const visibleMessages = messages.filter(m => m.role !== 'system')

  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {visibleMessages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={cn(
                "flex gap-3",
                message.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              {message.role === 'assistant' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}

              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3",
                  message.role === 'user'
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <p className="whitespace-pre-wrap text-sm">{message.content}</p>
              </div>

              {message.role === 'user' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && visibleMessages[visibleMessages.length - 1]?.role === 'user' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-muted px-4 py-3">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">Thinking...</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border/50 p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              disabled={isLoading}
              className="w-full rounded-xl border-2 border-input bg-background px-4 py-3 text-sm transition-all focus:border-primary focus:outline-none disabled:opacity-50"
            />
          </div>

          <div className="flex gap-2">
            {isLoading ? (
              <PremiumButton
                type="button"
                variant="outline"
                size="icon"
                onClick={stop}
              >
                <StopCircle className="h-4 w-4" />
              </PremiumButton>
            ) : (
              <>
                {visibleMessages.length > 0 && (
                  <>
                    <PremiumButton
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={regenerate}
                      disabled={visibleMessages.length < 2}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </PremiumButton>
                    <PremiumButton
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={clear}
                    >
                      <Trash2 className="h-4 w-4" />
                    </PremiumButton>
                  </>
                )}
                <PremiumButton
                  type="submit"
                  size="icon"
                  disabled={!input.trim()}
                >
                  <Send className="h-4 w-4" />
                </PremiumButton>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
```

---

## 6. Specialized AI Functions

### Text Generation
```typescript
// lib/ai/functions/generate.ts
import { chat } from '../chat'
import { AIConfig } from '../index'

export async function generateText(
  prompt: string,
  config: AIConfig
): Promise<string> {
  const response = await chat(
    [{ role: 'user', content: prompt }],
    config
  )
  return response.content
}

export async function generateJSON<T>(
  prompt: string,
  config: AIConfig
): Promise<T> {
  const response = await chat(
    [
      {
        role: 'system',
        content: 'You are a helpful assistant that always responds with valid JSON. Do not include any markdown formatting or code blocks, just the raw JSON.'
      },
      { role: 'user', content: prompt }
    ],
    config
  )

  return JSON.parse(response.content) as T
}

export async function summarize(
  text: string,
  config: AIConfig,
  options?: { maxLength?: number; style?: 'brief' | 'detailed' | 'bullets' }
): Promise<string> {
  const { maxLength = 200, style = 'brief' } = options || {}

  const styleInstructions = {
    brief: 'Provide a brief, concise summary.',
    detailed: 'Provide a detailed summary covering all key points.',
    bullets: 'Provide a summary as bullet points.'
  }

  return generateText(
    `Summarize the following text in approximately ${maxLength} words. ${styleInstructions[style]}\n\nText:\n${text}`,
    config
  )
}

export async function translate(
  text: string,
  targetLanguage: string,
  config: AIConfig
): Promise<string> {
  return generateText(
    `Translate the following text to ${targetLanguage}. Only respond with the translation, no explanations.\n\nText:\n${text}`,
    config
  )
}
```

### Image Analysis (Vision)
```typescript
// lib/ai/functions/vision.ts
import { AIConfig, getAIClient } from '../index'
import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'

export async function analyzeImage(
  imageUrl: string,
  prompt: string,
  config: AIConfig
): Promise<string> {
  const { provider, model, maxTokens = 1024 } = config

  switch (provider) {
    case 'openai': {
      const client = getAIClient('openai') as OpenAI
      const response = await client.chat.completions.create({
        model: model || 'gpt-4o',
        max_tokens: maxTokens,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: imageUrl } }
            ]
          }
        ]
      })
      return response.choices[0]?.message?.content || ''
    }

    case 'anthropic': {
      const client = getAIClient('anthropic') as Anthropic

      // Fetch image and convert to base64
      const imageResponse = await fetch(imageUrl)
      const imageBuffer = await imageResponse.arrayBuffer()
      const base64 = Buffer.from(imageBuffer).toString('base64')
      const mediaType = imageResponse.headers.get('content-type') || 'image/jpeg'

      const response = await client.messages.create({
        model: model || 'claude-sonnet-4-20250514',
        max_tokens: maxTokens,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType as any,
                  data: base64
                }
              },
              { type: 'text', text: prompt }
            ]
          }
        ]
      })

      const textBlock = response.content.find(block => block.type === 'text')
      return textBlock?.type === 'text' ? textBlock.text : ''
    }

    case 'gemini': {
      const { GoogleGenerativeAI } = await import('@google/generative-ai')
      const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
      const geminiModel = client.getGenerativeModel({ model: model || 'gemini-2.0-flash' })

      // Fetch image
      const imageResponse = await fetch(imageUrl)
      const imageBuffer = await imageResponse.arrayBuffer()
      const base64 = Buffer.from(imageBuffer).toString('base64')
      const mimeType = imageResponse.headers.get('content-type') || 'image/jpeg'

      const result = await geminiModel.generateContent([
        prompt,
        { inlineData: { data: base64, mimeType } }
      ])

      return result.response.text()
    }

    default:
      throw new Error(`Vision not supported for provider: ${provider}`)
  }
}
```

---

## 7. Provider Selection Guide

Choose the right provider based on use case:

| Use Case | Recommended Provider | Model |
|----------|---------------------|-------|
| General chat | Anthropic | claude-sonnet-4-20250514 |
| Code generation | Anthropic | claude-sonnet-4-20250514 |
| Creative writing | Anthropic | claude-sonnet-4-20250514 |
| Fast responses | OpenAI | gpt-4o-mini |
| Image analysis | OpenAI | gpt-4o |
| Web search | Perplexity | sonar-large |
| Multilingual | Gemini | gemini-2.0-flash |
| Long context | Anthropic | claude-sonnet-4-20250514 |
| Cost-effective | OpenAI | gpt-4o-mini |
