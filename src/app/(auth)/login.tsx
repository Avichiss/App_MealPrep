import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [callsign, setCallsign] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    const trimmedEmail = email.trim();
    const trimmedCallsign = callsign.trim();

    if (!trimmedEmail || !password) {
      Alert.alert("Perhatian", "Email dan kata sandi wajib diisi.");
      return;
    }

    if (isRegistering && !trimmedCallsign) {
      Alert.alert("Perhatian", "Callsign wajib diisi saat pendaftaran.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Perhatian", "Kata sandi minimal 6 karakter.");
      return;
    }

    setLoading(true);
    try {
      if (isRegistering) {
        const { data, error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
          options: {
            data: {
              callsign: trimmedCallsign,
            },
          },
        });

        if (error) throw error;

        if (data.session) {
          Alert.alert("Pendaftaran berhasil", "Selamat datang! Kamu akan masuk ke HQ.");
          router.replace("/(app)");
          return;
        }

        Alert.alert(
          "Pendaftaran berhasil",
          "Akun berhasil dibuat. Jika konfirmasi email aktif, cek email kamu. Jika sudah nonaktif, silakan masuk.",
        );
        setIsRegistering(false);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });

        if (error) throw error;

        if (!data.session) {
          Alert.alert(
            "Login belum berhasil",
            "Sesi tidak terbentuk. Pastikan email sudah terkonfirmasi atau matikan konfirmasi email di Supabase, lalu coba lagi.",
          );
          return;
        }

        router.replace("/(app)");
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan autentikasi.";
      Alert.alert("Autentikasi gagal", message);
      console.error("Auth error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meal Prep HQ</Text>
      <Text style={styles.subtitle}>
        {isRegistering
          ? "Daftarkan akun untuk menyimpan resep cloud kamu."
          : "Masuk untuk mengakses resep dan meal plan pribadimu."}
      </Text>

      {isRegistering && (
        <>
          <Text style={styles.label}>Callsign / Nama Tampilan</Text>
          <TextInput
            style={styles.input}
            placeholder="Contoh: ChefNusantara"
            value={callsign}
            onChangeText={setCallsign}
            autoCapitalize="words"
          />
        </>
      )}

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="nama@email.com"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        autoCorrect={false}
      />

      <Text style={styles.label}>Kata Sandi</Text>
      <TextInput
        style={styles.input}
        placeholder="Minimal 6 karakter"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <Pressable
        style={[styles.primaryButton, loading && styles.buttonDisabled]}
        onPress={handleAuth}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.primaryButtonText}>
            {isRegistering ? "Daftar sebagai Hero" : "Authenticate & Enter HQ"}
          </Text>
        )}
      </Pressable>

      <Pressable
        style={styles.linkButton}
        onPress={() => setIsRegistering((current) => !current)}
        disabled={loading}
      >
        <Text style={styles.linkButtonText}>
          {isRegistering
            ? "Sudah punya akun? Masuk di sini"
            : "Butuh kredensial? Daftar di sini"}
        </Text>
      </Pressable>
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
    fontSize: 30,
    fontWeight: "bold",
    color: "#704214",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#75634f",
    marginBottom: 24,
    lineHeight: 22,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
    color: "#704214",
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cbbba0",
    borderRadius: 10,
    padding: 13,
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: "#8b5e34",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  linkButton: {
    marginTop: 16,
    alignItems: "center",
  },
  linkButtonText: {
    color: "#704214",
    fontWeight: "600",
  },
});
