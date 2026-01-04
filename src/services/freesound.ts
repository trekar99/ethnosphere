// Freesound API Service
// Using Client Credentials flow for browser-based access

const FREESOUND_API_KEY = '84cD2SUXg5jpHAqfecqLzPIsyCSs2PiYvLYEIOge';
const FREESOUND_BASE_URL = 'https://freesound.org/apiv2';

export interface FreesoundResult {
  id: number;
  name: string;
  previews: {
    'preview-hq-mp3': string;
    'preview-lq-mp3': string;
    'preview-hq-ogg': string;
    'preview-lq-ogg': string;
  };
  duration: number;
  username: string;
}

export interface FreesoundSearchResponse {
  count: number;
  results: FreesoundResult[];
}

// Search for sounds by query
export async function searchSounds(query: string, limit: number = 10): Promise<FreesoundResult[]> {
  try {
    const params = new URLSearchParams({
      query,
      fields: 'id,name,previews,duration,username',
      page_size: limit.toString(),
      sort: 'rating_desc',
    });

    const url = `${FREESOUND_BASE_URL}/search/text/?${params}&token=${FREESOUND_API_KEY}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`Freesound API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data: FreesoundSearchResponse = await response.json();
    
    // Filter results to ensure they have valid previews
    return data.results.filter(r => r.previews && r.previews['preview-hq-mp3']);
  } catch (error) {
    console.error('Error searching Freesound:', error);
    return [];
  }
}

// Get a random sound from search results
export async function getRandomSound(query: string): Promise<FreesoundResult | null> {
  const results = await searchSounds(query, 15);
  
  if (results.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * results.length);
  return results[randomIndex];
}

// Audio player singleton
let currentAudio: HTMLAudioElement | null = null;

export function playSound(previewUrl: string): HTMLAudioElement {
  // Stop any currently playing sound
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  currentAudio = new Audio();
  currentAudio.crossOrigin = 'anonymous';
  currentAudio.src = previewUrl;
  
  // Handle autoplay restrictions
  const playPromise = currentAudio.play();
  if (playPromise !== undefined) {
    playPromise.catch((error) => {
      console.error('Audio playback failed:', error);
    });
  }
  
  return currentAudio;
}

export function stopSound(): void {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

export function setVolume(volume: number): void {
  if (currentAudio) {
    currentAudio.volume = Math.max(0, Math.min(1, volume));
  }
}

export function getCurrentAudio(): HTMLAudioElement | null {
  return currentAudio;
}
