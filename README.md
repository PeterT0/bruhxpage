# fxembed-download-page

A static "download this tweet's video" landing page, meant to be hosted on GitHub Pages (or any static host) instead of being rendered by the FxEmbed Cloudflare Worker.

## Why this exists

The Worker previously rendered this page itself (fetching the tweet, building HTML, etc.) on every click. That's real CPU/subrequest cost on every "Download video" click from the Telegram Instant View link. This page moves that rendering entirely to the client:

- The tweet embed is rendered by Twitter's own `widgets.js`, fetched directly from `platform.twitter.com` - the Worker is not involved at all.
- The "Download media" button links straight to the Worker's `/download/:id/file` endpoint, which is the one piece that *has* to run server-side (it fetches the actual video bytes and adds a `Content-Disposition: attachment` header so the browser downloads instead of just playing it).

So the Worker only ever does one cheap thing per visitor: stream a video file, if and when they actually click download.

## Setup

1. Push this folder as a GitHub repo.
2. In the repo settings, enable **GitHub Pages** (serve from the root of `main`, or from a `gh-pages` branch - your choice).
3. Edit `config.js` and set `FXEMBED_WORKER_BASE` to your deployed Worker's domain (currently set to `https://bruhx.com`).
4. (Optional) Point a custom domain at the Pages site via the repo's Pages settings + a CNAME record.

## URL format

```
https://<your-pages-domain>/?id=<tweet status id>
```

## Wiring it into FxEmbed

In the FxEmbed repo, `src/render/instantview.ts` builds the "Download video" link shown in the Telegram Instant View. Point `DOWNLOAD_PAGE_BASE_URL` (in `src/constants.ts`) at this page's deployed URL so that link sends visitors here instead of to the Worker's own HTML.
