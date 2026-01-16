import { NavigationContainer } from '@react-navigation/native';
import { BottomTabsNavigator } from './bottom-tabs';
import { ROOT_ROUTES } from './routes';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Type definition for Root Stack navigation
export type RootStackParamList = {
  [ROOT_ROUTES.BOTTOM_TABS]: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={ROOT_ROUTES.BOTTOM_TABS} component={BottomTabsNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
