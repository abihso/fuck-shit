import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

const SendParcelLayOut = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        statusBarStyle: isDark ? "light" : "dark",
        statusBarBackgroundColor: isDark ? "#121212" : "#FFFFFF",
      }}
    />
  );
};

export default SendParcelLayOut;