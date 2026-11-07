// Where to get the app: the one place the store links live. The badges, the
// copy that says where Dayzi is (FAQ, guides, seo.js) and the
// dayzi.live/download redirect (middleware.js) all read this file.
//
// iPhone launch day (10 Nov 2026, 12:00 IST): set APP_STORE_LIVE to true,
// commit and deploy. The App Store badge becomes a link and its countdown
// goes, /download sends iPhones to the App Store, and the copy names both
// stores. Nothing else needs to change.
//
// No React in here: middleware.js runs on Vercel's edge, outside the app.

export const APP_STORE_LIVE = false;

export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.vm.daisy';
export const APP_STORE_ID = '6811430749';
export const APP_STORE_URL = `https://apps.apple.com/app/id${APP_STORE_ID}`;

// The countdown under the App Store badge runs to this, while APP_STORE_LIVE
// is false.
export const APP_STORE_RELEASE = Date.parse('2026-11-10T12:00:00+05:30');
export const APP_STORE_SOON = 'Coming 10 Nov';

// The one link for the Instagram bio, posts and print. On laptops it lands
// on the badges, and so do iPhones until the App Store is live.
export const DOWNLOAD_URL = 'https://dayzi.live/download';
export const DOWNLOAD_SECTION_URL = 'https://dayzi.live/#download';

// For copy: "Dayzi is free, 18+, and <AVAILABILITY>."
export const AVAILABILITY = APP_STORE_LIVE
  ? 'on Google Play and the App Store'
  : 'on Google Play now, with the iPhone app coming to the App Store on 10 November';

// The same two tests, Apple first, as public/get.html.
const IOS = /iPhone|iPad|iPod/i;
const ANDROID = /Android/i;

// ?src=Instagram -> "instagram": lowercase letters, digits, dots, dashes and
// underscores, 40 at most. Anything else is dropped.
export function cleanSource(src) {
  return String(src || '')
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '')
    .slice(0, 40);
}

// Where dayzi.live/download sends someone, from their browser's user agent.
// iPads that ask for the desktop site (the default since iPadOS 13) say
// "Macintosh", so they land on the badges like a laptop.
export function downloadTarget({ userAgent = '', src = '', providerToken = '', appStoreLive = APP_STORE_LIVE } = {}) {
  const source = cleanSource(src);
  if (IOS.test(userAgent)) {
    if (!appStoreLive) return DOWNLOAD_SECTION_URL;
    // App Store campaign links need the provider token (pt) to count the
    // campaign (ct); without one, the plain link.
    if (!source || !providerToken) return APP_STORE_URL;
    return `${APP_STORE_URL}?ct=${encodeURIComponent(source)}&pt=${encodeURIComponent(providerToken)}`;
  }
  if (ANDROID.test(userAgent)) {
    // Play Console reports installs by utm_source, and the app can read it
    // through Google's Install Referrer API.
    if (!source) return PLAY_STORE_URL;
    return `${PLAY_STORE_URL}&referrer=${encodeURIComponent(`utm_source=${source}`)}`;
  }
  return DOWNLOAD_SECTION_URL;
}
