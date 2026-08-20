
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, router } from "expo-router";
import { ActivityIndicator, BackHandler, Image, Pressable, Text, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useIsFocused } from "expo-router";
import { useEffect } from "react";

const Policy = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const isFocused = useIsFocused();
   useEffect(() => {
      if (isFocused) {
        const handler = BackHandler.addEventListener("hardwareBackPress", () => {
          return true;
        });
  
        return () => handler.remove();
      }
  
      return () => {};
    }, [isFocused]);
 

  // Dynamic Theme Colors using the requested pattern
  const textColor = isDark ? "text-white" : "text-black";
  const subTextColor = isDark ? "text-gray-400" : "text-[#333333]";
  const screenBg = isDark ? "bg-[#121212]" : "bg-white";
  const borderColor = isDark ? "border-gray-800" : "border-gray-300";

  return (
    <SafeAreaView className={`flex-1 ${screenBg}`}>
      {/* Image Section - Better fit with cover */}
      <View className="h-80 w-full bg-black overflow-hidden">
        <Image
          source={require("../../../assets/images/groupofpeople.jpg")}
          className="h-full w-full"
          resizeMode="cover"
        />
      </View>

      {/* Content Section */}
      <View className="px-7 mt-4 flex-1">
        <Text 
          className={`text-xl ${textColor}`} 
          style={{ fontFamily: "Inter_600SemiBold" }}
        >
          NorthRide's Community Policy
        </Text>
        
        <Text
          className={`text-lg mt-3 ${textColor}`}
          style={{ fontFamily: "Inter_600SemiBold" }}
        >
          Safety and respect for all
        </Text>
        
        <Text
          className={`text-[10px] ${subTextColor} mt-1`}
          style={{ fontFamily: "Inter_400Regular" }}
        >
          We're committed along with multiple riders and delivery guys to:
        </Text>

        {/* Policy Items - Fixed spacing */}
        <View className="mt-4">
          <View className="flex-row items-center gap-3">
            <FontAwesome name="check" size={12} color={isDark ? "#9CA3AF" : "#333"} />
            <View className={`border-b ${borderColor} py-3 flex-1`}>
              <Text
                className={`text-[10px] ${subTextColor}`}
                style={{ fontFamily: "Inter_400Regular" }}
              >
                Treat everyone with kindness and respect
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-3">
            <FontAwesome name="check" size={12} color={isDark ? "#9CA3AF" : "#333"} />
            <View className={`border-b ${borderColor} py-3 flex-1`}>
              <Text
                className={`text-[10px] ${subTextColor}`}
                style={{ fontFamily: "Inter_400Regular" }}
              >
                Help keep each other safe
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-3">
            <FontAwesome name="check" size={12} color={isDark ? "#9CA3AF" : "#333"} />
            <View className={`border-b ${borderColor} py-3 flex-1`}>
              <Text
                className={`text-[10px] ${subTextColor}`}
                style={{ fontFamily: "Inter_400Regular" }}
              >
                Follow the law
              </Text>
            </View>
          </View>
        </View>

        {/* Additional Info */}
        <Text
          className={`text-[10px] ${subTextColor} mt-8`}
          style={{ fontFamily: "Inter_400Regular" }}
        >
          Everyone who uses NorthRide app is expected to follow these guidelines.
        </Text>

        <Link href={".."}>
          <Text
            className={`text-[10px] ${subTextColor} mt-3`}
            style={{ fontFamily: "Inter_400Regular" }}
          >
            You can read about our Community Guidelines HERE
          </Text>
        </Link>

        {/* Button - Better positioning */}
        <View className="flex-1 justify-end pb-8">
          <Pressable 
            className={`w-full h-12 rounded-full flex-row items-center justify-center px-5 ${
              isDark ? "bg-[#2A2A2A]" : "bg-[#FDBF07]"
            }`}
            onPress={() => router.push("/(auth)/paymentMethod")}
          >
            <Text 
              className={`text-sm ${isDark ? "text-[#FDBF07]" : "text-black"}`}
              style={{ fontFamily: "Inter_600SemiBold" }}
            >
              I understand
            </Text>
            <View className="absolute right-5">
              <FontAwesome name="arrow-right" size={14} color={isDark ? "#FDBF07" : "#000"} />
            </View>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Policy;