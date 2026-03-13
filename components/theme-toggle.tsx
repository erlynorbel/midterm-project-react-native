import { useTheme } from '@react-navigation/native';
import { Pressable, StyleSheet, Text } from 'react-native';

import { useAppContext } from '@/context/app-context';

export function ThemeToggle() {
  const { colors } = useTheme();
  const { themeMode, toggleTheme } = useAppContext();

  return (
    <Pressable
      onPress={toggleTheme}
      style={({ pressed }) => [
        styles.button,
        {
          borderColor: colors.border,
          backgroundColor: colors.card,
          opacity: pressed ? 0.8 : 1,
        },
      ]}>
      <Text style={[styles.label, { color: colors.text }]}>Mode: {themeMode === 'light' ? 'Light' : 'Dark'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
});
