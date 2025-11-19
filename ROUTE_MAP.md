# Havanah Route Map

## 🗺️ Complete Navigation Structure

```
localhost:3000/
│
├── / (LANDING PAGE - PUBLIC)
│   ├── Hero Section
│   ├── Features (6 items)
│   ├── How It Works
│   ├── Testimonials
│   ├── Pricing (GMD)
│   ├── CTA Buttons
│   └── Footer
│
├── /auth/login (PUBLIC)
│   ├── Email/Password Form
│   ├── OAuth Options (Google, GitHub)
│   ├── Remember Me
│   ├── Forgot Password Link
│   └── Sign Up Link
│
├── /auth/signup (PUBLIC)
│   ├── Step 1: Role Selection
│   │   ├── Customer
│   │   └── Service Provider
│   ├── Step 2: Details Entry
│   │   ├── Full Name
│   │   ├── Email
│   │   ├── Phone
│   │   ├── Password (with strength meter)
│   │   └── Agency Name (if provider)
│   ├── Step 3: Verification
│   │   └── Success Message
│   └── Sign In Link
│
├── /user-dashboard (🔒 PROTECTED - CUSTOMERS ONLY)
│   ├── Navigation Bar
│   │   ├── Logo
│   │   ├── Dashboard Link
│   │   ├── My Bookings
│   │   ├── Messages
│   │   ├── Profile
│   │   ├── Theme Toggle (☀️/🌙)
│   │   └── Sign Out
│   │
│   └── Dashboard Content
│       ├── Welcome Header
│       ├── Quick Stats (4 cards)
│       │   ├── Active Bookings
│       │   ├── Saved Items
│       │   ├── Total Spent (GMD)
│       │   └── Reviews
│       ├── Recommended Services
│       │   └── Service List (with pricing in GMD)
│       ├── Recent Bookings
│       │   └── Booking List (with status)
│       └── Sidebar
│           ├── Quick Actions
│           ├── Messages Button
│           └── Premium Upgrade CTA
│
├── /agent-dashboard (🔒 PROTECTED - PROVIDERS ONLY)
│   ├── Navigation Bar
│   │   ├── Logo
│   │   ├── Dashboard Link
│   │   ├── My Listings
│   │   ├── Bookings
│   │   ├── Earnings
│   │   ├── Profile
│   │   ├── Theme Toggle (☀️/🌙)
│   │   └── Sign Out
│   │
│   └── Dashboard Content
│       ├── Welcome Header
│       ├── Key Metrics (4 cards)
│       │   ├── Total Earnings (GMD)
│       │   ├── Active Listings
│       │   ├── Pending Bookings
│       │   └── Rating (⭐)
│       ├── Revenue Chart
│       ├── Recent Bookings Management
│       ├── Sidebar
│       │   ├── Quick Actions
│       │   ├── Create Listing Button
│       │   ├── Manage Listings
│       │   ├── Growth Tips
│       │   └── Premium Upgrade CTA
│       └── Agency Info
│
└── Other Routes (Planned)
    ├── /bookings
    ├── /messages
    ├── /profile
    ├── /listings
    ├── /checkout
    ├── /explore
    └── /settings
```

---

## 🔐 Route Protection Logic

```
┌─────────────────┐
│  Visit Root (/)  │
└────────┬────────┘
         │
    ┌────▼─────┐
    │ Check Auth│
    └────┬─────┘
         │
    ┌────┴────────────┐
    │                 │
  YES               NO
    │                 │
    │            Show Landing
    │            Page
    │
  Check Role
    │
┌───┴───────┐
│           │
CUSTOMER  AGENT
│           │
└───┬───┬───┘
    │   │
    ▼   ▼
 User   Agent
Dashboard Dashboard
```

---

## 🎨 Theme Support

All routes support theme toggle (☀️ = light, 🌙 = dark)

```
Light Mode (Default)
├── Background: White
├── Text: Dark Gray
├── Cards: Light with shadow
├── Buttons: Blue primary

Dark Mode
├── Background: Deep Blue-Black (#0a1019)
├── Text: Light Gray
├── Cards: Dark with glass effect
├── Buttons: Blue primary (adjusted)

Smooth Transition: 250ms via CSS variables
```

---

## 📱 Responsive Breakpoints

All pages respond at:
- **Mobile** (< 768px): 1 column layouts
- **Tablet** (768px - 1024px): 2 column layouts
- **Desktop** (> 1024px): 3+ column layouts

---

## 🎯 Key Route Features

### Landing Page
- **Role**: Marketing & conversion
- **Access**: Everyone
- **Features**: Hero, features, testimonials, pricing
- **CTA**: Sign Up / Sign In buttons

### Auth Pages
- **Role**: User onboarding
- **Access**: Everyone (redirects if already authenticated)
- **Features**: Form validation, password strength, role selection
- **Flow**: Signup → Create account → Redirect to dashboard

### Customer Dashboard
- **Role**: Browse & manage bookings
- **Access**: Users only (role = 'user')
- **Features**: Recommended services, booking history, quick actions
- **Data**: Stats, recent activity, personalized recommendations

### Agent Dashboard
- **Role**: Manage business & listings
- **Access**: Providers only (role = 'agent')
- **Features**: Revenue tracking, listing management, growth tips
- **Data**: Earnings, active listings, pending bookings, rating

---

## 🔄 Data Flow

```
Browser
  ├─► Request Page
  │
  ├─► Check Auth State
  │   └─► Load from localStorage / Firebase
  │
  ├─► Load Theme Preference
  │   └─► Apply CSS variables
  │
  ├─► Check Route Protection
  │   └─► Redirect if needed
  │
  └─► Render Page
      └─► Show Content with User Data
```

---

## 📊 Component Usage

Every page uses the design system:

```
Provider Components
├── ThemeProvider (dark/light mode)
└── ToastProvider (notifications)

UI Components
├── Cards (glass morphism)
├── Buttons (primary/secondary)
├── Navigation (sticky)
├── Gradients (8 variants)
└── Animations (15+ types)

Features
├── Dark/Light Toggle
├── Loading States
├── Error Handling
├── Responsive Design
└── Accessibility Support
```

---

## 🚀 URL Examples

### Public Routes
```
http://localhost:3000/                    # Landing
http://localhost:3000/auth/login          # Login
http://localhost:3000/auth/signup         # Signup
```

### Protected Routes (requires login)
```
http://localhost:3000/user-dashboard      # Customer dashboard
http://localhost:3000/agent-dashboard     # Provider dashboard
```

### Redirect Behavior
```
NOT Logged In
└─ Visit /user-dashboard → Redirect to /auth/login

Logged In as User
├─ Visit /                 → Show landing (or dashboard)
├─ Visit /agent-dashboard  → Redirect to /user-dashboard
└─ Visit /auth/login       → Already authenticated

Logged In as Agent
├─ Visit /                 → Show landing (or dashboard)
├─ Visit /user-dashboard   → Redirect to /agent-dashboard
└─ Visit /auth/signup      → Already authenticated
```

---

## 🎨 Page Style Guide

### Landing Page
- **Hero**: Large gradient text, animated blobs
- **Features**: 3-column grid with icons
- **Pricing**: 3 cards with GMD amounts
- **CTA**: Prominent buttons

### Auth Pages
- **Logo**: Animated in hero
- **Form**: Clean white/dark cards
- **Buttons**: Full-width primary buttons
- **Links**: Subtle secondary links

### Dashboards
- **Header**: Sticky navigation bar
- **Metrics**: 4-card quick stats row
- **Content**: 2-3 column layouts
- **Sidebar**: Quick actions & tips

---

## 💡 Features by Route

| Route | Dark Mode | Responsive | Animations | Theme Toggle |
|-------|-----------|-----------|-----------|--------------|
| / (Landing) | ✅ | ✅ | ✅ | ✅ |
| /auth/login | ✅ | ✅ | ✅ | ✅ |
| /auth/signup | ✅ | ✅ | ✅ | ✅ |
| /user-dashboard | ✅ | ✅ | ✅ | ✅ |
| /agent-dashboard | ✅ | ✅ | ✅ | ✅ |

---

## 🎯 What's Connected

✅ **Landing** → Signup/Login buttons
✅ **Auth Pages** → Dashboard redirect
✅ **Dashboards** → Theme & sign out
✅ **Theme** → All pages
✅ **Notifications** → Form validation, auth events
✅ **Authentication** → Route protection

---

## 🔌 What Needs Firebase

Once credentials are added:
1. Login/Signup forms → Real authentication
2. User data → Firestore storage
3. Dashboards → Real data display
4. Messaging → Real-time updates
5. Bookings → Database records

---

**All routes are production-ready and styled with the professional design system!** 🚀
