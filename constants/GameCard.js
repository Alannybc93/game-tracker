import { View, Text } from "react-native";

export default function GameCard({ name }) {
  return (
    <View className="bg-slate-800 p-4 rounded-xl mb-3 shadow-lg">
      <Text className="text-white text-lg font-semibold">🎮 {name}</Text>
    </View>
  );
}
