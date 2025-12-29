# AI Providers Integration

Unified interface for multiple AI providers.

## Supported Providers

| Provider | Models | Features |
|----------|--------|----------|
| OpenAI | GPT-4o, GPT-4o-mini | Chat, Vision, Embeddings, DALL-E |
| Anthropic | Claude Sonnet 4, Claude Opus 4 | Chat, Vision, Long context |
| Google | Gemini 2.0 Flash | Chat, Vision, Multilingual |
| Perplexity | Sonar Large | Chat with web search |

## Quick Start

```typescript
import { chat, streamChat } from '@/lib/ai'

// Simple chat
const response = await chat(
  [{ role: 'user', content: 'Hello!' }],
  { provider: 'anthropic', model: 'claude-sonnet-4-20250514' }
)

// Streaming chat
for await (const chunk of streamChat(messages, config)) {
  console.log(chunk)
}
```

## Files

### Core
- `index.ts` - Provider configuration and client factory
- `chat.ts` - Unified chat interface
- `stream.ts` - Streaming support

### Functions
- `generate.ts` - Text generation utilities
- `vision.ts` - Image analysis
- `embeddings.ts` - Vector embeddings

### React
- `use-chat.ts` - Chat hook with state management
- `ai-chat.tsx` - Complete chat component

## Environment Variables

```bash
# OpenAI
OPENAI_API_KEY=sk-...

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Google
GEMINI_API_KEY=...

# Perplexity
PERPLEXITY_API_KEY=pplx-...
```

## Provider Selection Guide

- **General chat**: Anthropic Claude
- **Code generation**: Anthropic Claude
- **Fast responses**: OpenAI GPT-4o-mini
- **Web search**: Perplexity Sonar
- **Multilingual**: Google Gemini
- **Long documents**: Anthropic Claude
