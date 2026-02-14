import { useRouter } from "expo-router";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";

const jogos = [
  { id: "1", nome: "Minecraft", capa: "https://i.imgur.com/8RKXAIV.jpg" },
  { id: "2", nome: "GTA V", capa: "https://i.imgur.com/lp6XG7J.jpg" },
  { id: "3", nome: "Free Fire", capa: "https://i.imgur.com/7yUvePI.jpg" },
];

export default function Jogos() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, padding: 15, backgroundColor: "#0f172a" }}>
      <FlatList
        data={jogos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              flexDirection: "row",
              padding: 10,
              backgroundColor: "#1e293b",
              marginBottom: 10,
              borderRadius: 12,
              alignItems: "center",
            }}
            onPress={() => router.push(`/jogos/${item.id}`)}
          >
            <Image
              source={{ uri: item.capa }}
              style={{ width: 60, height: 60, borderRadius: 10 }}
            />
            <Text style={{ color: "white", fontSize: 18, marginLeft: 10 }}>
              {item.nome}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
