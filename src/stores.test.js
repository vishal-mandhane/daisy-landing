import { APP_STORE_URL, DOWNLOAD_SECTION_URL, PLAY_STORE_URL, cleanSource, downloadTarget } from './stores';

// User agents in the format each browser sends, one per place people open
// dayzi.live/download: the phone browsers, the Instagram and Facebook in-app
// browsers, laptops, and the bots that fetch link previews.
const UA = {
  iphoneSafari:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1',
  iphoneChrome:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/139.0.7258.76 Mobile/15E148 Safari/604.1',
  iphoneInstagram:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 393.0.0.30.85 (iPhone15,2; iOS 18_6; en_IN; en; scale=3.00; 1179x2556; 781914064)',
  iphoneFacebook:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [FBAN/FBIOS;FBAV/520.0.0.38.101;FBBV/751207890;FBDV/iPhone15,2;FBMD/iPhone;FBSN/iOS;FBSV/18.6;FBSS/3;FBID/phone;FBLC/en_GB;FBOP/5;FBRV/753964393]',
  ipadMobileSite:
    'Mozilla/5.0 (iPad; CPU OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1',
  // What an iPad sends by default (desktop-class browsing since iPadOS 13).
  ipadDesktopSite:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15',
  androidChrome:
    'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36',
  androidInstagram:
    'Mozilla/5.0 (Linux; Android 14; SM-S918B Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/139.0.7258.94 Mobile Safari/537.36 Instagram 393.0.0.42.80 Android (34/14; 450dpi; 1080x2340; samsung; SM-S918B; dm3q; qcom; en_IN; 783241562)',
  androidFacebook:
    'Mozilla/5.0 (Linux; Android 14; SM-S918B Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/139.0.7258.94 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/521.0.0.48.108;]',
  androidSamsung:
    'Mozilla/5.0 (Linux; Android 14; SAMSUNG SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/28.0 Chrome/130.0.0.0 Mobile Safari/537.36',
  windowsChrome:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
  macSafari:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15',
  linuxFirefox: 'Mozilla/5.0 (X11; Linux x86_64; rv:142.0) Gecko/20100101 Firefox/142.0',
  // Link previews: they should land on the site and read its og: tags.
  whatsappPreview: 'WhatsApp/2.25.21.80 A',
  facebookPreview: 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
};

const IOS = ['iphoneSafari', 'iphoneChrome', 'iphoneInstagram', 'iphoneFacebook', 'ipadMobileSite'];
const ANDROID = ['androidChrome', 'androidInstagram', 'androidFacebook', 'androidSamsung'];
const OTHER = ['ipadDesktopSite', 'windowsChrome', 'macSafari', 'linuxFirefox', 'whatsappPreview', 'facebookPreview'];

test.each(ANDROID)('%s goes to Google Play', (name) => {
  expect(downloadTarget({ userAgent: UA[name] })).toBe(PLAY_STORE_URL);
});

test.each(IOS)('%s goes to the App Store once it is live', (name) => {
  expect(downloadTarget({ userAgent: UA[name], appStoreLive: true })).toBe(APP_STORE_URL);
});

test.each(IOS)('%s lands on the badges until the App Store is live', (name) => {
  expect(downloadTarget({ userAgent: UA[name], appStoreLive: false, src: 'instagram', providerToken: '123' })).toBe(
    DOWNLOAD_SECTION_URL
  );
});

test.each(OTHER)('%s lands on the badges', (name) => {
  expect(downloadTarget({ userAgent: UA[name], appStoreLive: true, src: 'instagram' })).toBe(DOWNLOAD_SECTION_URL);
});

test('no user agent at all lands on the badges', () => {
  expect(downloadTarget({})).toBe(DOWNLOAD_SECTION_URL);
  expect(DOWNLOAD_SECTION_URL).toBe('https://dayzi.live/#download');
});

test('?src= reaches Google Play as the install referrer', () => {
  expect(downloadTarget({ userAgent: UA.androidInstagram, src: 'instagram' })).toBe(
    'https://play.google.com/store/apps/details?id=com.vm.daisy&referrer=utm_source%3Dinstagram'
  );
  expect(downloadTarget({ userAgent: UA.androidChrome, src: 'standee' })).toBe(
    'https://play.google.com/store/apps/details?id=com.vm.daisy&referrer=utm_source%3Dstandee'
  );
});

test('?src= reaches the App Store only with a provider token', () => {
  const live = { userAgent: UA.iphoneInstagram, appStoreLive: true };
  expect(downloadTarget({ ...live, src: 'instagram', providerToken: '128045617' })).toBe(
    'https://apps.apple.com/app/id6811430749?ct=instagram&pt=128045617'
  );
  expect(downloadTarget({ ...live, src: 'instagram' })).toBe(APP_STORE_URL);
  expect(downloadTarget({ ...live, providerToken: '128045617' })).toBe(APP_STORE_URL);
});

test('?src= is cleaned before it goes anywhere', () => {
  expect(cleanSource('Instagram')).toBe('instagram');
  expect(cleanSource('insta bio!')).toBe('instabio');
  expect(cleanSource('"><script>alert(1)</script>')).toBe('scriptalert1script');
  expect(cleanSource('story_2026-11.v2')).toBe('story_2026-11.v2');
  expect(cleanSource('x'.repeat(100))).toHaveLength(40);
  expect(cleanSource(undefined)).toBe('');
  // Nothing usable left: the plain store link, no empty referrer.
  expect(downloadTarget({ userAgent: UA.androidChrome, src: '!!!' })).toBe(PLAY_STORE_URL);
});
