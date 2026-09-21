// Base URL of the Cloudflare Worker that resolves and streams the actual
// video file. Only this one endpoint is ever called on the worker - the
// tweet embed itself is rendered entirely client-side via Twitter's own
// widget, so this static page adds no load to the worker beyond a single
// file download request when someone actually clicks the button.
window.FXEMBED_WORKER_BASE = 'https://bruhx.com';
