import type { AppTemplate } from './store'

export const templates: AppTemplate[] = [
  // Full-Stack Applications
  {
    id: 'saas',
    name: 'SaaS Platform',
    description: 'Full-featured SaaS with subscriptions, team management, and analytics dashboard',
    category: 'fullstack',
    techStack: ['Next.js 15', 'TypeScript', 'Tailwind', 'Supabase', 'Stripe'],
    features: ['Auth', 'Teams', 'Subscriptions', 'Analytics', 'Billing'],
    icon: 'Layers',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce Store',
    description: 'Complete online store with products, cart, checkout, and order management',
    category: 'fullstack',
    techStack: ['Next.js 15', 'TypeScript', 'Tailwind', 'Supabase', 'Stripe'],
    features: ['Products', 'Cart', 'Checkout', 'Orders', 'Reviews'],
    icon: 'ShoppingCart',
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 'social',
    name: 'Social Platform',
    description: 'Social network with profiles, posts, follows, and real-time messaging',
    category: 'fullstack',
    techStack: ['Next.js 15', 'TypeScript', 'Tailwind', 'Supabase'],
    features: ['Profiles', 'Posts', 'Follows', 'Messaging', 'Notifications'],
    icon: 'Users',
    color: 'from-pink-500 to-rose-500',
  },
  {
    id: 'ai-app',
    name: 'AI Application',
    description: 'AI-powered app with multi-model chat, document analysis, and content generation',
    category: 'fullstack',
    techStack: ['Next.js 15', 'TypeScript', 'Tailwind', 'OpenAI/Claude'],
    features: ['Chat', 'Documents', 'RAG', 'Streaming', 'History'],
    icon: 'Brain',
    color: 'from-purple-500 to-indigo-500',
  },
  {
    id: 'dashboard',
    name: 'Admin Dashboard',
    description: 'Comprehensive admin panel with charts, tables, and user management',
    category: 'fullstack',
    techStack: ['Next.js 15', 'TypeScript', 'Tailwind', 'Recharts'],
    features: ['Charts', 'Tables', 'CRUD', 'RBAC', 'Reports'],
    icon: 'LayoutDashboard',
    color: 'from-emerald-500 to-teal-500',
  },

  // Web Applications
  {
    id: 'react-webapp',
    name: 'React Web App',
    description: 'Single-page application with modern React patterns and state management',
    category: 'web',
    techStack: ['React 18', 'Vite', 'JavaScript', 'Tailwind', 'Zustand'],
    features: ['SPA', 'Routing', 'State', 'Forms', 'API'],
    icon: 'Globe',
    color: 'from-sky-500 to-blue-500',
  },
  {
    id: 'nextjs-website',
    name: 'Landing Page & Website',
    description: 'Beautiful marketing website with animations, SEO optimization, and conversion focus',
    category: 'web',
    techStack: ['Next.js 15', 'TypeScript', 'Tailwind', 'Framer Motion'],
    features: ['Hero', 'Features', 'Pricing', 'Testimonials', 'SEO'],
    icon: 'Sparkles',
    color: 'from-violet-500 to-purple-500',
  },
  {
    id: 'internal-tool',
    name: 'Internal Tool',
    description: 'Business tool with data tables, forms, reporting, and Excel export',
    category: 'web',
    techStack: ['React 18', 'Vite', 'JavaScript', 'TanStack Table'],
    features: ['Tables', 'Forms', 'Export', 'RBAC', 'Charts'],
    icon: 'Wrench',
    color: 'from-amber-500 to-orange-500',
  },

  // Mobile Applications
  {
    id: 'flutter-mobile',
    name: 'Flutter Mobile App',
    description: 'Cross-platform mobile app for iOS and Android with native performance',
    category: 'mobile',
    techStack: ['Flutter', 'Dart', 'Riverpod', 'GoRouter'],
    features: ['iOS', 'Android', 'Offline', 'Push', 'Material 3'],
    icon: 'Smartphone',
    color: 'from-cyan-500 to-blue-500',
  },
]

export const getTemplatesByCategory = () => {
  return {
    fullstack: templates.filter((t) => t.category === 'fullstack'),
    web: templates.filter((t) => t.category === 'web'),
    mobile: templates.filter((t) => t.category === 'mobile'),
  }
}

export const getTemplateById = (id: string) => {
  return templates.find((t) => t.id === id)
}
