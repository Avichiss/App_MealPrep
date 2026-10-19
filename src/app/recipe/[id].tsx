
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getRecipeById } from "../../data/recipes";

export default function RecipeDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const recipe = getRecipeById(id);

  if (!recipe) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Resep tidak ditemukan</Text>

        <Pressable
          style={styles.button}
          onPress={() => router.replace("/" as any)}
        >
          <Text style={styles.buttonText}>
            Ke Halaman Utama
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{recipe.name}</Text>

      <Text style={styles.info}>
        Waktu memasak: {recipe.time} menit
      </Text>

      <Text style={styles.description}>
        Ini adalah halaman detail untuk resep {recipe.name}.
      </Text>

      <Pressable
        style={styles.button}
        onPress={() => router.back()}
      >
        <Text style={styles.buttonText}>Kembali</Text>
      </Pressable>

      <Pressable
        style={styles.secondaryButton}
        onPress={() => router.replace("/" as any)}
      >
        <Text style={styles.secondaryButtonText}>
          Ke Halaman Utama
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fffaf0",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#704214",
    marginBottom: 12,
  },
  info: {
    fontSize: 17,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#8b5e34",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#8b5e34",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#704214",
    fontWeight: "bold",
  },
});
