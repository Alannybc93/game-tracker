import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import GameCoverSearch from './components/GameCoverSearch'; // ← CORRIGIDO!

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

type Platform = {
  id: string;
  name: string;
  icon: string;
};

type StatusOption = {
  id: string;
  name: string;
  color: string;
  icon: string;
};

export default function AddGameFormScreen() {
  const router = useRouter();
  
  const [gameName, setGameName] = useState('');
  const [platform, setPlatform] = useState('');
  const [hours, setHours] = useState('');
  const [status, setStatus] = useState('');
  const [rating, setRating] = useState(0);
  const [gameImage, setGameImage] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [showSteamSearch, setShowSteamSearch] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      await ImagePicker.requestCameraPermissionsAsync();
    } catch (error) {
      console.error('Erro ao solicitar permissões:', error);
    }
  };

  const convertToBase64 = async (uri: string): Promise<string | null> => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('❌ Erro ao converter imagem:', error);
      return null;
    }
  };

  const takePhoto = async () => {
    try {
      const cameraPermission = await ImagePicker.getCameraPermissionsAsync();
      
      if (cameraPermission.status !== 'granted') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar a câmera.');
          return;
        }
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.6,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        if (result.assets[0].base64) {
          setGameImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
        } else {
          setGameImage(result.assets[0].uri);
        }
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível abrir a câmera.');
    }
  };

  const pickImage = async () => {
    try {
      const galleryPermission = await ImagePicker.getMediaLibraryPermissionsAsync();
      
      if (galleryPermission.status !== 'granted') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar a galeria.');
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.6,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        if (result.assets[0].base64) {
          setGameImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
        } else {
          const base64 = await convertToBase64(result.assets[0].uri);
          setGameImage(base64);
        }
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível abrir a galeria.');
    }
  };

  const handleSteamCoverSelected = (coverUrl: string, gameName: string) => {
    setGameImage(coverUrl);
    setGameName(gameName);
    setShowSteamSearch(false);
  };

  const removeImage = () => {
    setGameImage(null);
  };

  const handleSubmit = async () => {
    if (!gameName.trim()) {
      Alert.alert('Erro', 'Por favor, insira o nome do jogo');
      return;
    }

    setLoading(true);

    try {
      let platformName = 'Não informada';
      if (platform) {
        const found = platforms.find(p => p.id === platform);
        platformName = found ? found.name : platform;
      }

      let statusName = 'Não informado';
      if (status) {
        const found = statusOptions.find(s => s.id === status);
        statusName = found ? found.name : status;
      }

      const newGame: Game = {
        id: Date.now().toString(),
        title: gameName.trim(),
        platform: platformName,
        status: statusName,
        hours: hours ? parseInt(hours) : 0,
        rating: rating,
        imageUri: gameImage,
        notes: notes || '',
        createdAt: new Date().toISOString(),
      };

      const existingGames = await AsyncStorage.getItem('games');
      let games: Game[] = existingGames ? JSON.parse(existingGames) : [];
      games.push(newGame);
      
      games.sort((a: Game, b: Game) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      await AsyncStorage.setItem('games', JSON.stringify(games));
      
      Alert.alert('✅ Sucesso!', `"${newGame.title}" foi adicionado à sua coleção.`, [
        { text: 'OK', onPress: () => router.back() }
      ]);

      setGameName('');
      setPlatform('');
      setHours('');
      setStatus('');
      setRating(0);
      setGameImage(null);
      setNotes('');
      
    } catch (error) {
      console.error('❌ Erro ao salvar jogo:', error);
      Alert.alert('Erro', 'Não foi possível salvar o jogo. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const platforms: Platform[] = [
    { id: 'pc', name: 'PC', icon: 'laptop' },
    { id: 'ps5', name: 'PS5', icon: 'sony-playstation' },
    { id: 'xbox', name: 'XBOX', icon: 'microsoft-xbox' },
    { id: 'switch', name: 'Switch', icon: 'nintendo-switch' },
    { id: 'mobile', name: 'Mobile', icon: 'smartphone' },
    { id: 'other', name: 'Outro', icon: 'gamepad-variant' },
  ];

  const statusOptions: StatusOption[] = [
    { id: 'playing', name: 'Jogando', color: '#10b981', icon: 'play-circle' },
    { id: 'completed', name: 'Completo', color: '#3b82f6', icon: 'checkmark-done-circle' },
    { id: 'paused', name: 'Pausado', color: '#f59e0b', icon: 'pause-circle' },
    { id: 'planned', name: 'Planejado', color: '#8b5cf6', icon: 'calendar' },
    { id: 'dropped', name: 'Abandonado', color: '#ef4444', icon: 'close-circle' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Adicionar Jogo Personalizado</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.imageSection}>
          <Text style={styles.sectionTitle}>🎮 Capa do Jogo</Text>
          
          {gameImage ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: gameImage }} style={styles.selectedImage} />
              <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}>
                <Ionicons name="close-circle" size={28} color="#ef4444" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.imageUploadArea}>
              <Ionicons name="image-outline" size={60} color="#475569" />
              <Text style={styles.uploadText}>Nenhuma imagem selecionada</Text>
            </View>
          )}
          
          <View style={styles.imageButtons}>
            <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
              <Ionicons name="camera" size={20} color="#fff" />
              <Text style={styles.imageButtonText}>📸 Câmera</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.imageButton, styles.galleryButton]} onPress={pickImage}>
              <MaterialIcons name="photo-library" size={20} color="#fff" />
              <Text style={styles.imageButtonText}>🖼️ Galeria</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.imageButton, styles.steamButton]} 
              onPress={() => setShowSteamSearch(true)}
            >
              <Ionicons name="logo-steam" size={20} color="#fff" />
              <Text style={styles.imageButtonText}>🎮 Steam</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>📝 Nome do Jogo <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.input}
              value={gameName}
              onChangeText={setGameName}
              placeholder="Ex: The Legend of Zelda"
              placeholderTextColor="#64748b"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>🎯 Plataforma</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {platforms.map((plat: Platform) => (
                <TouchableOpacity
                  key={plat.id}
                  style={[
                    styles.platformButton,
                    platform === plat.id && styles.platformButtonSelected,
                  ]}
                  onPress={() => setPlatform(plat.id)}
                >
                  <Ionicons
                    name={plat.icon as any}
                    size={22}
                    color={platform === plat.id ? '#fff' : '#94a3b8'}
                  />
                  <Text style={[
                    styles.platformText,
                    platform === plat.id && styles.platformTextSelected,
                  ]}>
                    {plat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>⏱️ Horas Jogadas</Text>
            <View style={styles.hoursContainer}>
              <TextInput
                style={[styles.input, styles.hoursInput]}
                value={hours}
                onChangeText={setHours}
                placeholder="0"
                placeholderTextColor="#64748b"
                keyboardType="numeric"
              />
              <Text style={styles.hoursLabel}>horas</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>📌 Status</Text>
            <View style={styles.statusGrid}>
              {statusOptions.map((stat: StatusOption) => (
                <TouchableOpacity
                  key={stat.id}
                  style={[
                    styles.statusButton,
                    { borderColor: stat.color },
                    status === stat.id && { backgroundColor: stat.color + '20' },
                  ]}
                  onPress={() => setStatus(stat.id)}
                >
                  <Ionicons
                    name={stat.icon as any}
                    size={20}
                    color={status === stat.id ? stat.color : '#94a3b8'}
                  />
                  <Text style={[
                    styles.statusText,
                    status === stat.id && { color: stat.color },
                  ]}>
                    {stat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>⭐ Avaliação</Text>
            <View style={styles.ratingSection}>
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star: number) => (
                  <TouchableOpacity key={star} onPress={() => setRating(star)}>
                    <Ionicons
                      name={star <= rating ? 'star' : 'star-outline'}
                      size={40}
                      color={star <= rating ? '#fbbf24' : '#475569'}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.ratingText}>
                {rating === 0 ? 'Sem avaliação' : `${rating}/5 estrelas`}
              </Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>📝 Observações</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Suas anotações sobre o jogo..."
              placeholderTextColor="#64748b"
              multiline
              numberOfLines={3}
            />
          </View>

          <TouchableOpacity 
            style={[styles.submitButton, (!gameName.trim() || loading) && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={!gameName.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Text style={styles.submitButtonText}>✅ ADICIONAR JOGO</Text>
                <Ionicons name="checkmark-circle" size={22} color="#fff" />
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <GameCoverSearch
        visible={showSteamSearch}
        onClose={() => setShowSteamSearch(false)}
        onSelectCover={handleSteamCoverSelected}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1e293b',
  },
  backButton: { padding: 8 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
  scrollView: { flex: 1 },
  imageSection: { 
    padding: 20, 
    alignItems: 'center', 
    borderBottomWidth: 1, 
    borderBottomColor: '#334155',
    backgroundColor: '#0f172a',
  },
  sectionTitle: { 
    color: '#e2e8f0', 
    fontSize: 16, 
    fontWeight: '600', 
    marginBottom: 16, 
    alignSelf: 'flex-start' 
  },
  imagePreviewContainer: { 
    position: 'relative', 
    width: 200, 
    height: 200, 
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  selectedImage: { 
    width: '100%', 
    height: '100%', 
    borderRadius: 12,
  },
  removeImageButton: { 
    position: 'absolute', 
    top: -10, 
    right: -10, 
    backgroundColor: '#1e293b', 
    borderRadius: 14,
    padding: 2,
  },
  imageUploadArea: { 
    width: 200, 
    height: 200, 
    backgroundColor: '#1e293b', 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 2, 
    borderColor: '#334155', 
    borderStyle: 'dashed', 
    marginBottom: 16 
  },
  uploadText: { 
    color: '#94a3b8', 
    marginTop: 12, 
    fontSize: 14, 
    textAlign: 'center' 
  },
  imageButtons: { 
    flexDirection: 'row', 
    gap: 8, 
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  imageButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#3b82f6', 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 8, 
    gap: 6, 
    minWidth: 100, 
    justifyContent: 'center' 
  },
  galleryButton: { 
    backgroundColor: '#8b5cf6' 
  },
  steamButton: {
    backgroundColor: '#171a21',
  },
  imageButtonText: { 
    color: '#fff', 
    fontSize: 14, 
    fontWeight: '600' 
  },
  form: { padding: 20 },
  inputGroup: { marginBottom: 24 },
  label: { 
    color: '#e2e8f0', 
    fontSize: 15, 
    fontWeight: '600', 
    marginBottom: 8 
  },
  required: { color: '#ef4444' },
  input: { 
    backgroundColor: '#1e293b', 
    color: '#fff', 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    borderRadius: 10, 
    fontSize: 15, 
    borderWidth: 1, 
    borderColor: '#334155' 
  },
  textArea: { 
    height: 80, 
    textAlignVertical: 'top', 
    paddingTop: 12 
  },
  platformButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#1e293b', 
    paddingHorizontal: 14, 
    paddingVertical: 10, 
    borderRadius: 8, 
    marginRight: 8, 
    borderWidth: 1, 
    borderColor: '#334155', 
    gap: 6, 
    minWidth: 80 
  },
  platformButtonSelected: { 
    backgroundColor: '#3b82f6', 
    borderColor: '#3b82f6' 
  },
  platformText: { 
    color: '#94a3b8', 
    fontSize: 13, 
    fontWeight: '500' 
  },
  platformTextSelected: { 
    color: '#fff' 
  },
  hoursContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12 
  },
  hoursInput: { 
    flex: 1 
  },
  hoursLabel: { 
    color: '#94a3b8', 
    fontSize: 15, 
    fontWeight: '500', 
    minWidth: 50 
  },
  statusGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 8 
  },
  statusButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#1e293b', 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 8, 
    borderWidth: 1.5, 
    gap: 6, 
    flex: 1, 
    minWidth: '45%' 
  },
  statusText: { 
    color: '#94a3b8', 
    fontSize: 13, 
    fontWeight: '500' 
  },
  ratingSection: { 
    alignItems: 'center' 
  },
  ratingContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    gap: 4, 
    marginBottom: 8 
  },
  ratingText: { 
    color: '#94a3b8', 
    fontSize: 14, 
    fontWeight: '500' 
  },
  submitButton: { 
    backgroundColor: '#10b981', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 16, 
    borderRadius: 12, 
    marginTop: 20, 
    marginBottom: 12, 
    gap: 8, 
    elevation: 4, 
    shadowColor: '#10b981', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 8 
  },
  submitButtonDisabled: { 
    backgroundColor: '#374151', 
    opacity: 0.6 
  },
  submitButtonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold', 
    letterSpacing: 1 
  },
  cancelButton: { 
    alignItems: 'center', 
    paddingVertical: 12 
  },
  cancelButtonText: { 
    color: '#94a3b8', 
    fontSize: 15, 
    fontWeight: '500' 
  },
});