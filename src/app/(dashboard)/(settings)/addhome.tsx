import {
    Inter_300Light,
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_900Black,
} from "@expo-google-fonts/inter";
import { useFonts } from "@expo-google-fonts/inter/useFonts";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
    useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const RECENT_LOCATIONS = [
  { id: "1", title: "Kumasi", subtitle: "11km away from home now, last used 2nd January, 2026" },
  { id: "2", title: "Kumasi", subtitle: "11km away from home now, last used 2nd January, 2026" },
  { id: "3", title: "Kumasi", subtitle: "11km away from home now, last used 2nd January, 2026" },
  { id: "4", title: "Stadium", subtitle: "11km away from home now, last used 2nd January, 2026" },
];

const AddHome = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [fontsLoaded] = useFonts([
    Inter_400Regular,
    Inter_300Light,
    Inter_600SemiBold,
    Inter_900Black,
  ]);

  const [modalVisible, setModalVisible] = useState(false);

  const { width } = Dimensions.get("window");
  const isTablet = width >= 768;

  if (!fontsLoaded) {
    return (
      <View className={`flex-1 justify-center items-center ${isDark ? "bg-[#121212]" : "bg-white"}`}>
        <ActivityIndicator size="large" color="#FDBF07" />
      </View>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${isDark ? "bg-[#121212]" : "bg-white"}`}>
      <ScrollView 
        className="px-7 mt-6 flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* Header */}
        <Text className={`text-lg ${isDark ? "text-white" : "text-black"}`} style={{ fontFamily: "Inter_600SemiBold" }}>
          Add Home
        </Text>

        {/* Search Input */}
        <View className="relative">
          <TextInput
            style={{ fontFamily: "Inter_300Light" }}
            className={`
              rounded-full ${isTablet ? "mt-6" : "mt-4"} 
              ${isDark ? "bg-[#1F2937] text-white" : "bg-[#F2F2F2] text-gray-800"} 
              ${isTablet ? "py-6" : "py-4"} 
              items-center ${isTablet ? "pl-16" : "pl-12"} pr-5
            `}
            placeholder={isTablet ? "Search for shops, restaurants..." : "Search..."}
            placeholderTextColor="#9ca3af"
          />
          <FontAwesome
            name="search"
            color="#9ca3af"
            size={isTablet ? 22 : 18}
            style={{
              position: "absolute",
              top: isTablet ? 30 : 20,
              left: isTablet ? 25 : 18,
            }}
          />
        </View>

        <Pressable onPress={() => console.log("Clear search")}>
          <Text
            className={`text-right my-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}
            style={{ fontFamily: "Inter_600SemiBold" }}
          >
            clear
          </Text>
        </Pressable>

        {/* Location List */}
        {RECENT_LOCATIONS.map((loc) => (
          <View key={loc.id} className="flex-row gap-3 items-center mt-3">
            <Feather name="map-pin" color={isDark ? "#9CA3AF" : "#4B5563"} size={20} />
            <Pressable
              className={`flex-row h-12 justify-between items-center border-b ${isDark ? "border-gray-800" : "border-gray-200"} flex-1`}
              accessibilityRole="button"
            >
              <View className="flex-1 pr-2">
                <Text
                  className={`text-sm ${isDark ? "text-white" : "text-black"}`}
                  style={{ fontFamily: "Inter_600SemiBold" }}
                >
                  {loc.title}
                </Text>
                <Text
                  className={`text-[10px] ${isDark ? "text-gray-400" : "text-[#716D6D]"} mt-0.5`}
                  style={{ fontFamily: "Inter_400Regular" }}
                >
                  {loc.subtitle}
                </Text>
              </View>
              <Feather name="chevron-right" size={16} color={isDark ? "#9CA3AF" : "#4B5563"} />
            </Pressable>
          </View>
        ))}

        {/* Set Location on Map Option */}
        <View className="flex-row gap-3 items-center mt-3">
          <Feather name="map-pin" color={isDark ? "#9CA3AF" : "#4B5563"} size={20} />
          <Pressable
            className={`flex-row h-12 justify-between items-center border-b ${isDark ? "border-gray-800" : "border-gray-200"} flex-1`}
            accessibilityRole="button"
          >
            <View>
              <Text
                className={`text-sm ${isDark ? "text-white" : "text-black"}`}
                style={{ fontFamily: "Inter_600SemiBold" }}
              >
                Set Location on map
              </Text>
            </View>
            <Feather name="chevron-right" size={16} color={isDark ? "#9CA3AF" : "#4B5563"} />
          </Pressable>
        </View>

        {/* Action Button */}
        <View className="mt-8">
          <Pressable
            className="bg-[#FDBF07] w-full h-12 rounded-full flex-row items-center justify-center px-5 relative"
            onPress={() => setModalVisible(true)}
          >
            <Text
              className="text-sm text-black"
              style={{ fontFamily: "Inter_600SemiBold" }}
            >
              Set Up Later
            </Text>
            <View className="absolute right-5">
              <FontAwesome name="arrow-right" size={14} color="#000" />
            </View>
          </Pressable>
        </View>

        {/* Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-end items-center bg-[#0000008e]">
            <View className={`p-20 rounded-3xl w-[100%] h-[40%] items-center ${isDark ? "bg-[#1F2937]" : "bg-white"}`}>
              <Image
                source={require("../../../../assets/images/ChatGPT Image Jul 31, 2026, 10_33_08 AM.png")}
                className="w-48 h-48 self-center -mt-16"
                resizeMode="cover"
              />
              <Text
                className={`text-sm text-center mt-2 ${isDark ? "text-white" : "text-black"}`}
                style={{ fontFamily: "Inter_600SemiBold" }}
              >
                Allow location Access
              </Text>
              <Text
                className={`text-[10px] text-center mt-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}
                style={{ fontFamily: "Inter_600SemiBold" }}
              >
                We need your location to find the nearb ride
              </Text>
              <Pressable className="bg-[#FDBF07] mt-3 py-3 rounded-full w-full flex justify-center items-center">
                <Text style={{ fontFamily: "Inter_600SemiBold" }}>
                  Open Setting
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setModalVisible(false)}
                className="absolute right-10 top-5"
              >
                <FontAwesome name="close" size={14} color={isDark ? "#FFF" : "#000"} className="p-2" />
              </Pressable>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});