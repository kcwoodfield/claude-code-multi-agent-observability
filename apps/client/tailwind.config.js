/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      screens: {
        'mobile': {'max': '699px'}, // Custom mobile breakpoint for < 700px
        'short': {'raw': '(max-height: 400px)'}, // Custom breakpoint for height <= 400px
      },
      colors: {
        // shadcn-vue colors
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Theme-aware colors using CSS custom properties
        'theme': {
          'primary': 'var(--theme-primary)',
          'primary-hover': 'var(--theme-primary-hover)',
          'primary-light': 'var(--theme-primary-light)',
          'primary-dark': 'var(--theme-primary-dark)',
          'bg': {
            'primary': 'var(--theme-bg-primary)',
            'secondary': 'var(--theme-bg-secondary)',
            'tertiary': 'var(--theme-bg-tertiary)',
            'quaternary': 'var(--theme-bg-quaternary)',
          },
          'text': {
            'primary': 'var(--theme-text-primary)',
            'secondary': 'var(--theme-text-secondary)',
            'tertiary': 'var(--theme-text-tertiary)',
            'quaternary': 'var(--theme-text-quaternary)',
          },
          'border': {
            'primary': 'var(--theme-border-primary)',
            'secondary': 'var(--theme-border-secondary)',
            'tertiary': 'var(--theme-border-tertiary)',
          },
          'accent': {
            'success': 'var(--theme-accent-success)',
            'warning': 'var(--theme-accent-warning)',
            'error': 'var(--theme-accent-error)',
            'info': 'var(--theme-accent-info)',
          }
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'theme': 'var(--theme-shadow)',
        'theme-lg': 'var(--theme-shadow-lg)',
      },
      transitionProperty: {
        'theme': 'var(--theme-transition)',
        'theme-fast': 'var(--theme-transition-fast)',
      }
    },
  },
  plugins: [],
  safelist: [
    // Background colors
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-orange-500',
    'bg-teal-500',
    'bg-cyan-500',
    // Border colors
    'border-blue-500',
    'border-green-500',
    'border-yellow-500',
    'border-purple-500',
    'border-pink-500',
    'border-indigo-500',
    'border-red-500',
    'border-orange-500',
    'border-teal-500',
    'border-cyan-500',
    // Gradient colors
    'from-blue-500',
    'to-blue-600',
    'from-green-500',
    'to-green-600',
    'from-yellow-500',
    'to-yellow-600',
    'from-purple-500',
    'to-purple-600',
    'from-pink-500',
    'to-pink-600',
    'from-indigo-500',
    'to-indigo-600',
    'from-red-500',
    'to-red-600',
    'from-orange-500',
    'to-orange-600',
    'from-teal-500',
    'to-teal-600',
    'from-cyan-500',
    'to-cyan-600',
    // Theme classes
    'theme-bg-primary',
    'theme-bg-secondary',
    'theme-bg-tertiary',
    'theme-bg-quaternary',
    'theme-text-primary',
    'theme-text-secondary',
    'theme-text-tertiary',
    'theme-text-quaternary',
    'theme-border-primary',
    'theme-border-secondary',
    'theme-border-tertiary',
    'theme-primary',
    'theme-primary-bg',
    'theme-primary-border',
    'theme-accent-success',
    'theme-accent-warning',
    'theme-accent-error',
    'theme-accent-info',
    'theme-shadow',
    'theme-shadow-lg',
    'theme-transition',
    'theme-transition-fast',
    'theme-hover',
    'theme-active',
    'theme-focus',
    'backdrop-blur',
    // Theme class names
    'theme-light',
    'theme-dark',
    'theme-modern',
    'theme-earth',
    'theme-glass',
    'theme-high-contrast',
  ]
}