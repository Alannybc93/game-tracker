import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function CameraScreen() {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0f172a", alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: "white", fontSize: 20, marginBottom: 20 }}>
        Escolher capa do jogo 🎮
      </Text>

      <TouchableOpacity
        onPress={pickImage}
        style={{ backgroundColor: "#3b82f6", padding: 15, borderRadius: 10 }}
      >
        <Text style={{ color: "white" }}>Abrir Galeria</Text>
      </TouchableOpacity>

      {image && (
        <Image
          source={{ uri: image }}
          style={{ width: 200, height: 300, marginTop: 20, borderRadius: 10 }}
        />
      )}
    </View>
  );
}
