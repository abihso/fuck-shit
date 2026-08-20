import { LuckiestGuy_400Regular } from "@expo-google-fonts/luckiest-guy/400Regular";
import { useFonts } from "@expo-google-fonts/luckiest-guy/useFonts";
import { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CustomSplash() {
  const [fontsLoaded] = useFonts({
    LuckiestGuy_400Regular,
  });

  const slideAnim = useRef(new Animated.Value(-350)).current;

  // 1. Hook into the device's color scheme
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  // 2. Define dynamic Tailwind classes based on the theme
  const bgColorClass = isDarkMode ? "bg-black" : "bg-white";
  const textColorClass = isDarkMode ? "text-white" : "text-black";

  useEffect(() => {
    if (fontsLoaded) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
      }).start();
    }
  }, [fontsLoaded, slideAnim]);

  if (!fontsLoaded) {
    return (
      <SafeAreaView
        className={`flex-1 items-center justify-center ${bgColorClass}`}
      >
        <ActivityIndicator size="large" color="#DCA501" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 items-center ${bgColorClass}`}>
      <View className="">
        <Animated.Image
          source={require("../../assets/images/waste.png")}
          style={{
            width: 350,
            height: 370,
            transform: [{ translateX: slideAnim }],
          }}
          resizeMode="contain"
        />
        <Text
          style={{ fontFamily: "LuckiestGuy_400Regular" }}
          className={`text-3xl -mt-36 ml-10 text-center ${textColorClass}`}
        >
          North<Text className="text-[#DCA501]">Ride</Text>{" "}
        </Text>
      </View>

      <View className="absolute bottom-10">
        <ActivityIndicator size="large" color="#DCA501" />
        <Text
          className={`text-center text-5xl my-10 ${textColorClass}`}
          style={{ fontFamily: "LuckiestGuy_400Regular" }}
        >
          Welcome
        </Text>
        <View className="flex-row items-center gap-2 justify-center">
          <Text
            className={`text-xs text-center ${textColorClass}`}
            style={{ fontFamily: "LuckiestGuy_400Regular" }}
          >
            FAST
          </Text>
          <Text
            className={`text-xs text-center ${textColorClass}`}
            style={{ fontFamily: "LuckiestGuy_400Regular" }}
          >
            RELIABLE
          </Text>
          <Text
            className={`text-xs text-center ${textColorClass}`}
            style={{ fontFamily: "LuckiestGuy_400Regular" }}
          >
            SAFE
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
