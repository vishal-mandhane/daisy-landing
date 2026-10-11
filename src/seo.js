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
    'Dayzi is a free app for the plans you don’t want to miss, big or small: a gig, a club night, a run, chai, the big match. Find a plan near you, ask to join, and when the host says yes, you’re in the group chat. No need to bring anyone. Or host your own plan. 18+. It’s in testing on Android and iPhone; join the invite list at dayzi.live.',
};

// Titles: 60 characters at most. Descriptions: 160 at most (App.test.js).
export const PAGES = {
  '/': {
    title: 'Dayzi app: friends bailed? Find a plan nearby and go',
    description:
      'A gig, a run, chai, the big match: when friends can’t make it, find a plan near you, ask to join and go anyway. Free, 18+, invite-only for now.',
  },
  '/how-it-works': {
    title: 'How Dayzi works: find a plan, ask to join, show up',
    description:
      'See plans near you, who’s going and who’s hosting. Ask to join, the host decides, and the group chat does the rest. Or host your own plan in a minute.',
  },
  '/safety': {
    title: 'Safety on Dayzi: verified badge, host approval, SOS',
    description:
      'An optional face-verified badge, hosts who approve every guest, visible no-shows, screened content and SOS to someone you trust. Plus how to meet smart.',
  },
  '/faq': {
    title: 'Dayzi FAQ: is it free, can I go alone, where does it work',
    description:
      'What Dayzi is, what it costs (nothing), going on your own, concerts and match screenings, travelling, whether it’s a dating app (no) and how to get in.',
  },
  '/things-to-do-in-mumbai': {
    title: 'Things to do in Mumbai, with friends or on your own | Dayzi',
    description:
      'Gigs, club nights, match screenings, sunset walks, run clubs, turf football, treks and festivals: what to do in Mumbai, and how to go when friends can’t.',
  },
  '/meet-locals': {
    title: 'New in town or travelling? How to meet locals | Dayzi',
    description:
      'Here for work, studies or a holiday? Join what locals do, from runs to match screenings, or post your own plan and let people nearby join. Plus safety tips.',
  },
  '/no-one-to-go-with': {
    title: 'No one to go with? How to go anyway | Dayzi',
    description:
      'Friends bailed on the gig, the match or the run? How to go on your own, pick plans that are easy to walk into, and get home safe.',
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
        'Plans within 100 km of the location on your profile',
        'Ask to join; the host approves who comes',
        'A group chat for every plan',
        'Host your own plan',
        'Optional face-verified badge',
        'SOS: opens WhatsApp with your location for one person you trust',
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
    '- Where: anywhere. Dayzi runs on location (coordinates), not a list of cities or countries. It shows plans within 100 km of the location on your profile, for example Mumbai, Thane, Navi Mumbai, Pune, Delhi, Bengaluru or a city abroad; change it to any city or country (one country at a time). It is new, so the number of plans depends on how many people nearby have joined.',
    '- Travellers, tourists and people new to a city: join plans locals post, or post your own (for example "new in town, anyone for chai at 6?") and people nearby can ask to join; a plan shows to people near its venue.',
    '- Going alone: yes. You do not need to bring anyone, and you can see who is hosting and who is going before you ask to join.',
    '- Plans, big and small: 15 categories, including sports, fitness, wellness, outdoors, food, nightlife, music, entertainment, games, creative, learning, networking, community, hangouts, and culture and spirituality. Examples: concerts, club nights, treks, evening walks, runs, chai and cafe hopping, watching cricket or football together, console and board games, karaoke, open mics, garba, pandal hopping.',
    '- Tickets: Dayzi does not sell tickets or take payments. If a plan needs a ticket, hosts are asked to say so and people buy their own.',
    '- Hosting: anyone can create a plan, choose who joins from the requests, and run it from the group chat.',
    '- Safety: an optional face-verified badge (the selfie is not stored), hosts approve every guest, attendees can mark no-shows and they show on profiles, photos and text are screened automatically, and SOS opens WhatsApp with your location for one person you choose. 18+ only. Dayzi does not organise, vet or supervise plans.',
    '- Who it is for: adults (18+) who do not want to miss a plan because their friends bailed or are busy, who are new to a city, travelling or on holiday, or who want to go to plans on their own.',
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
