/**
 * Intelligent Page & Component Planner
 * Analyzes user requirements and generates appropriate pages, components, and structure
 */

import { DesignSystem, getDesignSystem } from './design-systems'

export interface PageSpec {
  name: string
  path: string
  description: string
  components: ComponentSpec[]
  layout: 'default' | 'dashboard' | 'auth' | 'marketing' | 'settings' | 'minimal'
  priority: 'core' | 'important' | 'optional'
  features: string[]
}

export interface ComponentSpec {
  name: string
  type: 'ui' | 'feature' | 'layout' | 'form' | 'display' | 'navigation'
  description: string
  props: string[]
  dependencies: string[]
}

export interface AppStructure {
  pages: PageSpec[]
  sharedComponents: ComponentSpec[]
  layouts: string[]
  providers: string[]
  hooks: string[]
  services: string[]
  types: string[]
}

// ============================================================================
// PAGE TEMPLATES BY APP TYPE
// ============================================================================

const saasPages: PageSpec[] = [
  {
    name: 'Landing',
    path: '/',
    description: 'Marketing landing page with hero, features, pricing, testimonials',
    components: [
      { name: 'Hero', type: 'feature', description: 'Hero section with CTA', props: ['title', 'subtitle', 'ctaText'], dependencies: [] },
      { name: 'Features', type: 'feature', description: 'Feature grid/carousel', props: ['features'], dependencies: [] },
      { name: 'Pricing', type: 'feature', description: 'Pricing tiers comparison', props: ['plans'], dependencies: [] },
      { name: 'Testimonials', type: 'feature', description: 'Customer testimonials carousel', props: ['testimonials'], dependencies: [] },
      { name: 'FAQ', type: 'feature', description: 'Accordion FAQ section', props: ['faqs'], dependencies: [] },
      { name: 'CTA', type: 'feature', description: 'Final call-to-action section', props: ['title', 'ctaText'], dependencies: [] },
    ],
    layout: 'marketing',
    priority: 'core',
    features: ['SEO', 'animations', 'responsive'],
  },
  {
    name: 'Dashboard',
    path: '/dashboard',
    description: 'Main dashboard with stats, charts, recent activity',
    components: [
      { name: 'StatsCards', type: 'display', description: 'KPI stat cards', props: ['stats'], dependencies: ['recharts'] },
      { name: 'ActivityFeed', type: 'display', description: 'Recent activity timeline', props: ['activities'], dependencies: [] },
      { name: 'QuickActions', type: 'navigation', description: 'Quick action buttons', props: ['actions'], dependencies: [] },
      { name: 'Charts', type: 'display', description: 'Analytics charts', props: ['data'], dependencies: ['recharts'] },
    ],
    layout: 'dashboard',
    priority: 'core',
    features: ['realtime', 'charts', 'notifications'],
  },
  {
    name: 'Settings',
    path: '/settings',
    description: 'User settings with profile, billing, team management',
    components: [
      { name: 'ProfileForm', type: 'form', description: 'User profile editor', props: ['user'], dependencies: ['react-hook-form'] },
      { name: 'BillingSection', type: 'feature', description: 'Subscription and billing', props: ['subscription'], dependencies: ['stripe'] },
      { name: 'TeamManager', type: 'feature', description: 'Team members management', props: ['team'], dependencies: [] },
      { name: 'NotificationSettings', type: 'form', description: 'Notification preferences', props: ['settings'], dependencies: [] },
    ],
    layout: 'settings',
    priority: 'core',
    features: ['forms', 'validation', 'file-upload'],
  },
  {
    name: 'Auth',
    path: '/auth',
    description: 'Authentication pages - login, signup, forgot password',
    components: [
      { name: 'LoginForm', type: 'form', description: 'Login form with social auth', props: [], dependencies: ['supabase'] },
      { name: 'SignupForm', type: 'form', description: 'Registration form', props: [], dependencies: ['supabase'] },
      { name: 'ForgotPassword', type: 'form', description: 'Password reset flow', props: [], dependencies: ['supabase'] },
      { name: 'SocialAuth', type: 'feature', description: 'Social login buttons', props: ['providers'], dependencies: ['supabase'] },
    ],
    layout: 'auth',
    priority: 'core',
    features: ['validation', 'oauth', 'magic-link'],
  },
]

const ecommercePages: PageSpec[] = [
  {
    name: 'Home',
    path: '/',
    description: 'Homepage with featured products, categories, promotions',
    components: [
      { name: 'HeroBanner', type: 'feature', description: 'Full-width promotional banner', props: ['slides'], dependencies: ['embla-carousel'] },
      { name: 'FeaturedProducts', type: 'display', description: 'Featured products grid', props: ['products'], dependencies: [] },
      { name: 'CategoryCards', type: 'navigation', description: 'Category showcase', props: ['categories'], dependencies: [] },
      { name: 'PromoBar', type: 'ui', description: 'Promotional announcement bar', props: ['message'], dependencies: [] },
      { name: 'TrendingSection', type: 'display', description: 'Trending products carousel', props: ['products'], dependencies: ['embla-carousel'] },
    ],
    layout: 'default',
    priority: 'core',
    features: ['carousel', 'lazy-loading', 'responsive'],
  },
  {
    name: 'ProductListing',
    path: '/products',
    description: 'Product listing with filters, sorting, pagination',
    components: [
      { name: 'FilterSidebar', type: 'feature', description: 'Filter panel with facets', props: ['filters'], dependencies: [] },
      { name: 'ProductGrid', type: 'display', description: 'Product cards grid', props: ['products'], dependencies: [] },
      { name: 'SortDropdown', type: 'ui', description: 'Sort options dropdown', props: ['options'], dependencies: [] },
      { name: 'Pagination', type: 'navigation', description: 'Page navigation', props: ['total', 'current'], dependencies: [] },
      { name: 'QuickView', type: 'feature', description: 'Product quick view modal', props: ['product'], dependencies: [] },
    ],
    layout: 'default',
    priority: 'core',
    features: ['infinite-scroll', 'filters', 'search'],
  },
  {
    name: 'ProductDetail',
    path: '/products/[slug]',
    description: 'Single product page with gallery, details, reviews',
    components: [
      { name: 'ImageGallery', type: 'display', description: 'Product image gallery with zoom', props: ['images'], dependencies: ['react-medium-image-zoom'] },
      { name: 'ProductInfo', type: 'display', description: 'Product details and pricing', props: ['product'], dependencies: [] },
      { name: 'VariantSelector', type: 'form', description: 'Size/color selection', props: ['variants'], dependencies: [] },
      { name: 'AddToCart', type: 'feature', description: 'Add to cart button with quantity', props: [], dependencies: [] },
      { name: 'Reviews', type: 'display', description: 'Customer reviews section', props: ['reviews'], dependencies: [] },
      { name: 'RelatedProducts', type: 'display', description: 'Related products carousel', props: ['products'], dependencies: [] },
    ],
    layout: 'default',
    priority: 'core',
    features: ['gallery', 'reviews', 'wishlist'],
  },
  {
    name: 'Cart',
    path: '/cart',
    description: 'Shopping cart with items, totals, checkout link',
    components: [
      { name: 'CartItems', type: 'display', description: 'Cart items list', props: ['items'], dependencies: [] },
      { name: 'CartSummary', type: 'display', description: 'Order summary', props: ['totals'], dependencies: [] },
      { name: 'PromoCode', type: 'form', description: 'Promo code input', props: [], dependencies: [] },
      { name: 'CartRecommendations', type: 'display', description: 'Upsell recommendations', props: ['products'], dependencies: [] },
    ],
    layout: 'default',
    priority: 'core',
    features: ['quantity-update', 'remove-item', 'save-for-later'],
  },
  {
    name: 'Checkout',
    path: '/checkout',
    description: 'Multi-step checkout with shipping, payment',
    components: [
      { name: 'CheckoutStepper', type: 'navigation', description: 'Checkout progress steps', props: ['currentStep'], dependencies: [] },
      { name: 'ShippingForm', type: 'form', description: 'Shipping address form', props: [], dependencies: ['react-hook-form'] },
      { name: 'PaymentForm', type: 'form', description: 'Payment method selection', props: [], dependencies: ['stripe'] },
      { name: 'OrderReview', type: 'display', description: 'Order review summary', props: ['order'], dependencies: [] },
    ],
    layout: 'minimal',
    priority: 'core',
    features: ['multi-step', 'address-autocomplete', 'stripe'],
  },
]

const socialPages: PageSpec[] = [
  {
    name: 'Feed',
    path: '/',
    description: 'Main feed with posts from followed users',
    components: [
      { name: 'CreatePost', type: 'form', description: 'Post composer', props: [], dependencies: [] },
      { name: 'PostCard', type: 'display', description: 'Individual post display', props: ['post'], dependencies: [] },
      { name: 'StoryBar', type: 'display', description: 'Stories carousel', props: ['stories'], dependencies: [] },
      { name: 'SuggestedUsers', type: 'display', description: 'User suggestions sidebar', props: ['users'], dependencies: [] },
      { name: 'TrendingTopics', type: 'navigation', description: 'Trending hashtags', props: ['topics'], dependencies: [] },
    ],
    layout: 'default',
    priority: 'core',
    features: ['infinite-scroll', 'realtime', 'optimistic-updates'],
  },
  {
    name: 'Profile',
    path: '/[username]',
    description: 'User profile with posts, followers, following',
    components: [
      { name: 'ProfileHeader', type: 'display', description: 'Profile banner and info', props: ['user'], dependencies: [] },
      { name: 'ProfileStats', type: 'display', description: 'Followers/following counts', props: ['stats'], dependencies: [] },
      { name: 'ProfileTabs', type: 'navigation', description: 'Posts/likes/media tabs', props: [], dependencies: [] },
      { name: 'PostGrid', type: 'display', description: 'User posts grid', props: ['posts'], dependencies: [] },
      { name: 'FollowButton', type: 'feature', description: 'Follow/unfollow button', props: ['isFollowing'], dependencies: [] },
    ],
    layout: 'default',
    priority: 'core',
    features: ['tabs', 'follow-system', 'analytics'],
  },
  {
    name: 'Messages',
    path: '/messages',
    description: 'Direct messages with conversations list',
    components: [
      { name: 'ConversationList', type: 'navigation', description: 'Chat list sidebar', props: ['conversations'], dependencies: [] },
      { name: 'ChatWindow', type: 'feature', description: 'Message thread', props: ['messages'], dependencies: [] },
      { name: 'MessageInput', type: 'form', description: 'Message composer', props: [], dependencies: [] },
      { name: 'OnlineIndicator', type: 'ui', description: 'Online status dot', props: ['isOnline'], dependencies: [] },
    ],
    layout: 'default',
    priority: 'core',
    features: ['realtime', 'typing-indicator', 'read-receipts'],
  },
  {
    name: 'Explore',
    path: '/explore',
    description: 'Discover content and users',
    components: [
      { name: 'SearchBar', type: 'form', description: 'Search input', props: [], dependencies: [] },
      { name: 'TrendingGrid', type: 'display', description: 'Trending posts masonry', props: ['posts'], dependencies: [] },
      { name: 'CategoryFilter', type: 'navigation', description: 'Category pills', props: ['categories'], dependencies: [] },
      { name: 'UserCard', type: 'display', description: 'User suggestion card', props: ['user'], dependencies: [] },
    ],
    layout: 'default',
    priority: 'important',
    features: ['search', 'masonry-layout', 'filters'],
  },
  {
    name: 'Notifications',
    path: '/notifications',
    description: 'Activity notifications',
    components: [
      { name: 'NotificationList', type: 'display', description: 'Notification items', props: ['notifications'], dependencies: [] },
      { name: 'NotificationItem', type: 'display', description: 'Single notification', props: ['notification'], dependencies: [] },
      { name: 'NotificationFilters', type: 'navigation', description: 'Filter tabs', props: [], dependencies: [] },
    ],
    layout: 'default',
    priority: 'core',
    features: ['realtime', 'mark-read', 'grouping'],
  },
]

const aiAppPages: PageSpec[] = [
  {
    name: 'Chat',
    path: '/',
    description: 'Main AI chat interface',
    components: [
      { name: 'ChatMessages', type: 'display', description: 'Message thread display', props: ['messages'], dependencies: [] },
      { name: 'ChatInput', type: 'form', description: 'Message input with actions', props: [], dependencies: [] },
      { name: 'MessageBubble', type: 'display', description: 'Single message display', props: ['message'], dependencies: ['react-markdown'] },
      { name: 'TypingIndicator', type: 'ui', description: 'AI typing animation', props: [], dependencies: [] },
      { name: 'ModelSelector', type: 'form', description: 'AI model dropdown', props: ['models'], dependencies: [] },
      { name: 'ConversationSidebar', type: 'navigation', description: 'Chat history list', props: ['conversations'], dependencies: [] },
    ],
    layout: 'default',
    priority: 'core',
    features: ['streaming', 'markdown', 'code-highlighting'],
  },
  {
    name: 'Documents',
    path: '/documents',
    description: 'Document upload and analysis',
    components: [
      { name: 'FileUpload', type: 'form', description: 'Drag-drop file upload', props: [], dependencies: ['react-dropzone'] },
      { name: 'DocumentList', type: 'display', description: 'Uploaded documents', props: ['documents'], dependencies: [] },
      { name: 'DocumentViewer', type: 'display', description: 'PDF/document preview', props: ['document'], dependencies: ['react-pdf'] },
      { name: 'AnalysisResults', type: 'display', description: 'AI analysis output', props: ['analysis'], dependencies: [] },
    ],
    layout: 'default',
    priority: 'important',
    features: ['file-upload', 'pdf-viewer', 'rag'],
  },
  {
    name: 'Playground',
    path: '/playground',
    description: 'Prompt engineering and testing',
    components: [
      { name: 'PromptEditor', type: 'form', description: 'Prompt textarea with variables', props: ['prompt'], dependencies: ['monaco-editor'] },
      { name: 'ParameterPanel', type: 'form', description: 'Model parameters (temp, tokens)', props: ['params'], dependencies: [] },
      { name: 'OutputPanel', type: 'display', description: 'AI response display', props: ['output'], dependencies: [] },
      { name: 'PromptLibrary', type: 'navigation', description: 'Saved prompts list', props: ['prompts'], dependencies: [] },
    ],
    layout: 'default',
    priority: 'important',
    features: ['code-editor', 'prompt-variables', 'history'],
  },
  {
    name: 'History',
    path: '/history',
    description: 'Conversation history and search',
    components: [
      { name: 'HistoryList', type: 'display', description: 'Past conversations', props: ['conversations'], dependencies: [] },
      { name: 'SearchBar', type: 'form', description: 'Semantic search', props: [], dependencies: [] },
      { name: 'ConversationPreview', type: 'display', description: 'Conversation snippet', props: ['conversation'], dependencies: [] },
      { name: 'DateFilter', type: 'form', description: 'Date range picker', props: [], dependencies: ['react-day-picker'] },
    ],
    layout: 'default',
    priority: 'optional',
    features: ['search', 'filters', 'export'],
  },
]

const dashboardPages: PageSpec[] = [
  {
    name: 'Overview',
    path: '/',
    description: 'Dashboard overview with KPIs and charts',
    components: [
      { name: 'KPICards', type: 'display', description: 'Key metrics cards', props: ['metrics'], dependencies: [] },
      { name: 'MainChart', type: 'display', description: 'Primary analytics chart', props: ['data'], dependencies: ['recharts'] },
      { name: 'RecentActivity', type: 'display', description: 'Activity timeline', props: ['activities'], dependencies: [] },
      { name: 'QuickStats', type: 'display', description: 'Mini stat widgets', props: ['stats'], dependencies: [] },
    ],
    layout: 'dashboard',
    priority: 'core',
    features: ['charts', 'realtime', 'date-range'],
  },
  {
    name: 'Analytics',
    path: '/analytics',
    description: 'Detailed analytics and reporting',
    components: [
      { name: 'ChartGrid', type: 'display', description: 'Multiple chart types', props: ['charts'], dependencies: ['recharts'] },
      { name: 'DateRangePicker', type: 'form', description: 'Date range selector', props: [], dependencies: ['react-day-picker'] },
      { name: 'MetricComparison', type: 'display', description: 'Period comparison', props: ['data'], dependencies: [] },
      { name: 'ExportButton', type: 'feature', description: 'Export to CSV/PDF', props: [], dependencies: [] },
    ],
    layout: 'dashboard',
    priority: 'core',
    features: ['charts', 'export', 'filters'],
  },
  {
    name: 'Users',
    path: '/users',
    description: 'User management with CRUD operations',
    components: [
      { name: 'DataTable', type: 'display', description: 'Sortable/filterable table', props: ['data', 'columns'], dependencies: ['@tanstack/react-table'] },
      { name: 'UserForm', type: 'form', description: 'Create/edit user form', props: ['user'], dependencies: ['react-hook-form'] },
      { name: 'UserFilters', type: 'form', description: 'Filter panel', props: [], dependencies: [] },
      { name: 'BulkActions', type: 'feature', description: 'Bulk action toolbar', props: ['selected'], dependencies: [] },
    ],
    layout: 'dashboard',
    priority: 'core',
    features: ['crud', 'search', 'pagination', 'bulk-actions'],
  },
  {
    name: 'Reports',
    path: '/reports',
    description: 'Custom reports and exports',
    components: [
      { name: 'ReportBuilder', type: 'form', description: 'Custom report creator', props: [], dependencies: [] },
      { name: 'ReportPreview', type: 'display', description: 'Report preview', props: ['report'], dependencies: [] },
      { name: 'ScheduledReports', type: 'display', description: 'Scheduled reports list', props: ['reports'], dependencies: [] },
      { name: 'ExportOptions', type: 'form', description: 'Export format selector', props: [], dependencies: [] },
    ],
    layout: 'dashboard',
    priority: 'important',
    features: ['export', 'scheduling', 'templates'],
  },
]

const reactWebAppPages: PageSpec[] = [
  {
    name: 'Home',
    path: '/',
    description: 'Main application home page',
    components: [
      { name: 'Header', type: 'layout', description: 'App header with navigation', props: [], dependencies: [] },
      { name: 'MainContent', type: 'layout', description: 'Primary content area', props: [], dependencies: [] },
      { name: 'Sidebar', type: 'navigation', description: 'Navigation sidebar', props: [], dependencies: [] },
    ],
    layout: 'default',
    priority: 'core',
    features: ['routing', 'responsive'],
  },
  {
    name: 'Features',
    path: '/features',
    description: 'Main features/functionality page',
    components: [
      { name: 'FeatureList', type: 'display', description: 'Feature items display', props: ['features'], dependencies: [] },
      { name: 'FeatureCard', type: 'display', description: 'Individual feature card', props: ['feature'], dependencies: [] },
    ],
    layout: 'default',
    priority: 'core',
    features: ['state-management'],
  },
]

const nextjsWebsitePages: PageSpec[] = [
  {
    name: 'Home',
    path: '/',
    description: 'Landing page with hero, features, social proof',
    components: [
      { name: 'Hero', type: 'feature', description: 'Large hero with headline and CTA', props: [], dependencies: ['framer-motion'] },
      { name: 'LogoCloud', type: 'display', description: 'Client/partner logos', props: ['logos'], dependencies: [] },
      { name: 'FeatureShowcase', type: 'display', description: 'Feature highlights with visuals', props: ['features'], dependencies: ['framer-motion'] },
      { name: 'SocialProof', type: 'display', description: 'Testimonials and stats', props: [], dependencies: [] },
      { name: 'CTASection', type: 'feature', description: 'Final conversion section', props: [], dependencies: [] },
    ],
    layout: 'marketing',
    priority: 'core',
    features: ['animations', 'seo', 'conversion-optimized'],
  },
  {
    name: 'Features',
    path: '/features',
    description: 'Detailed features page',
    components: [
      { name: 'FeatureHero', type: 'display', description: 'Features page header', props: [], dependencies: [] },
      { name: 'FeatureGrid', type: 'display', description: 'All features grid', props: ['features'], dependencies: [] },
      { name: 'FeatureDetail', type: 'display', description: 'Detailed feature section', props: ['feature'], dependencies: [] },
      { name: 'ComparisonTable', type: 'display', description: 'Feature comparison', props: ['plans'], dependencies: [] },
    ],
    layout: 'marketing',
    priority: 'core',
    features: ['scroll-animations', 'responsive'],
  },
  {
    name: 'Pricing',
    path: '/pricing',
    description: 'Pricing plans and comparison',
    components: [
      { name: 'PricingHero', type: 'display', description: 'Pricing page header', props: [], dependencies: [] },
      { name: 'PricingCards', type: 'display', description: 'Pricing tier cards', props: ['plans'], dependencies: [] },
      { name: 'ToggleBilling', type: 'ui', description: 'Monthly/yearly toggle', props: [], dependencies: [] },
      { name: 'FAQAccordion', type: 'display', description: 'Pricing FAQ', props: ['faqs'], dependencies: [] },
    ],
    layout: 'marketing',
    priority: 'core',
    features: ['toggle', 'comparison', 'faq'],
  },
  {
    name: 'About',
    path: '/about',
    description: 'Company about page',
    components: [
      { name: 'MissionStatement', type: 'display', description: 'Company mission', props: [], dependencies: [] },
      { name: 'TeamGrid', type: 'display', description: 'Team members', props: ['team'], dependencies: [] },
      { name: 'Timeline', type: 'display', description: 'Company history', props: ['events'], dependencies: [] },
      { name: 'Values', type: 'display', description: 'Company values', props: ['values'], dependencies: [] },
    ],
    layout: 'marketing',
    priority: 'important',
    features: ['animations', 'storytelling'],
  },
  {
    name: 'Contact',
    path: '/contact',
    description: 'Contact form and information',
    components: [
      { name: 'ContactForm', type: 'form', description: 'Contact form', props: [], dependencies: ['react-hook-form'] },
      { name: 'ContactInfo', type: 'display', description: 'Contact details', props: [], dependencies: [] },
      { name: 'Map', type: 'display', description: 'Location map', props: [], dependencies: [] },
    ],
    layout: 'marketing',
    priority: 'important',
    features: ['form-validation', 'email-integration'],
  },
  {
    name: 'Blog',
    path: '/blog',
    description: 'Blog listing and articles',
    components: [
      { name: 'BlogGrid', type: 'display', description: 'Blog posts grid', props: ['posts'], dependencies: [] },
      { name: 'BlogCard', type: 'display', description: 'Blog post card', props: ['post'], dependencies: [] },
      { name: 'CategoryFilter', type: 'navigation', description: 'Category pills', props: ['categories'], dependencies: [] },
      { name: 'Newsletter', type: 'form', description: 'Newsletter signup', props: [], dependencies: [] },
    ],
    layout: 'marketing',
    priority: 'optional',
    features: ['mdx', 'seo', 'pagination'],
  },
]

const flutterMobilePages: PageSpec[] = [
  {
    name: 'Splash',
    path: '/',
    description: 'App splash/launch screen',
    components: [
      { name: 'SplashLogo', type: 'display', description: 'Animated logo', props: [], dependencies: [] },
      { name: 'LoadingIndicator', type: 'ui', description: 'Loading animation', props: [], dependencies: [] },
    ],
    layout: 'minimal',
    priority: 'core',
    features: ['animation', 'auto-login-check'],
  },
  {
    name: 'Onboarding',
    path: '/onboarding',
    description: 'First-time user onboarding',
    components: [
      { name: 'OnboardingSlider', type: 'display', description: 'Swipeable intro slides', props: ['slides'], dependencies: [] },
      { name: 'PageIndicator', type: 'ui', description: 'Dot indicators', props: ['count', 'current'], dependencies: [] },
      { name: 'SkipButton', type: 'navigation', description: 'Skip to login', props: [], dependencies: [] },
    ],
    layout: 'minimal',
    priority: 'core',
    features: ['gestures', 'animations'],
  },
  {
    name: 'Home',
    path: '/home',
    description: 'Main home screen',
    components: [
      { name: 'BottomNav', type: 'navigation', description: 'Bottom navigation bar', props: ['items'], dependencies: [] },
      { name: 'HomeHeader', type: 'layout', description: 'Collapsible app bar', props: [], dependencies: [] },
      { name: 'ContentList', type: 'display', description: 'Main content list', props: ['items'], dependencies: [] },
      { name: 'FAB', type: 'ui', description: 'Floating action button', props: [], dependencies: [] },
    ],
    layout: 'default',
    priority: 'core',
    features: ['pull-to-refresh', 'infinite-scroll'],
  },
  {
    name: 'Detail',
    path: '/detail/:id',
    description: 'Item detail screen',
    components: [
      { name: 'SliverAppBar', type: 'layout', description: 'Collapsible header', props: [], dependencies: [] },
      { name: 'DetailContent', type: 'display', description: 'Item details', props: ['item'], dependencies: [] },
      { name: 'ActionButtons', type: 'feature', description: 'Action buttons', props: [], dependencies: [] },
    ],
    layout: 'default',
    priority: 'core',
    features: ['hero-animation', 'share'],
  },
  {
    name: 'Profile',
    path: '/profile',
    description: 'User profile screen',
    components: [
      { name: 'ProfileAvatar', type: 'display', description: 'User avatar', props: ['user'], dependencies: [] },
      { name: 'ProfileStats', type: 'display', description: 'User statistics', props: ['stats'], dependencies: [] },
      { name: 'SettingsList', type: 'navigation', description: 'Settings options', props: ['items'], dependencies: [] },
    ],
    layout: 'default',
    priority: 'core',
    features: ['image-picker', 'settings'],
  },
]

const internalToolPages: PageSpec[] = [
  {
    name: 'Dashboard',
    path: '/',
    description: 'Main dashboard with key metrics',
    components: [
      { name: 'MetricCards', type: 'display', description: 'KPI cards', props: ['metrics'], dependencies: [] },
      { name: 'MiniCharts', type: 'display', description: 'Small trend charts', props: ['data'], dependencies: ['recharts'] },
      { name: 'RecentActions', type: 'display', description: 'Recent activity', props: ['actions'], dependencies: [] },
    ],
    layout: 'dashboard',
    priority: 'core',
    features: ['charts', 'filters'],
  },
  {
    name: 'DataTable',
    path: '/data',
    description: 'Main data management table',
    components: [
      { name: 'DataGrid', type: 'display', description: 'Advanced data table', props: ['data', 'columns'], dependencies: ['@tanstack/react-table'] },
      { name: 'ColumnSelector', type: 'form', description: 'Show/hide columns', props: ['columns'], dependencies: [] },
      { name: 'ExportMenu', type: 'feature', description: 'Export to Excel/CSV', props: [], dependencies: ['xlsx'] },
      { name: 'FilterPanel', type: 'form', description: 'Advanced filters', props: ['filters'], dependencies: [] },
      { name: 'BulkActions', type: 'feature', description: 'Bulk operations', props: ['selected'], dependencies: [] },
    ],
    layout: 'dashboard',
    priority: 'core',
    features: ['sorting', 'filtering', 'export', 'inline-edit'],
  },
  {
    name: 'Form',
    path: '/form',
    description: 'Data entry form',
    components: [
      { name: 'DynamicForm', type: 'form', description: 'Dynamic form fields', props: ['schema'], dependencies: ['react-hook-form', 'zod'] },
      { name: 'FormSteps', type: 'navigation', description: 'Multi-step wizard', props: ['steps'], dependencies: [] },
      { name: 'ValidationSummary', type: 'display', description: 'Validation errors', props: ['errors'], dependencies: [] },
    ],
    layout: 'dashboard',
    priority: 'core',
    features: ['validation', 'auto-save', 'multi-step'],
  },
  {
    name: 'Reports',
    path: '/reports',
    description: 'Report generation and viewing',
    components: [
      { name: 'ReportList', type: 'display', description: 'Available reports', props: ['reports'], dependencies: [] },
      { name: 'ReportViewer', type: 'display', description: 'Report display', props: ['report'], dependencies: [] },
      { name: 'ReportParams', type: 'form', description: 'Report parameters', props: ['params'], dependencies: [] },
      { name: 'ScheduleModal', type: 'form', description: 'Schedule reports', props: [], dependencies: [] },
    ],
    layout: 'dashboard',
    priority: 'important',
    features: ['export', 'scheduling', 'charts'],
  },
]

// ============================================================================
// PAGE REGISTRY
// ============================================================================

const pageRegistry: Record<string, PageSpec[]> = {
  saas: saasPages,
  ecommerce: ecommercePages,
  social: socialPages,
  'ai-app': aiAppPages,
  dashboard: dashboardPages,
  'react-webapp': reactWebAppPages,
  'nextjs-website': nextjsWebsitePages,
  'flutter-mobile': flutterMobilePages,
  'internal-tool': internalToolPages,
}

// ============================================================================
// REQUIREMENT ANALYZER
// ============================================================================

interface AnalyzedRequirements {
  keywords: string[]
  features: string[]
  entities: string[]
  actions: string[]
  complexity: 'simple' | 'medium' | 'complex'
}

export function analyzeRequirements(requirements: string): AnalyzedRequirements {
  const text = requirements.toLowerCase()

  // Feature keywords
  const featureKeywords = {
    auth: ['login', 'signup', 'register', 'authentication', 'oauth', 'sso', 'password'],
    payments: ['payment', 'billing', 'subscription', 'stripe', 'checkout', 'cart', 'purchase'],
    chat: ['chat', 'message', 'conversation', 'dm', 'real-time', 'messaging'],
    analytics: ['analytics', 'dashboard', 'metrics', 'charts', 'reports', 'statistics'],
    ai: ['ai', 'ml', 'gpt', 'claude', 'llm', 'chatbot', 'assistant', 'generate'],
    social: ['follow', 'like', 'share', 'comment', 'post', 'feed', 'profile'],
    ecommerce: ['product', 'cart', 'order', 'shop', 'store', 'inventory', 'catalog'],
    content: ['blog', 'article', 'cms', 'content', 'editor', 'publish'],
    upload: ['upload', 'file', 'image', 'document', 'storage', 'media'],
    search: ['search', 'filter', 'query', 'find', 'lookup'],
    notification: ['notification', 'alert', 'push', 'email', 'reminder'],
    team: ['team', 'organization', 'workspace', 'collaborate', 'invite'],
  }

  // Entity keywords
  const entityKeywords = [
    'user', 'users', 'customer', 'admin', 'member',
    'product', 'item', 'order', 'post', 'comment',
    'message', 'notification', 'document', 'file',
    'project', 'task', 'event', 'booking', 'appointment',
  ]

  // Action keywords
  const actionKeywords = [
    'create', 'add', 'delete', 'remove', 'edit', 'update',
    'view', 'list', 'display', 'show', 'filter', 'sort',
    'search', 'export', 'import', 'share', 'send', 'upload',
  ]

  // Extract features
  const features: string[] = []
  for (const [feature, keywords] of Object.entries(featureKeywords)) {
    if (keywords.some((kw) => text.includes(kw))) {
      features.push(feature)
    }
  }

  // Extract entities
  const entities = entityKeywords.filter((e) => text.includes(e))

  // Extract actions
  const actions = actionKeywords.filter((a) => text.includes(a))

  // Determine complexity
  let complexity: 'simple' | 'medium' | 'complex' = 'simple'
  if (features.length >= 5 || entities.length >= 5) {
    complexity = 'complex'
  } else if (features.length >= 3 || entities.length >= 3) {
    complexity = 'medium'
  }

  return {
    keywords: text.split(/\s+/).filter((w) => w.length > 3),
    features,
    entities,
    actions,
    complexity,
  }
}

// ============================================================================
// APP STRUCTURE GENERATOR
// ============================================================================

export function generateAppStructure(
  templateId: string,
  requirements: string
): AppStructure {
  const basePages = pageRegistry[templateId] || []
  const analyzed = analyzeRequirements(requirements)
  const design = getDesignSystem(templateId)

  // Start with base pages for the template
  let pages = [...basePages]

  // Add pages based on detected features
  const additionalPages: PageSpec[] = []

  if (analyzed.features.includes('auth') && !pages.find((p) => p.name === 'Auth')) {
    additionalPages.push({
      name: 'Auth',
      path: '/auth',
      description: 'Authentication pages',
      components: [
        { name: 'LoginForm', type: 'form', description: 'Login form', props: [], dependencies: ['supabase'] },
        { name: 'SignupForm', type: 'form', description: 'Signup form', props: [], dependencies: ['supabase'] },
      ],
      layout: 'auth',
      priority: 'core',
      features: ['validation', 'oauth'],
    })
  }

  if (analyzed.features.includes('chat')) {
    additionalPages.push({
      name: 'Chat',
      path: '/chat',
      description: 'Real-time chat interface',
      components: [
        { name: 'ChatWindow', type: 'feature', description: 'Chat messages', props: ['messages'], dependencies: ['supabase'] },
        { name: 'MessageInput', type: 'form', description: 'Message composer', props: [], dependencies: [] },
      ],
      layout: 'default',
      priority: 'core',
      features: ['realtime', 'typing-indicator'],
    })
  }

  if (analyzed.features.includes('analytics') && !pages.find((p) => p.name.includes('Analytics'))) {
    additionalPages.push({
      name: 'Analytics',
      path: '/analytics',
      description: 'Analytics dashboard',
      components: [
        { name: 'Charts', type: 'display', description: 'Analytics charts', props: ['data'], dependencies: ['recharts'] },
        { name: 'DateRange', type: 'form', description: 'Date picker', props: [], dependencies: ['react-day-picker'] },
      ],
      layout: 'dashboard',
      priority: 'important',
      features: ['charts', 'filters'],
    })
  }

  pages = [...pages, ...additionalPages]

  // Generate shared components based on design system
  const sharedComponents: ComponentSpec[] = [
    { name: 'Button', type: 'ui', description: `Button with ${design.components.button.style} style`, props: ['variant', 'size'], dependencies: [] },
    { name: 'Card', type: 'ui', description: `Card with ${design.components.card.style} style`, props: ['children'], dependencies: [] },
    { name: 'Input', type: 'ui', description: `Input with ${design.components.input.style} style`, props: ['type', 'placeholder'], dependencies: [] },
    { name: 'Modal', type: 'ui', description: 'Modal dialog', props: ['isOpen', 'onClose'], dependencies: [] },
    { name: 'Avatar', type: 'ui', description: 'User avatar', props: ['src', 'alt', 'size'], dependencies: [] },
    { name: 'Badge', type: 'ui', description: 'Status badge', props: ['variant', 'children'], dependencies: [] },
    { name: 'Spinner', type: 'ui', description: 'Loading spinner', props: ['size'], dependencies: [] },
    { name: 'Toast', type: 'ui', description: 'Toast notification', props: ['message', 'type'], dependencies: ['sonner'] },
  ]

  // Generate layouts
  const layouts = [
    'RootLayout',
    design.layout.skimmingPattern === 'F-pattern' ? 'SidebarLayout' : 'DefaultLayout',
    'AuthLayout',
    design.components.navigation.position === 'side' ? 'DashboardLayout' : 'MarketingLayout',
  ]

  // Generate providers
  const providers = [
    'ThemeProvider',
    'AuthProvider',
    analyzed.features.includes('chat') ? 'RealtimeProvider' : null,
  ].filter(Boolean) as string[]

  // Generate hooks
  const hooks = [
    'useAuth',
    'useTheme',
    'useToast',
    analyzed.features.includes('chat') ? 'useRealtime' : null,
    analyzed.features.includes('analytics') ? 'useAnalytics' : null,
  ].filter(Boolean) as string[]

  // Generate services
  const services = [
    'supabase',
    'api',
    analyzed.features.includes('ai') ? 'ai' : null,
    analyzed.features.includes('payments') ? 'stripe' : null,
  ].filter(Boolean) as string[]

  // Generate types
  const types = [
    'user',
    ...analyzed.entities.map((e) => e.toLowerCase()),
  ]

  return {
    pages,
    sharedComponents,
    layouts,
    providers,
    hooks,
    services,
    types: [...new Set(types)],
  }
}

// ============================================================================
// MEGA PROMPT GENERATOR FOR PAGE
// ============================================================================

export function generatePagePrompt(page: PageSpec, design: DesignSystem): string {
  return `
## Page: ${page.name}
Route: ${page.path}
Layout: ${page.layout}
Priority: ${page.priority}

### Description
${page.description}

### Design Specifications
- **Color Palette**: Primary ${design.colors.primary}, Secondary ${design.colors.secondary}
- **Typography**: ${design.typography.fontFamily.heading} for headings, ${design.typography.fontFamily.body} for body
- **Spacing**: ${design.spacing.sectionGap} between sections, ${design.spacing.cardPadding} for cards
- **Border Radius**: ${design.borderRadius.lg} for cards, ${design.borderRadius.md} for buttons
- **Shadows**: ${design.shadows.md} for elevated elements
- **Animation**: ${design.animation.duration.normal} transitions with ${design.animation.easing.default}

### Layout Pattern
- Skimming Pattern: ${design.layout.skimmingPattern}
- Max Width: ${design.layout.maxWidth}
- Grid: ${design.layout.gridColumns} columns

### Components to Build
${page.components
  .map(
    (c) => `
#### ${c.name}
- Type: ${c.type}
- Description: ${c.description}
- Props: ${c.props.length > 0 ? c.props.join(', ') : 'none'}
- Dependencies: ${c.dependencies.length > 0 ? c.dependencies.join(', ') : 'none'}
`
  )
  .join('')}

### Features to Implement
${page.features.map((f) => `- ${f}`).join('\n')}

### Style Guidelines
- Button Style: ${design.components.button.style}, ${design.components.button.size} size${design.components.button.gradient ? ', with gradient' : ''}
- Card Style: ${design.components.card.style}, hover effect: ${design.components.card.hover}
- Input Style: ${design.components.input.style}, focus: ${design.components.input.focus}
- Icon Style: ${design.iconStyle.library}, stroke-width: ${design.iconStyle.strokeWidth}

### Implementation Notes
1. Use ${design.typography.fontFamily.heading} for all headings
2. Apply ${design.colors.gradient} for gradient backgrounds
3. Use ${design.animation.hover} for hover transitions
4. Ensure ${design.layout.skimmingPattern} layout pattern for optimal scanning
`
}
