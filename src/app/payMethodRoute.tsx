import {
  Inter_300Light,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_900Black,
} from "@expo-google-fonts/inter";
import { useFonts } from "@expo-google-fonts/inter/useFonts";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PaymentMethodRoute = () => {
  const [fontsLoaded] = useFonts([
    Inter_400Regular,
    Inter_300Light,
    Inter_600SemiBold,
    Inter_900Black,
  ]);

  if (!fontsLoaded) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#FDBF07" />
      </View>
    );
  }

  const handleSubmit = async () => {
    await AsyncStorage.setItem("paymentMethod","Cash")
    return router.push("/loadProcessRoute")
  }

  return (
    <SafeAreaView className="bg-white flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        className="px-5 py-10"
      >
        <Text className="text-xl" style={{ fontFamily: "Inter_600SemiBold" }}>
          How would you like to pay?
        </Text>
        <Text
          className="text-xs mt-3"
          style={{ fontFamily: "Inter_600SemiBold" }}
        >
          Select a preferred payment method
        </Text>
        <View className="min-h-56 mt-5 rounded-3xl bg-[#F0ECEC] p-4">
          <View className="flex-row gap-3 items-center ">
            <Feather name="credit-card" color="#4B5563" size={20} />
            <Pressable
              className="flex-row h-12 justify-between items-center border-b border-gray-300 flex-1"
              accessibilityLabel={""}
              accessibilityRole="button"
            >
              <Text
                className="text-sm"
                style={{ fontFamily: "Inter_600SemiBold" }}
              >
                Apple pay
              </Text>
              <Feather name="chevron-right" color="#4B5563" size={16} />
            </Pressable>
          </View>

          <View className="flex-row gap-3 items-center mt-2">
            <Feather name="phone" color="#4B5563" size={20} />
            <Pressable
              className="flex-row h-12 justify-between items-center border-b border-gray-300 flex-1"
              accessibilityLabel={""}
              accessibilityRole="button"
            >
              <Text
                className="text-sm"
                style={{ fontFamily: "Inter_600SemiBold" }}
              >
                AirtelTigo money
              </Text>
              <Feather name="chevron-right" color="#4B5563" size={16} />
            </Pressable>
          </View>

          <View className="flex-row gap-3 items-center mt-2">
            <Feather name="smartphone" color="#4B5563" size={20} />
            <Pressable
              className="flex-row h-12 justify-between items-center border-b border-gray-300 flex-1"
              accessibilityLabel={""}
              accessibilityRole="button"
            >
              <Text
                className="text-sm"
                style={{ fontFamily: "Inter_600SemiBold" }}
              >
                MTN Mobile money
              </Text>
              <Feather name="chevron-right" color="#4B5563" size={16} />
            </Pressable>
          </View>

          <View className="flex-row gap-3 items-center mt-2">
            <Feather name="phone-call" color="#4B5563" size={20} />
            <Pressable
              className="flex-row h-12 justify-between items-center border-b border-gray-300 flex-1"
              accessibilityLabel={""}
              accessibilityRole="button"
            >
              <Text
                className="text-sm"
                style={{ fontFamily: "Inter_600SemiBold" }}
              >
                Telecel Cash
              </Text>
              <Feather name="chevron-right" color="#4B5563" size={16} />
            </Pressable>
          </View>

          <View className="flex-row gap-3 items-center mt-2">
            <Feather name="dollar-sign" color="#4B5563" size={20} />
            <Pressable
              className="flex-row h-12 justify-between items-center border-b border-gray-300 flex-1"
              accessibilityLabel={""}
              accessibilityRole="button"
            >
              <Text
                className="text-sm"
                style={{ fontFamily: "Inter_600SemiBold" }}
              >
                Cash
              </Text>
              <Feather name="chevron-right" color="#4B5563" size={16} />
            </Pressable>
          </View>
        </View>

        <Pressable onPress={handleSubmit} className="py-4 bg-black mt-10 rounded-3xl">
          <Text
            className="text-[#FDBF07] text-center"
            style={{ fontFamily: "Inter_400Regular" }}
          >
            Continue
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PaymentMethodRoute;
