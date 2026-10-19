
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from "react-native";

export default function Index() {
  const [namaResep, setNamaResep] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Project Meal Prep</Text>

      <TextInput
        style={styles.input}
        placeholder="Masukkan nama resep..."
        value={namaResep}
        onChangeText={setNamaResep}
      />

      <Text style={styles.label}>Pratinjau resep:</Text>
      <Text style={styles.result}>
        {namaResep || "Belum ada resep"}
      </Text>

      <Text>Jumlah karakter: {namaResep.length}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#fffaf0",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#704214",
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbbba0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    backgroundColor: "#ffffff",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  result: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
});
