import { Camera } from 'expo-camera';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

export default function CameraScreen() {
  const [permission, requestPermission] = Camera.useCameraPermissions();

  useEffect(() => {
    requestPermission();
  }, []);

  if (!permission?.granted) {
    return <Text>Sem permissão para câmera</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} />
    </View>
  );
}
