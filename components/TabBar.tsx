import { View, Text, Pressable, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { FC } from 'react';
import { SvgProps } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeIcon from '../assets/icons/home_icon.svg';
import HomeActiveIcon from '../assets/icons/home_active_icon.svg';
import ForYouIcon from '../assets/icons/for_you_icon.svg';
import ForYouActiveIcon from '../assets/icons/for_you_active_icon.svg';

type RouteName = 'HomeTab' | 'FeedTab';
type SvgComponent = FC<SvgProps>;

const RouteToSvg: Record<
  RouteName,
  {
    default: SvgComponent;
    active: SvgComponent;
  }
> = {
  HomeTab: {
    default: HomeIcon,
    active: HomeActiveIcon,
  },
  FeedTab: {
    default: ForYouIcon,
    active: ForYouActiveIcon,
  },
};

export const TabBar: FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <BlurView intensity={50} tint="light" className="absolute bottom-0 left-0 right-0 h-[98px]">
      {/* Glassmorphism overlay - semi-transparent white layer */}
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        ]}
      />

      {/* Tab buttons container */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          paddingBottom: insets.bottom,
          paddingTop: 12,
          paddingHorizontal: 16,
        }}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const { options } = descriptors[route.key];
          const label = typeof options.tabBarLabel === 'string' ? options.tabBarLabel : route.name;

          const Icon = RouteToSvg[route.name as RouteName][isFocused ? 'active' : 'default'];

          return (
            <Pressable
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 8,
                padding: 11,
              }}>
              <Icon width={24} height={24} />
              <Text
                style={{
                  marginTop: 6,
                  fontSize: 12,
                  fontWeight: '600',
                  color: isFocused ? '#000' : '#999',
                }}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </BlurView>
  );
};
