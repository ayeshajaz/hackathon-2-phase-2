---
name: frontend-ui-builder
description: Build responsive frontend pages and reusable UI components with clean layout and modern styling.
---

# Frontend UI Development

## Instructions

1. **Page Structure**
   - Semantic HTML structure
   - Reusable sections (header, main, footer)
   - Component-based layout

2. **Components**
   - Buttons, cards, forms, navbars
   - Props-based customization
   - Reusable and scalable design

3. **Layout & Styling**
   - Flexbox and Grid layouts
   - Responsive design (mobile-first)
   - Consistent spacing and typography
   - Utility-first or modular CSS (Tailwind / CSS Modules)

4. **Interactivity**
   - Hover and focus states
   - Transitions and subtle animations
   - Accessibility-friendly interactions

## Best Practices
- Follow mobile-first design
- Keep components reusable and clean
- Use consistent colors and spacing
- Avoid inline styles
- Optimize for performance and accessibility

## Example Structure
```html
<main class="container">
  <header class="navbar">
    <h1 class="logo">Brand</h1>
    <nav class="nav-links">
      <a href="#">Home</a>
      <a href="#">About</a>
      <a href="#">Contact</a>
    </nav>
  </header>

  <section class="content">
    <div class="card">
      <h2>Card Title</h2>
      <p>Card description goes here.</p>
      <button class="primary-button">Learn More</button>
    </div>
  </section>
</main>
