import React from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const games = [
  {
    id: "1",
    name: "GTA V",
    platform: "PC / PS5",
    rating: 5,
    image: "https://i.imgur.com/Qh7q9aP.jpg",
    date: "10/02/2026",
  },
  {
    id: "2",
    name: "Minecraft",
    platform: "PC / Mobile",
    rating: 4,
    image: "https://i.imgur.com/8RKXAIV.jpg",
    date: "08/02/2026",
  },
  {
    id: "3",
    name: "The Witcher 3",
    platform: "PC / PS5",
    rating: 5,
    image: "https://i.imgur.com/VtXc6uK.jpg",
    date: "01/02/2026",
  },
];

export default function GameListScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎮 Jogos Jogados</Text>

      <FlatList
        data={games}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />

            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>

              <Text style={styles.platform}>{item.platform}</Text>

              <View style={styles.row}>
                <Ionicons name="calendar" size={16} color="#aaa" />
                <Text style={styles.date}> {item.date}</Text>
              </View>

              <View style={styles.stars}>
                {[...Array(item.rating)].map((_, i) => (
                  <Ionicons key={i} name="star" size={18} color="#FFD700" />
                ))}
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a", // fundo escuro gamer
    padding: 15,
  },
  title: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
    marginBottom: 15,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#1e293b",
    borderRadius: 15,
    marginBottom: 15,
    overflow: "hidden",
    elevation: 5,
  },
  image: {
    width: 110,
    height: 110,
  },
  info: {
    padding: 10,
    flex: 1,
  },
  name: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  platform: {
    color: "#38bdf8",
    fontSize: 14,
    marginBottom: 5,
  },
  date: {
    color: "#aaa",
    fontSize: 13,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  stars: {
    flexDirection: "row",
    marginTop: 5,
  },
});
