# Premium UI Components

This directory contains premium, 10x quality UI components for the autonomous app builder.

## Available Components

### Layout Components
- `premium-sidebar.tsx` - Collapsible sidebar with animations
- `premium-header.tsx` - Header with search, notifications, user menu
- `premium-footer.tsx` - Footer with links and social icons
- `app-shell.tsx` - Complete app shell combining all layout pieces

### Input Components
- `premium-button.tsx` - Buttons with variants, loading, icons
- `premium-input.tsx` - Input with validation states, icons
- `premium-select.tsx` - Custom select with search
- `premium-textarea.tsx` - Textarea with character count
- `premium-checkbox.tsx` - Animated checkbox
- `premium-switch.tsx` - Toggle switch with labels
- `premium-slider.tsx` - Range slider with markers
- `premium-file-upload.tsx` - Drag & drop file upload

### Display Components
- `animated-card.tsx` - Cards with hover effects
- `stats-card.tsx` - Stats with sparklines
- `avatar.tsx` - Avatar with status indicator
- `badge.tsx` - Status badges
- `progress.tsx` - Progress bars and circles
- `skeleton.tsx` - Loading skeletons
- `empty-state.tsx` - Empty state illustrations

### Feedback Components
- `toast.tsx` - Toast notifications
- `alert.tsx` - Alert banners
- `modal.tsx` - Modal dialogs
- `drawer.tsx` - Slide-out drawers
- `tooltip.tsx` - Tooltips with animations
- `popover.tsx` - Popovers

### Data Components
- `data-table.tsx` - Advanced data table
- `chart-card.tsx` - Chart containers
- `list-item.tsx` - List with actions
- `timeline.tsx` - Activity timeline

### Navigation Components
- `nav-link.tsx` - Animated nav links
- `breadcrumb.tsx` - Breadcrumb trail
- `tabs.tsx` - Tab navigation
- `pagination.tsx` - Pagination controls

## Usage

Import components in your app:

```tsx
import { PremiumButton } from '@/components/premium/premium-button'
import { AnimatedCard } from '@/components/premium/animated-card'
import { StatsCard } from '@/components/premium/stats-card'
```

## Design Principles

1. **10x Quality**: Every component is crafted with exceptional attention to detail
2. **Accessibility**: Full keyboard navigation and screen reader support
3. **Performance**: Optimized rendering with minimal re-renders
4. **Customization**: Extensive variant props and CSS variables
5. **Animation**: Smooth micro-interactions using Framer Motion
6. **Responsive**: Mobile-first design approach
7. **Dark Mode**: Full dark/light mode support
