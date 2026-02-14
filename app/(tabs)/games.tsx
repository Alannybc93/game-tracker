import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Game = {
  id: string;
  title: string;
  platform: string;
  status: string;
  hours: number;
  rating: number;
  imageUri: string | null;
  notes: string;
  createdAt: string;
};

// 🎮 JOGOS DE EXEMPLO
const SAMPLE_GAMES: Game[] = [
  {
    id: '1',
    title: 'The Legend of Zelda: Breath of the Wild',
    platform: 'Switch',
    status: 'Jogando',
    hours: 85,
    rating: 5,
    imageUri: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co49w5.jpg',
    notes: 'Jogo incrível! Mundo aberto perfeito.',
    createdAt: new Date('2026-01-15').toISOString(),
  },
  {
    id: '2',
    title: 'Elden Ring',
    platform: 'PC',
    status: 'Completo',
    hours: 120,
    rating: 5,
    imageUri: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co5x8d.jpg',
    notes: 'Desafiador e recompensador.',
    createdAt: new Date('2026-01-20').toISOString(),
  },
  {
    id: '3',
    title: 'God of War: Ragnarok',
    platform: 'PS5',
    status: 'Pausado',
    hours: 30,
    rating: 4,
    imageUri: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co5r1o.jpg',
    notes: 'História emocionante, mas parei no meio.',
    createdAt: new Date('2026-01-25').toISOString(),
  },
  {
    id: '4',
    title: 'Hollow Knight',
    platform: 'PC',
    status: 'Jogando',
    hours: 45,
    rating: 5,
    imageUri: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7y.jpg',
    notes: 'Metroidvania perfeito.',
    createdAt: new Date('2026-02-01').toISOString(),
  },
  {
    id: '5',
    title: 'Super Mario Odyssey',
    platform: 'Switch',
    status: 'Completo',
    hours: 40,
    rating: 5,
    imageUri: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2g4y.jpg',
    notes: 'Divertido do começo ao fim!',
    createdAt: new Date('2026-02-05').toISOString(),
  },
  {
    id: '6',
    title: 'Red Dead Redemption 2',
    platform: 'Multi',
    status: 'Planejado',
    hours: 0,
    rating: 0,
    imageUri: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2cms.jpg',
    notes: 'Preciso começar esse.',
    createdAt: new Date('2026-02-10').toISOString(),
  },
];

export default function GamesScreen() {
  const [games, setGames] = useState<Game[]>([]);
  const router = useRouter();

  // Carregar jogos do AsyncStorage ou usar exemplos
  async function loadGames() {
    try {
      const data = await AsyncStorage.getItem('games');
      if (data) {
        setGames(JSON.parse(data));
      } else {
        // 🎮 PRIMEIRA VEZ: Carrega os jogos de exemplo
        await AsyncStorage.setItem('games', JSON.stringify(SAMPLE_GAMES));
        setGames(SAMPLE_GAMES);
      }
    } catch (error) {
      console.error('Erro ao carregar jogos:', error);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadGames();
    }, [])
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Jogando': return '#10b981';
      case 'Completo': return '#3b82f6';
      case 'Pausado': return '#f59e0b';
      case 'Planejado': return '#8b5cf6';
      case 'Abandonado': return '#ef4444';
      default: return '#94a3b8';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Jogando': return 'play-circle';
      case 'Completo': return 'checkmark-circle';
      case 'Pausado': return 'pause-circle';
      case 'Planejado': return 'calendar';
      case 'Abandonado': return 'close-circle';
      default: return 'help-circle';
    }
  };

  const totalHours = games.reduce((acc, game) => acc + game.hours, 0);
  const completedGames = games.filter(game => game.status === 'Completo').length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.title}>🎮 Meus Jogos</Text>
        <Text style={styles.subtitle}>
          {games.length} jogos • {totalHours}h jogadas
        </Text>
      </View>

      {/* ESTATÍSTICAS */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="game-controller" size={24} color="#3b82f6" />
          <Text style={styles.statNumber}>{games.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="time" size={24} color="#10b981" />
          <Text style={styles.statNumber}>{totalHours}h</Text>
          <Text style={styles.statLabel}>Horas</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="trophy" size={24} color="#fbbf24" />
          <Text style={styles.statNumber}>{completedGames}</Text>
          <Text style={styles.statLabel}>Completos</Text>
        </View>
      </View>

      {/* LISTA DE JOGOS */}
      <FlatList
        data={games}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.gameCard}
            activeOpacity={0.7}
          >
            <View style={styles.gameImageContainer}>
              {item.imageUri ? (
                <Image source={{ uri: item.imageUri }} style={styles.gameImage} />
              ) : (
                <View style={styles.gameImagePlaceholder}>
                  <Ionicons name="game-controller" size={30} color="#475569" />
                </View>
              )}
            </View>
            <View style={styles.gameInfo}>
              <View style={styles.gameHeader}>
                <Text style={styles.gameTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                  <Ionicons 
                    name={getStatusIcon(item.status) as any} 
                    size={12} 
                    color={getStatusColor(item.status)} 
                  />
                  <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                    {item.status}
                  </Text>
                </View>
              </View>
              <View style={styles.gameDetails}>
                <Text style={styles.detailText}>{item.platform}</Text>
                <Text style={styles.detailText}>• {item.hours}h</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons 
                    name="star" 
                    size={12} 
                    color={item.rating > 0 ? '#fbbf24' : '#475569'} 
                  />
                  <Text style={styles.detailText}>{item.rating}/5</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  gameCard: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  gameImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  gameImage: {
    width: '100%',
    height: '100%',
  },
  gameImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  gameDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});