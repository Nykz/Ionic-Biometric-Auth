import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.technyks.faceid',
  appName: 'face-id-app',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
