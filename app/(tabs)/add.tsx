import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function AddScreen() {
  const router = useRouter();
  const [selectedGames, setSelectedGames] = useState<string[]>([]);

  // Lista de jogos disponíveis (você pode expandir)
  const availableGames = [
    { id: '1', name: 'The Legend of Zelda: Breath of the Wild', platform: 'Switch', image: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co49w5.jpg' },
    { id: '2', name: 'Elden Ring', platform: 'PC', image: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co5x8d.jpg' },
    { id: '3', name: 'God of War: Ragnarok', platform: 'PS5', image: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co5r1o.jpg' },
    { id: '4', name: 'Hollow Knight', platform: 'PC', image: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7y.jpg' },
    { id: '5', name: 'Super Mario Odyssey', platform: 'Switch', image: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2g4y.jpg' },
    { id: '6', name: 'Red Dead Redemption 2', platform: 'Multi', image: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2cms.jpg' },
  ];

  // Função para selecionar/deselecionar jogos
  const toggleGameSelection = (gameId: string) => {
    setSelectedGames(prev => {
      if (prev.includes(gameId)) {
        return prev.filter(id => id !== gameId);
      } else {
        return [...prev, gameId];
      }
    });
  };

  // Função para adicionar jogos selecionados
  const handleAddSelected = () => {
    if (selectedGames.length === 0) {
      Alert.alert('Atenção', 'Selecione pelo menos um jogo');
      return;
    }
    
    Alert.alert(
      '✅ Sucesso!', 
      `${selectedGames.length} jogos adicionados à sua coleção!`,
      [{ text: 'OK', onPress: () => setSelectedGames([]) }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>➕ Adicionar Jogos</Text>
          <Text style={styles.subtitle}>Selecione jogos para sua coleção</Text>
        </View>

        {/* CONTADOR DE SELECIONADOS */}
        {selectedGames.length > 0 && (
          <View style={styles.counterContainer}>
            <Text style={styles.counterText}>
              {selectedGames.length} jogo{selectedGames.length !== 1 ? 's' : ''} selecionado{selectedGames.length !== 1 ? 's' : ''}
            </Text>
          </View>
        )}

        {/* GRADE DE JOGOS */}
        <View style={styles.gamesGrid}>
          {availableGames.map((game) => (
            <TouchableOpacity 
              key={game.id} 
              style={[
                styles.gameCard,
                selectedGames.includes(game.id) && styles.gameCardSelected
              ]}
              onPress={() => toggleGameSelection(game.id)}
              activeOpacity={0.7}
            >
              <View style={styles.imageContainer}>
                <Image source={{ uri: game.image }} style={styles.gameImage} />
                {selectedGames.includes(game.id) && (
                  <View style={styles.selectedOverlay}>
                    <Ionicons name="checkmark-circle" size={32} color="#10b981" />
                  </View>
                )}
              </View>
              <View style={styles.gameInfo}>
                <Text style={styles.gameName} numberOfLines={2}>
                  {game.name}
                </Text>
                <Text style={styles.platformText}>{game.platform}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* BOTÃO JOGO PERSONALIZADO */}
        <TouchableOpacity 
          style={styles.customButton}
          onPress={() => router.push("/addGameForm")}
        >
          <Ionicons name="add-circle-outline" size={24} color="#3b82f6" />
          <Text style={styles.customButtonText}>Adicionar jogo personalizado</Text>
        </TouchableOpacity>

        {/* BOTÃO ADICIONAR SELECIONADOS */}
        {selectedGames.length > 0 && (
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddSelected}
          >
            <Ionicons name="checkmark-circle" size={24} color="#fff" />
            <Text style={styles.addButtonText}>
              Adicionar {selectedGames.length} jogo{selectedGames.length !== 1 ? 's' : ''}
            </Text>
          </TouchableOpacity>
        )}

        {/* ESPAÇO EXTRA NO FINAL */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    padding: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
  },
  counterContainer: {
    backgroundColor: '#1e293b',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  counterText: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  gameCard: {
    width: '46%',
    margin: '2%',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  gameCardSelected: {
    borderColor: '#10b981',
  },
  imageContainer: {
    position: 'relative',
  },
  gameImage: {
    width: '100%',
    height: 150,
  },
  selectedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(16, 185, 129, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameInfo: {
    padding: 12,
  },
  gameName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    height: 40,
  },
  platformText: {
    color: '#94a3b8',
    fontSize: 12,
  },
  customButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    padding: 16,
    borderWidth: 2,
    borderColor: '#334155',
    borderStyle: 'dashed',
    borderRadius: 12,
    gap: 10,
  },
  customButtonText: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    padding: 18,
    borderRadius: 12,
    gap: 10,
    elevation: 4,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});