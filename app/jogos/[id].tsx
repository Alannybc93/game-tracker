import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text } from "react-native";

export default function GameDetails() {
  const { id } = useLocalSearchParams();
  const [game, setGame] = useState<any>(null);

  useEffect(() => {
    loadGame();
  }, []);

  async function loadGame() {
    const data = await AsyncStorage.getItem("games");
    if (!data) return;
    const games = JSON.parse(data);
    const found = games.find((g: any) => g.id === id);
    setGame(found);
  }

  if (!game) return <Text style={{ color: "white" }}>Carregando...</Text>;

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: game.cover || "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg" }}
        style={styles.cover}
      />

      <Text style={styles.title}>{game.title}</Text>
      <Text style={styles.info}>🎮 Plataforma: {game.platform}</Text>
      <Text style={styles.info}>📌 Status: {game.status}</Text>

      <Text style={styles.section}>⭐ Minha avaliação</Text>
      <Text style={styles.review}>Ainda não avaliado...</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020617", padding: 10 },
  cover: { width: "100%", height: 250, borderRadius: 12 },
  title: { color: "white", fontSize: 22, fontWeight: "bold", marginTop: 10 },
  info: { color: "#94a3b8", marginTop: 5 },
  section: { color: "white", fontSize: 18, fontWeight: "bold", marginTop: 15 },
  review: { color: "#e5e7eb", marginTop: 5 },
});
