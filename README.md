# LuxGrid UI

Shared React + Tailwind CSS component library for the LuxGrid ecosystem (AuraFX, NØID, NoidLux, PostPilot).

---

## Vision
LuxGrid UI provides Fortune-500 polish, accessibility, and modular components across all LuxGrid products. Inspired by Tesla Hub sleekness and Tom Ford luxury aesthetics, this system ensures consistency, speed, and trust.

---

## Brand DNA
- **Minimalist**: Clean grid, sharp typography, intentional whitespace.  
- **Luxury**: Subtle gradients, refined shadows, confident interactions.  
- **Accessible**: WCAG-compliant color contrasts and keyboard navigation.  
- **Emotional Triggers**: Seamless animations that evoke elegance.  
- **Gamification**: Delightful micro-interactions for onboarding and user retention.

---

## Technical Stack
- React  
- Tailwind CSS  
- Storybook (for component previews)  
- Jest + React Testing Library (testing)  
- Vite (bundler)  

---

## Next Steps
1. Initialize `package.json` with dependencies.  
2. Add Tailwind + PostCSS config.  
3. Create `src/components` folder with first component (`Button`).  
4. Add Storybook for component documentation.  
5. Setup GitHub Actions CI/CD for quality checks.  

---

© 2025 LuxGrid — MIT License

## 🚀 Deployment Pipeline

### Automatic Deployment
- **PR Creation**: Triggers Vercel preview deployment
- **Validation**: Automated smoke tests verify functionality  
- **Brand Compliance**: Checks NØID branding elements
- **Merge Protection**: Cannot merge without passing all checks

### Local Development
```bash
npm run dev:check    # Validate config + start dev server
npm run health:local # Check local API health
npm run validate:config # Run configuration validation
```

### Manual Deployment
```bash
npm run deploy:preview # Deploy preview to Vercel
```

### Performance Metrics
- Build time: 2-3 minutes (optimized with caching)
- Preview ready: 30-60 seconds
- Smoke tests: 15-20 seconds (parallel execution)
