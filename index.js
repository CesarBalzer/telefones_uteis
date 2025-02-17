if (__DEV__) {
  import('./ReactotronConfig').then(() => console.log('Reactotron Configured'));
}
import React, { useState } from 'react';
import { AppRegistry, LogBox } from 'react-native';
import { name as appName } from './app.json';
import App from './src/App';
import SplashScreen from './src/components/Splashs/SplashScreen';
import ThemeProvider from './src/providers/ThemeProvider';
import ModalProvider from './src/providers/ModalProvider';
import UserProvider from './src/providers/UserProvider';
import { isDatabaseInitialized, populateTables } from './src/db/db-service';

const MainApp = () => {
  const [showSplash, setShowSplash] = useState(true);

  LogBox.ignoreLogs([
    'Warning: componentWillMount',
    '`new NativeEventEmitter()`',
    'EventEmitter.removeListener',
    'ViewPropTypes will be removed from React Native',
    'Sending `onAnimatedValueUpdate`',
  ]);

  const initializeApp = async () => {
    try {
      const databaseInitialized = await isDatabaseInitialized();
      if (!databaseInitialized) {
        // console.log('Database not initialized. Initializing now...');
        await populateTables();
      } else {
        // console.log('Database already initialized.');
      }
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  };
  
  initializeApp();

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <ThemeProvider>
      <ModalProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </ModalProvider>
    </ThemeProvider>
  );
};

AppRegistry.registerComponent(appName, () => MainApp);
