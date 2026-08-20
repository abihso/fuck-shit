import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  useColorScheme,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Menu = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const closeIconColor = isDark ? "#FFFFFF" : "#000000";

  return (
    <SafeAreaView className={`flex-1 ${isDark ? "bg-[#121212]" : "bg-white"}`}>
      <ScrollView
        className="px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <Text
          className={`text-3xl mt-4 ${isDark ? "text-white" : "text-black"}`}
          style={{ fontFamily: "Inter_600SemiBold" }}
        >
          Menu
        </Text>
        <Text
          className={`text-base ${isDark ? "text-gray-400" : "text-gray-600"}`}
          style={{ fontFamily: "Inter_600SemiBold" }}
        >
          Go anywhere, get anything
        </Text>

        {/* Promo Banner */}
        <View
          className={`mt-5 h-14 rounded-xl px-2 ${
            isDark ? "bg-[#1E1E1E]" : "bg-[#F2F2F2]"
          } shadow-slate-300 flex-row justify-between items-center`}
        >
          <View className="flex-row items-center gap-2">
            <View
              className={`w-9 h-9 rounded-full ${
                isDark ? "bg-emerald-900" : "bg-green-200"
              }`}
            />
            <View>
              <Text
                className={`text-base ${isDark ? "text-white" : "text-black"}`}
                style={{ fontFamily: "Inter_300Light" }}
              >
                Get 50% discount on your first 3 rides
              </Text>
              <Text
                className={`text-xs ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
                style={{ fontFamily: "Inter_300Light" }}
              >
                View details
              </Text>
            </View>
          </View>
          <AntDesign name="close" size={13} color={closeIconColor} />
        </View>

        {/* Ride Section */}
        <Text
          style={{ fontFamily: "Inter_600SemiBold" }}
          className={`text-xl mt-3 ${isDark ? "text-white" : "text-black"}`}
        >
          Ride
        </Text>
        <Pressable onPress={() => router.push("/(rides)")}>
          <View
            className={`h-20 rounded-3xl p-3 mt-2 ${
              isDark ? "bg-[#1E1E1E]" : "bg-[#F2F2F2]"
            } flex-row items-center gap-4`}
          >
            <View
              className={`${
                isDark ? "bg-[#2A2A2A]" : "bg-[#E4DFDF]"
              } p-2 rounded-2xl`}
            >
              <Image
                source={require("../../../../assets/images/scooter-delivery-3d-illustration.png")}
                className="h-8 w-8"
              />
            </View>
            <View className="h-10">
              <Text
                className={`text-base ${isDark ? "text-white" : "text-black"}`}
                style={{ fontFamily: "Inter_600SemiBold" }}
              >
                Rides
              </Text>
              <Text
                className={`text-xs ${
                  isDark ? "text-gray-400" : "text-[#626262]"
                }`}
                style={{ fontFamily: "Inter_300Light" }}
              >
                Let’s get moving
              </Text>
            </View>
          </View>
        </Pressable>

        {/* Delivery Section */}
        <Text
          style={{ fontFamily: "Inter_600SemiBold" }}
          className={`text-xl mt-3 ${isDark ? "text-white" : "text-black"}`}
        >
          Delivery
        </Text>
        <View
          className={`${
            isDark ? "bg-[#1E1E1E]" : "bg-[#F2F2F2]"
          } rounded-3xl mt-2`}
        >
          <Pressable
            onPress={async () => {
              await AsyncStorage.setItem("task", JSON.stringify("send"));
              router.push({
                pathname: "/(send)",
                params: { task: "send" },
              });
            }}
          >
            <View className="h-20 p-3 flex-row items-center gap-4">
              <View
                className={`${
                  isDark ? "bg-[#2A2A2A]" : "bg-[#E4DFDF]"
                } p-2 rounded-2xl`}
              >
                <Image
                  source={require("../../../../assets/images/7466907.png")}
                  className="h-8 w-8"
                />
              </View>
              <View className="h-10">
                <Text
                  className={`text-base ${
                    isDark ? "text-white" : "text-black"
                  }`}
                  style={{ fontFamily: "Inter_600SemiBold" }}
                >
                  Send
                </Text>
                <Text
                  className={`text-xs ${
                    isDark ? "text-gray-400" : "text-[#626262]"
                  }`}
                  style={{ fontFamily: "Inter_300Light" }}
                >
                  Do you want to send an item?
                </Text>
              </View>
            </View>
          </Pressable>

          <View
            className={`h-px ${
              isDark ? "bg-gray-700" : "bg-gray-300"
            } w-[80%] z-10 mr-3 self-end`}
          />

          <Pressable
            onPress={async () => {
              await AsyncStorage.setItem("task", JSON.stringify("receive"));
              router.push({
                pathname: "/(send)",
                params: { task: "receive" },
              });
            }}
          >
            <View className="h-20 p-3 flex-row items-center gap-4">
              <View
                className={`${
                  isDark ? "bg-[#2A2A2A]" : "bg-[#E4DFDF]"
                } p-2 rounded-2xl`}
              >
                <Image
                  source={require("../../../../assets/images/scooter-delivery-3d-illustration.png")}
                  className="h-8 w-8"
                />
              </View>
              <View className="h-10">
                <Text
                  className={`text-base ${
                    isDark ? "text-white" : "text-black"
                  }`}
                  style={{ fontFamily: "Inter_600SemiBold" }}
                >
                  Receive
                </Text>
                <Text
                  className={`text-xs ${
                    isDark ? "text-gray-400" : "text-[#626262]"
                  }`}
                  style={{ fontFamily: "Inter_300Light" }}
                >
                  Do you want to receive an item
                </Text>
              </View>
            </View>
          </Pressable>
        </View>

        {/* Buy Section */}
        <Text
          style={{ fontFamily: "Inter_600SemiBold" }}
          className={`text-xl mt-3 ${isDark ? "text-white" : "text-black"}`}
        >
          Buy
        </Text>
        <View
          className={`${
            isDark ? "bg-[#1E1E1E]" : "bg-[#F2F2F2]"
          } rounded-3xl mt-2`}
        >
          <Pressable>
            <View className="h-20 p-3 flex-row items-center gap-4">
              <View
                className={`${
                  isDark ? "bg-[#2A2A2A]" : "bg-[#E4DFDF]"
                } p-2 rounded-2xl`}
              >
                <Image
                  source={require("../../../../assets/images/pizza.png")}
                  className="h-8 w-8"
                />
              </View>
              <View className="h-10">
                <Text
                  className={`text-base ${
                    isDark ? "text-white" : "text-black"
                  }`}
                  style={{ fontFamily: "Inter_600SemiBold" }}
                >
                  Food
                </Text>
                <Text
                  className={`text-xs ${
                    isDark ? "text-gray-400" : "text-[#626262]"
                  }`}
                  style={{ fontFamily: "Inter_300Light" }}
                >
                  Let’s get moving
                </Text>
              </View>
            </View>
          </Pressable>

          <View
            className={`h-px ${
              isDark ? "bg-gray-700" : "bg-gray-300"
            } w-[80%] z-10 mr-3 self-end`}
          />

          <Pressable>
            <View className="h-20 p-3 flex-row items-center gap-4">
              <View
                className={`${
                  isDark ? "bg-[#2A2A2A]" : "bg-[#E4DFDF]"
                } p-2 rounded-2xl`}
              >
                <Image
                  source={require("../../../../assets/images/medicine.png")}
                  className="h-8 w-8"
                  resizeMode="contain"
                />
              </View>
              <View className="h-10">
                <Text
                  className={`text-base ${
                    isDark ? "text-white" : "text-black"
                  }`}
                  style={{ fontFamily: "Inter_600SemiBold" }}
                >
                  Medicine
                </Text>
                <Text
                  className={`text-xs ${
                    isDark ? "text-gray-400" : "text-[#626262]"
                  }`}
                  style={{ fontFamily: "Inter_300Light" }}
                >
                  Let’s get moving
                </Text>
              </View>
            </View>
          </Pressable>

          <View
            className={`h-px ${
              isDark ? "bg-gray-700" : "bg-gray-300"
            } w-[80%] z-10 mr-3 self-end`}
          />

          <Pressable>
            <View className="h-20 p-3 flex-row items-center gap-4">
              <View
                className={`${
                  isDark ? "bg-[#2A2A2A]" : "bg-[#E4DFDF]"
                } p-2 rounded-2xl`}
              >
                <Image
                  source={require("../../../../assets/images/groceries.png")}
                  className="h-8 w-8"
                  resizeMode="contain"
                />
              </View>
              <View className="h-10">
                <Text
                  className={`text-base ${
                    isDark ? "text-white" : "text-black"
                  }`}
                  style={{ fontFamily: "Inter_600SemiBold" }}
                >
                  Groceries
                </Text>
                <Text
                  className={`text-xs ${
                    isDark ? "text-gray-400" : "text-[#626262]"
                  }`}
                  style={{ fontFamily: "Inter_300Light" }}
                >
                  Let’s get moving
                </Text>
              </View>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Menu;
