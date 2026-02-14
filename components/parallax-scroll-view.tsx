import { PropsWithChildren } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export function ParallaxScrollView({ children }: PropsWithChildren) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  content: {
    padding: 16,
  },
});
