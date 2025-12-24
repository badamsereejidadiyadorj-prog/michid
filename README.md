# MICHID Next.js migration

This workspace contains a minimal Next.js scaffold converted from a static `index.html`.

Quick start:

1. Copy your Supabase credentials into `.env.local` (see `.env.local.example`).
2. Install dependencies:

```bash
npm install
```

3. Run dev server:

```bash
npm run dev
```

Admin page: [pages/admin](pages/admin/index.tsx) — it can list and create `categories` and read `orders` via Supabase. The `initSampleData` button attempts to insert sample rows into `categories` and `orders` (tables must exist).

Notes:

- This is a starter conversion. The original `index.html` was copied into `public/index.html` for reference; migrate pieces into React components/pages as needed.
- Create Supabase tables `categories` and `orders` in Supabase Dashboard or via SQL before using the admin insert features.
"# michid" 
