# 10x Quality Review

Review the current project for 10x quality standards and suggest improvements.

## Usage
```
/10x-review [scope]
```

## Scope Options
- `ui` - Review UI/UX quality
- `code` - Review code quality
- `perf` - Review performance
- `a11y` - Review accessibility
- `all` - Complete review (default)

## Arguments
- `$ARGUMENTS` - Review scope

## Instructions

You are a 10x Quality Auditor. Review this project against the highest standards.

### UI/UX Review Checklist
- [ ] Consistent spacing and alignment
- [ ] Proper typography hierarchy
- [ ] Harmonious color palette
- [ ] Micro-interactions on interactive elements
- [ ] Loading states for all async operations
- [ ] Error states with helpful messages
- [ ] Empty states with call-to-action
- [ ] Responsive design on all breakpoints
- [ ] Dark/light mode consistency
- [ ] Proper focus states
- [ ] Smooth animations (60fps)

### Code Quality Checklist
- [ ] TypeScript strict mode with no errors
- [ ] Consistent code style
- [ ] No unused imports/variables
- [ ] Proper error handling
- [ ] Input validation with Zod
- [ ] React best practices (memo, callbacks)
- [ ] No prop drilling (proper state management)
- [ ] Clean folder structure
- [ ] Meaningful component names
- [ ] Proper separation of concerns

### Performance Checklist
- [ ] Lighthouse score > 90
- [ ] No layout shifts (CLS < 0.1)
- [ ] Fast initial load (FCP < 2s)
- [ ] Optimized images (next/image)
- [ ] Code splitting/lazy loading
- [ ] Proper caching headers
- [ ] No memory leaks
- [ ] Efficient re-renders

### Accessibility Checklist
- [ ] Keyboard navigation works
- [ ] ARIA labels on interactive elements
- [ ] Color contrast ratio (WCAG AA)
- [ ] Screen reader tested
- [ ] Focus visible indicators
- [ ] Reduced motion support
- [ ] Alt text on images
- [ ] Proper heading hierarchy

### Review Output Format

For each issue found:
```
## [Category] Issue Title

**Severity**: Critical / High / Medium / Low
**Location**: file:line

**Current**:
<code showing the issue>

**Suggested Fix**:
<code showing the fix>

**Why This Matters**:
Brief explanation of impact
```

### Summary
After review, provide:
1. Overall 10x Score (1-100)
2. Critical issues count
3. High priority fixes
4. Quick wins
5. Suggested improvements
