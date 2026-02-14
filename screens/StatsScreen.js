import { View, Text, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useEffect, useState } from "react";
import { loadGames } from "../services/storage";

export default function StatsScreen() {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function load() {
      const games = await loadGames();
      setTotal(games.length);
    }
    load();
  }, []);

  return (
    <View className="flex-1 bg-slate-900 p-5">
      <Text className="text-white text-2xl font-bold mb-5">📊 Estatísticas</Text>

      <LineChart
        data={{
          labels: ["Jogos"],
          datasets: [{ data: [total] }],
        }}
        width={Dimensions.get("window").width - 40}
        height={220}
        chartConfig={{
          backgroundColor: "#0f172a",
          backgroundGradientFrom: "#0f172a",
          backgroundGradientTo: "#1e293b",
          color: () => "#22d3ee",
        }}
        style={{ borderRadius: 16 }}
      />
    </View>
  );
}
