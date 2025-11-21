
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { IconSymbol } from './IconSymbol';
import { colors } from '@/styles/commonStyles';

export interface TabBarItem {
  name: string;
  route: string;
  icon: string;
  label: string;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
}

export default function FloatingTabBar({ tabs }: FloatingTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const getIconForTab = (tabName: string): { ios: string; android: string } => {
    const iconMap: Record<string, { ios: string; android: string }> = {
      home: { ios: 'house.fill', android: 'home' },
      gamepad: { ios: 'gamecontroller.fill', android: 'sports-esports' },
      person: { ios: 'person.fill', android: 'person' },
    };
    return iconMap[tabName] || { ios: 'circle.fill', android: 'circle' };
  };

  const isActive = (route: string) => {
    return pathname.startsWith(route);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const active = isActive(tab.route);
          const icons = getIconForTab(tab.icon);
          
          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tab}
              onPress={() => router.push(tab.route as any)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, active && styles.activeIconContainer]}>
                <IconSymbol
                  ios_icon_name={icons.ios}
                  android_material_icon_name={icons.android}
                  size={24}
                  color={active ? colors.primary : colors.text}
                />
              </View>
              <Text style={[styles.label, active && styles.activeLabel]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: 'transparent',
    pointerEvents: 'box-none',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 10,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    marginBottom: 4,
  },
  activeIconContainer: {
    transform: [{ scale: 1.1 }],
  },
  label: {
    fontSize: 11,
    color: colors.text,
    fontWeight: '500',
  },
  activeLabel: {
    color: colors.primary,
    fontWeight: '700',
  },
});
