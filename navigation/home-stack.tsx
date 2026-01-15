import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { HOME_STACK_ROUTES } from './routes';
import { HomeScreen } from 'features/home/screens/home-screen';

// Type definition for Home Stack navigation
export type HomeStackParamList = {
  [HOME_STACK_ROUTES.HOME_SCREEN]: undefined;
};

export type HomeStackNavigationProp = StackNavigationProp<HomeStackParamList>;

const Stack = createStackNavigator<HomeStackParamList>();

export function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={HOME_STACK_ROUTES.HOME_SCREEN} component={HomeScreen} />
    </Stack.Navigator>
  );
}
