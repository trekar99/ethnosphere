export type Mode = 'instruments' | 'radio';

export interface EthnoItem {
  id: string;
  name: string;
  country: string;
  region: string;
  description: string;
  category: Mode;
  coordinates: {
    lat: number;
    lng: number;
  };
  audioUrl?: string;
  imageUrl?: string;
  tags: string[];
  soundQuery?: string; // Query for Freesound API
}

export const ethnoData: EthnoItem[] = [
  // INSTRUMENTS
  {
    id: 'flamenco-guitar',
    name: 'Flamenco Guitar',
    country: 'Spain',
    region: 'Andalusia',
    description: 'The flamenco guitar is a type of guitar used in toque, the guitar-playing part of the art of flamenco. It is lighter and has a sharper, more percussive sound than a classical guitar.',
    category: 'instruments',
    coordinates: { lat: 37.3891, lng: -5.9845 }, // Seville
    tags: ['string', 'plucked', 'flamenco', 'spanish'],
    soundQuery: 'flamenco guitar',
  },
  {
    id: 'koto',
    name: 'Koto',
    country: 'Japan',
    region: 'Honshu',
    description: 'The koto is a traditional Japanese stringed instrument derived from Chinese zheng. It has 13 strings strung over movable bridges on a body made of paulownia wood.',
    category: 'instruments',
    coordinates: { lat: 35.6762, lng: 139.6503 }, // Tokyo
    tags: ['string', 'plucked', 'traditional', 'japanese'],
    soundQuery: 'koto japanese',
  },
  {
    id: 'djembe',
    name: 'Djembe',
    country: 'Mali',
    region: 'West Africa',
    description: 'The djembe is a rope-tuned skin-covered goblet drum played with bare hands. It originated in West Africa and is central to traditional ceremonies and celebrations.',
    category: 'instruments',
    coordinates: { lat: 12.6392, lng: -8.0029 }, // Bamako
    tags: ['percussion', 'drum', 'african', 'traditional'],
    soundQuery: 'djembe drum',
  },
  {
    id: 'sitar',
    name: 'Sitar',
    country: 'India',
    region: 'North India',
    description: 'The sitar is a plucked stringed instrument, originating from the Indian subcontinent. It has a long hollow neck, a gourd resonating chamber, and 18-21 strings.',
    category: 'instruments',
    coordinates: { lat: 28.6139, lng: 77.2090 }, // Delhi
    tags: ['string', 'plucked', 'classical', 'indian'],
    soundQuery: 'sitar indian',
  },
  {
    id: 'morin-khuur',
    name: 'Morin Khuur',
    country: 'Mongolia',
    region: 'Central Asia',
    description: 'The morin khuur is a traditional Mongolian bowed stringed instrument. The scroll is carved into a horse head, giving it its name. It is considered one of the Masterpieces of the Oral and Intangible Heritage of Humanity by UNESCO.',
    category: 'instruments',
    coordinates: { lat: 47.8864, lng: 106.9057 }, // Ulaanbaatar
    tags: ['string', 'bowed', 'mongolian', 'traditional'],
    soundQuery: 'morin khuur mongolian',
  },
  {
    id: 'didgeridoo',
    name: 'Didgeridoo',
    country: 'Australia',
    region: 'Northern Territory',
    description: 'The didgeridoo is a wind instrument developed by Indigenous Australians of northern Australia potentially over 1500 years ago. It is known for its distinctive drone sound.',
    category: 'instruments',
    coordinates: { lat: -12.4634, lng: 130.8456 }, // Darwin
    tags: ['wind', 'drone', 'aboriginal', 'australian'],
    soundQuery: 'didgeridoo',
  },
  {
    id: 'balalaika',
    name: 'Balalaika',
    country: 'Russia',
    region: 'Eastern Europe',
    description: 'The balalaika is a Russian stringed musical instrument with a characteristic triangular wooden, hollow body and three strings. It is a symbol of Russian folk music.',
    category: 'instruments',
    coordinates: { lat: 55.7558, lng: 37.6173 }, // Moscow
    tags: ['string', 'plucked', 'russian', 'folk'],
    soundQuery: 'balalaika russian',
  },
  {
    id: 'charango',
    name: 'Charango',
    country: 'Bolivia',
    region: 'Andes',
    description: 'The charango is a small Andean stringed instrument of the lute family. Traditionally made with an armadillo shell for the back, it has a bright, crisp sound.',
    category: 'instruments',
    coordinates: { lat: -19.5834, lng: -65.7531 }, // Potosí
    tags: ['string', 'plucked', 'andean', 'bolivian'],
    soundQuery: 'charango andean',
  },
  // RADIO/AUDIO (Traditional Music Clips)
  {
    id: 'throat-singing',
    name: 'Tuvan Throat Singing',
    country: 'Russia',
    region: 'Tuva Republic',
    description: 'Khoomei is a form of singing originating in the Altai and Sayan mountains of Central Asia. The singer produces a fundamental pitch and manipulates the resonances to produce multiple pitches simultaneously.',
    category: 'radio',
    coordinates: { lat: 51.7191, lng: 94.4378 }, // Kyzyl
    tags: ['vocal', 'overtone', 'traditional', 'tuvan'],
  },
  {
    id: 'fado',
    name: 'Fado',
    country: 'Portugal',
    region: 'Lisbon',
    description: 'Fado is a type of Portuguese folk music known for its melancholic themes and soulful singing. It is characterized by mournful tunes and lyrics about the sea, poverty, and longing.',
    category: 'radio',
    coordinates: { lat: 38.7223, lng: -9.1393 }, // Lisbon
    tags: ['vocal', 'folk', 'portuguese', 'melancholic'],
  },
  {
    id: 'gamelan',
    name: 'Gamelan Orchestra',
    country: 'Indonesia',
    region: 'Java & Bali',
    description: 'Gamelan is the traditional ensemble music of Java and Bali in Indonesia, made up predominantly of percussive instruments. The gamelan has been the main musical tradition of royal courts for centuries.',
    category: 'radio',
    coordinates: { lat: -7.7956, lng: 110.3695 }, // Yogyakarta
    tags: ['ensemble', 'percussion', 'indonesian', 'royal'],
  },
  {
    id: 'mbira-music',
    name: 'Mbira Dzavadzimu',
    country: 'Zimbabwe',
    region: 'Southern Africa',
    description: 'The mbira is an African musical instrument with metal tines played with the thumbs. Mbira music is traditionally used in religious ceremonies to summon ancestral spirits.',
    category: 'radio',
    coordinates: { lat: -17.8292, lng: 31.0522 }, // Harare
    tags: ['percussion', 'lamellophone', 'zimbabwean', 'ceremonial'],
  },
  {
    id: 'qawwali',
    name: 'Qawwali',
    country: 'Pakistan',
    region: 'Punjab',
    description: 'Qawwali is a form of Sufi devotional music popular in South Asia. It originated in the Indian subcontinent and is characterized by its hypnotic rhythms and powerful vocals.',
    category: 'radio',
    coordinates: { lat: 31.5204, lng: 74.3587 }, // Lahore
    tags: ['vocal', 'sufi', 'devotional', 'pakistani'],
  },
  {
    id: 'mariachi',
    name: 'Mariachi',
    country: 'Mexico',
    region: 'Jalisco',
    description: 'Mariachi is a form of Mexican folk music and band that originated in the state of Jalisco. A typical mariachi ensemble includes violins, trumpets, and various types of guitars.',
    category: 'radio',
    coordinates: { lat: 20.6597, lng: -103.3496 }, // Guadalajara
    tags: ['ensemble', 'folk', 'mexican', 'festive'],
  },
];

// Helper functions
export const getItemsByCategory = (category: Mode): EthnoItem[] => {
  return ethnoData.filter(item => item.category === category);
};

export const getItemById = (id: string): EthnoItem | undefined => {
  return ethnoData.find(item => item.id === id);
};
