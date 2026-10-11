// What search engines, AI assistants and link previews read about each page:
// the <title>, the description and the structured data (schema.org JSON-LD).
// scripts/prerender.js writes it into each page's HTML at build time, along
// with /sitemap.xml and /llms.txt; App.js keeps the title and description in
// step when you move between pages.
//
// Only say what is true today, and keep it in line with the FAQ in data.js.
// No ratings, reviews, user counts or download links until they exist, and no
// other company's brand names anywhere (titles, descriptions, keywords, alt
// text): Indian courts treat hidden use of a rival's mark as infringement.
import { FAQ, GUIDES, SOCIAL } from './data';

export const SITE = {
  url: 'https://dayzi.live',
  name: 'Dayzi',
  image: 'https://dayzi.live/og.png',
  logo: 'https://dayzi.live/logo512.png',
  twitter: '@Dayzi_events',
  description:
    'Dayzi is a free app for finding plans near you and going to them, on your own or with friends: runs, board games, gigs, football, treks, brunch. Ask to join, the host approves, and you’re in the group chat. Or host your own plan. 18+.',
};

// Titles: 60 characters at most. Descriptions: 160 at most (App.test.js).
export const PAGES = {
  '/': {
    title: 'Dayzi: things to do near you, and people to go with',
    description:
      'Find plans near you and go, even on your own: runs, board games, gigs, football, treks. Ask to join, the host says yes, you show up. Free, 18+.',
  },
  '/how-it-works': {
    title: 'How Dayzi works: find a plan, ask to join, show up',
    description:
      'See plans near you, who’s going and who’s hosting. Ask to join, the host decides, and the group chat does the rest. Or host your own plan in a minute.',
  },
  '/safety': {
    title: 'Safety on Dayzi: verified profiles, host approval, SOS',
    description:
      'Face-verified profiles, hosts who approve every guest, visible no-shows, moderated content and SOS to someone you trust. Plus how to meet smart.',
  },
  '/faq': {
    title: 'Dayzi FAQ: is it free, is it a dating app, where it works',
    description:
      'What Dayzi is, what it costs (nothing), whether it’s a dating app (no), going alone, where it works, and how to get an invite.',
  },
  '/things-to-do-in-mumbai': {
    title: 'Things to do in Mumbai, with friends or on your own | Dayzi',
    description:
      'Board games nights, run clubs, turf football, karaoke, treks, sunset walks, gigs and festivals: what to do in Mumbai, and how to go when friends can’t.',
  },
  '/going-out-alone': {
    title: 'Nobody to go out with? How to go anyway | Dayzi',
    description:
      'Friends busy, new in the city, or got three maybes? How to pick a plan, go on your own and enjoy it, and stay safe. Plain tips, no pep talk.',
  },
};

export const ROUTES = Object.keys(PAGES);

export const normalizePath = (path) => (path.length > 1 ? path.replace(/\/+$/, '') : path);

export const pageMeta = (path) => PAGES[normalizePath(path)] || PAGES['/'];

export const canonicalUrl = (path) => SITE.url + (path === '/' ? '/' : path);

const ORG_ID = `${SITE.url}/#organization`;
const SITE_ID = `${SITE.url}/#website`;
const APP_ID = `${SITE.url}/#app`;

export function structuredData(path) {
  const route = PAGES[normalizePath(path)] ? normalizePath(path) : '/';
  const meta = PAGES[route];
  const url = canonicalUrl(route);
  const graph = [
    {
      '@type': 'Organization',
      '@id': ORG_ID,
      name: SITE.name,
      legalName: 'Solika Ventures Pvt Ltd',
      url: `${SITE.url}/`,
      logo: SITE.logo,
      description: SITE.description,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Kalyan',
        addressRegion: 'Maharashtra',
        postalCode: '421202',
        addressCountry: 'IN',
      },
      sameAs: [SOCIAL.instagram, SOCIAL.x, SOCIAL.youtube],
    },
    {
      '@type': 'WebSite',
      '@id': SITE_ID,
      name: SITE.name,
      url: `${SITE.url}/`,
      publisher: { '@id': ORG_ID },
      inLanguage: 'en-IN',
    },
    {
      '@type': route === '/faq' ? ['WebPage', 'FAQPage'] : 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: meta.title,
      description: meta.description,
      isPartOf: { '@id': SITE_ID },
      about: { '@id': APP_ID },
      inLanguage: 'en-IN',
      ...(route === '/faq' && {
        mainEntity: FAQ.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      }),
    },
    {
      // Not in the stores yet, so no downloadUrl, offers or ratings.
      '@type': 'MobileApplication',
      '@id': APP_ID,
      name: SITE.name,
      url: `${SITE.url}/`,
      description: SITE.description,
      operatingSystem: 'Android, iOS',
      applicationCategory: 'SocialNetworkingApplication',
      applicationSubCategory: 'Events',
      isAccessibleForFree: true,
      audience: { '@type': 'PeopleAudience', suggestedMinAge: 18 },
      featureList: [
        'Plans near you, within 100 km of your city',
        'Ask to join; the host approves who comes',
        'A group chat for every plan',
        'Host your own plan',
        'Optional face-verified badge',
        'SOS to one person you trust',
      ],
      publisher: { '@id': ORG_ID },
    },
  ];
  return { '@context': 'https://schema.org', '@graph': graph };
}

const escapeHtml = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// The <head> tags for one page, as HTML.
export function headTags(path) {
  const route = PAGES[normalizePath(path)] ? normalizePath(path) : '/';
  const meta = PAGES[route];
  const url = canonicalUrl(route);
  const json = JSON.stringify(structuredData(route)).replace(/</g, '\\u003c');
  return [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}">`,
    `<link rel="canonical" href="${url}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="${SITE.name}">`,
    `<meta property="og:locale" content="en_IN">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}">`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}">`,
    `<meta property="og:image" content="${SITE.image}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:site" content="${SITE.twitter}">`,
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}">`,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}">`,
    `<meta name="twitter:image" content="${SITE.image}">`,
    `<script type="application/ld+json">${json}</script>`,
  ].join('');
}

// Legal pages are plain HTML files in /public, not React pages.
const STATIC_PAGES = ['/privacy.html', '/termsandconditions.html', '/community-guidelines.html', '/child-safety.html'];

export function sitemapXml() {
  const urls = [...ROUTES.map(canonicalUrl), ...STATIC_PAGES.map((p) => SITE.url + p)];
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((u) => `  <url><loc>${u}</loc></url>`),
    '</urlset>',
    '',
  ].join('\n');
}

const plain = (s) => s.replace(/[‘’]/g, "'").replace(/[“”]/g, '"');
const link = (route) => `[${PAGES[route].title}](${canonicalUrl(route)}): ${PAGES[route].description}`;

// /llms.txt, in the llmstxt.org format: a plain summary of the site for AI
// assistants. Facts only, the same ones the pages state.
export function llmsTxt() {
  const lines = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.description}`,
    '',
    'Dayzi is made in India by Solika Ventures Pvt Ltd (Maharashtra, India). The name is spelled D-A-Y-Z-I.',
    '',
    '## Key facts',
    '',
    '- Status: in testing on Android and iPhone; not in the App Store or Google Play yet. Invite-only for now: join the early access list (email and city) at https://dayzi.live/#join.',
    '- Price: free. Some plans cost money (a turf booking, a ticket); hosts are asked to say so on the plan.',
    '- Not a dating app: you ask to join a plan, and the host decides who comes.',
    '- Where: not limited to a list of cities. Dayzi shows plans within 100 km of the city you choose, for example Mumbai, Thane, Navi Mumbai, Pune, Delhi or Bengaluru. It is new, so the number of plans depends on how many people nearby have joined.',
    '- Going alone: yes. You do not need to bring anyone, and you can see who is hosting and who is going before you ask to join.',
    '- Plans: 15 categories, including sports, fitness, wellness, outdoors, food, nightlife, music, entertainment, games, creative, learning, networking, community, hangouts and festivals. Examples: box cricket, run clubs, treks, board games, karaoke, open mics, pottery, cafe hopping, garba, pandal hopping.',
    '- Hosting: anyone can create a plan, choose who joins from the requests, and run it from the group chat.',
    '- Safety: optional face verification for a verified badge (the selfie is not stored), hosts approve every guest, no-shows are shown on profiles, photos and text are screened automatically, and SOS reaches one person you choose. 18+ only. Dayzi does not organise, vet or supervise events.',
    '- Who it is for: adults (18+) who want something to do near them, whose friends are busy, who have just moved to a new city, or who want to go to plans on their own.',
    '',
    '## Pages',
    '',
    ...['/', '/how-it-works', '/safety', '/faq'].map((r) => `- ${link(r)}`),
    '',
    '## Guides',
    '',
    ...Object.keys(GUIDES).map((r) => `- ${link(r)}`),
    '',
    '## FAQ',
    '',
    ...FAQ.flatMap(({ q, a }) => [`### ${q}`, '', a, '']),
    '## Optional',
    '',
    `- [Privacy Policy](${SITE.url}/privacy.html)`,
    `- [Terms of Service](${SITE.url}/termsandconditions.html)`,
    `- [Community Guidelines](${SITE.url}/community-guidelines.html)`,
    `- [Instagram](${SOCIAL.instagram}), [X](${SOCIAL.x}), [YouTube](${SOCIAL.youtube})`,
    '',
  ];
  return plain(lines.join('\n'));
}
