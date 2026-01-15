import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { BottomTabsNavigator } from './bottom-tabs';
import { ROOT_ROUTES } from './routes';

// Type definition for Root Stack navigation
export type RootStackParamList = {
  [ROOT_ROUTES.BOTTOM_TABS]: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={ROOT_ROUTES.BOTTOM_TABS} component={BottomTabsNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
