import type { Narrative } from './types';

// Bot network - coordinated propaganda accounts
const BOT_ACCOUNTS = [
  { id: 'bot_001', name: 'PakDefender2024', is_bot: true },
  { id: 'bot_002', name: 'TruthSpeaker_PK', is_bot: true },
  { id: 'bot_003', name: 'IslamabadWatch', is_bot: true },
  { id: 'bot_004', name: 'PakVoice24_7', is_bot: true },
  { id: 'bot_005', name: 'DefenseAnalystPK', is_bot: true },
  { id: 'bot_006', name: 'PatriotPakistan', is_bot: true },
  { id: 'bot_007', name: 'PakMediaWatch', is_bot: true },
  { id: 'bot_008', name: 'TruthSeeker_ISB', is_bot: true },
];

// Organic accounts (non-bots)
const ORGANIC_ACCOUNTS = [
  { id: 'user_001', name: 'Ahmad_Lahore', is_bot: false },
  { id: 'user_002', name: 'Fatima_Karachi', is_bot: false },
  { id: 'user_003', name: 'Journalist_KHI', is_bot: false },
  { id: 'user_004', name: 'NewsDesk_PK', is_bot: false },
  { id: 'user_005', name: 'CitizenReport', is_bot: false },
];

// Keywords being tracked
const KEYWORDS = [
  'military',
  'operation',
  'terrorism',
  'security',
  'Pakistan',
  'defense',
  'border',
  'attack',
];

// Trending hashtags
const HASHTAGS = [
  '#PakArmy',
  '#NationalSecurity',
  '#TerrorismFree',
  '#DefendPakistan',
  '#OperationSuccess',
  '#BorderSecurity',
  '#PeacefulPakistan',
  '#StrongDefense',
  '#AntiTerror',
  '#SafetyFirst',
];

// Template messages for different sentiments
const NEGATIVE_TEMPLATES = [
  'Concerned about recent {keyword} developments. Government must act now! {hashtags}',
  'Another {keyword} incident reported. When will this end? {hashtags}',
  'Worried about {keyword} situation in the region. {hashtags}',
  'Breaking: {keyword} alert issued. Stay safe everyone. {hashtags}',
  'Reports of {keyword} activity increasing. Authorities silent. {hashtags}',
];

const POSITIVE_TEMPLATES = [
  'Proud of our forces handling {keyword} operations! {hashtags}',
  '{keyword} efforts showing great results. Well done! {hashtags}',
  'Excellent progress on {keyword} front. Pakistan Zindabad! {hashtags}',
  'Our brave soldiers excelling in {keyword} operations. {hashtags}',
  'Major success in {keyword} initiatives. Keep it up! {hashtags}',
];

const NEUTRAL_TEMPLATES = [
  'Update on {keyword}: Operations continuing as planned. {hashtags}',
  '{keyword} briefing scheduled for tomorrow morning. {hashtags}',
  'Official statement regarding {keyword} released. {hashtags}',
  'Monitoring {keyword} situation closely. {hashtags}',
  '{keyword} update: Current status stable. {hashtags}',
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomHashtags(count: number = 2): string[] {
  const shuffled = [...HASHTAGS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function generateNarrative(): Narrative {
  // 60% bot, 40% organic
  const isBot = Math.random() < 0.6;
  const account = isBot
    ? getRandomElement(BOT_ACCOUNTS)
    : getRandomElement(ORGANIC_ACCOUNTS);

  // Sentiment distribution: 40% negative, 35% positive, 25% neutral
  let sentiment: 'Negative' | 'Positive' | 'Neutral';
  let template: string;
  const rand = Math.random();
  if (rand < 0.4) {
    sentiment = 'Negative';
    template = getRandomElement(NEGATIVE_TEMPLATES);
  } else if (rand < 0.75) {
    sentiment = 'Positive';
    template = getRandomElement(POSITIVE_TEMPLATES);
  } else {
    sentiment = 'Neutral';
    template = getRandomElement(NEUTRAL_TEMPLATES);
  }

  const keyword = getRandomElement(KEYWORDS);
  const hashtags = getRandomHashtags(Math.floor(Math.random() * 2) + 2); // 2-3 hashtags
  const platform = Math.random() < 0.7 ? 'Twitter' : 'Facebook';

  const text = template
    .replace('{keyword}', keyword)
    .replace('{hashtags}', hashtags.join(' '));

  return {
    id: `narrative-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    keyword,
    source_id: account.id,
    author_name: account.name,
    is_bot: account.is_bot,
    platform,
    sentiment,
    text,
    hashtags,
    timestamp: new Date().toISOString(),
  };
}

// Generate initial batch of narratives (for historical data)
export function generateInitialNarratives(count: number = 50): Narrative[] {
  const narratives: Narrative[] = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const narrative = generateNarrative();
    // Spread them over the last hour
    const timestamp = new Date(now - (count - i) * 60000);
    narrative.timestamp = timestamp.toISOString();
    narratives.push(narrative);
  }

  return narratives;
}
