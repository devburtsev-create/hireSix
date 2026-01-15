import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from 'navigation/root-navigator';
import { AppProviders } from 'providers/app-providers';

import './global.css';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProviders>
        <RootNavigator />
        <StatusBar style="auto" />
      </AppProviders>
    </SafeAreaProvider>
  );
}
