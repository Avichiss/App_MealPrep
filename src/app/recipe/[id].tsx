// [id].tsx
import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getApiRecipeById } from "../../data/mealApi";
import { getRecipeById, Recipe } from "../../data/recipes";

export default function RecipeDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const recipeId = Array.isArray(id) ? id[0] : id;
  const localRecipe = getRecipeById(recipeId);
  const [apiResult, setApiResult] = useState<{
    id: string;
    recipe?: Recipe;
    error?: string;
  }>();

  useEffect(() => {
    if (!recipeId?.startsWith("mealdb-")) {
      return;
    }

    let active = true;

    getApiRecipeById(recipeId)
      .then((result) => {
        if (active) setApiResult({ id: recipeId, recipe: result });
      })
      .catch((err: unknown) => {
        if (active) {
          setApiResult({
            id: recipeId,
            error: err instanceof Error ? err.message : String(err),
          });
        }
      });

    return () => {
      active = false;
    };
  }, [recipeId]);

  const currentApiResult =
    apiResult?.id === recipeId ? apiResult : undefined;
  const loading =
    Boolean(recipeId?.startsWith("mealdb-")) && !currentApiResult;
  const error = currentApiResult?.error ?? "";
  const apiRecipe = currentApiResult?.recipe;
  const recipe = localRecipe ?? apiRecipe;

  if (!recipe) {
    return (
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#8b5e34" />
        ) : (
          <Text style={styles.title}>
            {error || "Resep tidak ditemukan"}
          </Text>
        )}

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

      {recipe.category && (
        <Text style={styles.info}>Kategori: {recipe.category}</Text>
      )}

      <Text style={styles.description}>
        {recipe.instructions ||
          `Ini adalah halaman detail untuk resep ${recipe.name}.`}
      </Text>

      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <>
          <Text style={styles.subtitle}>Bahan</Text>
          {recipe.ingredients.map((ingredient, index) => (
            <Text key={`${index}-${ingredient}`} style={styles.ingredient}>
              • {ingredient}
            </Text>
          ))}
        </>
      )}

      <Pressable
        style={styles.button}
        onPress={() => router.back()}
      >
        <Text style={styles.buttonText}>Kembali</Text>
      </Pressable>

      <Pressable
        style={styles.secondaryButton}
        onPress={() => router.push("/recipe/" + recipe.id as any)}
      >
        <Text style={styles.secondaryButtonText}>
          Next
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
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#704214",
    marginBottom: 8,
  },
  ingredient: {
    fontSize: 16,
    lineHeight: 24,
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
