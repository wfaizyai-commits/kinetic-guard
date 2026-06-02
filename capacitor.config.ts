import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wfaizy.fitguard',
  appName: 'FitGuard',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      // Native splash hands off to the in-app AnimatedSplash with no second screen.
      // launchAutoHide:false → we hide it manually the instant React has rendered,
      // so the user only ever sees ONE splash (the animated one).
      launchShowDuration: 0,
      launchAutoHide: false,
      backgroundColor: '#0A0818',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'Dark',
      backgroundColor: '#0A0A0F',
    },
  },
};

export default config;
