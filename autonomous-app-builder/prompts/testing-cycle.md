# Auto-Testing and Error Fixing Protocol

## Overview
This protocol ensures every build is tested, errors are automatically detected and fixed, and the app maintains 10x quality standards.

---

## 1. Testing Pipeline

### Phase 1: Static Analysis
```bash
# Run immediately after any code changes
npm run lint          # ESLint checks
npm run type-check    # TypeScript validation
npm run format:check  # Prettier formatting
```

### Phase 2: Build Verification
```bash
# Ensure the app compiles
npm run build

# Check for bundle size issues
npx @next/bundle-analyzer
```

### Phase 3: Unit Tests
```bash
# Run component and utility tests
npm run test

# With coverage report
npm run test:coverage
```

### Phase 4: Integration Tests
```bash
# Run API and database integration tests
npm run test:integration
```

### Phase 5: E2E Tests
```bash
# Run Playwright or Cypress tests
npm run test:e2e
```

---

## 2. Auto-Fix Protocol

### ESLint Auto-Fix
```bash
# Automatically fix linting issues
npm run lint -- --fix

# If errors persist, analyze and fix manually:
# 1. Read the error message
# 2. Identify the file and line
# 3. Apply the correct fix
# 4. Re-run lint
```

### TypeScript Error Resolution
```
For each TypeScript error:

1. Parse the error:
   - File path
   - Line number
   - Error code (e.g., TS2322, TS2339)
   - Error message

2. Apply fix based on error type:

   TS2322 (Type assignment):
   → Check if types match
   → Add type assertion if safe
   → Update type definition

   TS2339 (Property doesn't exist):
   → Add property to interface
   → Use optional chaining
   → Check for typos

   TS2345 (Argument type):
   → Convert argument type
   → Update function signature
   → Use type guards

   TS7006 (Implicit any):
   → Add explicit type annotation
   → Enable noImplicitAny: false (not recommended)

3. Re-run type check
4. Repeat until clean
```

### Build Error Resolution
```
Common build errors and fixes:

1. Module not found:
   → npm install missing-package
   → Check import path spelling
   → Verify file exists

2. Invalid configuration:
   → Check next.config.js/ts
   → Verify tailwind.config.js
   → Check tsconfig.json

3. Environment variable missing:
   → Add to .env.local
   → Add to .env.example
   → Check variable name spelling

4. Memory issues:
   → Increase Node memory: NODE_OPTIONS='--max-old-space-size=4096'
   → Check for memory leaks
   → Optimize large imports
```

---

## 3. Runtime Error Detection

### Error Boundary Implementation
```tsx
// components/error-boundary.tsx
"use client"

import { Component, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to error tracking service
    console.error('Error caught by boundary:', error, errorInfo)

    // In production, send to Sentry/LogRocket
    if (process.env.NODE_ENV === 'production') {
      // captureException(error, { extra: errorInfo })
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-lg border border-destructive/20 bg-destructive/5 p-8">
          <AlertTriangle className="h-12 w-12 text-destructive" />
          <h2 className="text-lg font-semibold">Something went wrong</h2>
          <p className="text-sm text-muted-foreground">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
```

### Global Error Handler
```tsx
// app/global-error.tsx
"use client"

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to service
    console.error('Global error:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center">
          <h2 className="text-2xl font-bold">Something went wrong!</h2>
          <button
            onClick={() => reset()}
            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
```

---

## 4. Automated Testing Setup

### Jest Configuration
```javascript
// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
}

module.exports = createJestConfig(customJestConfig)
```

### Jest Setup
```javascript
// jest.setup.js
import '@testing-library/jest-dom'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
    }
  },
  usePathname() {
    return '/'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock Supabase
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getSession: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
    })),
  })),
}))
```

### Component Test Example
```tsx
// __tests__/components/button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { PremiumButton } from '@/components/ui/premium-button'

describe('PremiumButton', () => {
  it('renders correctly', () => {
    render(<PremiumButton>Click me</PremiumButton>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<PremiumButton onClick={handleClick}>Click me</PremiumButton>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('shows loading state', () => {
    render(<PremiumButton loading>Submit</PremiumButton>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('applies variant styles', () => {
    render(<PremiumButton variant="destructive">Delete</PremiumButton>)
    expect(screen.getByRole('button')).toHaveClass('bg-destructive')
  })
})
```

### E2E Test Example (Playwright)
```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('user can sign in', async ({ page }) => {
    await page.goto('/login')

    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="password"]', 'password123')
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('text=Welcome back')).toBeVisible()
  })

  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/login')

    await page.fill('[name="email"]', 'wrong@example.com')
    await page.fill('[name="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')

    await expect(page.locator('text=Invalid credentials')).toBeVisible()
  })

  test('user can sign up', async ({ page }) => {
    await page.goto('/signup')

    await page.fill('[name="email"]', `test-${Date.now()}@example.com`)
    await page.fill('[name="password"]', 'SecurePass123!')
    await page.fill('[name="confirmPassword"]', 'SecurePass123!')
    await page.click('button[type="submit"]')

    await expect(page.locator('text=Check your email')).toBeVisible()
  })
})

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login')
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
  })

  test('can navigate between pages', async ({ page }) => {
    await page.click('text=Settings')
    await expect(page).toHaveURL('/settings')

    await page.click('text=Dashboard')
    await expect(page).toHaveURL('/dashboard')
  })
})
```

---

## 5. Continuous Quality Checks

### Pre-commit Hook (lint-staged)
```json
// package.json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,css}": [
      "prettier --write"
    ]
  }
}
```

### Husky Setup
```bash
# Install
npm install -D husky lint-staged

# Initialize
npx husky init

# Add pre-commit hook
echo "npx lint-staged" > .husky/pre-commit
```

### GitHub Actions CI
```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run type check
        run: npm run type-check

      - name: Run tests
        run: npm run test:ci

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}

      - name: Run E2E tests
        run: npm run test:e2e
```

---

## 6. Error Pattern Detection

### Common Error Patterns and Auto-Fixes

```typescript
// scripts/auto-fix.ts
const errorPatterns = [
  {
    pattern: /Cannot find module '(.+)'/,
    fix: async (match: RegExpMatchArray) => {
      const module = match[1]
      await exec(`npm install ${module}`)
    }
  },
  {
    pattern: /Property '(\w+)' does not exist on type/,
    fix: async (match: RegExpMatchArray, file: string, line: number) => {
      // Add property to type or use optional chaining
      // Read file, modify, write back
    }
  },
  {
    pattern: /Expected (\d+) arguments, but got (\d+)/,
    fix: async (match: RegExpMatchArray, file: string, line: number) => {
      // Add or remove arguments
    }
  },
  {
    pattern: /Cannot read property '(\w+)' of undefined/,
    fix: async (match: RegExpMatchArray, file: string, line: number) => {
      // Add optional chaining or null check
    }
  },
  {
    pattern: /'(\w+)' is defined but never used/,
    fix: async (match: RegExpMatchArray, file: string, line: number) => {
      // Prefix with underscore or remove
    }
  }
]

async function autoFixErrors(buildOutput: string) {
  for (const { pattern, fix } of errorPatterns) {
    const matches = buildOutput.matchAll(new RegExp(pattern, 'g'))
    for (const match of matches) {
      await fix(match)
    }
  }
}
```

---

## 7. Visual Regression Testing

### Screenshot Testing with Playwright
```typescript
// e2e/visual.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Visual Regression', () => {
  test('home page matches snapshot', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveScreenshot('home.png', {
      fullPage: true,
      animations: 'disabled'
    })
  })

  test('dashboard matches snapshot', async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')

    await expect(page).toHaveScreenshot('dashboard.png', {
      fullPage: true,
      animations: 'disabled'
    })
  })

  test('mobile view matches snapshot', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await expect(page).toHaveScreenshot('home-mobile.png', {
      fullPage: true
    })
  })
})
```

---

## 8. Performance Testing

### Lighthouse CI
```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI

on: [push]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - run: npm ci && npm run build

      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

### Performance Thresholds
```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run start',
      url: ['http://localhost:3000/', 'http://localhost:3000/dashboard'],
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
```

---

## 9. Testing Checklist

Before marking any feature complete:

```markdown
## Testing Checklist

### Static Analysis
- [ ] ESLint passes with no errors
- [ ] TypeScript compiles with no errors
- [ ] Prettier formatting applied

### Unit Tests
- [ ] All new functions have tests
- [ ] All new components have tests
- [ ] Edge cases covered
- [ ] Coverage above 70%

### Integration Tests
- [ ] API routes tested
- [ ] Database operations tested
- [ ] Authentication flows tested

### E2E Tests
- [ ] Happy path tested
- [ ] Error states tested
- [ ] Mobile views tested

### Visual
- [ ] No visual regressions
- [ ] Responsive design verified
- [ ] Dark/light mode tested

### Performance
- [ ] Lighthouse score > 90
- [ ] No memory leaks
- [ ] Bundle size reasonable

### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader tested
- [ ] Color contrast verified
```
