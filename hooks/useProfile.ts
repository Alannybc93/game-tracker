import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert } from "react-native";


export interface Profile {
  name: string;
   avatar: string | null; // ✅ IMPORTANTE
  createdAt: string;
  gamesCount: number;
  totalHours: number;
  favoritePlatform: string;
}

export interface Settings {
  notificationsEnabled: boolean;
  dailyReminderTime: string; // ⬅️ ADICIONADO
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile>({
    name: "Gamer",
    avatar: null, // ✅ IMPORTANTE
    createdAt: new Date().toISOString(),
    gamesCount: 0,
    totalHours: 0,
    favoritePlatform: "PC",
  });

  const [settings, setSettings] = useState<Settings>({
    notificationsEnabled: false,
    dailyReminderTime: "20:00", // ⬅️ DEFAULT
  });

  const updateProfile = async (updates: Partial<Profile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
    return true;
  };

  const reloadProfile = () => {};

  const updateSettings = (updates: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

const updateAvatar = async (): Promise<string | null> => {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    Alert.alert("Permissão negada", "Você precisa permitir acesso à galeria");
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (result.canceled) return null;

  const uri = result.assets[0].uri;
  updateProfile({ avatar: uri });

  return uri;
};



  const clearAllData = () => {
    setProfile({
      name: "Gamer",
      avatar: null, // ✅ IMPORTANTE
      createdAt: new Date().toISOString(),
      gamesCount: 0,
      totalHours: 0,
      favoritePlatform: "PC",
    });
  };

  return {
    profile,
    settings,
    updateProfile,
    updateSettings,
    updateAvatar,
    clearAllData,
    reloadProfile,
    isLoading: false,
    error: null,
  };
}

