export interface Environment {
  production: boolean;
  apiBaseUrl: string;
  appName: string;
  appVersion: string;
}

export const environment: Environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080/api/v1',
  appName: 'STEG Back Office',
  appVersion: '0.1.0'
};
