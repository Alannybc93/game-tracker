import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// TIPO DO JOGO
type Game = {
  id: string;
  title: string;
  platform: string;
  status: "Jogando" | "Finalizado" | "Backlog";
  cover?: string;
};

export default function Home() {
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);

  // RECARREGA SEMPRE QUE VOLTAR PARA A TELA
  useFocusEffect(
    useCallback(() => {
      loadGames();
    }, [])
  );

  async function loadGames() {
    const data = await AsyncStorage.getItem("games");
    setGames(data ? JSON.parse(data) : []);
  }

  const playing = games.filter((g) => g.status === "Jogando");
  const finished = games.filter((g) => g.status === "Finalizado");

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.hello}>🎮 Olá, Gamer!</Text>
          <Text style={styles.subtitle}>Seu Game Tracker pessoal</Text>
        </View>

        <Image
          source={{ uri: "https://i.pravatar.cc/100" }}
          style={styles.avatar}
        />
      </View>

      {/* ESTATÍSTICAS */}
      <View style={styles.statsRow}>
        <StatCard title="Jogos" value={games.length} />
        <StatCard title="Jogando" value={playing.length} />
        <StatCard title="Finalizados" value={finished.length} />
      </View>

      {/* AÇÕES */}
      <Text style={styles.section}>⚡ Ações rápidas</Text>

      <View style={styles.actionsRow}>
        <ActionBtn title="Adicionar Jogo" color="#2563eb" onPress={() => router.push("/add-game")} />
        <ActionBtn title="Ver Biblioteca" color="#16a34a" onPress={() => router.push("/games")} />
        <ActionBtn title="Perfil" color="#7c3aed" onPress={() => router.push("/profile")} />
      </View>

      {/* JOGANDO AGORA */}
      <View style={styles.playingHeader}>
        <Text style={styles.section}>🔥 Jogando agora</Text>
        <Text style={styles.link} onPress={() => router.push("/games")}>
          Ver todos →
        </Text>
      </View>

      {playing.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum jogo sendo jogado 😢</Text>
      ) : (
        <FlatList
          horizontal
          data={playing}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => <GameCard game={item} />}
        />
      )}
    </ScrollView>
  );
}







// ================= COMPONENTES ================= //

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );
}

function ActionBtn({
  title,
  color,
  onPress,
}: {
  title: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: color }]} onPress={onPress}>
      <Text style={styles.actionText}>{title}</Text>
    </TouchableOpacity>
  );
}

function GameCard({ game }: { game: Game }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.gameCard}
      onPress={() => router.push(`/jogos/${game.id}`)}
    >
      <Image
        source={{
          uri:
            game.cover ||
            "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg",
        }}
        style={styles.gameCover}
      />
      <Text style={styles.gameTitle}>{game.title}</Text>
      <Text style={styles.gamePlatform}>{game.platform}</Text>
    </TouchableOpacity>
  );
}







// ================= ESTILOS ================= //

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    padding: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  hello: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#94a3b8",
    fontSize: 14,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#2563eb",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  statCard: {
    width: "30%",
    backgroundColor: "#0f172a",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1e293b",
  },

  statValue: {
    color: "#22c55e",
    fontSize: 22,
    fontWeight: "bold",
  },

  statTitle: {
    color: "#64748b",
    fontSize: 12,
  },

  section: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  actionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },

  actionBtn: {
    padding: 14,
    borderRadius: 14,
    minWidth: "48%",
    alignItems: "center",
  },

  actionText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },

  playingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  link: {
    color: "#3b82f6",
    fontSize: 14,
  },

  gameCard: {
    width: 160,
    backgroundColor: "#0f172a",
    borderRadius: 16,
    marginRight: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1e293b",
  },

  gameCover: {
    width: "100%",
    height: 200,
  },

  gameTitle: {
    color: "white",
    fontSize: 14,
    padding: 6,
    fontWeight: "bold",
  },

  gamePlatform: {
    color: "#64748b",
    fontSize: 12,
    paddingHorizontal: 6,
    paddingBottom: 8,
  },

  emptyText: {
    color: "#64748b",
    textAlign: "center",
    marginBottom: 10,
  },
});
