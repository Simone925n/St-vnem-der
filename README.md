# Sunday Club

A frontend-only, mobile-first weekend planner for Simone, Naja, katrine and Cille. Simone is the current user. No backend, authentication, external APIs or deployment. Fonts ship locally with the app.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```sh
npm ci --cache /tmp/sunday-npm-cache
npm run dev
```

## Try the complete story

1. October 24 starts with Naja, katrine and Cille available. Mark Simone available to trigger **YAY!**
2. Close the celebration and press **I’M IN ✓**. Availability alone does not commit anyone.
3. Use **Prototype playground** to individually commit the other three friends. The fourth commitment triggers **IT’S A DATE!** and confirms the day.
4. Remove Simone’s availability to break the match. All commitments clear so a changed group must agree again.
5. Browse months or filter matches. October 17 starts as a match with katrine already committed, so Simone’s commitment demonstrates “2 of 4 committed.”

Progress is saved in this browser’s localStorage. **Reset the demo** restores the fixtures. There is no shared data between browsers or actual friend activity.

## Architecture / future backend

`src/store.js` owns the friend fixtures, date grouping, availability arrays, commitment arrays, stage calculation and state transitions. `src/main.js` renders that state and connects UI events to the store. `src/style.css` owns the responsive visual design.

A future API adapter can replace `loadState()` and `save()` with fetching and persisting availability and commitments. Keep those as separate records keyed by user and date. The backend should independently validate four-person eligibility and confirmations, handle changes and concurrency, and identify the current user. The UI can keep consuming the same day/state shape. No backend is implemented here.

## Verification

```sh
npm test
npm run test:e2e
npm run build
```

Browser tests use `/usr/bin/chromium` in this cloud environment. Set `CHROMIUM_PATH` for another Chromium installation. Tests cover desktop and a 390px phone viewport, the full celebration/commitment flow, persistence, removing availability, month navigation, filters and horizontal overflow. Unit tests cover weekend-only grouping, cross-month weekends, partial availability, unique commitments and corrupted saved state.

Reduced-motion preferences disable confetti and animations; celebration dialogs support keyboard focus trapping and Escape.

## GitHub Pages (prepared, not deployed)

The cloud server is reachable internally, but this session does not expose a supported browser preview or inbound port-forwarding URL. For a browser-accessible site, the project is prepared for GitHub Pages at the repository path `/St-vnem-der/`.

`npm run build:pages` creates `dist/` with the correct asset paths. The regular development and build commands retain their existing behavior. Application source, content, styling and localStorage behavior are unchanged.

When you decide to publish:

1. Commit and push the frontend files, lockfile and `.github/workflows/pages.yml` to `Simone925n/St-vnem-der`. These files currently exist only in the cloud checkout.
2. In the GitHub repository, open **Settings → Pages** and select **GitHub Actions** as the build/deployment source. Pages must be available for your repository/account.
3. Open **Actions → Deploy frontend to GitHub Pages → Run workflow** and select the branch containing these files. This manual action builds and publishes the frontend.
4. Open the site URL reported by the successful deployment. Its expected address is `https://simone925n.github.io/St-vnem-der/` (it is not live from this preparation).

The workflow has no push or pull-request trigger. Merely adding or pushing it does not deploy anything. No secrets, database, backend or external API are required. A newly hosted origin has its own browser-local demo progress; it does not copy the cloud browser's localStorage or share state with friends.

Alternatively, copy the project to your computer and run `npm ci` and `npm run dev`, then open the local address Vite prints in your own browser. Cloud localhost addresses do not point to your computer.
