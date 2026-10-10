// Everything the site says lives here, so copy edits don't need to touch layout.

export const FORM_ACTION = 'https://eomail5.com/form/b7b93d50-eaf6-11f0-abdc-bf3561320fe8';

export const SOCIAL = {
  instagram: 'https://www.instagram.com/dayzi_india/',
  instagramHandle: '@dayzi_india',
  x: 'https://x.com/Dayzi_events',
  youtube: 'https://www.youtube.com/@DAYZIPARTY',
};

export const NAV = [
  { to: '/how-it-works', label: 'How it works' },
  { to: '/safety', label: 'Safety' },
  { to: '/faq', label: 'FAQ' },
];

export const TICKER = [
  'Rooftop gigs',
  'Board games & chill',
  'Sunset picnics',
  'Techno nights',
  'Sunday football',
  'Candlelit supper clubs',
  'Pottery for beginners',
  'Bar hopping',
  'Brunch',
  'Karaoke',
];

// Clips live in /public/app as <name>.mp4 with a <name>.jpg poster.

// Home page: the three-step version.
export const STEPS = [
  {
    n: '01',
    clip: 'nearby',
    label: 'Find a plan',
    title: ['What’s ', 'hot', ' nearby.'],
    body: 'Everything near you, in one scroll. Ranked by requests, spots filled and how soon it starts.',
  },
  {
    n: '02',
    clip: 'details',
    label: 'Ask to join',
    title: ['See it ', 'all', '.'],
    body: 'Who’s going, the ages, the host, the details. Like it? Swipe to send a request.',
  },
  {
    n: '03',
    clip: 'going',
    label: 'Show up',
    title: ['You’re ', 'going', '.'],
    body: 'Once the host lets you in, the plan is tagged attending and you’re in the group chat.',
  },
];

// How it works page, chapter one: the app.
export const HOME_FEATURES = [
  {
    clip: 'nearby',
    label: 'Trending near you',
    title: ['What’s ', 'hot', ' nearby.'],
    body: 'Ranked by requests, spots filled and how soon it starts. Tap the heart to save one.',
  },
  {
    clip: 'vibes',
    label: 'Every category',
    title: ['A row for every ', 'vibe', '.'],
    body: 'Nightlife, food, outdoors: one row per category near you.',
  },
  {
    clip: 'details',
    label: 'Tap any plan',
    title: ['See it ', 'all', '.'],
    body: 'Who’s going, the ages, the host, the details. Swipe to send a request.',
  },
  {
    clip: 'going',
    label: 'Your plans',
    title: ['You’re ', 'going', '.'],
    body: 'Plans you joined are tagged attending, right at the top of your home.',
  },
  {
    clip: 'hosting',
    label: 'Your plans',
    title: ['You’re ', 'hosting', '.'],
    body: 'Plans you made are tagged hosting. Swipe through them all.',
  },
  {
    clip: 'requests',
    label: 'Up top',
    title: ['Requests ', 'first', '.'],
    body: 'Hosting? New join requests wait right here. You decide who gets in.',
  },
];

// How it works page, chapter two: your profile.
export const PROFILE_STEPS = [
  {
    clip: 'p-vibes',
    label: 'Vibes',
    title: ['Pick five ', 'vibes', '.'],
    body: 'Exactly five. Karaoke, rooftop parties, run clubs: whatever is you.',
  },
  {
    clip: 'p-face',
    label: 'Your photo',
    title: ['Show your ', 'face', '.'],
    body: 'A clear photo helps people recognise you when you show up.',
  },
  {
    clip: 'p-badge',
    label: 'Verified badge',
    title: ['Get the ', 'badge', '.'],
    body: 'A selfie doing the gesture we ask for, matched to your photo. The selfie isn’t kept.',
  },
  {
    clip: 'p-anthem',
    label: 'Your song',
    title: ['Your ', 'anthem', '.'],
    body: 'Pick a song. The selfie check finishes in the background, so you never wait.',
  },
  {
    clip: 'p-three',
    label: 'About you',
    title: ['Say it in ', 'three', '.'],
    body: 'Answer three prompts. With a song and a show, that’s all you need to join or host.',
  },
  {
    clip: 'p-mia',
    label: 'The result',
    title: ['Meet ', 'you', '.'],
    body: 'Photo, verified badge, vibes, prompts, song and show. All on one page.',
  },
];

export const SAFETY = [
  {
    n: '01',
    title: ['Face-', 'verified', '.'],
    body: 'A selfie with a gesture, matched to your profile photo, proves you’re a real, unique person. The selfie is used for the check and isn’t stored. Verified people get the badge.',
  },
  {
    n: '02',
    title: ['Hosts ', 'choose', '.'],
    body: 'Nobody walks into a plan uninvited. You ask to join, the host sees your profile, and they decide.',
  },
  {
    n: '03',
    title: ['The ghost ', 'counter', '.'],
    body: 'RSVP and don’t turn up? It shows on your profile. Plans only work when people show up.',
  },
  {
    n: '04',
    title: ['SOS to ', 'your person', '.'],
    body: 'Pick one person you trust. If you ever need them, SOS reaches them in a tap.',
  },
  {
    n: '05',
    title: ['Moderated, ', '18+', '.'],
    body: 'Photos and text are screened automatically, and Dayzi is for adults only. No exceptions.',
  },
];

export const MEET_SMART = [
  'Meet in public places, at least the first time.',
  'Tell a friend where you’re going.',
  'Get yourself there and back.',
  'Trust your gut. Leaving is always allowed.',
];

export const FAQ = [
  {
    q: 'What is Dayzi?',
    a: 'A social events app. Find plans happening around you, ask to join, chat with everyone going, and show up. Or host your own.',
  },
  {
    q: 'How do I get in?',
    a: 'Join the list with your email and city. We’re sending rolling invites, and people on the list get in first.',
  },
  {
    q: 'Can I host my own plans?',
    a: 'Yes. Create a plan in a minute, choose who gets in from the requests, and run it from the group chat. Dayzi can even help write the description.',
  },
  {
    q: 'What goes on my profile?',
    a: 'A photo, five vibes, a song, a show and three prompts. Add the verified badge with a quick selfie check.',
  },
  {
    q: 'Is it safe to meet people from Dayzi?',
    a: 'Profiles can be face-verified, hosts choose who joins, no-shows are visible, content is moderated, and SOS reaches a person you choose. Dayzi doesn’t vet or supervise events, so meet in public and trust your judgement.',
  },
  {
    q: 'Who can use Dayzi?',
    a: 'Anyone 18 or older.',
  },
];
