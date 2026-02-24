## Lost & Found (Monochrome)

A simple, strictly black-and-white Lost &amp; Found website with four pages: Home, Items, Report, and About Us.

### Pages

- **Home**: Intro text and primary actions to report a lost or found item, plus a link to browse items.
- **Items**: Displays all items with search and filters (category, status, date range) and a detail dialog for each item.
- **Report**: Toggle between reporting a lost or found item, with validation and submission that adds to the Items list.
- **About Us**: Mission, how it works, privacy/safety notes, and admin contact.

### Tech stack

- Plain HTML, CSS, and JavaScript.
- Items are stored in `localStorage` with realistic seed data (10+ items) for first load.

### Running the project

- **Option 1 (simplest)**: Open `index.html` directly in your browser (double-click or drag into a window).
- **Option 2 (recommended)**: Serve via a simple static server (for example, using `npx serve` in this folder) and open the provided URL.

### Notes

- The entire UI is monochrome (black and white only). Any images are rendered in grayscale with no color accents.
- Navigation is keyboard accessible, and form fields provide clear black/white error states on invalid input.

