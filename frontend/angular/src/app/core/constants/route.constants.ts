export const APP_ROUTES = {
  auth: 'auth',
  login: 'auth/login',
  dashboard: 'dashboard',
  forbidden: 'forbidden',
  notFound: 'not-found',
  root: ''
} as const;

export type AppRoute = (typeof APP_ROUTES)[keyof typeof APP_ROUTES];
