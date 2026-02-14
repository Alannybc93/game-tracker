import { Ionicons } from "@expo/vector-icons";
import { PropsWithChildren, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function Collapsible({
  children,
  title,
}: PropsWithChildren<{ title: string }>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={styles.title}>{title}</Text>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={20}
          color="#fff"
        />
      </TouchableOpacity>

      {isOpen && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  content: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#334155",
  },
});
