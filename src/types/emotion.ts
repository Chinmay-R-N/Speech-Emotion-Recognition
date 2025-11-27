export interface EmotionResult {
  emotion: string;
  confidence: number;
  timestamp: number;
}

export interface EmotionAnalysis {
  emotion: string;
  confidence: number;
  is_confident: boolean;
  probabilities: {
    [key: string]: number;
  };
}

export const EMOTIONS = {
  neutral: { color: 'bg-gray-500', label: 'Neutral' },
  calm: { color: 'bg-blue-400', label: 'Calm' },
  happy: { color: 'bg-green-500', label: 'Happy' },
  sad: { color: 'bg-blue-600', label: 'Sad' },
  angry: { color: 'bg-red-500', label: 'Angry' },
  fearful: { color: 'bg-purple-500', label: 'Fearful' },
  disgust: { color: 'bg-yellow-600', label: 'Disgust' },
  surprised: { color: 'bg-pink-500', label: 'Surprised' }
} as const;

export type EmotionType = 'Neutral' | 'Fearful' | 'Happy' | 'Sad' | 'Angry';