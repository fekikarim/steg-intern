export const STORAGE_KEYS = {
  refreshToken: 'steg.refreshToken',
  rememberMe: 'steg.rememberMe',
  theme: 'steg.theme'
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
