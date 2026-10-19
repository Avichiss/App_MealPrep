
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Meal Prep" }}
      />

      <Stack.Screen
        name="about"
        options={{ title: "About" }}
      />

      <Stack.Screen
        name="recipe/[id]"
        options={{ title: "Detail Resep" }}
      />
    </Stack>
  );
}
