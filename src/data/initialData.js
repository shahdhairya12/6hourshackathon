// Realistic Gen Z Personas and Seed Financial Data for ₹10,000 30-Day Budget
export const PERSONAS = [
  {
    id: 'hostel_student',
    name: 'Aarav (Hostel Hustler)',
    role: 'College Student (Final Year)',
    avatar: '🎓',
    tagline: 'Surviving on ₹10,000 monthly pocket money with heavy chai & canteen temptation',
    startingBudget: 10000,
    commitments: [
      { id: 'c1', name: 'Hostel Mess & Room Share', amount: 3500, dueDay: 5, category: 'living', paid: false, icon: '🏠' },
      { id: 'c2', name: 'Campus Wi-Fi & Laundry', amount: 500, dueDay: 10, category: 'utilities', paid: false, icon: '🧺' },
      { id: 'c3', name: 'Monthly Bus Pass', amount: 450, dueDay: 3, category: 'commute', paid: true, icon: '🚌' },
      { id: 'c4', name: 'Unlimited 5G Mobile Recharge', amount: 349, dueDay: 20, category: 'bills', paid: false, icon: '📱' },
    ],
    subscriptions: [
      { id: 's1', name: 'Spotify Student', amount: 59, dueDay: 8, active: true, icon: '🎵', category: 'entertainment' },
      { id: 's2', name: 'YouTube Premium Family share', amount: 79, dueDay: 14, active: true, icon: '▶️', category: 'entertainment' },
      { id: 's3', name: 'Gym / Badminton Court Pass', amount: 399, dueDay: 1, active: true, icon: '🏋️', category: 'health' },
    ],
    savingsGoals: [
      { id: 'g1', name: 'Coldplay / Fest Ticket', target: 2500, current: 800, deadlineDay: 28, icon: '🎫', color: 'var(--aurora-violet)' },
      { id: 'g2', name: 'Emergency No-Panic Buffer', target: 1500, current: 700, deadlineDay: 30, icon: '🛡️', color: 'var(--status-emerald)' },
      { id: 'g3', name: 'Sneakers / Drop', target: 2000, current: 300, deadlineDay: 25, icon: '👟', color: 'var(--aurora-cyan-deep)' },
    ],
    initialTransactions: [
      { id: 't1', day: 1, name: 'Monthly Budget Allocated', amount: 10000, type: 'income', category: 'budget', note: 'Family allowance' },
      { id: 't2', day: 1, name: 'Monthly Bus Pass', amount: 450, type: 'commitment', category: 'commute', note: 'Prepaid 30-day city bus pass' },
      { id: 't3', day: 1, name: 'Gym / Badminton Pass', amount: 399, type: 'subscription', category: 'health', note: 'Sports club subscription' },
      { id: 't4', day: 2, name: 'Canteen Maggie & Chai with gang', amount: 120, type: 'expense', category: 'food', note: 'Post-lecture hangout' },
      { id: 't5', day: 3, name: 'Printouts & Project Binding', amount: 180, type: 'expense', category: 'education', note: 'Mid-term submissions' },
    ]
  },
  {
    id: 'metro_intern',
    name: 'Riya (Metro Intern)',
    role: 'Design Intern in Bangalore',
    avatar: '💻',
    tagline: 'Managing ₹10,000 stipend with Koramangala PG rent, Metro fares & coffee cravings',
    startingBudget: 10000,
    commitments: [
      { id: 'c1', name: 'PG Room & Food Share', amount: 4200, dueDay: 5, category: 'living', paid: false, icon: '🏢' },
      { id: 'c2', name: 'Metro Smart Card Recharge', amount: 800, dueDay: 2, category: 'commute', paid: true, icon: '🚇' },
      { id: 'c3', name: 'High-speed Co-living Wi-Fi', amount: 400, dueDay: 12, category: 'utilities', paid: false, icon: '📶' },
      { id: 'c4', name: 'Phone Bill (Airtel)', amount: 299, dueDay: 18, category: 'bills', paid: false, icon: '📱' },
    ],
    subscriptions: [
      { id: 's1', name: 'Spotify Premium', amount: 119, dueDay: 8, active: true, icon: '🎵', category: 'entertainment' },
      { id: 's2', name: 'Netflix Mobile', amount: 149, dueDay: 15, active: true, icon: '🎬', category: 'entertainment' },
      { id: 's3', name: 'Figma Community Pack share', amount: 249, dueDay: 7, active: true, icon: '🎨', category: 'work' },
    ],
    savingsGoals: [
      { id: 'g1', name: 'Noise-Cancelling Earbuds', target: 2200, current: 600, deadlineDay: 27, icon: '🎧', color: 'var(--aurora-cyan-deep)' },
      { id: 'g2', name: 'Emergency No-Panic Buffer', target: 1500, current: 900, deadlineDay: 30, icon: '🛡️', color: 'var(--status-emerald)' },
      { id: 'g3', name: 'Weekend Coorg Trek', target: 2000, current: 400, deadlineDay: 22, icon: '⛺', color: 'var(--status-amber)' },
    ],
    initialTransactions: [
      { id: 't1', day: 1, name: 'Stipend Credited', amount: 10000, type: 'income', category: 'budget', note: 'Monthly design stipend' },
      { id: 't2', day: 1, name: 'Metro Card Reload', amount: 800, type: 'commitment', category: 'commute', note: 'Work commute pass' },
      { id: 't3', day: 2, name: 'Third Wave Cold Brew & Croissant', amount: 340, type: 'expense', category: 'food', note: 'Design brainstorm' },
      { id: 't4', day: 3, name: 'Blinkit emergency toiletries', amount: 260, type: 'expense', category: 'living', note: 'Shampoo & toothpaste' },
    ]
  },
  {
    id: 'solo_creator',
    name: 'Kabir (Solo Creator)',
    role: 'Freelance Video Editor',
    avatar: '⚡',
    tagline: '₹10,000 monthly cashflow with gear dreams, erratic gig timing & client coffee meets',
    startingBudget: 10000,
    commitments: [
      { id: 'c1', name: 'Studio Room Contribution', amount: 3000, dueDay: 6, category: 'living', paid: false, icon: '🛋️' },
      { id: 'c2', name: 'Fiber Broadband 300Mbps', amount: 825, dueDay: 10, category: 'work', paid: false, icon: '🚀' },
      { id: 'c3', name: 'Electricity Share (High GPU)', amount: 650, dueDay: 16, category: 'utilities', paid: false, icon: '⚡' },
      { id: 'c4', name: 'Phone + Hotspot Plan', amount: 479, dueDay: 22, category: 'bills', paid: false, icon: '📡' },
    ],
    subscriptions: [
      { id: 's1', name: 'Adobe Premiere / Creative Cloud', amount: 650, dueDay: 4, active: true, icon: '🎞️', category: 'work' },
      { id: 's2', name: 'Cloud Backup 2TB (Google One)', amount: 130, dueDay: 11, active: true, icon: '☁️', category: 'work' },
      { id: 's3', name: 'Epidemic Sound Royalty Beats', amount: 299, dueDay: 19, active: true, icon: '🎧', category: 'work' },
    ],
    savingsGoals: [
      { id: 'g1', name: 'Fast 1TB SSD & Hub', target: 2800, current: 950, deadlineDay: 26, icon: '💾', color: 'var(--aurora-violet)' },
      { id: 'g2', name: 'Emergency No-Panic Buffer', target: 1500, current: 1100, deadlineDay: 30, icon: '🛡️', color: 'var(--status-emerald)' },
      { id: 'g3', name: 'Vintage Leather Jacket', target: 1800, current: 200, deadlineDay: 30, icon: '🧥', color: 'var(--status-pink)' },
    ],
    initialTransactions: [
      { id: 't1', day: 1, name: 'Retainer Payout Credited', amount: 10000, type: 'income', category: 'budget', note: 'Freelance video contract' },
      { id: 't2', day: 2, name: 'Late night energy drinks & snacks', amount: 210, type: 'expense', category: 'food', note: 'All-nighter render session' },
      { id: 't3', day: 3, name: 'Audio Jack Adapter replacement', amount: 320, type: 'expense', category: 'work', note: 'Broke headphone pin' },
    ]
  }
];

// Pre-configured "What-If" temptation scenarios for instant simulation
export const SIMULATION_PRESETS = [
  {
    id: 'p1',
    name: 'Midnight Biryani + Swiggy Craving',
    amount: 460,
    category: 'food',
    icon: '🍗',
    frequency: 'one-off',
    roast: 'Swiggy surges hit hard! This late-night feast eats into 2 days worth of your safe daily allowance.',
    alternative: 'Make midnight instant noodles or split a combo with roommates to save ₹320.'
  },
  {
    id: 'p2',
    name: 'End of Season Sale Sneakers / Hoodie',
    amount: 1890,
    category: 'shopping',
    icon: '👟',
    frequency: 'one-off',
    roast: 'Drip is temporary, insolvency is permanent. This purchase wipes out 64% of your remaining free cash flow!',
    alternative: 'Add to Wishlist. Wait 48 hours to check if you still need it after rent is cleared.'
  },
  {
    id: 'p3',
    name: 'Spontaneous Weekend Goa Roadtrip Split',
    amount: 3200,
    category: 'travel',
    icon: '🏖️',
    frequency: 'one-off',
    roast: 'CRITICAL RISK! Spending ₹3,200 now means your Day 30 balance plunges deep into negative territory.',
    alternative: 'Offer to host a chill rooftop terrace board game night for ₹400 total.'
  },
  {
    id: 'p4',
    name: 'Artisanal Specialty Cafe with Friends',
    amount: 380,
    category: 'food',
    icon: '☕',
    frequency: 'one-off',
    roast: 'Fancy ₹380 iced hazelnut oat latte. That’s 1.5 days of your entire discretionary allowance!',
    alternative: 'Grab a regular Americano or local filter coffee at ₹40 and pocket ₹340.'
  },
  {
    id: 'p5',
    name: 'Steam Summer Sale Game Bundle',
    amount: 799,
    category: 'entertainment',
    icon: '🎮',
    frequency: 'one-off',
    roast: 'Backlog games you will never finish! Cuts your daily allowance by ₹38/day for the next 21 days.',
    alternative: 'Play through games already in your library until month-end budget clears.'
  },
  {
    id: 'p6',
    name: 'Ola / Uber Rain Surge Ride',
    amount: 320,
    category: 'commute',
    icon: '🚖',
    frequency: 'one-off',
    roast: 'Convenience tax! Taking a surge cab instead of the metro burns an extra ₹270.',
    alternative: 'Wait 15 mins for rain to subside or split an auto with a colleague.'
  }
];

// Unexpected curveball life events (Roulette)
export const CURVEBALL_EVENTS = [
  {
    id: 'cb1',
    title: 'Phone Screen Cracked!',
    amount: -1250,
    type: 'negative',
    category: 'unexpected',
    icon: '📱',
    severity: 'high',
    desc: 'Dropped your phone on pavement outside cafe. Local repair shop wants ₹1,250 for screen glass.',
    advice: 'If you have an Emergency Shield funded, draw from it instead of crashing your daily allowance!'
  },
  {
    id: 'cb2',
    title: 'Viral Flu & Doctor Prescription',
    amount: -680,
    type: 'negative',
    category: 'health',
    icon: '💊',
    severity: 'medium',
    desc: 'Sudden fever, paracetamol, cough syrup and clinic consult fee.',
    advice: 'Health always comes first. Adjust your dining out allowance for the next 4 days.'
  },
  {
    id: 'cb3',
    title: 'Roommate Surprise Birthday Treat Split',
    amount: -550,
    type: 'negative',
    category: 'social',
    icon: '🎂',
    severity: 'medium',
    desc: 'The entire flat planned a surprise midnight cake and pizza party. You gotta chip in!',
    advice: 'Social capital matters, but don’t let Peer Pressure derail your rent obligations.'
  },
  {
    id: 'cb4',
    title: 'Rain Storm Auto Rickshaw Surge',
    amount: -320,
    type: 'negative',
    category: 'commute',
    icon: '⛈️',
    severity: 'low',
    desc: 'Bangalore / Mumbai downpour flooded the roads. Autos demanded 2.5x flat fare.',
    advice: 'Micro-shocks happen regularly. A small buffer absorbs this easily.'
  },
  {
    id: 'cb5',
    title: 'GPay Cashback Scratch Card!',
    amount: +250,
    type: 'positive',
    category: 'windfall',
    icon: '🎉',
    severity: 'bonus',
    desc: 'You unlocked a rare legit cash reward on UPI transactions! Instant bank credit.',
    advice: 'Resist the urge to spend it on snacks! Stash it in your Emergency Shield.'
  },
  {
    id: 'cb6',
    title: 'Sold Old Textbook / Tech Gadget on OLX',
    amount: +850,
    type: 'positive',
    category: 'windfall',
    icon: '📦',
    severity: 'bonus',
    desc: 'A junior paid cash for your last semester reference books & old wired headphones.',
    advice: 'Huge runway booster! Pushes your Safe Daily Allowance up by ~₹40/day.'
  },
  {
    id: 'cb7',
    title: 'Traffic Fine / Helmet Challan',
    amount: -500,
    type: 'negative',
    category: 'unexpected',
    icon: '🚨',
    severity: 'medium',
    desc: 'Traffic cop caught your pillion rider without helmet at the crossroad.',
    advice: 'Unplanned administrative penalties teach expensive discipline.'
  },
  {
    id: 'cb8',
    title: 'Freelance Quick Logo Gig Advance',
    amount: +1200,
    type: 'positive',
    category: 'windfall',
    icon: '💼',
    severity: 'bonus',
    desc: 'Friend referred a mini banner design gig. Client sent 50% advance upfront!',
    advice: 'Hustle pays off. Allocate half to Savings and half to expand your daily comfort.'
  }
];

export const CATEGORIES = [
  { id: 'food', label: 'Food & Dining', color: 'var(--status-amber)', icon: '🍔' },
  { id: 'living', label: 'Rent & Living', color: 'var(--aurora-cyan-deep)', icon: '🏠' },
  { id: 'commute', label: 'Transit & Commute', color: 'var(--status-emerald)', icon: '🚇' },
  { id: 'utilities', label: 'Bills & Utilities', color: 'var(--aurora-indigo)', icon: '⚡' },
  { id: 'entertainment', label: 'Fun & Entertainment', color: 'var(--status-pink)', icon: '🎬' },
  { id: 'shopping', label: 'Shopping & Gear', color: 'var(--aurora-violet)', icon: '🛍️' },
  { id: 'health', label: 'Health & Fitness', color: 'var(--aurora-cyan-deep)', icon: '💊' },
  { id: 'unexpected', label: 'Curveballs & Emergencies', color: 'var(--status-red)', icon: '⚠️' },
  { id: 'windfall', label: 'Extra Income / Windfalls', color: 'var(--status-green)', icon: '💰' },
];
