import FontAwesome from "@expo/vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PaymentMethod = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  // Dynamic Theme Colors
  const textColor = isDark ? "text-white" : "text-black";
  const subTextColor = isDark ? "text-gray-400" : "text-gray-600";
  const itemTextColor = isDark ? "text-gray-200" : "text-[#333333]";
  const screenBg = isDark ? "bg-[#121212]" : "bg-white";
  const borderColor = isDark ? "border-gray-800" : "border-gray-200";
  const url = process.env.EXPO_PUBLIC_BACKPRODUCTIONURL;
  // Payment methods data
  const paymentMethods = [
    {
      id: "applepay",
      title: "Apple Pay",
      icon: require("../../../assets/images/applepay.png"),
    },
    {
      id: "airteltigo",
      title: "AirtelTigo Money",
      icon: require("../../../assets/images/money-transfer.png"),
    },
    {
      id: "mtn",
      title: "MTN Mobile Money",
      icon: require("../../../assets/images/mtn.png"),
    },
    {
      id: "telecel",
      title: "Telecel Cash",
      icon: require("../../../assets/images/credit-card.png"),
    },
    {
      id: "cash",
      title: "Cash",
      icon: require("../../../assets/images/cash-on-delivery.png"),
    },
  ];

  useEffect(() => {
    const getUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (!storedUser) return;

        const userInfor = JSON.parse(storedUser) as { userId?: string } | null;
        setUserId(userInfor?.userId ?? null);
      } catch (error) {
        console.log("Failed to load user data", error);
      }
    };

    getUserData();
  }, []);
  const handlePaymentSelect = async (methodId: string) => {
    setLoading(true);
    axios
      .post(
        `${url}/payment-method`,
        { data: methodId, userId: userId },
        { withCredentials: true },
      )
      .then((res) => router.push("/(auth)/sharelocation"))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  return (
    <SafeAreaView className={`flex-1 ${screenBg}`}>
      <View className="px-7 mt-6 flex-1">
        {/* Header */}
        <Text
          className={`text-lg ${textColor}`}
          style={{ fontFamily: "Inter_600SemiBold" }}
        >
          How would you like to pay?
        </Text>

        <Text
          className={`text-xs mt-2 ${subTextColor}`}
          style={{ fontFamily: "Inter_400Regular" }}
        >
          Select a preferred payment method
        </Text>

        {/* Payment Methods List */}
        <View className="mt-5">
          {paymentMethods.map((method, index) => (
            <TouchableOpacity
              key={method.id}
              className={`py-4 flex-row items-center gap-4 ${
                index < paymentMethods.length - 1
                  ? `border-b ${borderColor}`
                  : ""
              }`}
              onPress={() => handlePaymentSelect(method.id)}
              activeOpacity={0.7}
            >
              <Image
                source={method.icon}
                className="w-10 h-10 rounded-lg"
                resizeMode="contain"
              />
              <Text
                className={`text-sm ${itemTextColor} flex-1`}
                style={{ fontFamily: "Inter_600SemiBold" }}
              >
                {method.title}
              </Text>
              <FontAwesome
                name="chevron-right"
                size={14}
                color={isDark ? "#9CA3AF" : "#999"}
              />
            </TouchableOpacity>
          ))}
        </View>

        {loading && <ActivityIndicator />}

        <View className="flex-1 justify-end pb-8">
          <Pressable
            disabled={loading}
            className={`w-full h-12 rounded-full flex-row items-center justify-center px-5 ${
              isDark ? "bg-[#2A2A2A]" : "bg-[#FDBF07]"
            }`}
            onPress={() => router.push("/(auth)/sharelocation")}
          >
            <Text
              className={`text-sm ${isDark ? "text-[#FDBF07]" : "text-black"}`}
              style={{ fontFamily: "Inter_600SemiBold" }}
            >
              Set Up Later
            </Text>
            <View className="absolute right-5">
              <FontAwesome
                name="arrow-right"
                size={14}
                color={isDark ? "#FDBF07" : "#000"}
              />
            </View>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PaymentMethod;
