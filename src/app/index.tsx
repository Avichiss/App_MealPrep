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

export default function App() {
  const [recipe, setRecipe] = useState("");

  const handleSave = () => {
    const message = recipe
      ? `Resep kamu: ${recipe}`
      : "Silakan masukkan nama resep terlebih dahulu.";

    if (Platform.OS === "web") {
      window.alert(message); // untuk web
    } else {
      Alert.alert("Saved!", message); // untuk Android/iOS
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Project Meal Prep</Text>

      {/* Input resep */}
      <TextInput
        placeholder="Type your recipe..."
        style={styles.input}
        value={recipe}
        onChangeText={setRecipe}
      />

      {/* Tombol simpan */}
      <Button title="Click Me" color="#a16207" onPress={handleSave} />
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
});