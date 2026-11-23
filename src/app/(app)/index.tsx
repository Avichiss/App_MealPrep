import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { addRecipe, getRecipes, type Recipe } from "@/data/recipes";
import { getApiRecipes } from "@/data/mealApi";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

type CloudRecipe = {
  id: string;
  user_id: string;
  name: string;
  time: number;
  category: string | null;
  is_cooked: boolean;
  created_at?: string;
};

const PAGE_SIZE = 10;

export default function Index() {
  const router = useRouter();
  const { user } = useAuth();

  const [rahasia, setNama] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>(getRecipes());
  const [showRecipes, setShowRecipes] = useState(true);
  const [apiRecipes, setApiRecipes] = useState<Recipe[]>([]);
  const [loadingApi, setLoadingApi] = useState(true);
  const [apiError, setApiError] = useState("");

  const [cloudRecipes, setCloudRecipes] = useState<CloudRecipe[]>([]);
  const [cloudName, setCloudName] = useState("");
  const [cloudTime, setCloudTime] = useState("15");
  const [cloudLoading, setCloudLoading] = useState(false);
  const [cloudRefreshing, setCloudRefreshing] = useState(false);
  const [cloudError, setCloudError] = useState("");
  const [cloudPage, setCloudPage] = useState(1);
  const [cloudTotalCount, setCloudTotalCount] = useState(0);

  const callsign =
    (user?.user_metadata?.callsign as string | undefined) ||
    user?.email ||
    "Chef";

  const cloudTotalPages = Math.max(1, Math.ceil(cloudTotalCount / PAGE_SIZE));

  const loadCloudRecipes = useCallback(
    async (pageNum: number = cloudPage) => {
      if (!user) return;
      setCloudError("");
      const from = (pageNum - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error, count } = await supabase
        .from("user_recipes")
        .select("*", { count: "exact" })
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) {
        setCloudError(error.message);
        return;
      }

      setCloudRecipes((data as CloudRecipe[]) ?? []);
      setCloudTotalCount(count ?? 0);
    },
    [user, cloudPage],
  );

  useEffect(() => {
    const loadApiRecipes = async () => {
      try {
        const data = await getApiRecipes("ayam");
        setApiRecipes(data);
      } catch (err) {
        setApiError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoadingApi(false);
      }
    };

    loadApiRecipes();
  }, []);

  useEffect(() => {
    const init = async () => {
      setCloudLoading(true);
      try {
        await loadCloudRecipes(cloudPage);
      } finally {
        setCloudLoading(false);
      }
    };
    init();
  }, [loadCloudRecipes, cloudPage]);

  const onRefreshCloud = async () => {
    setCloudRefreshing(true);
    try {
      await loadCloudRecipes(cloudPage);
    } finally {
      setCloudRefreshing(false);
    }
  };

  function handleSaveLocal() {
    const namaBersih = rahasia.trim();

    if (!namaBersih) {
      Alert.alert("Perhatian", "Nama resep tidak boleh kosong.");
      return;
    }

    const addedRecipe = addRecipe(namaBersih);

    if (!addedRecipe) {
      Alert.alert("Perhatian", "Nama resep tidak valid.");
      return;
    }

    setRecipes(getRecipes());
    setNama("");
  }

  const handleAddCloudRecipe = async () => {
    const name = cloudName.trim();
    const time = Number.parseInt(cloudTime, 10) || 15;
    if (!name || !user) {
      Alert.alert("Perhatian", "Nama resep cloud tidak boleh kosong.");
      return;
    }

    setCloudLoading(true);
    setCloudError("");
    setCloudName("");

    const { error } = await supabase
      .from("user_recipes")
      .insert({ user_id: user.id, name, time, is_cooked: false });

    if (error) {
      setCloudName(name);
      setCloudError(error.message);
      Alert.alert("Gagal menyimpan", error.message);
      setCloudLoading(false);
      return;
    }

    const targetPage = 1;
    setCloudPage(targetPage);
    await loadCloudRecipes(targetPage);
    setCloudLoading(false);
  };

  const handleToggleCooked = async (recipe: CloudRecipe) => {
    const nextValue = !recipe.is_cooked;
    setCloudRecipes((prev) =>
      prev.map((r) => (r.id === recipe.id ? { ...r, is_cooked: nextValue } : r)),
    );

    const { error } = await supabase
      .from("user_recipes")
      .update({ is_cooked: nextValue })
      .eq("id", recipe.id)
      .eq("user_id", user?.id ?? "");

    if (error) {
      setCloudRecipes((prev) =>
        prev.map((r) =>
          r.id === recipe.id ? { ...r, is_cooked: recipe.is_cooked } : r,
        ),
      );
      Alert.alert("Gagal memperbarui", error.message);
    }
  };

  const handleDeleteCloudRecipe = async (id: string) => {
    const previous = cloudRecipes;
    setCloudRecipes((prev) => prev.filter((r) => r.id !== id));

    const { error } = await supabase
      .from("user_recipes")
      .delete()
      .eq("id", id)
      .eq("user_id", user?.id ?? "");

    if (error) {
      setCloudRecipes(previous);
      Alert.alert("Gagal menghapus", error.message);
      return;
    }

    const nextPage =
      previous.length === 1 && cloudPage > 1 ? cloudPage - 1 : cloudPage;
    setCloudPage(nextPage);
    await loadCloudRecipes(nextPage);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Gagal keluar", error.message);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={cloudRefreshing} onRefresh={onRefreshCloud} />
      }
    >
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Meal Prep HQ</Text>
          <Text style={styles.subtitle}>Halo, {callsign}</Text>
        </View>
        <Pressable style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Keluar</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Resep Cloud Saya (Supabase)</Text>
      <Text style={styles.helperText}>
        Data ini disimpan per akun di Supabase dan dilindungi RLS.
      </Text>
      <Text style={styles.helperText}>
        Total: {cloudTotalCount.toLocaleString("id-ID")} resep • {PAGE_SIZE} per
        halaman
      </Text>

      <Text style={styles.label}>Nama resep cloud</Text>
      <TextInput
        style={styles.input}
        placeholder="Contoh: Meal Prep Ayam Senin"
        value={cloudName}
        onChangeText={setCloudName}
      />
      <Text style={styles.label}>Waktu memasak (menit)</Text>
      <TextInput
        style={styles.input}
        placeholder="15"
        value={cloudTime}
        onChangeText={setCloudTime}
        keyboardType="number-pad"
      />
      <Pressable
        style={[styles.primaryButton, cloudLoading && styles.buttonDisabled]}
        onPress={handleAddCloudRecipe}
        disabled={cloudLoading}
      >
        <Text style={styles.primaryButtonText}>Tambah ke Cloud (INSERT)</Text>
      </Pressable>

      {cloudError !== "" && <Text style={styles.errorText}>{cloudError}</Text>}
      {cloudLoading && cloudRecipes.length === 0 ? (
        <ActivityIndicator size="small" color="#8b5e34" style={{ marginTop: 12 }} />
      ) : (
        <>
          {cloudRecipes.map((recipe) => (
            <View key={recipe.id} style={styles.recipeCard}>
              <Pressable onPress={() => handleToggleCooked(recipe)}>
                <Text style={styles.recipeName}>
                  {recipe.is_cooked ? "✅ " : "⏳ "}
                  {recipe.name}
                </Text>
              </Pressable>
              <Text>Waktu memasak: {recipe.time} menit</Text>
              <Text style={styles.muted}>
                Status: {recipe.is_cooked ? "Sudah dimasak" : "Belum dimasak"} (UPDATE)
              </Text>
              <View style={styles.rowActions}>
                <Pressable onPress={() => handleToggleCooked(recipe)}>
                  <Text style={styles.detailLink}>Toggle Status</Text>
                </Pressable>
                <Pressable onPress={() => handleDeleteCloudRecipe(recipe.id)}>
                  <Text style={styles.deleteLink}>Hapus (DELETE)</Text>
                </Pressable>
              </View>
            </View>
          ))}

          <View style={styles.paginationRow}>
            <Pressable
              style={[
                styles.secondaryButton,
                (cloudPage <= 1 || cloudLoading) && styles.buttonDisabled,
              ]}
              onPress={() => setCloudPage((p) => Math.max(1, p - 1))}
              disabled={cloudPage <= 1 || cloudLoading}
            >
              <Text style={styles.secondaryButtonText}>← Sebelumnya</Text>
            </Pressable>

            <Text style={styles.pageInfo}>
              Halaman {cloudPage.toLocaleString("id-ID")} dari{" "}
              {cloudTotalPages.toLocaleString("id-ID")}
            </Text>

            <Pressable
              style={[
                styles.secondaryButton,
                (cloudPage >= cloudTotalPages || cloudLoading) && styles.buttonDisabled,
              ]}
              onPress={() =>
                setCloudPage((p) => Math.min(cloudTotalPages, p + 1))
              }
              disabled={cloudPage >= cloudTotalPages || cloudLoading}
            >
              <Text style={styles.secondaryButtonText}>Berikutnya →</Text>
            </Pressable>
          </View>
        </>
      )}

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>Resep Lokal</Text>
      <Text style={styles.label}>Nama resep</Text>
      <TextInput
        style={styles.input}
        placeholder="Contoh: Nasi Goreng"
        value={rahasia}
        onChangeText={setNama}
      />
      <Pressable style={styles.primaryButton} onPress={handleSaveLocal}>
        <Text style={styles.primaryButtonText}>Simpan Resep Lokal</Text>
      </Pressable>

      <View style={styles.listHeader}>
        <Text style={styles.sectionTitle}>Daftar Resep Lokal ({recipes.length})</Text>
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
              router.push({
                pathname: "/(app)/recipe/[id]",
                params: { id: recipe.id },
              })
            }
          >
            <Text style={styles.recipeName}>{recipe.name}</Text>
            <Text>Waktu memasak: {recipe.time} menit</Text>
            <Text style={styles.detailLink}>Lihat detail →</Text>
          </Pressable>
        ))}

      <Text style={styles.sectionTitle}>Resep dari API</Text>
      {loadingApi && <ActivityIndicator size="large" color="#8b5e34" />}
      {apiError !== "" && <Text style={styles.errorText}>{apiError}</Text>}

      {apiRecipes.map((recipe) => (
        <Pressable
          key={recipe.id}
          style={styles.recipeCard}
          onPress={() =>
            router.push({
              pathname: "/(app)/recipe/[id]",
              params: { id: recipe.id },
            })
          }
        >
          <Text style={styles.recipeName}>{recipe.name}</Text>
          <Text>Kategori: {recipe.category}</Text>
        </Pressable>
      ))}

      <Pressable
        style={styles.aboutButton}
        onPress={() => router.push("/(app)/about")}
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#704214",
  },
  subtitle: {
    fontSize: 15,
    color: "#75634f",
    marginTop: 4,
  },
  helperText: {
    fontSize: 13,
    color: "#75634f",
    marginBottom: 12,
  },
  muted: {
    fontSize: 13,
    color: "#75634f",
    marginTop: 4,
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
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: "#8b5e34",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#704214",
    marginTop: 16,
    marginBottom: 8,
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
  deleteLink: {
    marginTop: 8,
    color: "#b42318",
    fontWeight: "600",
  },
  rowActions: {
    flexDirection: "row",
    gap: 16,
  },
  errorText: {
    color: "red",
    marginVertical: 8,
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
  signOutButton: {
    backgroundColor: "#e8d6b8",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  signOutText: {
    color: "#704214",
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: "#eadcc5",
    marginVertical: 20,
  },
  paginationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 4,
    marginBottom: 8,
  },
  pageInfo: {
    flex: 1,
    textAlign: "center",
    color: "#704214",
    fontWeight: "600",
    fontSize: 13,
  },
});
