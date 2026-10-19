
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import {
  addRecipe,
  getRecipes,
  Recipe,
} from "./data/recipes";

export default function Index() {
  const router = useRouter();

  const [namaResep, setNamaResep] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>(getRecipes());
  const [showRecipes, setShowRecipes] = useState(true);

  // Mencatat perubahan nama resep.
  useEffect(() => {
    console.log("Nama resep berubah:", namaResep);
  }, [namaResep]);

  function handleSave() {
    const namaBersih = namaResep.trim();

    if (!namaBersih) {
      Alert.alert("Perhatian", "Nama resep tidak boleh kosong.");
      return;
    }

    addRecipe(namaBersih);
    setRecipes(getRecipes());
    setNamaResep("");

    Alert.alert("Berhasil", "Resep berhasil disimpan.");
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Project Meal Prep</Text>
      <Text style={styles.subtitle}>
        Simpan dan kelola resep makananmu.
      </Text>

      <Text style={styles.label}>Nama resep</Text>

      <TextInput
        style={styles.input}
        placeholder="Contoh: Nasi Goreng"
        value={namaResep}
        onChangeText={setNamaResep}
      />

      <View style={styles.preview}>
        <Text style={styles.previewLabel}>Pratinjau resep</Text>
        <Text style={styles.previewName}>
          {namaResep.trim() || "Resep kamu akan muncul di sini"}
        </Text>
        <Text>Jumlah karakter: {namaResep.length}</Text>
      </View>

      <Pressable style={styles.primaryButton} onPress={handleSave}>
        <Text style={styles.primaryButtonText}>Simpan Resep</Text>
      </Pressable>

      <View style={styles.listHeader}>
        <Text style={styles.sectionTitle}>
          Daftar Resep ({recipes.length})
        </Text>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => setShowRecipes((current) => !current)}
        >
          <Text style={styles.secondaryButtonText}>
            {showRecipes ? "Sembunyikan" : "Tampilkan"}
          </Text>
        </Pressable>
      </View>

      {showRecipes &&
        recipes.map((recipe) => (
          <Pressable
            key={recipe.id}
            style={styles.recipeCard}
            onPress={() =>
              router.push(("/recipe/" + recipe.id) as any)
            }
          >
            <Text style={styles.recipeName}>{recipe.name}</Text>
            <Text>Waktu memasak: {recipe.time} menit</Text>
            <Text style={styles.detailLink}>Lihat detail →</Text>
          </Pressable>
        ))}

      <Pressable
        style={styles.aboutButton}
        onPress={() => router.push("/about" as any)}
      >
        <Text style={styles.aboutButtonText}>Tentang Aplikasi</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fffaf0",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#704214",
  },
  subtitle: {
    fontSize: 15,
    color: "#75634f",
    marginTop: 6,
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cbbba0",
    borderRadius: 10,
    padding: 13,
    marginBottom: 16,
  },
  preview: {
    backgroundColor: "#f3e6d0",
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
  previewLabel: {
    fontSize: 13,
    color: "#75634f",
    marginBottom: 5,
  },
  previewName: {
    fontSize: 19,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#704214",
  },
  primaryButton: {
    backgroundColor: "#8b5e34",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 28,
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#704214",
    flexShrink: 1,
  },
  secondaryButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#e8d6b8",
  },
  secondaryButtonText: {
    color: "#704214",
    fontWeight: "600",
  },
  recipeCard: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eadcc5",
  },
  recipeName: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#704214",
  },
  detailLink: {
    marginTop: 8,
    color: "#8b5e34",
    fontWeight: "600",
  },
  aboutButton: {
    marginTop: 12,
    marginBottom: 24,
    padding: 13,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#8b5e34",
    alignItems: "center",
  },
  aboutButtonText: {
    color: "#704214",
    fontWeight: "bold",
  },
});
