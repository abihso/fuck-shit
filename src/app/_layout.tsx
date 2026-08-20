import { Stack } from "expo-router";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  return (
    <View className={`flex-1 ${isDarkMode ? "dark bg-black" : "bg-white"}`}>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style={isDarkMode ? "light" : "dark"} />
    </View>
  );
}
