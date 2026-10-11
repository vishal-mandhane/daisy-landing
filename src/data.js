// Everything the site says lives here, so copy edits don't need to touch layout.

export const FORM_ACTION = 'https://eomail5.com/form/b7b93d50-eaf6-11f0-abdc-bf3561320fe8';

export const SOCIAL = {
  instagram: 'https://www.instagram.com/dayzi_india/',
  instagramHandle: '@dayzi_india',
  x: 'https://x.com/Dayzi_events',
  youtube: 'https://www.youtube.com/@DAYZIPARTY',
};

// Every page is one tap from the nav: these three, then the guides
// (GUIDE_LINKS) under "Guides".
export const NAV = [
  { to: '/how-it-works', label: 'How it works' },
  { to: '/safety', label: 'Safety' },
  { to: '/faq', label: 'FAQ' },
];

// Big nights and small plans, mixed: Dayzi is for both.
export const TICKER = [
  'Rooftop gigs',
  'Evening walks',
  'Board game nights',
  'Match screenings',
  'Techno nights',
  'Run clubs',
  'Sunset picnics',
  'Console nights',
  'Sunday football',
  'Chai & café hopping',
  'Supper clubs',
  'Karaoke',
  'Bar hopping',
  'Pottery for beginners',
  'Brunch',
];

// Clips live in /public/app as <name>.mp4 with a <name>.jpg poster.

// Home page: one look. A step is a clip, a label and one short line; the full
// tour lives on /how-it-works.
export const STEPS = [
  { n: '01', clip: 'nearby', label: 'Find a plan', line: 'Plans near you, in one scroll.' },
  { n: '02', clip: 'details', label: 'Ask to join', line: 'See who’s going. Send a request.' },
  { n: '03', clip: 'going', label: 'Show up', line: 'The host says yes. You’re in.' },
];

// Home page safety strip: one short line each; the detail is on /safety.
export const SAFETY_SHORT = [
  { icon: 'badge', text: 'Face-verified badges' },
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
    body: 'Ranked by requests, spots filled and how soon it starts. Save one for later.',
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
    body: 'Who’s going, the ages, the host, the details. Then send a request.',
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
    body: 'Plans you made are tagged hosting. Scroll through them all.',
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
    body: 'Exactly five. Karaoke, rooftop parties, run clubs: whatever you’re into.',
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
    body: 'A selfie doing the gesture we ask for, matched to your photo. The selfie isn’t stored.',
  },
  {
    clip: 'p-anthem',
    label: 'Your song',
    title: ['Your ', 'anthem', '.'],
    body: 'Pick a song. The selfie check finishes in the background, so you don’t have to wait.',
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
    title: ['That’s ', 'you', '.'],
    body: 'Photo, verified badge, vibes, prompts, song and show. All on one page.',
  },
];

export const SAFETY = [
  {
    n: '01',
    title: ['Face-', 'verified', '.'],
    body: 'Take a selfie doing the gesture we ask for. If it matches your profile photo, you get the verified badge. It’s optional, so look for it on profiles. The selfie isn’t stored.',
  },
  {
    n: '02',
    title: ['Hosts ', 'choose', '.'],
    body: 'Nobody joins a plan on Dayzi without the host’s yes. You ask to join, the host sees your profile, and they decide.',
  },
  {
    n: '03',
    title: ['The ghost ', 'counter', '.'],
    body: 'Got in and didn’t turn up? The group can mark you as a no-show, and it shows on your profile. Plans only work when people show up.',
  },
  {
    n: '04',
    title: ['SOS to ', 'your person', '.'],
    body: 'Pick one person you trust. If you ever need them, SOS opens WhatsApp with your location, ready to send to them.',
  },
  {
    n: '05',
    title: ['Moderated, ', '18+', '.'],
    body: 'Photos and text are screened automatically, and Dayzi is for adults only: you must be 18 or older.',
  },
];

export const MEET_SMART = [
  'Meet in public places, at least the first time.',
  'Tell a friend where you’re going.',
  'Get yourself there and back.',
  'Trust your gut. Leaving is always allowed.',
];

// Every answer here is checked against the app and the Terms: the app is free
// and takes no payments ("provided free of charge"; "does not currently take
// payments"), is not a dating app ("a listings and coordination platform"),
// works anywhere (it runs on coordinates: plans within 100 km of the location
// on your profile, which you can change to any city or country; a plan shows
// to people near its venue), and is in testing, not in the stores. Keep it that way; these answers are also what search engines and AI
// assistants quote.
//
// The angle is missing out, not loneliness: Dayzi is for the plans, big or
// small, you'd otherwise skip because nobody could come.
export const FAQ = [
  {
    q: 'What is Dayzi?',
    a: 'An app for the plans you don’t want to miss, big or small: a gig, a club night, a run, chai at the café, the big match on a big screen. Find a plan near you, ask to join, and when the host says yes, you’re in the group chat. Or host your own. It’s free, and in testing now: join the invite list.',
  },
  {
    q: 'My friends bailed. Can I still go?',
    a: 'Yes, that’s what Dayzi is for. Look for a plan near you for the same thing, like the gig, the match or a run, and ask to join. Or post your own: “Going to the gig on Saturday, anyone else?” You don’t need anyone to come with you.',
  },
  {
    q: 'What kind of plans are on Dayzi?',
    a: 'Big nights and small ones. Concerts, club nights and treks, but also an evening walk, a run, chai at the café down the road, a match screening or a gaming session nearby. Plans come in 15 categories, from sports, fitness and outdoors to nightlife, food, games, music, and culture and spirituality, like garba and pandal hopping.',
  },
  {
    q: 'Can I find people to go to a concert, watch a match or play games with?',
    a: 'Yes. Anyone can post a plan for a gig, a club night, watching the cricket or football together, or a console or board games session, and you can ask to join. Dayzi doesn’t sell tickets: if a plan needs one, hosts are asked to say so, and you buy your own.',
  },
  {
    q: 'Can I go on my own?',
    a: 'Yes. You don’t need to bring anyone. You ask to join on your own, and you can see who’s hosting and who’s going first.',
  },
  {
    q: 'Can I bring a friend?',
    a: 'Yes, if they’re on Dayzi. Once you’re in a plan, you can suggest it to a friend, and the host decides if they join.',
  },
  {
    q: 'What if the host says no?',
    a: 'You get a notification that your request was declined. Hosts choose who joins, so a no is often about the plan, not you. Ask to join another plan, or post your own.',
  },
  {
    q: 'Can I leave a plan? Will it count as a no-show?',
    a: 'Yes, you can leave. If you leave before the plan, you won’t be in its no-show vote, but you can’t ask to join that plan again. If you can’t make it, leaving beats not turning up.',
  },
  {
    q: 'I’m new in town, or travelling. Can I use Dayzi?',
    a: 'Yes, in any city or country. Set the location on your profile to where you are, and you’ll see plans within 100 km: a run, chai, a match screening, a festival night. Or post your own, like “new in town, anyone for chai at 6?”, and people nearby can ask to join. Dayzi is new, so how many plans you find depends on how many people there have joined.',
  },
  {
    q: 'Is Dayzi free?',
    a: 'Yes. Dayzi is free, and it doesn’t sell tickets or take payments. Some plans cost money, like a ticket or a turf booking, and hosts are asked to say so on the plan.',
  },
  {
    q: 'A plan costs money. How do we split it?',
    a: 'Between yourselves, in the group chat. Hosts are asked to put the cost on the plan, like a turf booking or a ticket, so you know before you ask to join. Dayzi doesn’t handle money.',
  },
  {
    q: 'Is Dayzi a dating app?',
    a: 'No. Dayzi is for plans: runs, gigs, football, board games, treks, brunch. You ask to join a plan, and the host decides who comes.',
  },
  {
    q: 'Where does Dayzi work? Is it in Mumbai?',
    a: 'Anywhere. Dayzi runs on location, not a list of cities: it shows plans within 100 km of the location on your profile, whether that’s Mumbai, Thane, Navi Mumbai, Pune, Delhi, Bengaluru or a city abroad. It’s new, so how many plans you see depends on how many people near you have joined.',
  },
  {
    q: 'How do I get Dayzi? Is it on Android and iPhone?',
    a: 'Dayzi is being tested on Android and iPhone and isn’t in the app stores yet. Join the list with your email and city. We’ll send invites in batches, starting soon, and people on the list get in first.',
  },
  {
    q: 'Can I host my own plans?',
    a: 'Yes. Create a plan in a minute, choose who gets in from the requests, and run it from the group chat. Dayzi can draft the description for you.',
  },
  {
    q: 'What goes on my profile?',
    a: 'A photo, five vibes, a song, a show and three prompts. Add the verified badge with a quick selfie check.',
  },
  {
    q: 'Is it safe to meet people from Dayzi?',
    a: 'Profiles can carry a face-verified badge, hosts choose who joins, no-shows are visible, photos and text are screened automatically, and SOS opens WhatsApp with your location for a person you choose. Dayzi doesn’t organise, vet or supervise plans, so meet in public and trust your judgement.',
  },
  {
    q: 'Can people see where I live?',
    a: 'No. Your profile shows your city, not your exact location, and nearby plans are worked out from that city, not from your phone’s GPS. Hosts are encouraged to put just the area on a plan and share the exact spot in the group chat.',
  },
  {
    q: 'Who can use Dayzi?',
    a: 'Anyone 18 or older. Hosts can also set an age range for their plan.',
  },
  {
    q: 'Will Dayzi help me make friends?',
    a: 'Dayzi can’t promise that. It gets you to the run, the gig or the match with people who wanted to go too. Talk in the group chat, turn up, and see what happens.',
  },
  {
    q: 'Is Dayzi just for lonely people?',
    a: 'No. It’s for the night your friends can’t make it, the city you’ve just moved to, or the plan you don’t want to skip. It isn’t therapy and can’t promise friendship. If loneliness or low mood is weighing on you, talk to someone: in India, Tele-MANAS is a free, 24x7 government helpline on 14416.',
  },
  {
    q: 'Who makes Dayzi?',
    a: 'Dayzi is made in India by Solika Ventures Pvt Ltd, based in Maharashtra. Questions? DM us on Instagram, @dayzi_india.',
  },
  {
    q: 'Why is it called Dayzi?',
    a: 'Because EventsNearYouAppForPlans was taken. Also, daisies are chill, and so is the vibe. It’s spelled D-A-Y-Z-I.',
  },
];

// Guides: one page each, written for what people actually search ("things to
// do in mumbai with friends", "no one to go to concert with", "friend bailed
// on concert", "match screening mumbai"). Plain advice first, Dayzi last. No
// venue names, no other companies' or leagues' brand names, no claims about
// how many plans there are.
//
// A section has a heading `h` and any of: `body` (paragraphs), `items`
// ([lead, text] pairs), `link` ({ to, label } inside the site, or { href, label }).
export const GUIDES = {
  '/things-to-do-in-mumbai': {
    kicker: 'Mumbai',
    title: ['Things to do ', 'in Mumbai', '.'],
    lead: 'Something is on every night: a gig, a match, a walk by the sea, chai at the corner café. The hard part is rarely finding a plan; it’s finding someone free to go with. Here’s what’s worth going to, and how to go even when your friends can’t.',
    image: '/app/vibes.jpg',
    sections: [
      {
        h: 'Gigs, concerts and club nights',
        body: [
          'From big concerts to small gigs, techno to Bollywood nights, there’s usually something on. If your friends bail, go anyway: get there early, check a club’s entry rules first (some have couples-only nights or limit stag entry), keep your drink in your hand, and know how you’re getting home before you leave.',
        ],
        link: { to: '/no-one-to-go-with', label: 'How to go when your friends bail' },
      },
      {
        h: 'Weeknights, after work',
        items: [
          ['Match screenings.', 'Cricket, football or a fight night on a big screen, in a room full of people on the same side.'],
          ['Board game nights.', 'A table, a stack of games and someone explaining the rules. One of the easiest rooms to walk into alone.'],
          ['Quiz and trivia nights.', 'Played in teams, so a team that’s one short will often take you in.'],
          ['Karaoke.', 'Nobody is judging your singing. Everyone is waiting for their own turn.'],
          ['Open mics.', 'Poetry, comedy, music. Perform, or just watch.'],
        ],
      },
      {
        h: 'Small plans, any day',
        items: [
          ['Sunset walks.', 'Marine Drive, Carter Road, Juhu: free, and there every evening.'],
          ['Chai and cafés.', 'The low-effort plan: an hour, a table, a conversation.'],
          ['Gaming sessions.', 'Console, cards or board games. The game breaks the ice for you.'],
        ],
      },
      {
        h: 'Mornings and weekends',
        items: [
          ['Run clubs.', 'Look for a beginners’ group that runs at a pace you can talk at.'],
          ['Turf football and box cricket.', 'Turfs are booked by the hour, and a game that’s a few players short is the classic way in.'],
          ['Treks.', 'Monsoon is peak trek season in the hills around Mumbai. Go with a group and a leader who knows the route, and check for closures: some spots shut in heavy rain.'],
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
          'Plenty of good plans cost little or nothing: a run, a sunset walk, a beach clean-up, a board game night, chai after work.',
        ],
      },
      {
        h: 'Visiting Mumbai?',
        body: [
          'In town for work or a few days? Set your location to Mumbai on Dayzi and see what people here are up to: a walk by the sea, a match screening, chai after work. Or post your own plan and let locals join you. It beats another evening in the hotel room.',
        ],
        link: { to: '/meet-locals', label: 'New in town? How to meet locals' },
      },
      {
        h: 'Finding plans on Dayzi',
        body: [
          'Dayzi shows plans within 100 km of the location on your profile: Mumbai, Thane, Navi Mumbai or anywhere else in the world. Each one shows who’s hosting, who’s going and their ages. Ask to join; when the host says yes, you’re in the group chat. Or post your own plan and pick who comes.',
          'Dayzi is free and invite-only while it’s in testing. It’s new, so the number of plans near you grows as more people join.',
        ],
        link: { to: '/how-it-works', label: 'See how it works' },
      },
    ],
  },
  '/no-one-to-go-with': {
    kicker: 'When friends bail',
    title: ['Friends bailed? ', 'Go anyway', '.'],
    lead: 'The artist is in town, the match is on, the café you keep meaning to try is right there, and the group chat just went quiet. Don’t miss it because someone else can’t make it.',
    image: '/app/going.jpg',
    sections: [
      {
        h: 'It happens to everyone',
        body: [
          'Three maybes that mean no. A last-minute “next time, pakka”. A friend who found a better offer. Plans fall through all the time, and missing the night usually stings longer than walking in on your own.',
        ],
      },
      {
        h: 'Going to a concert or club night alone',
        items: [
          ['Concerts and gigs.', 'Everyone is facing the stage. Get there early for a better spot, and plan your way home before you go.'],
          ['Club nights.', 'Easier, and safer, in a group of three or four. Check the entry rules first: some clubs have couples-only nights or limit stag entry. Keep your drink in your hand, and book your ride home before the night ends.'],
          ['Or find people already going.', 'On Dayzi, look for a plan for the same gig or night, or post your own and let people join you.'],
        ],
      },
      {
        h: 'Small plans count too',
        body: [
          'Not every plan is a big night. An evening walk, a run, chai at the café down the road, the big match on a big screen, a gaming session nearby. They’re the easiest to go to on your own, and the easiest to say yes to.',
        ],
        items: [
          ['Walks and runs.', 'The group sets the pace, and you don’t have to talk to keep up.'],
          ['Match nights.', 'Cricket, football or a fight night: a screen, a crowd on the same side, and something to shout about.'],
          ['Gaming.', 'Console or board games: the game breaks the ice for you.'],
        ],
      },
      {
        h: 'Pick plans that do the talking',
        items: [
          ['Choose an activity, not a crowd.', 'A run, a match, a game or a trek gives you something to do. A party where everyone already knows each other doesn’t.'],
          ['Go small.', 'A group of four to eight is easier to join than a room of fifty.'],
          ['Go near home.', 'If the plan is close, you’ll actually go. In a big city, the commute decides more than the plan does.'],
        ],
      },
      {
        h: 'The first ten minutes',
        items: [
          ['Be on time.', 'Groups settle in the first few minutes. Arriving late is harder than arriving alone.'],
          ['Say hi to the host.', 'They said yes to you. They’re expecting you.'],
          ['Ask one question.', 'About the game, the route, the band. One is enough to start.'],
          ['Stay as long as it’s fun.', 'Heading off early is fine.'],
        ],
      },
      {
        h: 'When your friends always cancel',
        body: ['Stop waiting for the group chat to agree. Decide what you want to do this week, go, and tell them about it after. Next time, they might come.'],
      },
      {
        h: 'New in town, or just visiting',
        body: [
          'A new city, or a week somewhere new, resets your plans. Start small: a run, a walk, a match screening, chai. On Dayzi, set the location on your profile to where you are, in India or abroad, and join what people there are doing, or post your own plan and let them join you.',
        ],
        link: { to: '/meet-locals', label: 'How to meet locals in a new city' },
      },
      {
        h: 'Stay safe',
        items: [
          ['Meet in public places,', 'at least the first time.'],
          ['Tell a friend', 'where you’re going.'],
          ['Get yourself there and back.', 'Your own ride means you can leave when you want.'],
          ['On Dayzi,', 'SOS opens WhatsApp with your location, ready to send to the one person you picked. Dayzi doesn’t organise, vet or supervise plans, so trust your judgement.'],
        ],
        link: { to: '/safety', label: 'How safety works on Dayzi' },
      },
      {
        h: 'How Dayzi helps',
        body: [
          'Dayzi is for the plans you nearly didn’t go to. See what’s on near you, who’s hosting and who’s going, ask to join, and the host decides. No need to bring anyone.',
          'Dayzi is free, 18+, and invite-only while it’s in testing. It’s new, so the number of plans near you grows as more people join.',
        ],
      },
    ],
  },
  '/meet-locals': {
    kicker: 'New in town',
    title: ['New in town? ', 'Join the locals', '.'],
    lead: 'Moved for work, here for a semester, or passing through for a week: a new city is better with people who know it. Here’s how to find them, and how to let them find you.',
    image: '/app/nearby.jpg',
    sections: [
      {
        h: 'Join what locals already do',
        items: [
          ['Runs and walks.', 'Morning runs and evening walks happen in every city. The route is the tour.'],
          ['Street food walks and cafés.', 'Eat where the people who live there eat.'],
          ['Match screenings.', 'Cheering for the same side turns a room of strangers into a crowd.'],
          ['Board games, quizzes and open mics.', 'Easy rooms to walk into, with something to do from the first minute.'],
          ['Festivals.', 'Wherever you are, a local festival is a good way in. Ask what’s on.'],
        ],
      },
      {
        h: 'Or start your own plan',
        body: [
          'You don’t have to wait to be asked. On Dayzi, post a plan where you are: “New in town, anyone up for chai near the station at 6?” People nearby see it, ask to join, and you pick who comes.',
          'Say exactly what, when and where. A clear plan beats “anyone free?”',
        ],
      },
      {
        h: 'If you’ve moved for work or studies',
        body: [
          'A new city resets your weekends. Pick one kind of plan, like a Sunday run or a weekly quiz, and go every week. Seeing the same faces is how a new place starts to feel like yours.',
        ],
      },
      {
        h: 'Travel smart',
        items: [
          ['Meet in public places,', 'at least the first time.'],
          ['Tell someone where you are,', 'back home or where you’re staying.'],
          ['Know your way back', 'before you go out, and keep your phone charged.'],
          ['Keep where you’re staying to yourself', 'until you know people.'],
          ['Respect local customs and laws.', 'What’s fine at home may not be fine here.'],
          ['On Dayzi,', 'SOS opens WhatsApp with your location, ready to send to the one person you picked. Dayzi doesn’t organise, vet or supervise plans, so trust your judgement.'],
        ],
        link: { to: '/safety', label: 'How safety works on Dayzi' },
      },
      {
        h: 'Dayzi works anywhere',
        body: [
          'Dayzi runs on location, not a list of cities. Set the location on your profile to where you are, in India or abroad, and you’ll see plans within 100 km. Change it to another country and your feed shows plans there, one country at a time. A plan you post shows to people near it.',
          'Dayzi is free, 18+, and invite-only while it’s in testing. It’s new, so how many plans you find depends on how many people there have joined.',
        ],
        link: { to: '/how-it-works', label: 'See how it works' },
      },
    ],
  },
};

// Nav ("Guides") and footer links to the guides, in this order.
export const GUIDE_LINKS = [
  { to: '/things-to-do-in-mumbai', label: 'Things to do in Mumbai' },
  { to: '/no-one-to-go-with', label: 'Friends bailed? Go anyway' },
  { to: '/meet-locals', label: 'New in town? Meet locals' },
];
