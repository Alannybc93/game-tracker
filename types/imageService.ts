import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { Alert, Platform } from 'react-native';
import { ImageInfo } from '../types';

class ImageService {
  private async requestPermissions() {
    if (Platform.OS !== 'web') {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'Precisamos de permissão para acessar a câmera e a galeria.'
        );
        return false;
      }
    }
    return true;
  }

  async pickFromGallery(): Promise<ImageInfo | null> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) return null;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        return {
          uri: result.assets[0].uri,
          width: result.assets[0].width,
          height: result.assets[0].height,
          type: result.assets[0].type,
          base64: result.assets[0].base64,
        };
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
    }

    return null;
  }

  async takePhoto(): Promise<ImageInfo | null> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) return null;

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        // Salvar na galeria
        await MediaLibrary.saveToLibraryAsync(result.assets[0].uri);
        
        return {
          uri: result.assets[0].uri,
          width: result.assets[0].width,
          height: result.assets[0].height,
          type: result.assets[0].type,
          base64: result.assets[0].base64,
        };
      }
    } catch (error) {
      console.error('Erro ao tirar foto:', error);
      Alert.alert('Erro', 'Não foi possível tirar a foto.');
    }

    return null;
  }

  async compressImage(uri: string): Promise<string> {
    // Implementação básica - você pode usar expo-image-manipulator para compressão
    return uri;
  }
}

export const imageService = new ImageService();