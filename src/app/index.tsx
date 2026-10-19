import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";

// Type & Array of Objects
type Recipe = {
  id: number;
  name: string;
  time: string;
};

const recipes: Recipe[] = [
  { id: 1, name: "Honey Garlic Salmon", time: "20 min" },
  { id: 2, name: "Nasi Goreng", time: "15 min" },
  { id: 3, name: "Sate Ayam", time: "25 min" },
];

export default function Index() {
  const [recipe, setRecipe] = useState("");

  // Custom Function
  const handleSave = () => {
    const message = recipe
      ? `Resep kamu: ${recipe}`
      : "Silakan masukkan nama resep terlebih dahulu.";

    if (Platform.OS === "web") {
      window.alert(message);
    } else {
      Alert.alert("Saved!", message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Project Meal Prep</Text>

      <TextInput
        placeholder="Type your recipe..."
        style={styles.input}
        value={recipe}
        onChangeText={setRecipe}
      />

      <Button title="Click Me" color="#a16207" onPress={handleSave} />

      {/* Looping array of objects */}
      {recipes.map((r) => (
        <View key={r.id} style={styles.card}>
          <Text style={styles.cardTitle}>{r.name}</Text>
          <Text style={styles.cardDesc}>{r.time}</Text>
        </View>
      ))}

      {/* Inline style */}
      <Text style={{ color: "blue", fontSize: 16, marginTop: 20 }}>
        Resep Sendiri
      </Text>

      {/* External styles sudah ada di StyleSheet */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fefce8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#a16207",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#a16207",
    borderRadius: 8,
    padding: 10,
    width: "80%",
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#facc15", // gold
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginTop: 20,
    width: "90%",
  },
  cardTitle: { fontSize: 20, fontWeight: "bold", color: "#a16207" },
  cardDesc: { fontSize: 14, color: "#78350f" },
});