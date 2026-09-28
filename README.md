# Our Spending Tracker 💑

A **shared** expense tracker for two — log rent, groceries, restaurants, gym, outings,
pet & household costs, split things 50/50, and see your monthly totals.

- **Vite + React + TypeScript**, deployed to **Netlify** (static frontend)
- **Supabase** = auth (email/password login for you + your partner) + database
- Row-Level Security so only signed-in household accounts touch the board

## 1. Create the Supabase project
1. Sign up at supabase.com (free) → **New project** → note your region + password.
2. Open **Project Settings** (gear) → **API** (may say *API Keys* / *Access Keys*).
3. Copy the **Project URL** (looks like `https://xxxx.supabase.co`) and the
   **anon / publishable** key (`sb_publishable_...`).

## 2. Run the schema
In Supabase: **SQL Editor** → paste in `supabase/schema.sql` → **Run**. This creates the
`spending` table, RLS policies, and the required grant statements. If a policy line says
"already exists," that's fine — only the grants need to run (they're safe to re-run).

## 3. Configure + run locally
```bash
npm install
cp .env.local.example .env.local   # then paste your URL + anon key in
npm run dev                          # http://localhost:5173
```

`.env.local`:
```
VITE_SUPABASE_URL=https://<ref>.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...
```

Note: with email confirmation on, new sign-ups must click the inbox link once.

## 4. Deploy to Netlify
1. Push this repo (or a folder) to GitHub (e.g. `Tanchai/spending-tracker`).
2. In Netlify: **Add new site** → Import from GitHub → build `npm run build`,
   publish `dist`, then set **Environment variables** `VITE_SUPABASE_URL` and
   `VITE_SUPABASE_ANON_KEY` (both env vars must be set, not committed).
3. Deploy → you both get a live URL + can log in from any device.
   SPA redirect is handled by `netlify.toml`.