import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { searchGames, SteamGameSearchResult } from '../../services/steamService';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelectCover: (coverUrl: string, gameName: string) => void;
}

export default function GameCoverSearch({ visible, onClose, onSelectCover }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SteamGameSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setSearched(true);
    try {
      const games = await searchGames(searchTerm);
      setResults(games);
    } catch (error) {
      console.error('Erro na busca:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (coverUrl: string | null, gameName: string) => {
    if (coverUrl) {
      onSelectCover(coverUrl, gameName);
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Buscar capa na Steam</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Busca */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color="#64748b" />
            <TextInput
              style={styles.input}
              placeholder="Digite o nome do jogo..."
              placeholderTextColor="#64748b"
              value={searchTerm}
              onChangeText={setSearchTerm}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              autoFocus
            />
            {searchTerm.length > 0 && (
              <TouchableOpacity onPress={() => setSearchTerm('')}>
                <Ionicons name="close-circle" size={20} color="#64748b" />
              </TouchableOpacity>
            )}
          </View>
          
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.searchButtonText}>Buscar</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Resultados */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text style={styles.loadingText}>Buscando jogos...</Text>
          </View>
        ) : searched && results.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="game-controller-outline" size={60} color="#334155" />
            <Text style={styles.emptyText}>Nenhum jogo encontrado</Text>
            <Text style={styles.emptySubtext}>Tente outro nome</Text>
          </View>
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => item.appid.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultCard}
                onPress={() => handleSelect(item.coverUrl, item.name)}
                activeOpacity={0.7}
              >
                <Image
                  source={{ uri: item.coverUrl || 'https://via.placeholder.com/150x225?text=Sem+Capa' }}
                  style={styles.coverImage}
                />
                <View style={styles.resultInfo}>
                  <Text style={styles.gameName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.gameId}>ID: {item.appid}</Text>
                  <TouchableOpacity
                    style={styles.selectButton}
                    onPress={() => handleSelect(item.coverUrl, item.name)}
                  >
                    <Ionicons name="checkmark-circle" size={18} color="#fff" />
                    <Text style={styles.selectButtonText}>Usar esta capa</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  closeButton: {
    padding: 8,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 8,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 12,
  },
  searchButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: 'center',
    minWidth: 70,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    color: '#94a3b8',
    fontSize: 16,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  resultCard: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
  },
  coverImage: {
    width: 80,
    height: 120,
    margin: 12,
    borderRadius: 8,
    backgroundColor: '#334155',
  },
  resultInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  gameName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  gameId: {
    color: '#64748b',
    fontSize: 12,
    marginBottom: 12,
  },
  selectButton: {
    flexDirection: 'row',
    backgroundColor: '#10b981',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyText: {
    color: '#e2e8f0',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#64748b',
    fontSize: 14,
  },
});