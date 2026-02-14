import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="addGameForm" 
        options={{ 
          headerShown: false,
          presentation: 'modal',
          animation: 'slide_from_bottom'
        }} 
      />
    </Stack>
  );
}