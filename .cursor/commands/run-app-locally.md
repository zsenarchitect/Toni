# Run App Locally (Cursor Command)

Start the HairVision Next.js dev server and open it in the Cursor browser, with strong **debug visibility** (terminal logs + browser console/network).

## Assumptions

- App folder: `hair-vision/`
- Dev command: `npm run dev`
- Local URL: `http://localhost:3000`

## Steps (do this in order)

1. **Start dev server (non-interactive)**
   - `cd hair-vision`
   - If `node_modules/` is missing: `npm ci`
   - Run: `npm run dev`
2. **Keep the terminal visible**
   - Watch for build errors, route errors, and runtime logs from API routes
3. **Open the app in Cursor browser**
   - Navigate to: `http://localhost:3000`
4. **Sanity check key routes**
   - `http://localhost:3000/presentation/external`
   - `http://localhost:3000/presentation/internal`

## Debug checklist

- **Terminal**: no crash loops, no build failures
- **Browser console**: no uncaught exceptions
- **Network**: check any failing requests (4xx/5xx), especially `/api/*`

## If something fails

Report:
- terminal error output
- browser console stack trace
- the URL/route you were on
