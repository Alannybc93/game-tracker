// components/GameCard.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface Game {
  id: string;
  title: string;
  status: 'playing' | 'completed' | 'backlog' | 'wishlist';
  hoursPlayed: number;
  coverUrl?: string;
  platform?: string;
  genre?: string;
}

interface GameCardProps {
  game: Game;
  onPress?: () => void;
}

export function GameCard({ game, onPress }: GameCardProps) {
  const getStatusColor = (): string => {
    switch (game.status) {
      case 'playing': return '#3b82f6';
      case 'completed': return '#10b981';
      case 'backlog': return '#8b5cf6';
      case 'wishlist': return '#f59e0b';
      default: return '#94a3b8';
    }
  };

  const getStatusLabel = (): string => {
    switch (game.status) {
      case 'playing': return 'Jogando';
      case 'completed': return 'Finalizado';
      case 'backlog': return 'Backlog';
      case 'wishlist': return 'Wishlist';
      default: return game.status;
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {game.coverUrl ? (
        <Image 
          source={{ uri: game.coverUrl }} 
          style={styles.cover}
        />
      ) : (
        <View style={styles.coverPlaceholder}>
          <Ionicons name="game-controller" size={32} color="#94a3b8" />
        </View>
      )}
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {game.title}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
            <Text style={styles.statusText}>{getStatusLabel()}</Text>
          </View>
        </View>
        
        {game.genre && (
          <Text style={styles.genre} numberOfLines={1}>
            {game.genre}
          </Text>
        )}
        
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={14} color="#94a3b8" />
            <Text style={styles.detailText}>{game.hoursPlayed}h</Text>
          </View>
          
          {game.platform && (
            <View style={styles.detailItem}>
              <Ionicons name="hardware-chip-outline" size={14} color="#94a3b8" />
              <Text style={styles.detailText}>{game.platform}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    minHeight: 100,
  },
  cover: {
    width: 80,
    height: 100,
  },
  coverPlaceholder: {
    width: 80,
    height: 100,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: {
    flex: 1,
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  genre: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 70,
    alignItems: 'center',
  },
  statusText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '500',
  },
  details: {
    flexDirection: 'row',
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    color: '#94a3b8',
    fontSize: 12,
  },
});