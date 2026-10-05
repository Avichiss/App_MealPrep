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

export default function Index() {
  const [recipe, setRecipe] = useState("");

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

      {/* Card tema cream & gold */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tema Cream & Gold</Text>
        <Text style={styles.cardDesc}>
          Elegan, rapi, cocok untuk demo project
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fefce8" },
  title: { fontSize: 24, fontWeight: "bold", color: "#a16207", marginBottom: 20 },
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
    marginTop: 30,
    width: "90%",
  },
  cardTitle: { fontSize: 20, fontWeight: "bold", color: "#a16207" },
  cardDesc: { fontSize: 14, color: "#78350f" },
});