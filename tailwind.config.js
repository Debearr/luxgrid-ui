@tailwind base;
@tailwind components;
@tailwind utilities;

/* Accessibility defaults */
:focus {
  outline: none;
}
:focus-visible {
  @apply ring-2 ring-lg-blue ring-offset-2 ring-offset-lg-bg;
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}

/* Base colors (use in Storybook/previews) */
html, body {
  background-color: #0A0E1A; /* lg-bg */
  color: #FFFFFF;            /* lg-text */
}
