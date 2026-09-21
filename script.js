(function () {
  const WORKER_BASE = (window.FXEMBED_WORKER_BASE || 'https://bruhx.com').replace(/\/$/, '');

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  const embedContainer = document.getElementById('tweet-embed');
  const downloadButton = document.getElementById('download-button');
  const hint = document.getElementById('hint');

  if (!id || !/^\d{2,20}$/.test(id)) {
    embedContainer.innerHTML = '<p class="error">No post ID provided. Add ?id=&lt;status id&gt; to the URL.</p>';
    return;
  }

  /* Embed the original tweet using Twitter's official widget. This runs
     entirely in the visitor's browser against platform.twitter.com, so
     the Cloudflare Worker is never involved in rendering the embed. */
  const blockquote = document.createElement('blockquote');
  blockquote.className = 'twitter-tweet';
  const link = document.createElement('a');
  link.href = `https://twitter.com/i/status/${id}`;
  blockquote.appendChild(link);
  embedContainer.appendChild(blockquote);

  const widgetsScript = document.createElement('script');
  widgetsScript.src = 'https://platform.twitter.com/widgets.js';
  widgetsScript.async = true;
  document.body.appendChild(widgetsScript);

  /* Only the worker can resolve the underlying video and stream it back
     with a Content-Disposition header that forces a real download, so the
     button just points straight at that endpoint. */
  downloadButton.href = `${WORKER_BASE}/download/${id}/file`;
  downloadButton.removeAttribute('aria-disabled');
  downloadButton.setAttribute('download', `${id}.mp4`);
  hint.textContent = "If the download doesn't start, this post may not contain a video.";
})();
