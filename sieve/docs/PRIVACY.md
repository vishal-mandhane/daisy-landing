# Privacy

Sieve has no server, no account and no analytics. It cannot see what you watch because there is
nowhere for that data to go.

What leaves your browser, and only if you set it up:

| Destination | What is sent | When |
|---|---|---|
| OMDb or TMDB (your key) | the title and year of tiles on screen | Ratings lens on, key present; cached 21 days |
| huggingface.co | a request for model files (no page data) | once, when the embedding engine first loads |
| Your LLM endpoint (Ollama on localhost by default) | batches of video titles + channel names + your topic | LLM engine on |

Settings (including keys) are stored with `chrome.storage.sync`, which your browser may sync to
your own browser account. Caches use `chrome.storage.local`. Clear both from Settings → Data.

Permissions: `storage` (settings/caches), `unlimitedStorage` (model and cache size), `offscreen`
(runs the model in Chrome), host access to the listed streaming sites (to read tiles), to
omdbapi.com and themoviedb.org (ratings), and optional access to localhost (Ollama).
