# Havanah - Component Examples & Code Snippets

## Hero Section Example

```jsx
export function HeroSection() {
  const { showToast } = useToast();

  return (
    <section className="hero animate-fade-in" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated background blobs */}
      <div className="animate-blob" style={{
        position: 'absolute',
        width: '500px',
        height: '500px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
        top: '-100px',
        left: '-100px',
        zIndex: 0,
      }} />
      
      <div className="animate-blob" style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '70% 30% 30% 70% / 70% 70% 30% 30%',
        bottom: '-100px',
        right: '-100px',
        zIndex: 0,
        animationDelay: '2s',
      }} />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'slideInUp 0.6s ease-out' }}>
          Welcome to Havanah
        </h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '2rem', animation: 'slideInUp 0.6s ease-out 0.1s both' }}>
          Your trusted platform for premium services
        </p>
        <button 
          className="btn btn-primary btn-lg animate-scale-in"
          onClick={() => showToast('Explore now!', 'success')}
          style={{ animation: 'slideInUp 0.6s ease-out 0.2s both' }}
        >
          Get Started
        </button>
      </div>
    </section>
  );
}
```

---

## Feature Card Example

```jsx
export function FeatureCard({ icon, title, description }) {
  return (
    <div className="card-glass animate-slide-in-up" style={{
      padding: '2rem',
      textAlign: 'center',
      transition: 'all var(--transition-base)',
      cursor: 'pointer',
    }}>
      <div style={{
        fontSize: '3rem',
        marginBottom: '1rem',
        animation: 'float 3s ease-in-out infinite',
      }}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <h3 style={{ marginBottom: '1rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-muted-light)' }}>{description}</p>
    </div>
  );
}

// Usage in a grid:
<div style={{ 
  display: 'grid', 
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '2rem',
  padding: '4rem 2rem',
}}>
  <FeatureCard icon="apartment" title="Find Apartments" description="Browse beautiful apartments in your city" />
  <FeatureCard icon="directions_car" title="Rent Cars" description="Premium vehicle rentals at great prices" />
  <FeatureCard icon="shopping_cart" title="Easy Booking" description="Simple and secure booking process" />
</div>
```

---

## Testimonial Card Example

```jsx
export function TestimonialCard({ name, role, image, text, rating }) {
  return (
    <div className="card-glass animate-scale-in" style={{
      padding: '2rem',
      borderRadius: 'var(--radius-lg)',
    }}>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {[...Array(rating)].map((_, i) => (
          <span key={i} className="material-symbols-outlined" style={{ color: '#fbbf24' }}>
            star
          </span>
        ))}
      </div>
      
      <p style={{ marginBottom: '1.5rem', fontStyle: 'italic' }}>
        "{text}"
      </p>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <img 
          src={image} 
          alt={name}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            objectFit: 'cover',
          }}
        />
        <div>
          <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{name}</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted-light)' }}>{role}</p>
        </div>
      </div>
    </div>
  );
}
```

---

## Pricing Card Example

```jsx
export function PricingCard({ title, price, currency, description, features, highlighted }) {
  return (
    <div 
      className="card-glass animate-slide-in-up"
      style={{
        padding: '2.5rem',
        borderRadius: 'var(--radius-lg)',
        border: highlighted ? '2px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: highlighted ? 'var(--shadow-glow-lg)' : 'none',
        transform: highlighted ? 'scale(1.05)' : 'scale(1)',
        transition: 'all var(--transition-base)',
      }}
    >
      {highlighted && (
        <div style={{
          background: 'var(--primary)',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: 'var(--radius-full)',
          display: 'inline-block',
          fontSize: '0.75rem',
          fontWeight: 700,
          marginBottom: '1rem',
        }}>
          POPULAR
        </div>
      )}
      
      <h3 style={{ marginBottom: '0.5rem' }}>{title}</h3>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '2.5rem', fontWeight: 900 }}>{price}</span>
        <span style={{ color: 'var(--text-muted-light)' }}> {currency}/mo</span>
      </div>
      
      <p style={{ marginBottom: '2rem', color: 'var(--text-muted-light)' }}>{description}</p>
      
      <ul style={{ marginBottom: '2rem', listStyle: 'none' }}>
        {features.map((feature, i) => (
          <li key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'center' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--success)', fontSize: '1.25rem' }}>
              check_circle
            </span>
            {feature}
          </li>
        ))}
      </ul>
      
      <button className={highlighted ? 'btn btn-primary' : 'btn btn-secondary'} style={{ width: '100%' }}>
        Get Started
      </button>
    </div>
  );
}
```

---

## Stats/Analytics Card Example

```jsx
export function StatCard({ label, value, change, positive, icon }) {
  return (
    <div className="card glass-hover" style={{
      padding: '1.5rem',
      borderRadius: 'var(--radius-lg)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
        <div style={{
          width: '48px',
          height: '48px',
          background: 'var(--primary-ultra-light)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>
            {icon}
          </span>
        </div>
        
        <div style={{
          background: positive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          color: positive ? 'var(--success)' : 'var(--error)',
          padding: '0.25rem 0.75rem',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.75rem',
          fontWeight: 700,
        }}>
          {positive ? '↑' : '↓'} {Math.abs(change)}%
        </div>
      </div>
      
      <p style={{ color: 'var(--text-muted-light)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
        {label}
      </p>
      
      <p style={{ fontSize: '1.875rem', fontWeight: 900 }}>
        {value}
      </p>
    </div>
  );
}

// Usage:
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '1.5rem',
}}>
  <StatCard label="Total Revenue" value="$24,500" change={12} positive icon="attach_money" />
  <StatCard label="Active Listings" value="48" change={5} positive icon="apartment" />
  <StatCard label="Pending Orders" value="12" change={8} positive={false} icon="hourglass_top" />
</div>
```

---

## Input Group with Glass Effect

```jsx
export function SearchInput() {
  return (
    <div className="glass" style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '0.75rem 1.5rem',
      borderRadius: 'var(--radius-full)',
    }}>
      <span className="material-symbols-outlined" style={{ color: 'var(--text-muted-light)' }}>
        search
      </span>
      <input
        type="text"
        placeholder="Search..."
        style={{
          flex: 1,
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: 'var(--text-light)',
          fontSize: '1rem',
          fontFamily: 'inherit',
        }}
      />
    </div>
  );
}
```

---

## Modal/Dialog Example

```jsx
export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 'var(--z-modal-backdrop)',
          animation: 'fadeIn 0.2s ease-out',
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'var(--surface-light)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          maxWidth: '500px',
          width: '90%',
          zIndex: 'var(--z-modal)',
          animation: 'slideInUp 0.3s ease-out',
          boxShadow: 'var(--shadow-2xl)',
        }}
        className="dark-mode"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>{title}</h2>
          <button
            onClick={onClose}
            className="btn btn-icon"
            style={{ color: 'var(--text-muted-light)' }}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {children}
      </div>
    </>
  );
}
```

---

## Loading Skeleton Example

```jsx
export function SkeletonLoader() {
  return (
    <div className="animate-shimmer" style={{
      background: 'linear-gradient(90deg, var(--border-light) 25%, var(--surface-light) 50%, var(--border-light) 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 2s infinite',
    }}>
      <div style={{ height: '200px', borderRadius: 'var(--radius-lg)' }} />
      <div style={{ height: '1rem', marginTop: '1rem', borderRadius: 'var(--radius-md)' }} />
      <div style={{ height: '1rem', marginTop: '0.5rem', width: '80%', borderRadius: 'var(--radius-md)' }} />
    </div>
  );
}
```

---

## All These Examples Are Ready To Use!

Copy and paste these components into your project. They'll automatically:
- ✅ Respond to dark/light mode
- ✅ Animate smoothly
- ✅ Look beautiful
- ✅ Work on all devices
- ✅ Use the design system tokens

Mix and match to create unique layouts!
