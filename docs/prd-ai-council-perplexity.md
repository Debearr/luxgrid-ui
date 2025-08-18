---
title: AI Council — Perplexity Research (LuxGrid UI)
source: Perplexity
updated: 2025-08-17
status: proposed
depends_on:
  - ./prd-ai-council-claude.md
  - ./prd-ai-council-gemini.md
---

# AI Council — Perplexity Research: Evidence-Backed Best Practices

I've completed comprehensive research and created a detailed evidence-backed document for the LuxGrid UI component library. Here are the key findings and recommendations:

## Storybook Configuration Best Practices
**Vite Builder Advantages:** Storybook's Vite builder provides significant performance improvements over Webpack, with faster startup times and improved development experience [1][2]. The research shows this is now the recommended approach for modern component libraries.

**Component Story Format 3.0:** Modern Storybook practices emphasize using CSF 3.0 with proper TypeScript integration, providing better developer experience and type safety [3].

## Accessibility (WCAG AA+) Requirements
**Component-Specific Guidelines:**
- **Button components** must include proper ARIA attributes, focus management with 3:1 contrast ratio, and keyboard navigation support [4][5]  
- **Input components** require explicit label association, proper error handling with `aria-describedby`, and validation feedback [5]  
- **Modal components** need focus trapping, proper ARIA roles (`role="dialog"`, `aria-modal="true"`), and keyboard navigation support [6][7]  

**Testing Strategy:** Comprehensive accessibility testing should include automated tools (axe-core), manual keyboard navigation, screen reader testing, and color contrast validation [5].

## Theming Architecture Recommendations
**CSS Variables (Recommended):** Research shows CSS variables offer the best performance characteristics with native browser support, excellent for multi-brand theming with runtime switching capability [8][9]. This aligns with Tailwind CSS v4's new CSS-first approach.

**Performance Benefits:** Tailwind CSS v4 demonstrates significant improvements — full rebuilds up to 3.8x faster, incremental rebuilds up to 8.8x faster [9].

## Publishing and Versioning Workflow
**tsup (Recommended):** Research indicates tsup is superior to Rollup for most library use cases, offering zero-configuration setup with excellent TypeScript support and automatic dual ESM/CJS output [10][11].

**Changesets Workflow:** Industry best practice for semantic versioning with automated releases, supporting proper changelog generation and version management [12][13].

## CI/CD Pipeline and Quality Gates
**Bundle Size Monitoring:** Implement size-limit for automated bundle size monitoring with target <50KB for core components [14].

**Comprehensive Testing:** GitHub Actions workflow should include type checking, linting, testing, building, and Storybook accessibility tests [15][16].

---

### Citations
[1] [Vite | Storybook docs](https://storybook.js.org/docs/builders/vite)  
[2] [How to publish TS ReactJS component on npm?](https://stackoverflow.com/questions/63658835/how-to-publish-typescript-reactjs-component-on-npm)  
[3] [Implementing Multi-Brand Theming with Style Dictionary](https://www.alwaystwisted.com/articles/a-design-tokens-workflow-part-9.html)  
[4] [Exploring advanced support for Vite 5 in Storybook 8 - LogRocket](https://blog.logrocket.com/exploring-advanced-support-vite-5-storybook-8/)  
[5] [Publish a React and TS Component as NPM Package](https://roadsidecoder.hashnode.dev/publish-a-react-and-typescript-component-on-npm-package)  
[6] [Creating Themes With Tailwind CSS](https://www.swiftorial.com/swiftlessons/design-tokens-theming-systems/theming-systems/creating-themes-with-tailwind-css)  
[7] [Storybook React Guide - DECODE Agency](https://decode.agency/article/storybook-react-guide/)  
[8] [Build and Publish a Component Library](https://dev.to/abhijitdotsharma/build-and-publish-a-component-library-react-typescript-storybook-34ba)  
[9] [Tailwind CSS v4](https://tailwindcss.com/blog/tailwindcss-v4)  
[10] [Developing, Documenting, and Testing your Vite app](https://www.youtube.com/watch?v=0PhjwygY7A8)  
[11] [How to Build Component Library with React + TS](https://blog.logrocket.com/how-to-build-component-library-react-typescript/)  
[12] [Introducing Changesets](https://lirantal.com/blog/introducing-changesets-simplify-project-versioning-with-semantic-releases)  
[13] [Changesets GitHub](https://github.com/changesets/changesets)  
[14] [Monitor Bundle Size - Jake Trent](https://jaketrent.com/post/monitor-javascript-bundle-size/)  
[15] [Storybook CI Testing Handbook](https://storybook.js.org/tutorials/ui-testing-handbook/react/en/automate/)  
[16] [Cypress + GitHub Actions CI Guide](https://docs.cypress.io/app/continuous-integration/github-actions)
