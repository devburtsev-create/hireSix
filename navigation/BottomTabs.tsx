import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BOTTOM_TAB_ROUTES } from './routes';
import { HomeStackNavigator } from './home-stack';
import { FeedStackNavigator } from './feed-stack';

// Type definition for Bottom Tab navigation
export type BottomTabsParamList = {
  [BOTTOM_TAB_ROUTES.HOME]: undefined;
  [BOTTOM_TAB_ROUTES.FEED]: undefined;
};

const Tab = createBottomTabNavigator<BottomTabsParamList>();

export function BottomTabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen
        name={BOTTOM_TAB_ROUTES.HOME}
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name={BOTTOM_TAB_ROUTES.FEED}
        component={FeedStackNavigator}
        options={{
          tabBarLabel: 'Feed',
        }}
      />
    </Tab.Navigator>
  );
}
