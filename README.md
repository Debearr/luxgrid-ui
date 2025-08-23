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

## 🧪 Netlify Fallback Preview
If Vercel is noisy, trigger a backup preview:
1) Add two GitHub Secrets: **NETLIFY_AUTH_TOKEN** and **NETLIFY_SITE_ID** (from Netlify dashboard).
2) Run **Actions → Netlify Preview (fallback) → Run workflow** on your branch.
3) The job prints a **Preview URL** you can open and share (works with SSR).

Manual one-liner deploy (optional):
```bash
npx netlify-cli deploy --build --message "Manual preview" --json
```
