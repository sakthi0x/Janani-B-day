# Birthday Letter

A single-page birthday site with an envelope cover that opens on click to
reveal the message, a photo gallery, an interactive candle-blow-out cake,
and an age/countdown section.

## Setup

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually http://localhost:5173).

## Build for deployment

```bash
npm run build
```

This outputs a static site into `dist/`, which you can deploy anywhere
(Netlify, Vercel, GitHub Pages, etc.).

## Personalizing

Open `src/App.jsx` and edit the `CONFIG` object near the top:

- `name` — the birthday person's name
- `senderName` — your name
- `message` — the birthday message
- `mode` — `"age"` to show the age they're turning, or `"countdown"` to
  count down to a future date
- `age` / `targetDate` — used depending on `mode`
- `photos` — an array of image URLs to fill the gallery (leave empty for
  placeholders)

No other files need to change for a new birthday.
