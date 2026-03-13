import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Job Finder',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="search" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Saved Jobs',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="bookmark" color={color} />,
        }}
      />
    </Tabs>
  );
}
