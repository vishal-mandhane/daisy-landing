// dayzi.live/download: the one link for the Instagram bio, posts and the
// standee QR. Android goes straight to Google Play, iPhone to the App Store
// (once APP_STORE_LIVE in src/stores.js is true), and everyone else to the
// badges at dayzi.live/#download. ?src=instagram is passed on to the store.
//
// Vercel runs this file before the site on the paths in `config.matcher`
// (Routing Middleware); no other path ever reaches it. It answers with a
// plain 302, not a page with a script, so it works the same inside the
// Instagram and WhatsApp in-app browsers, whose user agents still say
// "iPhone" or "Android".
//
// APP_STORE_PROVIDER_TOKEN (optional, Vercel environment variable): the pt=
// value from an App Store Connect campaign link. With it, App Store links
// carry ct=<src> so App Store Connect counts each source.
import { downloadTarget } from './src/stores.js';

export const config = { matcher: ['/download', '/download/'] };

export default function middleware(request) {
  const url = new URL(request.url);
  const location = downloadTarget({
    userAgent: request.headers.get('user-agent') || '',
    src: url.searchParams.get('src') || '',
    providerToken: (typeof process !== 'undefined' && process.env.APP_STORE_PROVIDER_TOKEN) || '',
  });
  return new Response(null, {
    status: 302,
    headers: {
      Location: location,
      // The answer depends on who's asking: never cache it, anywhere.
      'Cache-Control': 'no-store',
      Vary: 'User-Agent',
      'X-Robots-Tag': 'noindex',
    },
  });
}
