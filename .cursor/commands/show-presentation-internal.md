
# Show Internal Presentation (Cursor Command)

Open and verify the **internal presentation** page for HairVision.

## Goal

- Navigate to `hair-vision/src/app/presentation/internal/page.tsx` in the app
- Confirm it renders and slide navigation works
- Watch the console/network logs for any runtime errors

## Steps

1. **Ensure the app is running locally**
   - If not running, execute the `run-app-locally` command first (or start the dev server with `npm run dev` inside `hair-vision/`).
2. **Open the internal presentation route**
   - In the browser, go to: `http://localhost:3000/presentation/internal`
3. **Verify the page is healthy**
   - No red runtime error overlay
   - Console has **no errors** (warnings ok but note them)
   - Slide navigation works (next/previous), fullscreen toggle works if present

## What to report back

- The route opened (yes/no)
- Any console errors (copy the stack trace)
- Any broken UI interactions (what you clicked + what happened)



