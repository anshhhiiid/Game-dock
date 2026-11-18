# GAME DOCK implementation notes

## Start the project

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` (the included local `.env` already points to JSON Server at `http://localhost:3000`).
3. Start JSON Server in terminal 1: `npx json-server db.json --port 3000`
4. Start Vite in terminal 2: `npm run dev`

## Database-backed cart and wishlist

The `carts` and `wishlists` arrays in `db.json` hold one record per user:

- `userId`: the logged-in user's JSON Server ID.
- `items`: the user's cart or wishlist items.

Redux loads these records after the session is restored or a user logs in. Cart/wishlist changes are written through Axios to JSON Server. Cart and wishlist are no longer read from or written to localStorage. `localStorage` is still used for the login session only.

Old cart/wishlist values previously stored in the browser are not automatically migrated; they remain unused.

## API CRUD coverage

- Products: GET, POST, PATCH, DELETE in `productService.js` and `productSlice.js`.
- Games: GET, POST, PATCH, DELETE in `gameService.js` and `gameSlice.js`.
- Users: GET, POST, PATCH, DELETE in `userService.js` and `userSlice.js`.
- Orders: GET (all/by user/by ID), POST, PATCH, DELETE in `orderService.js` and `orderSlice.js`.
- Carts and wishlists: GET by user, create record, update items, remove individual items, and clear items through `userCollectionService.js` and their Redux slices.

The CRUD actions are available in the service/Redux layers for management screens or admin workflows. Existing storefront UI was kept intact; a dedicated admin CRUD dashboard is not added in this change.

## Notes

- `.env` is ignored by Git; keep `.env.example` committed.
- JSON Server is a mock API, not a production backend.
- The existing demo authentication still stores passwords in `db.json` as plain text. Do not use real passwords or deploy this authentication as production security.
- JSON Server does not provide atomic multi-record transactions; production stock/order processing should be moved to a backend with transaction support.
