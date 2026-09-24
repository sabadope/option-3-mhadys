# Glass Button - Copy Instructions

## What You're Getting
A **zero-dependency** CSS implementation of the glassmorphism button from the Aura Hub project. No Tailwind, no React, no build step required.

---

## Quick Start (30 seconds)

### 1. Copy the CSS File
```bash
cp glass-button.css /your-project/src/styles/
```

### 2. Include in Your Project

**Option A: HTML `<link>` (simplest)**
```html
<head>
  <link rel="stylesheet" href="/styles/glass-button.css">
</head>
```

**Option B: CSS `@import`**
```css
/* In your main.css */
@import "./glass-button.css";
```

**Option C: JS Import (Vite/Webpack/Next.js)**
```js
import "./styles/glass-button.css";
```

### 3. Use the Button
```html
<!-- Basic -->
<button class="glass-btn">Start exploring</button>

<!-- With icon (ArrowRight example) -->
<button class="glass-btn">
  Start exploring
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M5 12h14"></path>
    <path d="m12 5 7 7-7 7"></path>
  </svg>
</button>

<!-- As a link -->
<a href="/shop" class="glass-btn">Start exploring <svg>...</svg></a>

<!-- Sizes -->
<button class="glass-btn glass-btn--sm">Small</button>
<button class="glass-btn">Default</button>
<button class="glass-btn glass-btn--lg">Large</button>
<button class="glass-btn glass-btn--xl">Extra Large</button>

<!-- Disabled -->
<button class="glass-btn" disabled>Disabled</button>
```

---

## What Makes It "Glass"

| Property | Value | Why It Matters |
|----------|-------|----------------|
| `backdrop-filter: blur(24px) saturate(145%)` | Blurs background behind button | Core glassmorphism effect |
| `background: rgba(255,255,255,0.62)` | Semi-transparent white | Lets background show through |
| `inset 0 1px 0 rgba(255,255,255,0.75)` | Inner top highlight | Catches light like real glass |
| `hover: translateY(-2px)` | Lifts on hover | Feels tactile/physical |
| `active: scale(0.98)` | Presses down on click | Physical button feedback |

---

## Customization

### Change Colors (Edit CSS Variables)
```css
:root {
  --glass-bg: rgba(255, 255, 255, 0.62);      /* Base background */
  --glass-bg-hover: rgba(255, 255, 255, 0.82); /* Hover background */
  --glass-border: rgba(255, 255, 255, 0.75);   /* Border color */
  --glass-text: #1e1e26;                        /* Text color */
  --glass-ring: rgba(90, 140, 120, 0.5);        /* Focus ring color */
}
```

### Use Your Brand Colors
```css
:root {
  --glass-bg: rgba(99, 102, 241, 0.25);      /* Indigo tint */
  --glass-bg-hover: rgba(99, 102, 241, 0.35);
  --glass-border: rgba(99, 102, 241, 0.40);
  --glass-text: #312e81;
  --glass-ring: rgba(99, 102, 241, 0.5);
}
```

### Adjust Blur Strength
```css
.glass-btn {
  backdrop-filter: blur(16px) saturate(145%);  /* Less blur */
  /* or */
  backdrop-filter: blur(40px) saturate(180%);  /* More blur */
}
```

---

## Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| `backdrop-filter` | 76+ | 103+ | 14.1+ | 76+ |
| `rgba()` colors | All | All | All | All |
| CSS Variables | All | All | All | All |

**Fallback for old browsers**: The button still works (solid background), just no blur effect.

---

## File Checklist

- [ ] `glass-button.css` copied to project
- [ ] CSS included in build/bundle
- [ ] Button HTML added with `.glass-btn` class
- [ ] Tested in browser (hover, focus, click states)
- [ ] Dark mode checked (auto-adapts via `prefers-color-scheme`)

---

## Troubleshooting

**"Blur not working"**
- Ensure button has a background behind it (image, gradient, or parent with background)
- `backdrop-filter` only blurs what's *behind* the element

**"Button looks wrong in dark mode"**
- The CSS auto-detects `prefers-color-scheme: dark`
- Override by adding `.dark { --glass-bg: ... }` if using class-based dark mode

**"Focus ring looks off"**
- Adjust `--glass-ring` variable to match your brand color

---

## Credits

Original design from **Aura Hub** (`/src/components/ui/button.tsx` + `/src/styles.css`)
- Glass tokens: `--glass`, `--glass-strong`, `--glass-border`, `--shadow-glass`
- Extracted and made standalone by opencode

---

## License

Free to use, modify, distribute. No attribution required.