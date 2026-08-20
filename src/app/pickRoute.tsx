
import Feather from "@expo/vector-icons/Feather";
import { AppleMaps, GoogleMaps } from 'expo-maps';
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PastRide from "@/components/pastRide";
const PickupsRotesMop = () => {
  // const icon = useImage('https://example.com/marker.svg', { maxWidth: 48, maxHeight: 48 });


  // State for select option
  const [selectedOption, setSelectedOption] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  // Payment options with Feather icons
  const paymentOptions = [
    { label: "Select payment option", value: "", icon: "credit-card" as const },
    { label: "Cash", value: "cash", icon: "dollar-sign" as const },
    { label: "Mobile Money", value: "momo", icon: "smartphone" as const },
    { label: "Card", value: "card", icon: "credit-card" as const },
    { label: "Wallet", value: "wallet", icon: "folder" as const },
  ];

  // Get selected option details
  const getSelectedDetails = () => {
    return paymentOptions.find((item) => item.value === selectedOption);
  };

  const selectedDetails = getSelectedDetails();

  

  return (
    <SafeAreaView className="bg-white flex-1">
      <View className="h-[400px]">
          <GoogleMaps.View
            style={{ flex: 1 }}
            cameraPosition={{
              coordinates: {
                latitude: 6.6745,
                longitude: -1.5716,
              },
              zoom: 14,
            }}
          />
        </View>

        <View className="p-5">
          <View className="bg-[#F7F7F7] rounded-3xl p-3 mt-4">
            <View className="flex-row gap-3 items-center mt-3">
              <Feather name="map-pin" color="#4B5563" size={20} />
              <Pressable
                className="flex-row h-12 justify-between items-center border-b border-gray-200 flex-1"
                accessibilityRole="button"
              >
                <View>
                  <Text
                    className="text-sm"
                    style={{ fontFamily: "Inter_600SemiBold" }}
                  >
                    Stadium
                  </Text>
                  <Text
                    className="text-[8px] text-[#716D6D] mt-0.5"
                    style={{ fontFamily: "Inter_400Regular" }}
                  >
                    11km away from home now, last used 2nd January, 2026
                  </Text>
                </View>
                <Text
                  className="text-[8px] text-[#716D6D]"
                  style={{ fontFamily: "Inter_400Regular" }}
                >
                  Home
                </Text>
              </Pressable>
            </View>
          </View>

          <View className="bg-[#F7F7F7] rounded-3xl p-3 mt-4">
            <View className="flex-row gap-3 items-center mt-3">
              <Feather name="map-pin" color="#4B5563" size={20} />
              <Pressable
                className="flex-row h-12 justify-between items-center border-b border-gray-200 flex-1"
                accessibilityRole="button"
              >
                <View>
                  <Text
                    className="text-sm"
                    style={{ fontFamily: "Inter_600SemiBold" }}
                  >
                    Stadium
                  </Text>
                  <Text
                    className="text-[8px] text-[#716D6D] mt-0.5"
                    style={{ fontFamily: "Inter_400Regular" }}
                  >
                    11km away from home now, last used 2nd January, 2026
                  </Text>
                </View>
                <Text
                  className="text-[8px] text-[#716D6D]"
                  style={{ fontFamily: "Inter_400Regular" }}
                >
                  Home
                </Text>
              </Pressable>
            </View>
          </View>

          <View className="bg-[#F7F7F7] rounded-3xl p-4 mt-4">
            <View className="border-[#A1AC03] border flex-row items-center justify-between rounded-3xl h-20 py-2 px-5">
              <View className="flex-row items-center gap-2">
                <Image
                  source={require("../../assets/images/scooter-delivery-3d-illustration.png")}
                  className="w-10 h-10"
                />
                <View>
                  <Text
                    className="text-xl"
                    style={{ fontFamily: "Inter_600SemiBold" }}
                  >
                    Motorcycle Ride
                  </Text>
                  <Text
                    className="text-xs"
                    style={{ fontFamily: "Inter_400Regular" }}
                  >
                    5 min ride
                  </Text>
                </View>
              </View>
              <Text
                className="text-xs -mt-5"
                style={{ fontFamily: "Inter_600SemiBold" }}
              >
                GH₵ 20.00
              </Text>
            </View>

            {/* Custom Dropdown with Arrow AFTER the Label */}
            <View className="mt-3">
              <TouchableOpacity
                className="flex-row items-center bg-white border border-gray-200 rounded-2xl px-4"
                style={{ height: 50 }}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.7}
              >
                {/* Icon on the LEFT */}
                <Feather
                  name={selectedDetails?.icon || "credit-card"}
                  size={20}
                  color={selectedOption ? "#333" : "#9CA3AF"}
                />

                {/* Label and Arrow */}
                <View className="flex-row items-center gap-2 flex-1 ml-3">
                  <Text
                    className={selectedOption ? "text-black" : "text-gray-400"}
                    style={{ fontFamily: "Inter_400Regular" }}
                  >
                    {selectedDetails?.label || "Select payment option"}
                  </Text>

                  {/* Arrow AFTER the label */}
                  <Feather name="chevron-down" size={20} color="#4B5563" />
                </View>
              </TouchableOpacity>
            </View>

            <Pressable
              onPress={() => router.push("/payMethodRoute")}
              className="py-4 bg-black rounded-3xl mt-3"
            >
              <Text
                className="text-[#FDBF07] text-center"
                style={{ fontFamily: "Inter_400Regular" }}
              >
                Continue
              </Text>
            </Pressable>
          </View>
        </View>

      {/* Modal Dropdown */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          className="flex-1 justify-end bg-black/50"
          onPress={() => setModalVisible(false)}
        >
          <View className="bg-white rounded-t-3xl">
            {/* Modal Header */}
            <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
              <Text
                className="text-lg"
                style={{ fontFamily: "Inter_600SemiBold" }}
              >
                Select Payment Option
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Feather name="x" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Options List */}
            <FlatList
              data={paymentOptions}
              keyExtractor={(item) => item.value || "empty"}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="flex-row items-center justify-between p-4 border-b border-gray-100"
                  onPress={() => {
                    setSelectedOption(item.value);
                    setModalVisible(false);
                  }}
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-center gap-3">
                    <Feather
                      name={item.icon}
                      size={22}
                      color={
                        item.value === selectedOption ? "#FDBF07" : "#4B5563"
                      }
                    />
                    <Text
                      className={`text-base ${item.value === selectedOption ? "text-yellow-500 font-semibold" : "text-black"}`}
                      style={{
                        fontFamily:
                          item.value === selectedOption
                            ? "Inter_600SemiBold"
                            : "Inter_400Regular",
                      }}
                    >
                      {item.label}
                    </Text>
                  </View>
                  {item.value === selectedOption && (
                    <Feather name="check" size={22} color="#FDBF07" />
                  )}
                </TouchableOpacity>
              )}
              style={{ maxHeight: 300 }}
            />
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default PickupsRotesMop;
