// Everything the site says lives here, so copy edits don't need to touch layout.

export const FORM_ACTION = 'https://eomail5.com/form/b7b93d50-eaf6-11f0-abdc-bf3561320fe8';

export const SOCIAL = {
  instagram: 'https://www.instagram.com/dayzi_india/',
  instagramHandle: '@dayzi_india',
  x: 'https://x.com/Dayzi_events',
  youtube: 'https://www.youtube.com/@DAYZIPARTY',
};

// `to` is where the link goes; `page` is the page that marks it as current.
// How it works and Safety scroll to their section on the home page; the full
// pages are linked from inside those sections.
export const NAV = [
  { to: '/#how-it-works', page: '/how-it-works', label: 'How it works' },
  { to: '/#safety', page: '/safety', label: 'Safety' },
  { to: '/faq', page: '/faq', label: 'FAQ' },
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

// Home page: one look. A step is a clip, a label and one short line; the full
// tour lives on /how-it-works.
export const STEPS = [
  { n: '01', clip: 'nearby', label: 'Find a plan', line: 'Everything near you, in one scroll.' },
  { n: '02', clip: 'details', label: 'Ask to join', line: 'See who’s going. Send a request.' },
  { n: '03', clip: 'going', label: 'Show up', line: 'The host says yes. You’re in.' },
];

// Home page safety strip: one short line each; the detail is on /safety.
export const SAFETY_SHORT = [
  { icon: 'badge', text: 'Face-verified profiles' },
  { icon: 'users', text: 'Hosts choose who joins' },
  { icon: 'ghost', text: 'No-shows are visible' },
  { icon: 'phone', text: 'SOS to someone you trust' },
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
    body: 'A selfie with a gesture, matched to your profile photo, proves you’re a real, unique person. The selfie isn’t stored. Verified people get the badge.',
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

// Every answer here is checked against the app and the Terms: the app is free
// (Terms: "provided free of charge"), not a dating app ("a listings and
// coordination platform"), has no city list (plans within 100 km of the city
// you pick), and is in testing, not in the stores. Keep it that way; these
// answers are also what search engines and AI assistants quote.
export const FAQ = [
  {
    q: 'What is Dayzi?',
    a: 'A free app for finding plans near you and going to them: a run, a board games night, a gig, a trek. Ask to join, the host says yes, and you’re in the group chat. Or host your own.',
  },
  {
    q: 'How do I get Dayzi? Is it on Android and iPhone?',
    a: 'Dayzi is being tested on Android and iPhone and isn’t in the app stores yet. Join the list with your email and city. We’re sending rolling invites, and people on the list get in first.',
  },
  {
    q: 'Is Dayzi free?',
    a: 'Yes. Dayzi is free. Some plans cost money, like a turf booking or a ticket, and hosts are asked to say so on the plan.',
  },
  {
    q: 'Is Dayzi a dating app?',
    a: 'No. Dayzi is for plans: runs, gigs, football, board games, treks, brunch. You ask to join a plan, and the host decides who comes.',
  },
  {
    q: 'Can I go on my own?',
    a: 'Yes. You don’t need to bring anyone. You ask to join by yourself, and you can see who’s hosting and who’s going before you do.',
  },
  {
    q: 'Where does Dayzi work? Is it in Mumbai?',
    a: 'Dayzi isn’t limited to a list of cities. It shows plans within 100 km of the city you choose, so it works in Mumbai, Thane, Navi Mumbai, Pune, Delhi, Bengaluru or anywhere else in India. It’s new, so how many plans you see depends on how many people near you have joined.',
  },
  {
    q: 'What kind of plans are on Dayzi?',
    a: 'Whatever people near you post, across 15 categories: sports, fitness, wellness, outdoors, food, nightlife, music, entertainment, games, creative, learning, networking, community, hangouts, and festivals. Think box cricket, run clubs, treks, board games, karaoke, open mics, pottery, café hopping, garba and pandal hopping.',
  },
  {
    q: 'My friends are always busy. Can I still go out?',
    a: 'Yes, that’s what Dayzi is for. Find a plan you’d go to anyway, ask to join, and go. You don’t need anyone to come with you.',
  },
  {
    q: 'Will Dayzi help me make friends?',
    a: 'Maybe. Go to plans that interest you, talk to people in the group chat, and show up in real life. The app can only do so much; the rest is on you.',
  },
  {
    q: 'Is Dayzi for people who feel lonely?',
    a: 'Dayzi is for anyone who wants something to do this week: your friends are busy, you’ve just moved, or you want a change. It isn’t therapy and can’t promise friendship. If loneliness or low mood is weighing on you, talk to someone. In India, Tele-MANAS is a free, 24x7 government helpline: call 14416.',
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
    a: 'Anyone 18 or older. Hosts can also set an age range for their plan.',
  },
  {
    q: 'Why is it called Dayzi?',
    a: 'Because EventMeetupSocialNetworkingPlatform was taken. Also, daisies are chill and we wanted a chill vibe.',
  },
];

// Guides: one page each, written for what people actually search
// ("things to do in mumbai with friends", "nobody to go out with"). Plain
// advice first, Dayzi last. No venue or brand names, no claims about how many
// plans there are.
//
// A section has a heading `h` and any of: `body` (paragraphs), `items`
// ([lead, text] pairs), `link` ({ to, label } inside the site, or { href, label }).
export const GUIDES = {
  '/things-to-do-in-mumbai': {
    kicker: 'Mumbai',
    title: ['Things to do ', 'in Mumbai', '.'],
    lead: 'Something is on every night of the week. The hard part is rarely finding a plan; it’s finding someone free to go with. Here’s what’s worth going to, with friends or on your own.',
    image: '/app/vibes.jpg',
    sections: [
      {
        h: 'Weeknights, after work',
        items: [
          ['Board games nights.', 'A table, a stack of games and someone explaining the rules. One of the easiest rooms to walk into alone: there’s always something to do.'],
          ['Quiz and trivia nights.', 'Played in teams, so a team that’s one short will often take you in.'],
          ['Karaoke.', 'Nobody is judging your singing. Everyone is waiting for their own turn.'],
          ['Open mics.', 'Poetry, comedy, music. Perform, or just watch.'],
          ['Café hopping and chai.', 'The low-effort plan: an hour, a table, a conversation.'],
        ],
      },
      {
        h: 'Mornings and weekends',
        items: [
          ['Run clubs.', 'Look for a beginners’ group that runs at a pace you can talk at.'],
          ['Turf football and box cricket.', 'Turfs are booked by the hour, and a game that’s a few players short is the classic way in.'],
          ['Sunset by the sea.', 'Marine Drive, Carter Road, Juhu: free, and on every evening.'],
          ['Brunch.', 'A long Sunday table is better with more people around it.'],
          ['Treks.', 'Monsoon is trek season in the hills around Mumbai. Go with a group, and with someone who knows the route.'],
        ],
      },
      {
        h: 'Nights out',
        body: [
          'Gigs, DJ nights, techno and Bollywood nights, rooftop parties, bar hopping. A group of four is easier to plan and safer to get home with: share the cab, and tell someone where you are.',
        ],
      },
      {
        h: 'Festival season',
        body: [
          'Mumbai goes big for festivals: pandal hopping at Ganeshotsav, garba and dandiya at Navratri, Diwali parties, Christmas. All of them are better in a group.',
        ],
      },
      {
        h: 'Cheap or free',
        body: [
          'Plenty of good plans cost little or nothing: a run, a sunset walk, a beach clean-up, a board games night at someone’s place, chai after work.',
        ],
      },
      {
        h: 'When your friends can’t come',
        body: ['Go anyway. At a run, a quiz or a trek, everyone came for the same thing, so the activity does the talking.'],
        link: { to: '/going-out-alone', label: 'How to go out alone' },
      },
      {
        h: 'Finding plans on Dayzi',
        body: [
          'Dayzi shows plans within 100 km of your city: Mumbai, Thane, Navi Mumbai or anywhere else in India. Each one shows who’s hosting, who’s going and their ages. Ask to join; when the host says yes, you’re in the group chat. Or post your own plan and pick who comes.',
          'Dayzi is free and invite-only while it’s in testing. It’s new, so the number of plans near you grows as more people join.',
        ],
        link: { to: '/how-it-works', label: 'See how it works' },
      },
    ],
  },
  '/going-out-alone': {
    kicker: 'Going out alone',
    title: ['Nobody to go with? ', 'Go anyway', '.'],
    lead: 'Three maybes, one no, and a plan you really wanted to do. It happens to everyone. Here’s how to go on your own and have a good time.',
    image: '/app/going.jpg',
    sections: [
      {
        h: 'It’s easier than it sounds',
        body: [
          'You’ll know nobody. That’s normal. At a run, a quiz, a football game or a trek, everyone came for the same thing, so you don’t need an opening line: the activity is the conversation.',
          'And if you talk to nobody and still enjoy the run, the night worked.',
        ],
      },
      {
        h: 'Pick plans with something to do',
        items: [
          ['Choose an activity, not a crowd.', 'Board games, football, a workshop or a trek give you something to do. A party where everyone already knows each other doesn’t.'],
          ['Go small.', 'A group of four to eight is easier to join than a room of fifty.'],
          ['Go near home.', 'If the plan is close, you’ll actually go. In a city like Mumbai, the commute decides more than the plan does.'],
        ],
      },
      {
        h: 'The first ten minutes',
        items: [
          ['Be on time.', 'Groups settle in the first few minutes. Arriving late is harder than arriving alone.'],
          ['Say hi to the host.', 'They said yes to you. They’re expecting you.'],
          ['Ask one question.', 'About the game, the route, the band. One is enough to start.'],
          ['Leave when you want.', 'Staying an hour is a win. Leaving is always allowed.'],
        ],
      },
      {
        h: 'If you’ve just moved',
        body: [
          'A new city resets your weekends. Start with one plan a week, ideally the same kind, so you keep seeing the same faces. New to Mumbai, Thane or Navi Mumbai? Look for plans near where you live or work first.',
        ],
      },
      {
        h: 'If your friends are always busy',
        body: ['Don’t cancel your plan because theirs changed. Go, and tell them about it after. Next time, they might come.'],
      },
      {
        h: 'Stay safe',
        items: [
          ['Meet in public places,', 'at least the first time.'],
          ['Tell a friend', 'where you’re going.'],
          ['Get yourself there and back.', 'Your own ride means you can leave when you want.'],
          ['On Dayzi,', 'SOS reaches the one person you picked in a tap. Dayzi doesn’t organise or supervise plans, so trust your judgement.'],
        ],
        link: { to: '/safety', label: 'How Dayzi keeps it safe' },
      },
      {
        h: 'If it’s more than a quiet weekend',
        body: [
          'Feeling low or lonely for weeks at a stretch is common, and worth talking about. In India, Tele-MANAS is a free, 24x7 government mental health helpline: call 14416.',
        ],
        link: { href: 'https://telemanas.mohfw.gov.in/', label: 'Tele-MANAS' },
      },
      {
        h: 'How Dayzi helps',
        body: [
          'Every plan on Dayzi can be joined on your own. You see who’s hosting and who’s going, ask to join, and the host decides. No need to bring anyone.',
          'Dayzi is free, 18+, and invite-only while it’s in testing.',
        ],
      },
    ],
  },
};

// Footer links to the guides, in this order.
export const GUIDE_LINKS = [
  { to: '/things-to-do-in-mumbai', label: 'Things to do in Mumbai' },
  { to: '/going-out-alone', label: 'Going out alone' },
];
