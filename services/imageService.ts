import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

export interface ImageInfo {
  uri: string;
  type?: string;
  size?: number;
}

export class ImageService {
  static async pickImage(): Promise<ImageInfo | null> {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        throw new Error('Permissão para acessar a galeria foi negada');
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: false,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return null;
      }

      const asset = result.assets[0];
      
      // Verificar se asset.type não é null
      const type = asset.type ?? undefined;

      if (!asset.uri) {
        throw new Error('URI da imagem não encontrada');
      }

      // Obter informações do arquivo
      const fileInfo = await FileSystem.getInfoAsync(asset.uri);
      
      // Comprimir a imagem se necessário
      const compressedImage = await manipulateAsync(
        asset.uri,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: SaveFormat.JPEG }
      );

      return {
        uri: compressedImage.uri,
        type,
        size: fileInfo.exists ? (fileInfo.size || 0) : 0,
      };
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      throw error;
    }
  }

  static async takePhoto(): Promise<ImageInfo | null> {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (!permissionResult.granted) {
        throw new Error('Permissão para acessar a câmera foi negada');
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: false,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return null;
      }

      const asset = result.assets[0];
      
      // Verificar se asset.type não é null
      const type = asset.type ?? undefined;

      if (!asset.uri) {
        throw new Error('URI da foto não encontrada');
      }

      // Obter informações do arquivo
      const fileInfo = await FileSystem.getInfoAsync(asset.uri);
      
      // Comprimir a imagem se necessário
      const compressedImage = await manipulateAsync(
        asset.uri,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: SaveFormat.JPEG }
      );

      return {
        uri: compressedImage.uri,
        type,
        size: fileInfo.exists ? (fileInfo.size || 0) : 0,
      };
    } catch (error) {
      console.error('Erro ao tirar foto:', error);
      throw error;
    }
  }

  static async uploadImage(uri: string, uploadUrl: string): Promise<string> {
    try {
      const formData = new FormData();
      
      // Extrair nome do arquivo da URI
      const fileName = uri.split('/').pop() || 'photo.jpg';
      const fileType = 'image/jpeg';

      formData.append('file', {
        uri,
        name: fileName,
        type: fileType,
      } as any);

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error(`Erro no upload: ${response.statusText}`);
      }

      const data = await response.json();
      return data.url || data.uri || data.path;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      throw error;
    }
  }

  static async getImageBase64(uri: string): Promise<string> {
    try {
      // SOLUÇÃO: Usar string literal 'base64' em vez de EncodingType.Base64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: 'base64', // String literal funciona na maioria das versões
      });
      return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
      console.error('Erro ao converter imagem para base64:', error);
      throw error;
    }
  }

  // Alternativa 2: Se ainda der erro, use esta versão com FileReader
  static async getImageBase64Alt(uri: string): Promise<string> {
    try {
      // Método alternativo usando FileReader (funciona em navegadores e React Native)
      const response = await fetch(uri);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Erro ao converter imagem para base64:', error);
      throw error;
    }
  }

  static async deleteImage(uri: string): Promise<void> {
    try {
      if (uri.startsWith('file://')) {
        await FileSystem.deleteAsync(uri, { idempotent: true });
      }
    } catch (error) {
      console.error('Erro ao deletar imagem:', error);
      // Não lançar erro para não interromper o fluxo principal
    }
  }

  static isValidImageUrl(url: string): boolean {
    if (!url) return false;
    
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
    const urlLower = url.toLowerCase();
    
    return imageExtensions.some(ext => urlLower.includes(ext)) || 
           urlLower.startsWith('data:image/') ||
           urlLower.startsWith('file://');
  }

  // Método utilitário adicional: criar nome de arquivo único
  static generateFileName(extension: string = 'jpg'): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `image_${timestamp}_${random}.${extension}`;
  }

  // Método para verificar tamanho da imagem
  static async getImageSize(uri: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = reject;
      img.src = uri;
    });
  }
}