// hooks/useThemeColor.ts - VERSÃO SIMPLIFICADA
import { useColorScheme } from 'react-native';

const Colors = {
  light: {
    background: '#ffffff',
    text: '#000000',
    primary: '#3b82f6',
    secondary: '#6b7280',
    border: '#d1d5db',
    card: '#f9fafb',
  },
  dark: {
    background: '#0f172a',
    text: '#f8fafc',
    primary: '#3b82f6',
    secondary: '#94a3b8',
    border: '#334155',
    card: '#1e293b',
  },
};

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}