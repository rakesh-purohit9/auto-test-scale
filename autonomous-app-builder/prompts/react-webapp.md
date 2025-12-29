# React Web Application Builder

Build a stunning single-page web application with React, Tailwind CSS, and JavaScript.

---

## 🎯 Your Mission

Create a **10x quality React web application** based on the user's requirements. The app must be fast, beautiful, and intuitive.

---

## 📋 User Requirements

**Read the user's requirements carefully:**

```
{{USER_REQUIREMENTS}}
```

Parse these requirements to identify:
1. **Core Purpose**: What problem does this app solve?
2. **Key Features**: What functionality is needed?
3. **User Flows**: What are the main user journeys?
4. **Data Entities**: What data will the app manage?
5. **Integrations**: Any external services needed?

---

## 🛠 Tech Stack

```
Framework:     React 18
Language:      JavaScript (ES6+)
Bundler:       Vite
Styling:       Tailwind CSS
Routing:       React Router DOM v6
State:         Zustand
Forms:         React Hook Form
HTTP:          Axios
Icons:         Lucide React
Animations:    Tailwind + CSS transitions
```

---

## 📁 Project Structure

```
my-app/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Toast.jsx
│   │   │   ├── Loader.jsx
│   │   │   └── index.js
│   │   └── layout/             # Layout components
│   │       ├── Header.jsx
│   │       ├── Sidebar.jsx
│   │       ├── Footer.jsx
│   │       └── Layout.jsx
│   ├── pages/                  # Route pages
│   │   ├── Home.jsx
│   │   ├── Dashboard.jsx
│   │   ├── NotFound.jsx
│   │   └── ...
│   ├── hooks/                  # Custom hooks
│   │   ├── useAuth.js
│   │   ├── useFetch.js
│   │   └── useLocalStorage.js
│   ├── context/                # React context
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── stores/                 # Zustand stores
│   │   └── useStore.js
│   ├── services/               # API services
│   │   ├── api.js
│   │   └── auth.js
│   ├── utils/                  # Utilities
│   │   ├── helpers.js
│   │   └── constants.js
│   ├── assets/                 # Static assets
│   ├── styles/
│   │   └── index.css
│   ├── App.jsx
│   ├── main.jsx
│   └── routes.jsx
├── .env.example
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 🚀 Build Process

### Phase 1: Project Setup

```bash
# Create Vite project
npm create vite@latest my-app -- --template react
cd my-app

# Install dependencies
npm install react-router-dom zustand axios react-hook-form lucide-react

# Install Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Phase 2: Configure Tailwind

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}
```

### Phase 3: Create UI Components

Create beautiful, reusable components:

```jsx
// src/components/ui/Button.jsx
import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

const variants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 dark:bg-gray-800 dark:text-white',
  outline: 'border-2 border-gray-300 hover:bg-gray-50 focus:ring-gray-500 dark:border-gray-600',
  ghost: 'hover:bg-gray-100 focus:ring-gray-500 dark:hover:bg-gray-800',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2
        font-medium rounded-lg
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  )
})

Button.displayName = 'Button'
export default Button
```

```jsx
// src/components/ui/Input.jsx
import { forwardRef } from 'react'

const Input = forwardRef(({
  label,
  error,
  hint,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`
          w-full px-4 py-2
          border rounded-lg
          text-gray-900 dark:text-white
          bg-white dark:bg-gray-800
          placeholder-gray-400
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 dark:border-gray-600'
          }
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {hint && !error && (
        <p className="text-sm text-gray-500">{hint}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'
export default Input
```

```jsx
// src/components/ui/Card.jsx
const Card = ({
  children,
  className = '',
  hover = false,
  padding = true,
  ...props
}) => {
  return (
    <div
      className={`
        bg-white dark:bg-gray-800
        border border-gray-200 dark:border-gray-700
        rounded-xl
        ${padding ? 'p-6' : ''}
        ${hover ? 'transition-shadow duration-200 hover:shadow-lg cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
```

### Phase 4: Create Layout

```jsx
// src/components/layout/Layout.jsx
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header onMenuClick={() => setSidebarOpen(true)} />

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="lg:pl-64 pt-16">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Layout
```

### Phase 5: Setup Routing

```jsx
// src/routes.jsx
import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'dashboard', element: <Dashboard /> },
      // Add more routes based on requirements
    ],
  },
  { path: '*', element: <NotFound /> },
])

export default router
```

### Phase 6: State Management

```javascript
// src/stores/useStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useStore = create(
  persist(
    (set, get) => ({
      // Theme
      theme: 'light',
      toggleTheme: () => set((state) => ({
        theme: state.theme === 'light' ? 'dark' : 'light'
      })),

      // User
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),

      // App State
      isLoading: false,
      setLoading: (isLoading) => set({ isLoading }),

      // Add more state based on requirements
    }),
    {
      name: 'app-store',
    }
  )
)

export default useStore
```

### Phase 7: API Service

```javascript
// src/services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
```

---

## 🎨 Design Guidelines

### Colors
- Primary: Blue (#3b82f6) - actions, links, focus
- Success: Green (#22c55e) - success states
- Warning: Amber (#f59e0b) - warnings
- Error: Red (#ef4444) - errors
- Neutral: Gray scale for text and backgrounds

### Spacing
- Use Tailwind spacing scale consistently
- 4px base unit (space-1 = 4px)
- Generous whitespace for breathing room

### Typography
- Font: System font stack (Inter preferred)
- Clear hierarchy with font sizes
- Line height: relaxed for body text

### Components
- Rounded corners (rounded-lg, rounded-xl)
- Subtle shadows for elevation
- Smooth transitions (200-300ms)
- Focus states for accessibility

---

## ✅ Quality Checklist

Before completion, verify:

- [ ] All pages render without errors
- [ ] Routing works correctly
- [ ] Forms validate and submit
- [ ] Loading states displayed
- [ ] Error states handled
- [ ] Responsive on mobile/tablet/desktop
- [ ] Dark mode works
- [ ] No console errors
- [ ] Code is clean and organized

---

## 📦 Final Steps

1. Run `npm run build` to verify production build
2. Test all user flows
3. Create `.env.example` with required variables
4. Update README with setup instructions

---

Now build the application based on the user's requirements!
