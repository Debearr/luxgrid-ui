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

## 🚀 Cloud Dev (Codespaces)
1. Click **Code → Codespaces → Create codespace**.
2. It opens VS Code in the browser, runs `npm ci` automatically.
3. Run `npm run dev` — a URL will appear (port 3000 forwarded).
4. Open that URL and verify:
   - `/` renders the NØID landing page (not blank)
   - `/api/health` returns `{"status":"ok"}`
