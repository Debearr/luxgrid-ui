# Changelog

## brand-kit-v2

- Applied Claude QA fixes, regenerated VOAI assets (Minimal + Edgy), optimized for platform compliance.
- Structured assets under `assets/brand/social/<Platform>/` using naming `Platform_Type_Variant_v2.png`.
- Added export script `npm run export:brand-kit` to package `dist/brand-kit-v2.zip`.
- Added GitHub Action to build and upload artifact `brand-kit-v2.zip` on pushes to `main`.
- Added browser preview at `/preview/brand-kit` with grid layout for platform rows, Minimal vs Edgy side-by-side, responsive for desktop and mobile.