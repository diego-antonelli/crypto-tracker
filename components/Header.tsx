import { useCallback } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { useTheme } from '@/hooks';

export default function Header() {
  const { theme, themeName, setTheme } = useTheme();

  const onToggleTheme = useCallback(() => {
    const newTheme = themeName === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }, [themeName, setTheme]);

  return (
    <View style={[styles.header, { backgroundColor: theme.card }]}>
      <Text style={[styles.title, { color: theme.text }]}>Crypto Tracker</Text>
      <Switch onValueChange={onToggleTheme} value={themeName === 'dark'} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
