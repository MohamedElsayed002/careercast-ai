/**
 * Application-wide constants
 */

export const PODCAST_DURATIONS = ["1", "5", "10", "20"] as const;
export type PodcastDuration = typeof PODCAST_DURATIONS[number];

export const WORDS_PER_MINUTE = {
  CONSERVATIVE: 120,
  SPEECH: 160,
} as const;

export const RETRY_CONFIG = {
  MAX_ATTEMPTS: 3,
  BASE_DELAY_MS: 1000, // 1 second
} as const;

export const PODCAST_CONSTRAINTS = {
  MAX_AUDIO_DURATION_SEC: 60,
  MIN_WORDS_PERCENTAGE: 0.9,
  MAX_WORDS_PERCENTAGE: 1.1,
  TARGET_WORDS_PERCENTAGE: 0.95,
  MAX_WORDS_PERCENTAGE_EXPANDED: 1.25,
  AVG_WORDS_PER_TURN: 60,
} as const;

export const OPENAI_CONFIG = {
  MODEL: 'gpt-4o-mini',
  TTS_MODEL: 'gpt-4o-mini-tts',
  CHAT_MODEL: 'gpt-3.5-turbo',
  TOKEN_MULTIPLIER: 1.8,
  MAX_COMPLETION_TOKENS: 200,
  TEMPERATURE: 0.2,
} as const;

export const SYSTEM_PROMPTS = {
  BASE: `You are Podcastr Assistant - a focused assistant for Podcastr, a podcast generator web app.
    Only answer questions about the product or convert user topics into short podcast scripts.
    If the user asks unrelated factual questions that require web access, politely say you cannot browse and offer podcast help instead.`,
} as const;

export const ERROR_MESSAGES = {
  CREDENTIAL_REQUIRED: 'API key credential is required',
  CREDENTIAL_INVALID: 'Credential Invalid',
  CREDENTIAL_NOT_FOUND: 'No API credential found. Please add a credential first.',
  USER_NOT_FOUND: 'User not found',
  UNAUTHORIZED: 'No user in session',
  TRIAL_LIMIT_REACHED: 'Trial limit reached. Please change your subscription.',
  UPLOAD_FAILED: 'UploadThing returned empty response',
  DIALOGUE_GENERATION_FAILED: 'No dialogue generated',
  INVALID_DIALOGUE: 'No valid dialogue items after filtering',
} as const;


