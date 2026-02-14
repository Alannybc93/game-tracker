import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a", // azul escuro gamer
    padding: 15,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#38bdf8", // azul neon
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#111827",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },

  text: {
    color: "white",
    fontSize: 16,
  },

  button: {
    backgroundColor: "#22c55e",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
