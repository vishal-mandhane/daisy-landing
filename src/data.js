// Everything the page says lives here, so copy edits don't need to touch layout.

export const FORM_ACTION = 'https://eomail5.com/form/b7b93d50-eaf6-11f0-abdc-bf3561320fe8';

export const SOCIAL = {
  instagram: 'https://www.instagram.com/dayzi_india/',
  instagramHandle: '@dayzi_india',
  x: 'https://x.com/Dayzi_events',
  youtube: 'https://www.youtube.com/@DAYZIPARTY',
};

// Instagram reels
// - `url`: the reel link (Share -> Copy link).
// - Optional `video`: a downloaded copy saved in /public/reels (e.g. '/reels/night-1.mp4').
//   When set, the reel autoplays muted and looping, with no Instagram frame.
//   Without it, Instagram's official embed is used, with a styled fallback card.
// - Optional `poster`: still image for the card (e.g. '/reels/night-1.jpg').
export const REELS = [
  { url: 'https://www.instagram.com/reel/DTsjgDxiFUV/', caption: 'Dayzi vibes' },
  { url: 'https://www.instagram.com/reel/DTiLjz8CEPb/', caption: 'The night was electric' },
  { url: 'https://www.instagram.com/reel/DVBhZTriKUd/', caption: 'Energy was unmatched' },
  { url: 'https://www.instagram.com/reel/DX9cea6oyqw/', caption: 'You had to be there' },
];

export const TICKER = [
  'Rooftops',
  'Run clubs',
  'Gigs',
  'Game nights',
  'Brunches',
  'Open mics',
  'Day trips',
  'House parties',
  'Pottery',
  'Karaoke',
];

// Illustrative events for the app mockup in the hero.
export const SAMPLE_EVENTS = [
  { title: 'Sunset rooftop jam', tag: 'Music', when: 'Sat · 6:30 PM', going: 9, cap: 14, tone: 'tomato' },
  { title: 'Sunday 5K + filter coffee', tag: 'Fitness', when: 'Sun · 6:00 AM', going: 18, cap: 25, tone: 'mint' },
  { title: 'Board games & biryani', tag: 'Games', when: 'Fri · 8:00 PM', going: 5, cap: 8, tone: 'lilac' },
  { title: 'Open mic, then tacos', tag: 'Comedy', when: 'Thu · 9:00 PM', going: 11, cap: 20, tone: 'sun' },
];

export const STEPS = [
  {
    n: '01',
    title: 'Find a plan',
    body: "See what's happening near you, from rooftop gigs to Sunday runs. Pick by vibe, not by who you already know.",
  },
  {
    n: '02',
    title: 'Ask to join',
    body: 'Send a request. Hosts see your profile and let you in, so every plan fills up with people who actually fit.',
  },
  {
    n: '03',
    title: 'Show up',
    body: "You're in the group chat with everyone going. Sort the details, say hi, and turn up. That's the whole point.",
  },
];

export const SAFETY = [
  {
    title: 'Face-verified',
    body: 'A quick selfie check confirms you are a real, unique person. The selfie is used for the check and not stored.',
    icon: 'verified',
  },
  {
    title: 'Ghost counter',
    body: "RSVP and don't show? It shows on your profile. Plans only work when people turn up.",
    icon: 'ghost',
  },
  {
    title: 'SOS to your person',
    body: 'Pick one person you trust. If you need them, SOS reaches them in a tap.',
    icon: 'sos',
  },
  {
    title: 'Moderated, 18+',
    body: 'Photos and text are screened automatically, and Dayzi is for adults only. No exceptions.',
    icon: 'shield',
  },
];

export const FAQ = [
  {
    q: 'What is Dayzi?',
    a: 'A social events app. Find plans happening around you, ask to join, chat with everyone going, and show up. Or host your own.',
  },
  {
    q: 'How do I get in?',
    a: "Join the list with your email and city. We're sending rolling invites, and people on the list get in first.",
  },
  {
    q: 'Can I host my own plans?',
    a: 'Yes. Create an event in a minute, choose who gets in from their requests, and run it from the group chat. Dayzi can even help write the description.',
  },
  {
    q: 'Is it safe to meet people from Dayzi?',
    a: "Profiles are face-verified, no-shows are visible, content is moderated, and SOS reaches a person you choose. Still, Dayzi doesn't vet or supervise events, so meet in public places and trust your judgement.",
  },
  {
    q: 'Who can use Dayzi?',
    a: 'Anyone 18 or older.',
  },
];
