import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

export default function AddGameScreen() {
  const [name, setName] = useState("");

  return (
    <View className="flex-1 bg-slate-900 p-5 justify-center">

      <Text className="text-white text-2xl font-bold mb-5">Adicionar Jogo</Text>

      <TextInput
        className="bg-slate-800 text-white p-4 rounded-xl mb-4"
        placeholder="Nome do jogo"
        placeholderTextColor="gray"
        value={name}
        onChangeText={setName}
      />

      <TouchableOpacity className="bg-cyan-500 p-4 rounded-xl">
        <Text className="text-white text-center font-bold">Salvar</Text>
      </TouchableOpacity>

    </View>
  );
}
