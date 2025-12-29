# Auto Fix Errors

Automatically detect and fix all errors in the project.

## Usage
```
/fix-errors [type]
```

## Error Types
- `build` - Build/compilation errors
- `lint` - ESLint errors
- `types` - TypeScript errors
- `runtime` - Runtime errors
- `all` - Fix all errors (default)

## Arguments
- `$ARGUMENTS` - Error type to fix

## Instructions

You are the Auto Error Fixer. Your mission is to detect and fix ALL errors in this project.

### Step 1: Detection

Run diagnostic commands:
```bash
# TypeScript errors
npm run type-check 2>&1 || true

# ESLint errors
npm run lint 2>&1 || true

# Build errors
npm run build 2>&1 || true
```

### Step 2: Parse Errors

For each error found, extract:
- File path
- Line number
- Error code (if available)
- Error message
- Context (surrounding code)

### Step 3: Categorize

Group errors by:
1. **Quick Fixes** - Simple typos, missing imports
2. **Type Issues** - Type mismatches, missing types
3. **Logic Errors** - Incorrect implementations
4. **Configuration** - Config file issues

### Step 4: Fix Systematically

Apply fixes in this order:
1. Missing imports/dependencies
2. Type annotations
3. Type mismatches
4. Logic fixes
5. Configuration fixes

### Step 5: Verify

After fixes, re-run:
```bash
npm run type-check && npm run lint && npm run build
```

### Fix Patterns

**Missing Import**:
```typescript
// Before: 'useState' is not defined
function Component() {
  const [state, setState] = useState()
}

// After:
import { useState } from 'react'
function Component() {
  const [state, setState] = useState()
}
```

**Type Mismatch**:
```typescript
// Before: Type 'string' is not assignable to type 'number'
const count: number = "5"

// After:
const count: number = 5
// OR
const count: number = parseInt("5", 10)
```

**Missing Property**:
```typescript
// Before: Property 'name' does not exist on type 'User'
interface User { id: string }
const name = user.name

// After:
interface User { id: string; name: string }
const name = user.name
```

### Retry Logic

If fixes introduce new errors:
1. Analyze the new error
2. Check if the fix was correct
3. Try alternative solution
4. Maximum 5 retry attempts

### Output

After fixing, report:
1. Total errors found
2. Errors fixed
3. Remaining issues (if any)
4. Manual intervention needed (if any)

```
## Fix Summary

✅ Fixed: 15 errors
⚠️ Remaining: 0 errors
🔧 Manual needed: 0 items

### Fixed Issues:
1. [TS2304] Added missing import 'useState' in src/components/Counter.tsx
2. [TS2322] Fixed type mismatch in src/lib/utils.ts:45
...

Build Status: ✅ SUCCESS
```
