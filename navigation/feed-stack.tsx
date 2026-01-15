import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { FEED_STACK_ROUTES } from './routes';
import { FeedScreen } from 'features/feed/screens/feed-screen';

// Type definition for Feed Stack navigation
export type FeedStackParamList = {
  [FEED_STACK_ROUTES.FEED_SCREEN]: undefined;
};

export type FeedStackNavigationProp = StackNavigationProp<FeedStackParamList>;

const Stack = createStackNavigator<FeedStackParamList>();

export function FeedStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={FEED_STACK_ROUTES.FEED_SCREEN} component={FeedScreen} />
    </Stack.Navigator>
  );
}
