## Lost & Found (Monochrome)

A simple, strictly black-and-white Lost &amp; Found website with four pages: Home, Items, Report, and About Us.

### Pages

- **Home**: Intro text and primary actions to report a lost or found item, plus a link to browse items.
- **Items**: Displays all items with search and filters (category, status, date range) and a detail dialog for each item.
- **Report**: Toggle between reporting a lost or found item, with validation and submission that adds to the Items list.
- **About Us**: Mission, how it works, privacy/safety notes, and admin contact.

### Tech stack

- Plain HTML, CSS, and JavaScript frontend.
- Express API backed by Firebase Firestore.
- Optional image uploads through Cloudinary.

### Setup and running

1. Copy `.env.example` to `.env` and fill in the Firebase settings. The Firebase project must allow the server's requests through its Firestore rules.
2. To enable image uploads, also add the Cloudinary cloud name and unsigned upload preset. Reports without images work without these two settings.
3. Install dependencies with `npm install`, then start the app with `npm start`.
4. Open `http://localhost:3000`.

Run `npm run check` to perform JavaScript syntax checks.

### Notes

- The entire UI is monochrome (black and white only). Any images are rendered in grayscale with no color accents.
- Navigation is keyboard accessible, and form fields provide clear black/white error states on invalid input.

