# Havanah Design System - Quick Reference Guide

## 🎨 Color Palette

### Primary Colors
```css
--primary: #2badef           /* Main brand blue */
--primary-light: #4bbef5     /* Hover/interactive */
--primary-dark: #1e8ac4      /* Deep blue */
--primary-ultra-light: rgba(43, 173, 238, 0.1)  /* Background tint */
```

### Secondary Colors
```css
--secondary: #a368d9         /* Purple */
--secondary-light: #b888e8   /* Light purple */
--accent: #ff6b9d            /* Pink accent */
--accent-light: #ff9ab8      /* Light pink */
```

### Status Colors
```css
--success: #10b981           /* Green */
--error: #ef4444             /* Red */
--warning: #f59e0b           /* Orange */
--info: #3b82f6              /* Blue info */
```

---

## 🎯 Typography

### Heading Sizes (Auto-responsive)
```html
<h1>Extra Large Heading (1.875rem - 3.5rem)</h1>
<h2>Large Heading (1.5rem - 2.25rem)</h2>
<h3>Medium Heading (1.25rem - 1.875rem)</h3>
<h4>Small Heading (1.125rem)</h4>
<p>Body text - automatically responsive</p>
```

### Font Weights
```css
--font-weight-light: 300
--font-weight-normal: 400
--font-weight-medium: 500
--font-weight-semibold: 600
--font-weight-bold: 700
--font-weight-extrabold: 900
```

---

## 🔘 Buttons

### Button Types

**Primary Button** (Gradient + Glow)
```jsx
<button className="btn btn-primary">
  Primary Action
</button>
```

**Secondary Button** (Glass)
```jsx
<button className="btn btn-secondary">
  Secondary Action
</button>
```

**Icon Button**
```jsx
<button className="btn btn-icon">
  <span className="material-symbols-outlined">settings</span>
</button>
```

### Button Sizes
```jsx
<button className="btn btn-primary btn-sm">Small</button>
<button className="btn btn-primary">Medium (default)</button>
<button className="btn btn-primary btn-lg">Large</button>
```

---

## 🎴 Cards & Glass Effects

### Standard Card
```jsx
<div className="card">
  <h3>Card Title</h3>
  <p>Card content goes here...</p>
</div>
```

### Glass Card (Liquid Morphism)
```jsx
<div className="card-glass">
  <h3>Glass Card Title</h3>
  <p>Beautiful frosted glass effect</p>
</div>
```

### Interactive Glass
```jsx
<div className="glass glass-hover">
  Hover over me for enhanced effect
</div>
```

---

## ✨ Animations

### Floating Animation
```jsx
<div className="animate-float">Floats gracefully</div>
<div className="animate-float-slow">Slower float</div>
```

### Glow Effects
```jsx
<div className="animate-glow">Glowing effect</div>
<div className="animate-glow-pulse">Pulsing glow</div>
```

### Entrance Animations
```jsx
<div className="animate-slide-in-up">Slides in from bottom</div>
<div className="animate-slide-in-down">Slides in from top</div>
<div className="animate-slide-in-left">Slides in from left</div>
<div className="animate-slide-in-right">Slides in from right</div>
<div className="animate-scale-in">Scales in</div>
<div className="animate-fade-in">Fades in</div>
```

### Loading Animations
```jsx
<div className="animate-spin">
  <span className="material-symbols-outlined">hourglass_top</span>
</div>
<div className="animate-pulse">Loading...</div>
<div className="animate-bounce">Bouncing element</div>
```

### Advanced Animations
```jsx
<div className="animate-blob">Morphing blob shapes</div>
<div className="animate-gradient">Animated gradient</div>
<div className="animate-shimmer">Shimmer effect</div>
```

---

## 🌈 Gradients

### Built-in Gradient Classes
```jsx
<div className="gradient-primary">Blue gradient</div>
<div className="gradient-secondary">Purple to blue</div>
<div className="gradient-accent">Pink gradient</div>
<div className="gradient-cool">Cool purple</div>
<div className="gradient-warm">Warm pink</div>
<div className="gradient-sunset">Sunset colors</div>
<div className="gradient-aurora">Aurora colors</div>
<div className="gradient-mesh">Mesh colors</div>
```

---

## 🎬 Transitions

### Transition Speeds
```css
--transition-fast: 150ms      /* Quick interactions */
--transition-base: 250ms      /* Default (most common) */
--transition-slow: 350ms      /* Noticeable effect */
--transition-slower: 500ms    /* Emphasized animation */
```

### Apply Transitions
```css
.element {
  transition: all var(--transition-base);
}

.element {
  transition: color var(--transition-fast);
}
```

---

## 🎨 Creating Custom Components

### Pattern: Card with Animation
```jsx
<div className="card card-glass animate-slide-in-up">
  <h3>Animated Glass Card</h3>
  <p>Beautiful entrance effect</p>
  <button className="btn btn-primary">Action</button>
</div>
```

### Pattern: Button with Gradient
```jsx
<button className="btn btn-primary animate-scale-in">
  <span className="material-symbols-outlined">check_circle</span>
  Success Action
</button>
```

### Pattern: Interactive Glass Element
```jsx
<div className="glass-hover animate-glow">
  <h4>Interactive Element</h4>
  <p>Hovers to reveal more detail</p>
</div>
```

---

## 🌓 Dark Mode

### Automatic Dark Mode Classes
The app automatically adds `.dark-mode` class to `<body>` when dark theme is active.

### Create Dark Mode Aware Styles
```jsx
// JSX example
<div className="some-component">
  {/* Content automatically adapts via CSS variables */}
</div>

// CSS uses variables that change:
// Light: --text-light, --bg-light
// Dark: --text-dark, --bg-dark
```

### Programmatic Theme Control
```jsx
import { useTheme } from '@/lib/theme-context';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
```

---

## 📢 Toast Notifications

### Show Toast Messages
```jsx
import { useToast } from '@/lib/toast-context';

export function MyComponent() {
  const { showToast } = useToast();
  
  const handleClick = () => {
    showToast('Action completed!', 'success');
    // showToast(message, type, duration)
    // Types: 'success' | 'error' | 'warning' | 'info'
  };
  
  return <button onClick={handleClick}>Click me</button>;
}
```

---

## 📏 Spacing & Layout

### Spacing Units
```css
--spacing-xs: 0.5rem      /* 8px */
--spacing-sm: 1rem        /* 16px */
--spacing-md: 1.5rem      /* 24px */
--spacing-lg: 2rem        /* 32px */
--spacing-xl: 3rem        /* 48px */
--spacing-2xl: 4rem       /* 64px */
```

### Border Radius
```css
--radius-xs: 0.25rem      /* Minimal */
--radius-sm: 0.375rem
--radius-md: 0.5rem       /* Default */
--radius-lg: 1rem         /* Rounded cards */
--radius-xl: 1.5rem       /* Large elements */
--radius-2xl: 2rem        /* Extra large */
--radius-full: 9999px     /* Pills/circles */
```

---

## 🛠️ Responsive Design

### Mobile-First Breakpoints
```css
/* Small screens (default) */
.element { width: 100%; }

/* Tablets */
@media (min-width: 768px) {
  .element { width: 50%; }
}

/* Desktops */
@media (min-width: 1024px) {
  .element { width: 33%; }
}

/* Large screens */
@media (min-width: 1400px) {
  .element { width: 25%; }
}
```

---

## ⚡ Performance Tips

1. **Use CSS Variables** - Better than hard-coded colors
2. **Combine Animations** - Group related transforms
3. **Lazy Load Images** - Use loading="lazy"
4. **Minimize JS** - Keep interactions light
5. **Use `will-change`** - For animated elements (sparingly)

```css
.animated-element {
  will-change: transform, opacity;
  transition: all var(--transition-base);
}
```

---

## 🔍 Material Icons Reference

Common icons for Havanah:
```
check_circle      - Success/approval
error             - Error
warning           - Warning
info              - Information
home              - Home
apartment         - Apartment/building
directions_car    - Car/vehicle
sell              - Sale
shopping_cart     - Shopping
settings          - Settings
person            - User profile
logout            - Sign out
search            - Search
menu              - Navigation menu
close             - Close/dismiss
add               - Add/create
edit              - Edit
delete            - Delete
favorite          - Favorite/like
share             - Share
message           - Message/chat
phone             - Call
email             - Email
location_on       - Location/map
calendar_today    - Date/calendar
clock             - Time
star              - Rating/star
```

---

## 📱 Mobile Considerations

The design system is mobile-first:
- All components are responsive by default
- Touch targets are 44px minimum
- Glass effects scale appropriately
- Animations respect `prefers-reduced-motion`
- Text scales with viewport

---

## 🚀 Next Steps

1. Add Firebase credentials to `.env.local`
2. Run `npm install`
3. Start development: `npm run dev`
4. Build pages using these components
5. Deploy to Vercel for production

All design system variables can be customized in `app/globals.css` `:root` section.
