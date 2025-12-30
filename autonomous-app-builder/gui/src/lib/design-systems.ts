/**
 * Design Systems - Unique UI/UX specifications for each template type
 * Each template has completely different: colors, typography, spacing, icons, patterns
 */

export interface DesignSystem {
  id: string
  name: string

  // Color Palette
  colors: {
    primary: string
    primaryLight: string
    primaryDark: string
    secondary: string
    accent: string
    background: string
    backgroundAlt: string
    surface: string
    surfaceHover: string
    text: string
    textMuted: string
    textLight: string
    border: string
    success: string
    warning: string
    error: string
    info: string
    gradient: string
    gradientText: string
  }

  // Typography
  typography: {
    fontFamily: {
      heading: string
      body: string
      mono: string
    }
    fontSize: {
      xs: string
      sm: string
      base: string
      lg: string
      xl: string
      '2xl': string
      '3xl': string
      '4xl': string
      '5xl': string
      '6xl': string
    }
    fontWeight: {
      light: number
      normal: number
      medium: number
      semibold: number
      bold: number
      extrabold: number
    }
    lineHeight: {
      tight: string
      normal: string
      relaxed: string
    }
    letterSpacing: {
      tight: string
      normal: string
      wide: string
    }
  }

  // Spacing System
  spacing: {
    unit: number // base unit in px
    scale: number[] // multipliers
    containerPadding: string
    sectionGap: string
    cardPadding: string
    inputPadding: string
  }

  // Border Radius
  borderRadius: {
    none: string
    sm: string
    md: string
    lg: string
    xl: string
    '2xl': string
    full: string
  }

  // Shadows
  shadows: {
    sm: string
    md: string
    lg: string
    xl: string
    inner: string
    glow: string
  }

  // Animation & Transitions
  animation: {
    duration: {
      fast: string
      normal: string
      slow: string
    }
    easing: {
      default: string
      in: string
      out: string
      inOut: string
      bounce: string
    }
    hover: string
    focus: string
  }

  // Layout Pattern
  layout: {
    skimmingPattern: 'F-pattern' | 'Z-pattern' | 'Gutenberg' | 'Center-focus' | 'Card-grid'
    maxWidth: string
    gridColumns: number
    sidebarWidth: string
    headerHeight: string
  }

  // Icon Style
  iconStyle: {
    library: 'lucide' | 'heroicons' | 'phosphor' | 'feather' | 'tabler'
    strokeWidth: number
    defaultSize: string
    style: 'outline' | 'solid' | 'duotone'
  }

  // Component Variants
  components: {
    button: {
      style: 'rounded' | 'pill' | 'square' | 'soft'
      size: 'compact' | 'normal' | 'large'
      shadow: boolean
      gradient: boolean
    }
    card: {
      style: 'flat' | 'elevated' | 'bordered' | 'glass'
      hover: 'lift' | 'glow' | 'border' | 'scale' | 'none'
    }
    input: {
      style: 'underline' | 'bordered' | 'filled' | 'floating'
      focus: 'ring' | 'border' | 'glow' | 'underline'
    }
    navigation: {
      style: 'fixed' | 'sticky' | 'transparent' | 'solid'
      position: 'top' | 'side' | 'bottom'
    }
  }

  // Dark Mode Adjustments
  darkMode: {
    background: string
    surface: string
    text: string
    border: string
  }
}

// ============================================================================
// SAAS PLATFORM - Professional, Trust-building, Clean
// ============================================================================
export const saasDesign: DesignSystem = {
  id: 'saas',
  name: 'SaaS Platform',
  colors: {
    primary: '#6366F1', // Indigo
    primaryLight: '#818CF8',
    primaryDark: '#4F46E5',
    secondary: '#0EA5E9', // Sky blue
    accent: '#F59E0B', // Amber for CTAs
    background: '#FAFBFC',
    backgroundAlt: '#F1F5F9',
    surface: '#FFFFFF',
    surfaceHover: '#F8FAFC',
    text: '#0F172A',
    textMuted: '#64748B',
    textLight: '#94A3B8',
    border: '#E2E8F0',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    gradient: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A855F7 100%)',
    gradientText: 'linear-gradient(135deg, #6366F1, #A855F7)',
  },
  typography: {
    fontFamily: {
      heading: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      body: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      mono: '"JetBrains Mono", "Fira Code", monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
    },
    fontWeight: { light: 300, normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 },
    lineHeight: { tight: '1.25', normal: '1.5', relaxed: '1.75' },
    letterSpacing: { tight: '-0.025em', normal: '0', wide: '0.025em' },
  },
  spacing: {
    unit: 4,
    scale: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64],
    containerPadding: '2rem',
    sectionGap: '5rem',
    cardPadding: '1.5rem',
    inputPadding: '0.75rem 1rem',
  },
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    glow: '0 0 20px rgba(99, 102, 241, 0.3)',
  },
  animation: {
    duration: { fast: '150ms', normal: '300ms', slow: '500ms' },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
    hover: 'transform 0.2s ease, box-shadow 0.2s ease',
    focus: 'ring 0.15s ease-out',
  },
  layout: {
    skimmingPattern: 'F-pattern',
    maxWidth: '1280px',
    gridColumns: 12,
    sidebarWidth: '280px',
    headerHeight: '64px',
  },
  iconStyle: {
    library: 'lucide',
    strokeWidth: 2,
    defaultSize: '20px',
    style: 'outline',
  },
  components: {
    button: { style: 'rounded', size: 'normal', shadow: true, gradient: false },
    card: { style: 'elevated', hover: 'lift' },
    input: { style: 'bordered', focus: 'ring' },
    navigation: { style: 'fixed', position: 'top' },
  },
  darkMode: {
    background: '#0F172A',
    surface: '#1E293B',
    text: '#F1F5F9',
    border: '#334155',
  },
}

// ============================================================================
// E-COMMERCE - Warm, Inviting, Conversion-focused
// ============================================================================
export const ecommerceDesign: DesignSystem = {
  id: 'ecommerce',
  name: 'E-Commerce Store',
  colors: {
    primary: '#FF6B35', // Vibrant Orange
    primaryLight: '#FF8F66',
    primaryDark: '#E85A28',
    secondary: '#1A1A2E', // Deep navy
    accent: '#16C172', // Mint green for deals/savings
    background: '#FFFCF9', // Warm white
    backgroundAlt: '#FFF5EE',
    surface: '#FFFFFF',
    surfaceHover: '#FFF8F3',
    text: '#1A1A2E',
    textMuted: '#6B7280',
    textLight: '#9CA3AF',
    border: '#F3E8E2',
    success: '#16C172',
    warning: '#FBBF24',
    error: '#DC2626',
    info: '#0EA5E9',
    gradient: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
    gradientText: 'linear-gradient(90deg, #FF6B35, #F7931E)',
  },
  typography: {
    fontFamily: {
      heading: '"Poppins", -apple-system, BlinkMacSystemFont, sans-serif',
      body: '"DM Sans", -apple-system, BlinkMacSystemFont, sans-serif',
      mono: '"IBM Plex Mono", monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '2rem',
      '4xl': '2.5rem',
      '5xl': '3.5rem',
      '6xl': '4.5rem',
    },
    fontWeight: { light: 300, normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 },
    lineHeight: { tight: '1.2', normal: '1.6', relaxed: '1.8' },
    letterSpacing: { tight: '-0.02em', normal: '0', wide: '0.05em' },
  },
  spacing: {
    unit: 4,
    scale: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64],
    containerPadding: '1.5rem',
    sectionGap: '4rem',
    cardPadding: '1.25rem',
    inputPadding: '0.875rem 1.25rem',
  },
  borderRadius: {
    none: '0',
    sm: '0.375rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.25rem',
    '2xl': '2rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 2px 4px rgba(26, 26, 46, 0.06)',
    md: '0 4px 12px rgba(26, 26, 46, 0.08)',
    lg: '0 8px 24px rgba(26, 26, 46, 0.12)',
    xl: '0 16px 48px rgba(26, 26, 46, 0.16)',
    inner: 'inset 0 2px 4px rgba(26, 26, 46, 0.05)',
    glow: '0 0 30px rgba(255, 107, 53, 0.25)',
  },
  animation: {
    duration: { fast: '200ms', normal: '350ms', slow: '600ms' },
    easing: {
      default: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      in: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
      out: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      inOut: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
      bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
    hover: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
    focus: 'box-shadow 0.2s ease',
  },
  layout: {
    skimmingPattern: 'Z-pattern',
    maxWidth: '1440px',
    gridColumns: 12,
    sidebarWidth: '300px',
    headerHeight: '72px',
  },
  iconStyle: {
    library: 'phosphor',
    strokeWidth: 1.5,
    defaultSize: '24px',
    style: 'duotone',
  },
  components: {
    button: { style: 'pill', size: 'large', shadow: true, gradient: true },
    card: { style: 'bordered', hover: 'scale' },
    input: { style: 'filled', focus: 'border' },
    navigation: { style: 'sticky', position: 'top' },
  },
  darkMode: {
    background: '#1A1A2E',
    surface: '#252542',
    text: '#F9FAFB',
    border: '#3D3D5C',
  },
}

// ============================================================================
// SOCIAL PLATFORM - Fun, Engaging, Expressive
// ============================================================================
export const socialDesign: DesignSystem = {
  id: 'social',
  name: 'Social Platform',
  colors: {
    primary: '#EC4899', // Pink
    primaryLight: '#F472B6',
    primaryDark: '#DB2777',
    secondary: '#8B5CF6', // Purple
    accent: '#06B6D4', // Cyan
    background: '#FAFAFA',
    backgroundAlt: '#F5F5F5',
    surface: '#FFFFFF',
    surfaceHover: '#FAFAFA',
    text: '#18181B',
    textMuted: '#71717A',
    textLight: '#A1A1AA',
    border: '#E4E4E7',
    success: '#22C55E',
    warning: '#EAB308',
    error: '#EF4444',
    info: '#3B82F6',
    gradient: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 50%, #06B6D4 100%)',
    gradientText: 'linear-gradient(90deg, #EC4899, #8B5CF6, #06B6D4)',
  },
  typography: {
    fontFamily: {
      heading: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif',
      body: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif',
      mono: '"Source Code Pro", monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.8125rem',
      base: '0.9375rem',
      lg: '1.0625rem',
      xl: '1.1875rem',
      '2xl': '1.375rem',
      '3xl': '1.75rem',
      '4xl': '2.125rem',
      '5xl': '2.75rem',
      '6xl': '3.5rem',
    },
    fontWeight: { light: 300, normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 },
    lineHeight: { tight: '1.3', normal: '1.55', relaxed: '1.7' },
    letterSpacing: { tight: '-0.01em', normal: '0', wide: '0.02em' },
  },
  spacing: {
    unit: 4,
    scale: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 40, 48],
    containerPadding: '1rem',
    sectionGap: '2rem',
    cardPadding: '1rem',
    inputPadding: '0.625rem 1rem',
  },
  borderRadius: {
    none: '0',
    sm: '0.5rem',
    md: '0.875rem',
    lg: '1.25rem',
    xl: '1.5rem',
    '2xl': '2rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.08)',
    md: '0 4px 8px rgba(0, 0, 0, 0.08)',
    lg: '0 8px 16px rgba(0, 0, 0, 0.1)',
    xl: '0 16px 32px rgba(0, 0, 0, 0.12)',
    inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.04)',
    glow: '0 0 24px rgba(236, 72, 153, 0.4)',
  },
  animation: {
    duration: { fast: '150ms', normal: '250ms', slow: '400ms' },
    easing: {
      default: 'cubic-bezier(0.2, 0, 0, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
    hover: 'transform 0.15s ease, opacity 0.15s ease',
    focus: 'box-shadow 0.1s ease-out',
  },
  layout: {
    skimmingPattern: 'Center-focus',
    maxWidth: '680px',
    gridColumns: 1,
    sidebarWidth: '320px',
    headerHeight: '56px',
  },
  iconStyle: {
    library: 'lucide',
    strokeWidth: 2.5,
    defaultSize: '22px',
    style: 'outline',
  },
  components: {
    button: { style: 'pill', size: 'compact', shadow: false, gradient: true },
    card: { style: 'flat', hover: 'glow' },
    input: { style: 'bordered', focus: 'glow' },
    navigation: { style: 'solid', position: 'bottom' },
  },
  darkMode: {
    background: '#18181B',
    surface: '#27272A',
    text: '#FAFAFA',
    border: '#3F3F46',
  },
}

// ============================================================================
// AI APPLICATION - Futuristic, Technical, Sleek
// ============================================================================
export const aiAppDesign: DesignSystem = {
  id: 'ai-app',
  name: 'AI Application',
  colors: {
    primary: '#00D9FF', // Electric cyan
    primaryLight: '#5CE5FF',
    primaryDark: '#00B8D9',
    secondary: '#7C3AED', // Vivid purple
    accent: '#00FF88', // Matrix green
    background: '#0A0A0F', // Near black
    backgroundAlt: '#12121A',
    surface: '#1A1A24',
    surfaceHover: '#22222E',
    text: '#EAEAF0',
    textMuted: '#8888A0',
    textLight: '#5C5C70',
    border: '#2A2A38',
    success: '#00FF88',
    warning: '#FFB800',
    error: '#FF3366',
    info: '#00D9FF',
    gradient: 'linear-gradient(135deg, #00D9FF 0%, #7C3AED 50%, #FF00AA 100%)',
    gradientText: 'linear-gradient(90deg, #00D9FF, #7C3AED)',
  },
  typography: {
    fontFamily: {
      heading: '"Space Grotesk", -apple-system, BlinkMacSystemFont, sans-serif',
      body: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      mono: '"JetBrains Mono", "Fira Code", monospace',
    },
    fontSize: {
      xs: '0.6875rem',
      sm: '0.8125rem',
      base: '0.9375rem',
      lg: '1.0625rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.5rem',
      '5xl': '3.25rem',
      '6xl': '4rem',
    },
    fontWeight: { light: 300, normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 },
    lineHeight: { tight: '1.2', normal: '1.5', relaxed: '1.65' },
    letterSpacing: { tight: '-0.03em', normal: '-0.01em', wide: '0.05em' },
  },
  spacing: {
    unit: 4,
    scale: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64, 80],
    containerPadding: '1.5rem',
    sectionGap: '4rem',
    cardPadding: '1.25rem',
    inputPadding: '0.75rem 1rem',
  },
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.25rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 2px 8px rgba(0, 217, 255, 0.05)',
    md: '0 4px 16px rgba(0, 217, 255, 0.08)',
    lg: '0 8px 32px rgba(0, 217, 255, 0.1)',
    xl: '0 16px 48px rgba(0, 217, 255, 0.15)',
    inner: 'inset 0 1px 2px rgba(0, 0, 0, 0.3)',
    glow: '0 0 40px rgba(0, 217, 255, 0.3)',
  },
  animation: {
    duration: { fast: '100ms', normal: '200ms', slow: '400ms' },
    easing: {
      default: 'cubic-bezier(0.16, 1, 0.3, 1)',
      in: 'cubic-bezier(0.55, 0, 1, 0.45)',
      out: 'cubic-bezier(0, 0.55, 0.45, 1)',
      inOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
      bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
    hover: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
    focus: 'box-shadow 0.1s ease',
  },
  layout: {
    skimmingPattern: 'F-pattern',
    maxWidth: '1400px',
    gridColumns: 12,
    sidebarWidth: '320px',
    headerHeight: '60px',
  },
  iconStyle: {
    library: 'lucide',
    strokeWidth: 1.5,
    defaultSize: '18px',
    style: 'outline',
  },
  components: {
    button: { style: 'square', size: 'compact', shadow: true, gradient: false },
    card: { style: 'glass', hover: 'glow' },
    input: { style: 'underline', focus: 'glow' },
    navigation: { style: 'transparent', position: 'side' },
  },
  darkMode: {
    background: '#0A0A0F',
    surface: '#1A1A24',
    text: '#EAEAF0',
    border: '#2A2A38',
  },
}

// ============================================================================
// ADMIN DASHBOARD - Clean, Data-focused, Professional
// ============================================================================
export const dashboardDesign: DesignSystem = {
  id: 'dashboard',
  name: 'Admin Dashboard',
  colors: {
    primary: '#059669', // Emerald
    primaryLight: '#34D399',
    primaryDark: '#047857',
    secondary: '#0F172A', // Slate
    accent: '#F97316', // Orange for alerts
    background: '#F8FAFC',
    backgroundAlt: '#F1F5F9',
    surface: '#FFFFFF',
    surfaceHover: '#F8FAFC',
    text: '#0F172A',
    textMuted: '#475569',
    textLight: '#94A3B8',
    border: '#E2E8F0',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#0EA5E9',
    gradient: 'linear-gradient(135deg, #059669 0%, #0EA5E9 100%)',
    gradientText: 'linear-gradient(90deg, #059669, #0EA5E9)',
  },
  typography: {
    fontFamily: {
      heading: '"Geist", "Inter", -apple-system, sans-serif',
      body: '"Geist", "Inter", -apple-system, sans-serif',
      mono: '"Geist Mono", "JetBrains Mono", monospace',
    },
    fontSize: {
      xs: '0.6875rem',
      sm: '0.8125rem',
      base: '0.875rem',
      lg: '1rem',
      xl: '1.125rem',
      '2xl': '1.25rem',
      '3xl': '1.5rem',
      '4xl': '1.875rem',
      '5xl': '2.25rem',
      '6xl': '3rem',
    },
    fontWeight: { light: 300, normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 },
    lineHeight: { tight: '1.25', normal: '1.5', relaxed: '1.625' },
    letterSpacing: { tight: '-0.02em', normal: '0', wide: '0.025em' },
  },
  spacing: {
    unit: 4,
    scale: [0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40],
    containerPadding: '1.5rem',
    sectionGap: '1.5rem',
    cardPadding: '1.25rem',
    inputPadding: '0.5rem 0.75rem',
  },
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.04)',
    md: '0 2px 4px rgba(0, 0, 0, 0.06)',
    lg: '0 4px 8px rgba(0, 0, 0, 0.08)',
    xl: '0 8px 16px rgba(0, 0, 0, 0.1)',
    inner: 'inset 0 1px 2px rgba(0, 0, 0, 0.04)',
    glow: '0 0 16px rgba(5, 150, 105, 0.2)',
  },
  animation: {
    duration: { fast: '100ms', normal: '150ms', slow: '250ms' },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
    hover: 'background-color 0.1s ease',
    focus: 'outline 0.1s ease',
  },
  layout: {
    skimmingPattern: 'Gutenberg',
    maxWidth: '1600px',
    gridColumns: 12,
    sidebarWidth: '240px',
    headerHeight: '56px',
  },
  iconStyle: {
    library: 'lucide',
    strokeWidth: 2,
    defaultSize: '16px',
    style: 'outline',
  },
  components: {
    button: { style: 'rounded', size: 'compact', shadow: false, gradient: false },
    card: { style: 'bordered', hover: 'border' },
    input: { style: 'bordered', focus: 'ring' },
    navigation: { style: 'solid', position: 'side' },
  },
  darkMode: {
    background: '#0F172A',
    surface: '#1E293B',
    text: '#F1F5F9',
    border: '#334155',
  },
}

// ============================================================================
// REACT WEB APP - Modern, Minimal, Clean
// ============================================================================
export const reactWebAppDesign: DesignSystem = {
  id: 'react-webapp',
  name: 'React Web App',
  colors: {
    primary: '#2563EB', // Royal blue
    primaryLight: '#60A5FA',
    primaryDark: '#1D4ED8',
    secondary: '#475569',
    accent: '#14B8A6', // Teal
    background: '#FFFFFF',
    backgroundAlt: '#F9FAFB',
    surface: '#FFFFFF',
    surfaceHover: '#F3F4F6',
    text: '#111827',
    textMuted: '#6B7280',
    textLight: '#9CA3AF',
    border: '#E5E7EB',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    gradient: 'linear-gradient(135deg, #2563EB 0%, #14B8A6 100%)',
    gradientText: 'linear-gradient(90deg, #2563EB, #14B8A6)',
  },
  typography: {
    fontFamily: {
      heading: '"Outfit", -apple-system, BlinkMacSystemFont, sans-serif',
      body: '"Outfit", -apple-system, BlinkMacSystemFont, sans-serif',
      mono: '"Fira Code", monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
    },
    fontWeight: { light: 300, normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 },
    lineHeight: { tight: '1.25', normal: '1.5', relaxed: '1.75' },
    letterSpacing: { tight: '-0.025em', normal: '0', wide: '0.025em' },
  },
  spacing: {
    unit: 4,
    scale: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64],
    containerPadding: '1.5rem',
    sectionGap: '3rem',
    cardPadding: '1.5rem',
    inputPadding: '0.75rem 1rem',
  },
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.07)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
    inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
    glow: '0 0 20px rgba(37, 99, 235, 0.25)',
  },
  animation: {
    duration: { fast: '150ms', normal: '300ms', slow: '500ms' },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
    hover: 'all 0.2s ease',
    focus: 'ring 0.15s ease-out',
  },
  layout: {
    skimmingPattern: 'F-pattern',
    maxWidth: '1200px',
    gridColumns: 12,
    sidebarWidth: '260px',
    headerHeight: '64px',
  },
  iconStyle: {
    library: 'heroicons',
    strokeWidth: 2,
    defaultSize: '20px',
    style: 'outline',
  },
  components: {
    button: { style: 'rounded', size: 'normal', shadow: false, gradient: false },
    card: { style: 'elevated', hover: 'lift' },
    input: { style: 'bordered', focus: 'ring' },
    navigation: { style: 'sticky', position: 'top' },
  },
  darkMode: {
    background: '#111827',
    surface: '#1F2937',
    text: '#F9FAFB',
    border: '#374151',
  },
}

// ============================================================================
// NEXT.JS WEBSITE/LANDING PAGE - Bold, Impressive, Conversion
// ============================================================================
export const nextjsWebsiteDesign: DesignSystem = {
  id: 'nextjs-website',
  name: 'Landing Page & Website',
  colors: {
    primary: '#8B5CF6', // Violet
    primaryLight: '#A78BFA',
    primaryDark: '#7C3AED',
    secondary: '#06B6D4', // Cyan
    accent: '#F43F5E', // Rose for CTAs
    background: '#FAFAFA',
    backgroundAlt: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceHover: '#F5F5F5',
    text: '#171717',
    textMuted: '#525252',
    textLight: '#A3A3A3',
    border: '#E5E5E5',
    success: '#22C55E',
    warning: '#EAB308',
    error: '#EF4444',
    info: '#06B6D4',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 50%, #F43F5E 100%)',
    gradientText: 'linear-gradient(90deg, #8B5CF6, #F43F5E)',
  },
  typography: {
    fontFamily: {
      heading: '"Cabinet Grotesk", "Clash Display", -apple-system, sans-serif',
      body: '"Satoshi", "Inter", -apple-system, sans-serif',
      mono: '"JetBrains Mono", monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1.0625rem',
      lg: '1.1875rem',
      xl: '1.375rem',
      '2xl': '1.75rem',
      '3xl': '2.25rem',
      '4xl': '3rem',
      '5xl': '4rem',
      '6xl': '5.5rem',
    },
    fontWeight: { light: 300, normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 },
    lineHeight: { tight: '1.1', normal: '1.5', relaxed: '1.75' },
    letterSpacing: { tight: '-0.04em', normal: '-0.01em', wide: '0.025em' },
  },
  spacing: {
    unit: 4,
    scale: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 48, 64, 80, 96],
    containerPadding: '2rem',
    sectionGap: '8rem',
    cardPadding: '2rem',
    inputPadding: '1rem 1.5rem',
  },
  borderRadius: {
    none: '0',
    sm: '0.375rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    '2xl': '2rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 2px 4px rgba(0, 0, 0, 0.04)',
    md: '0 8px 16px rgba(0, 0, 0, 0.08)',
    lg: '0 16px 32px rgba(0, 0, 0, 0.1)',
    xl: '0 24px 48px rgba(0, 0, 0, 0.12)',
    inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.04)',
    glow: '0 0 60px rgba(139, 92, 246, 0.3)',
  },
  animation: {
    duration: { fast: '200ms', normal: '400ms', slow: '700ms' },
    easing: {
      default: 'cubic-bezier(0.16, 1, 0.3, 1)',
      in: 'cubic-bezier(0.55, 0, 1, 0.45)',
      out: 'cubic-bezier(0, 0.55, 0.45, 1)',
      inOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
      bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
    hover: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    focus: 'box-shadow 0.2s ease-out',
  },
  layout: {
    skimmingPattern: 'Z-pattern',
    maxWidth: '1400px',
    gridColumns: 12,
    sidebarWidth: '0px',
    headerHeight: '80px',
  },
  iconStyle: {
    library: 'lucide',
    strokeWidth: 2,
    defaultSize: '24px',
    style: 'outline',
  },
  components: {
    button: { style: 'pill', size: 'large', shadow: true, gradient: true },
    card: { style: 'glass', hover: 'lift' },
    input: { style: 'bordered', focus: 'glow' },
    navigation: { style: 'transparent', position: 'top' },
  },
  darkMode: {
    background: '#0A0A0A',
    surface: '#171717',
    text: '#FAFAFA',
    border: '#262626',
  },
}

// ============================================================================
// FLUTTER MOBILE APP - Native, Touch-friendly, Gesture-based
// ============================================================================
export const flutterMobileDesign: DesignSystem = {
  id: 'flutter-mobile',
  name: 'Flutter Mobile App',
  colors: {
    primary: '#0066FF', // iOS-inspired blue
    primaryLight: '#4D94FF',
    primaryDark: '#0052CC',
    secondary: '#FF9500', // Orange
    accent: '#34C759', // iOS green
    background: '#F2F2F7', // iOS system gray
    backgroundAlt: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceHover: '#F2F2F7',
    text: '#000000',
    textMuted: '#8E8E93',
    textLight: '#C7C7CC',
    border: '#C6C6C8',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    info: '#5AC8FA',
    gradient: 'linear-gradient(135deg, #0066FF 0%, #5856D6 100%)',
    gradientText: 'linear-gradient(90deg, #0066FF, #5856D6)',
  },
  typography: {
    fontFamily: {
      heading: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
      body: '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
      mono: '"SF Mono", "Menlo", monospace',
    },
    fontSize: {
      xs: '0.6875rem', // 11px
      sm: '0.8125rem', // 13px
      base: '1.0625rem', // 17px - iOS body
      lg: '1.25rem', // 20px
      xl: '1.375rem', // 22px
      '2xl': '1.5rem', // 24px
      '3xl': '1.75rem', // 28px
      '4xl': '2.125rem', // 34px - Large title
      '5xl': '2.5rem',
      '6xl': '3rem',
    },
    fontWeight: { light: 300, normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 },
    lineHeight: { tight: '1.2', normal: '1.4', relaxed: '1.6' },
    letterSpacing: { tight: '0.01em', normal: '0.02em', wide: '0.04em' },
  },
  spacing: {
    unit: 4,
    scale: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64],
    containerPadding: '1rem',
    sectionGap: '1.5rem',
    cardPadding: '1rem',
    inputPadding: '0.875rem 1rem',
  },
  borderRadius: {
    none: '0',
    sm: '0.375rem',
    md: '0.625rem',
    lg: '0.875rem', // iOS standard
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.08)',
    md: '0 2px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 4px 12px rgba(0, 0, 0, 0.12)',
    xl: '0 8px 24px rgba(0, 0, 0, 0.15)',
    inner: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)',
    glow: '0 0 20px rgba(0, 102, 255, 0.25)',
  },
  animation: {
    duration: { fast: '100ms', normal: '250ms', slow: '400ms' },
    easing: {
      default: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      in: 'cubic-bezier(0.42, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.58, 1)',
      inOut: 'cubic-bezier(0.42, 0, 0.58, 1)',
      bounce: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
    hover: 'opacity 0.15s ease',
    focus: 'none',
  },
  layout: {
    skimmingPattern: 'Center-focus',
    maxWidth: '428px', // iPhone 14 Pro Max
    gridColumns: 1,
    sidebarWidth: '0px',
    headerHeight: '44px',
  },
  iconStyle: {
    library: 'lucide',
    strokeWidth: 2,
    defaultSize: '22px',
    style: 'outline',
  },
  components: {
    button: { style: 'rounded', size: 'large', shadow: false, gradient: false },
    card: { style: 'flat', hover: 'none' },
    input: { style: 'filled', focus: 'border' },
    navigation: { style: 'solid', position: 'bottom' },
  },
  darkMode: {
    background: '#000000',
    surface: '#1C1C1E',
    text: '#FFFFFF',
    border: '#38383A',
  },
}

// ============================================================================
// INTERNAL TOOL - Functional, Dense, Efficient
// ============================================================================
export const internalToolDesign: DesignSystem = {
  id: 'internal-tool',
  name: 'Internal Tool',
  colors: {
    primary: '#3B82F6', // Blue
    primaryLight: '#60A5FA',
    primaryDark: '#2563EB',
    secondary: '#64748B',
    accent: '#F97316', // Warning orange
    background: '#F8FAFC',
    backgroundAlt: '#F1F5F9',
    surface: '#FFFFFF',
    surfaceHover: '#F8FAFC',
    text: '#1E293B',
    textMuted: '#64748B',
    textLight: '#94A3B8',
    border: '#CBD5E1',
    success: '#22C55E',
    warning: '#F97316',
    error: '#DC2626',
    info: '#0EA5E9',
    gradient: 'linear-gradient(90deg, #3B82F6 0%, #0EA5E9 100%)',
    gradientText: 'linear-gradient(90deg, #3B82F6, #0EA5E9)',
  },
  typography: {
    fontFamily: {
      heading: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      body: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      mono: '"JetBrains Mono", "Consolas", monospace',
    },
    fontSize: {
      xs: '0.6875rem', // 11px
      sm: '0.75rem', // 12px
      base: '0.8125rem', // 13px - Dense UI
      lg: '0.875rem', // 14px
      xl: '1rem', // 16px
      '2xl': '1.125rem', // 18px
      '3xl': '1.25rem', // 20px
      '4xl': '1.5rem', // 24px
      '5xl': '1.875rem',
      '6xl': '2.25rem',
    },
    fontWeight: { light: 300, normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 },
    lineHeight: { tight: '1.25', normal: '1.4', relaxed: '1.5' },
    letterSpacing: { tight: '0', normal: '0', wide: '0.025em' },
  },
  spacing: {
    unit: 4,
    scale: [0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40],
    containerPadding: '1rem',
    sectionGap: '1rem',
    cardPadding: '0.75rem',
    inputPadding: '0.375rem 0.5rem',
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    md: '0.25rem',
    lg: '0.375rem',
    xl: '0.5rem',
    '2xl': '0.75rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.04)',
    md: '0 2px 4px rgba(0, 0, 0, 0.06)',
    lg: '0 4px 8px rgba(0, 0, 0, 0.08)',
    xl: '0 8px 16px rgba(0, 0, 0, 0.1)',
    inner: 'inset 0 1px 2px rgba(0, 0, 0, 0.04)',
    glow: '0 0 8px rgba(59, 130, 246, 0.2)',
  },
  animation: {
    duration: { fast: '75ms', normal: '100ms', slow: '150ms' },
    easing: {
      default: 'ease-out',
      in: 'ease-in',
      out: 'ease-out',
      inOut: 'ease-in-out',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
    hover: 'background-color 0.075s ease',
    focus: 'outline 0.05s ease',
  },
  layout: {
    skimmingPattern: 'Card-grid',
    maxWidth: '1920px',
    gridColumns: 12,
    sidebarWidth: '200px',
    headerHeight: '48px',
  },
  iconStyle: {
    library: 'lucide',
    strokeWidth: 2,
    defaultSize: '14px',
    style: 'outline',
  },
  components: {
    button: { style: 'square', size: 'compact', shadow: false, gradient: false },
    card: { style: 'bordered', hover: 'none' },
    input: { style: 'bordered', focus: 'border' },
    navigation: { style: 'solid', position: 'side' },
  },
  darkMode: {
    background: '#0F172A',
    surface: '#1E293B',
    text: '#F1F5F9',
    border: '#334155',
  },
}

// ============================================================================
// DESIGN SYSTEM REGISTRY
// ============================================================================
export const designSystems: Record<string, DesignSystem> = {
  saas: saasDesign,
  ecommerce: ecommerceDesign,
  social: socialDesign,
  'ai-app': aiAppDesign,
  dashboard: dashboardDesign,
  'react-webapp': reactWebAppDesign,
  'nextjs-website': nextjsWebsiteDesign,
  'flutter-mobile': flutterMobileDesign,
  'internal-tool': internalToolDesign,
}

export function getDesignSystem(templateId: string): DesignSystem {
  return designSystems[templateId] || saasDesign
}

// ============================================================================
// TAILWIND CONFIG GENERATOR
// ============================================================================
export function generateTailwindConfig(design: DesignSystem): string {
  return `import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "${design.colors.primary}",
          light: "${design.colors.primaryLight}",
          dark: "${design.colors.primaryDark}",
        },
        secondary: "${design.colors.secondary}",
        accent: "${design.colors.accent}",
        background: "${design.colors.background}",
        "background-alt": "${design.colors.backgroundAlt}",
        surface: "${design.colors.surface}",
        "surface-hover": "${design.colors.surfaceHover}",
        foreground: "${design.colors.text}",
        muted: "${design.colors.textMuted}",
        "muted-light": "${design.colors.textLight}",
        border: "${design.colors.border}",
        success: "${design.colors.success}",
        warning: "${design.colors.warning}",
        error: "${design.colors.error}",
        info: "${design.colors.info}",
      },
      fontFamily: {
        heading: ['${design.typography.fontFamily.heading.split(',')[0].replace(/"/g, '')}', 'sans-serif'],
        body: ['${design.typography.fontFamily.body.split(',')[0].replace(/"/g, '')}', 'sans-serif'],
        mono: ['${design.typography.fontFamily.mono.split(',')[0].replace(/"/g, '')}', 'monospace'],
      },
      fontSize: ${JSON.stringify(design.typography.fontSize, null, 8).replace(/\n/g, '\n      ')},
      borderRadius: ${JSON.stringify(design.borderRadius, null, 8).replace(/\n/g, '\n      ')},
      boxShadow: {
        sm: "${design.shadows.sm}",
        md: "${design.shadows.md}",
        lg: "${design.shadows.lg}",
        xl: "${design.shadows.xl}",
        inner: "${design.shadows.inner}",
        glow: "${design.shadows.glow}",
      },
      transitionDuration: {
        fast: "${design.animation.duration.fast}",
        normal: "${design.animation.duration.normal}",
        slow: "${design.animation.duration.slow}",
      },
      transitionTimingFunction: {
        DEFAULT: "${design.animation.easing.default}",
        in: "${design.animation.easing.in}",
        out: "${design.animation.easing.out}",
        "in-out": "${design.animation.easing.inOut}",
        bounce: "${design.animation.easing.bounce}",
      },
      maxWidth: {
        container: "${design.layout.maxWidth}",
      },
      spacing: {
        sidebar: "${design.layout.sidebarWidth}",
        header: "${design.layout.headerHeight}",
      },
    },
  },
  plugins: [],
};

export default config;
`
}

// ============================================================================
// CSS VARIABLES GENERATOR
// ============================================================================
export function generateCSSVariables(design: DesignSystem): string {
  return `/* ${design.name} Design System */
:root {
  /* Colors */
  --color-primary: ${design.colors.primary};
  --color-primary-light: ${design.colors.primaryLight};
  --color-primary-dark: ${design.colors.primaryDark};
  --color-secondary: ${design.colors.secondary};
  --color-accent: ${design.colors.accent};
  --color-background: ${design.colors.background};
  --color-background-alt: ${design.colors.backgroundAlt};
  --color-surface: ${design.colors.surface};
  --color-surface-hover: ${design.colors.surfaceHover};
  --color-text: ${design.colors.text};
  --color-text-muted: ${design.colors.textMuted};
  --color-text-light: ${design.colors.textLight};
  --color-border: ${design.colors.border};
  --color-success: ${design.colors.success};
  --color-warning: ${design.colors.warning};
  --color-error: ${design.colors.error};
  --color-info: ${design.colors.info};
  --gradient: ${design.colors.gradient};
  --gradient-text: ${design.colors.gradientText};

  /* Typography */
  --font-heading: ${design.typography.fontFamily.heading};
  --font-body: ${design.typography.fontFamily.body};
  --font-mono: ${design.typography.fontFamily.mono};

  /* Spacing */
  --spacing-unit: ${design.spacing.unit}px;
  --container-padding: ${design.spacing.containerPadding};
  --section-gap: ${design.spacing.sectionGap};
  --card-padding: ${design.spacing.cardPadding};
  --input-padding: ${design.spacing.inputPadding};

  /* Layout */
  --max-width: ${design.layout.maxWidth};
  --sidebar-width: ${design.layout.sidebarWidth};
  --header-height: ${design.layout.headerHeight};

  /* Shadows */
  --shadow-sm: ${design.shadows.sm};
  --shadow-md: ${design.shadows.md};
  --shadow-lg: ${design.shadows.lg};
  --shadow-xl: ${design.shadows.xl};
  --shadow-glow: ${design.shadows.glow};

  /* Animation */
  --duration-fast: ${design.animation.duration.fast};
  --duration-normal: ${design.animation.duration.normal};
  --duration-slow: ${design.animation.duration.slow};
  --ease-default: ${design.animation.easing.default};
  --ease-bounce: ${design.animation.easing.bounce};
}

.dark {
  --color-background: ${design.darkMode.background};
  --color-surface: ${design.darkMode.surface};
  --color-text: ${design.darkMode.text};
  --color-border: ${design.darkMode.border};
}
`
}
