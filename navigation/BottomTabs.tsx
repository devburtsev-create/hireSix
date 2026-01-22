import { createBottomTabNavigator, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BOTTOM_TAB_ROUTES } from './routes';
import { HomeStackNavigator } from './HomeStack';
import { FeedStackNavigator } from './FeedStack';
import { TabBar } from 'components/TabBar';

export type BottomTabsParamList = {
  [BOTTOM_TAB_ROUTES.HOME]: undefined;
  [BOTTOM_TAB_ROUTES.FEED]: undefined;
};

export type BottomTabsScreenProps<T extends keyof BottomTabsParamList> = CompositeScreenProps<
  BottomTabScreenProps<BottomTabsParamList, T>,
  NativeStackScreenProps<any>
>;

const Tab = createBottomTabNavigator<BottomTabsParamList>();

export function BottomTabsNavigator(): React.ReactElement {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
        },
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
          tabBarLabel: 'For you',
        }}
      />
    </Tab.Navigator>
  );
}
