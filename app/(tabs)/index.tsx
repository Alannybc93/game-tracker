import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const router = useRouter();

  async function loadGames() {
    try {
      const data = await AsyncStorage.getItem('games');
      if (data) {
        setGames(JSON.parse(data));
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

  const playingGames = games.filter(game => game.status === 'Jogando');
  const recentGames = games.slice(0, 3);
  const totalHours = games.reduce((acc, game) => acc + game.hours, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Olá, Jogador! 👋</Text>
            <Text style={styles.date}>
              {new Date().toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
              })}
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/profile')}>
            <Ionicons name="person-circle" size={40} color="#3b82f6" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="game-controller" size={24} color="#3b82f6" />
          <Text style={styles.statNumber}>{games.length}</Text>
          <Text style={styles.statLabel}>Jogos</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="time" size={24} color="#10b981" />
          <Text style={styles.statNumber}>{totalHours}h</Text>
          <Text style={styles.statLabel}>Horas</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="trophy" size={24} color="#fbbf24" />
          <Text style={styles.statNumber}>{games.filter(g => g.status === 'Completo').length}</Text>
          <Text style={styles.statLabel}>Completos</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Continuar Jogando</Text>
          {playingGames.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {playingGames.map((game) => (
                <TouchableOpacity key={game.id} style={styles.playingCard}>
                  <View style={styles.playingImageContainer}>
                    {game.imageUri ? (
                      <Image source={{ uri: game.imageUri }} style={styles.playingImage} />
                    ) : (
                      <View style={styles.playingImagePlaceholder}>
                        <Ionicons name="game-controller" size={30} color="#475569" />
                      </View>
                    )}
                  </View>
                  <Text style={styles.playingTitle} numberOfLines={1}>{game.title}</Text>
                  <Text style={styles.playingHours}>{game.hours}h jogadas</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <TouchableOpacity style={styles.emptySection} onPress={() => router.push('/addGameForm')}>
              <Ionicons name="play-circle-outline" size={40} color="#475569" />
              <Text style={styles.emptyText}>Nenhum jogo em andamento</Text>
              <Text style={styles.emptySubtext}>Adicione um jogo para começar</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📥 Adicionados Recentemente</Text>
            <TouchableOpacity onPress={() => router.push('/games')}>
              <Text style={styles.seeAllButton}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          {recentGames.length > 0 ? (
            recentGames.map((game) => (
              <TouchableOpacity key={game.id} style={styles.recentCard}>
                <View style={styles.recentImageContainer}>
                  {game.imageUri ? (
                    <Image source={{ uri: game.imageUri }} style={styles.recentImage} />
                  ) : (
                    <View style={styles.recentImagePlaceholder}>
                      <Ionicons name="game-controller" size={20} color="#475569" />
                    </View>
                  )}
                </View>
                <View style={styles.recentInfo}>
                  <Text style={styles.recentTitle} numberOfLines={1}>{game.title}</Text>
                  <View style={styles.recentMeta}>
                    <Text style={styles.recentPlatform}>{game.platform}</Text>
                    <View style={[styles.recentStatus, { backgroundColor: getStatusColor(game.status) + '20' }]}>
                      <Text style={[styles.recentStatusText, { color: getStatusColor(game.status) }]}>
                        {game.status}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <TouchableOpacity style={styles.emptySection} onPress={() => router.push('/addGameForm')}>
              <Ionicons name="add-circle-outline" size={40} color="#475569" />
              <Text style={styles.emptyText}>Adicione seu primeiro jogo</Text>
              <Text style={styles.emptySubtext}>Toque aqui para começar</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => router.push("/addGameForm")}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

import { ScrollView } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#94a3b8',
    textTransform: 'capitalize',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
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
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  seeAllButton: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '600',
  },
  playingCard: {
    width: 140,
    marginRight: 12,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    overflow: 'hidden',
  },
  playingImageContainer: {
    width: '100%',
    height: 140,
  },
  playingImage: {
    width: '100%',
    height: '100%',
  },
  playingImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 4,
  },
  playingHours: {
    fontSize: 12,
    color: '#94a3b8',
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  emptySection: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#1e293b',
    borderRadius: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e2e8f0',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94a3b8',
  },
  recentCard: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  recentImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  recentImage: {
    width: '100%',
    height: '100%',
  },
  recentImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  recentTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 6,
  },
  recentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recentPlatform: {
    fontSize: 12,
    color: '#94a3b8',
  },
  recentStatus: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  recentStatusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});