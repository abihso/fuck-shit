import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { AppleMaps, GoogleMaps } from "expo-maps";
import { useEffect, useRef, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from "react-native";

const GOOGLE_PLACES_API_KEY = "AIzaSyA-snrIEiM4BNj7NmkqsC9ifvr_dbyKxyA";

interface DeliveryItem {
  createdAt?: string;
  pickupAddress?: string;
  dropoffAddress?: string;
  distanceKm?: number;
  totalAmount?: number;
}

interface DeliveryGroup {
  date?: string;
  deliveries: DeliveryItem[];
}

interface ID {
  id: string;
}

const UpcomingRide = ({ id }: ID) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const mapRef = useRef(null);
  const [showDetails, setShowDetails] = useState(false);
  const backend_url = process.env.EXPO_PUBLIC_BACKPRODUCTIONURL;
  console.log(id);

  const [data, setData] = useState<DeliveryGroup[]>([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");

        if (!storedUser) return;

        const user = JSON.parse(storedUser);

        if (!user?.userId) return;

        const res = await axios.get(
          `${backend_url}/users/${user.userId}/deliveries`,
        );
        setData(res.data.data);
      } catch (err) {
        console.error("Error fetching deliveries:", err);
      }
    };

    getData();
  }, [backend_url]);

  function formatMonthYear(dateString?: string) {
    if (!dateString) return "";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(date);
  }

  function formatRelativeTime(dateString?: string) {
    if (!dateString) return "";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const startOfTarget = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );

    const diffInTime = startOfToday.getTime() - startOfTarget.getTime();
    const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays > 1 && diffInDays <= 7) return "This week";
    if (diffInDays > 7 && diffInDays <= 14) return "Last week";
    if (diffInDays > 14 && diffInDays <= 30)
      return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays > 30 && diffInDays <= 60) return "Last month";
    if (diffInDays > 60) return `${Math.floor(diffInDays / 30)} months ago`;

    if (diffInDays === -1) return "Tomorrow";
    if (diffInDays < -1) return "In the future";

    return date.toLocaleDateString();
  }

  function truncateString(str?: string, maxLength = 5) {
    if (!str) return "";
    if (str.length > maxLength) {
      return str.slice(0, maxLength) + "...";
    }
    return str;
  }

  return (
    <>
      <View
        className={`${isDark ? "bg-[#121212]" : "bg-white"}`}
        style={{ flex: 1, paddingHorizontal: 30, paddingBottom: 120 }}
      >
        <Text
          className="text-black dark:text-white mt-7"
          style={{ fontFamily: "Inter_600SemiBold" }}
        >
          Upcoming
        </Text>

        <View className="mt-4 bg-[#F2F2F2] dark:bg-[#1E1E1E] rounded-3xl p-4 min-h-96">
          <View className="rounded-3xl overflow-hidden" style={{ height: 260 }}>
            {Platform.OS === "ios" ? (
              <AppleMaps.View
                style={{ flex: 1 }}
                colorScheme={
                  isDark
                    ? AppleMaps.MapColorScheme.DARK
                    : AppleMaps.MapColorScheme.LIGHT
                }
                cameraPosition={{
                  coordinates: {
                    latitude: 5.6037,
                    longitude: -0.187,
                  },
                  zoom: 12,
                }}
              />
            ) : (
              <GoogleMaps.View
                style={{ flex: 1 }}
                colorScheme={
                  isDark
                    ? GoogleMaps.MapColorScheme.DARK
                    : GoogleMaps.MapColorScheme.LIGHT
                }
                cameraPosition={{
                  coordinates: {
                    latitude: 5.6037,
                    longitude: -0.187,
                  },
                  zoom: 12,
                }}
              />
            )}
          </View>

          <View className="flex-row justify-between items-center mt-3 h-20">
            <View className="rounded-l-3xl border pl-5 py-2 border-[#D9D9D9] dark:border-[#333333] bg-white dark:bg-[#2A2A2A] w-[50%]">
              <Text
                className="text-[#716D6D] dark:text-[#A0A0A0] text-[10px]"
                style={{ fontFamily: "Inter_400Regular" }}
              >
                21st July, 2026
              </Text>
              <Text
                className="text-black dark:text-white text-base"
                style={{ fontFamily: "Inter_600SemiBold" }}
              >
                Kumasi - Kumasi
              </Text>
              <Text
                className="text-[#716D6D] dark:text-[#A0A0A0] text-[10px]"
                style={{ fontFamily: "Inter_400Regular" }}
              >
                GH₵ 20.00
              </Text>
            </View>
            <View className="rounded-r-3xl border pr-5 py-2 border-[#D9D9D9] dark:border-[#333333] bg-white dark:bg-[#2A2A2A] w-[50%]">
              <Text
                className="text-[#716D6D] dark:text-[#A0A0A0] text-[10px] text-right"
                style={{ fontFamily: "Inter_400Regular" }}
              >
                Rider’s Name
              </Text>
              <Text
                className="text-black dark:text-white text-base text-right"
                style={{ fontFamily: "Inter_600SemiBold" }}
              >
                Kobby
              </Text>
              <Text
                className="text-[#716D6D] dark:text-[#A0A0A0] text-[10px] text-right"
                style={{ fontFamily: "Inter_400Regular" }}
              >
                AS 214-26
              </Text>
            </View>
          </View>

          <Pressable
            className="bg-white dark:bg-[#2A2A2A] border-[#F1F1F1] dark:border-[#3A3A3A]"
            style={{
              marginTop: 5,
              borderWidth: 1,
              borderRadius: 24,
              paddingVertical: 16,
              alignItems: "center",
              width: "95%",
              alignSelf: "center",
              elevation: 3,
              shadowColor: "#000000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 6,
            }}
          >
            <Text
              className="text-black dark:text-white text-base"
              style={{ fontFamily: "Inter_600SemiBold" }}
            >
              Edit Deliver
            </Text>
          </Pressable>

          <Pressable
          onPress={() => setShowDetails(true)}
            className="bg-white dark:bg-[#2A2A2A] border-[#F1F1F1] dark:border-[#3A3A3A]"
            style={{
              marginTop: 5,
              borderWidth: 1,
              borderRadius: 24,
              paddingVertical: 16,
              alignItems: "center",
              width: "95%",
              alignSelf: "center",
              elevation: 3,
              shadowColor: "#000000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 6,
            }}
          >
            <Text
              className="text-black dark:text-white text-base"
              style={{ fontFamily: "Inter_600SemiBold" }}
            >
              View Delivery details
            </Text>
          </Pressable>
        </View>

        <Text
          className="text-black dark:text-white mt-7"
          style={{ fontFamily: "Inter_600SemiBold" }}
        >
          Cancel Upcoming delivery policy
        </Text>
        <View className="mt-4 bg-[#F2F2F2] dark:bg-[#1E1E1E] rounded-3xl p-4 h-32">
          <Text
            className="text-black dark:text-white text-[10px]"
            style={{ fontFamily: "Inter_400Regular" }}
          >
            NorthRides balance is not available with this payment method
          </Text>
        </View>
      </View>
     {
      showDetails && (
         <View className="absolute top-0 bottom-0 left-0 right-0 z-50">
        <View className="absolute bottom-0 min-h-[780px] bg-[#f9f9f9] dark:bg-[#121212] left-0 right-0 rounded-t-3xl p-4">
         <Pressable className="p-2" onPress={() => setShowDetails(false)}>
           <Text
            className="text-[#008624] dark:text-[#22c55e] text-[10px] text-right"
            style={{ fontFamily: "Inter_600SemiBold" }}
          >
            Done
          </Text>
         </Pressable>

          <View className="bg-[#F2F2F2] dark:bg-[#1E1E1E] rounded-3xl p-4 min-h-96 mt-2">
            <View
              className="rounded-3xl overflow-hidden"
              style={{ height: 260 }}
            >
              {Platform.OS === "ios" ? (
                <AppleMaps.View
                  style={{ flex: 1 }}
                  colorScheme={
                    isDark
                      ? AppleMaps.MapColorScheme.DARK
                      : AppleMaps.MapColorScheme.LIGHT
                  }
                  cameraPosition={{
                    coordinates: {
                      latitude: 5.6037,
                      longitude: -0.187,
                    },
                    zoom: 12,
                  }}
                />
              ) : (
                <GoogleMaps.View
                  style={{ flex: 1 }}
                  colorScheme={
                    isDark
                      ? GoogleMaps.MapColorScheme.DARK
                      : GoogleMaps.MapColorScheme.LIGHT
                  }
                  cameraPosition={{
                    coordinates: {
                      latitude: 5.6037,
                      longitude: -0.187,
                    },
                    zoom: 12,
                  }}
                />
              )}
            </View>

            <View className="flex-row justify-between items-center mt-3 h-20">
              <View className="rounded-l-3xl border pl-5 py-2 border-[#D9D9D9] dark:border-[#333333] bg-white dark:bg-[#2A2A2A] w-[50%]">
                <Text
                  className="text-[#716D6D] dark:text-[#A0A0A0] text-[10px]"
                  style={{ fontFamily: "Inter_400Regular" }}
                >
                  21st July, 2026
                </Text>
                <Text
                  className="text-black dark:text-white text-base"
                  style={{ fontFamily: "Inter_600SemiBold" }}
                >
                  Kumasi - Kumasi
                </Text>
                <Text
                  className="text-[#716D6D] dark:text-[#A0A0A0] text-[10px]"
                  style={{ fontFamily: "Inter_400Regular" }}
                >
                  GH₵ 20.00
                </Text>
              </View>
              <View className="rounded-r-3xl border pr-5 py-2 border-[#D9D9D9] dark:border-[#333333] bg-white dark:bg-[#2A2A2A] w-[50%]">
                <Text
                  className="text-[#716D6D] dark:text-[#A0A0A0] text-[10px] text-right"
                  style={{ fontFamily: "Inter_400Regular" }}
                >
                  Rider’s Name
                </Text>
                <Text
                  className="text-black dark:text-white text-base text-right"
                  style={{ fontFamily: "Inter_600SemiBold" }}
                >
                  Kobby
                </Text>
                <Text
                  className="text-[#716D6D] dark:text-[#A0A0A0] text-[10px] text-right"
                  style={{ fontFamily: "Inter_400Regular" }}
                >
                  AS 214-26
                </Text>
              </View>
            </View>

            <Pressable
              className="bg-white dark:bg-[#2A2A2A] border-[#F1F1F1] dark:border-[#3A3A3A]"
              style={{
                marginTop: 5,
                borderWidth: 1,
                borderRadius: 24,
                paddingVertical: 16,
                alignItems: "center",
                width: "95%",
                alignSelf: "center",
                elevation: 3,
                shadowColor: "#000000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 6,
              }}
            >
              <Text
                className="text-black dark:text-white text-base"
                style={{ fontFamily: "Inter_600SemiBold" }}
              >
                Get help with Delivery
              </Text>
            </Pressable>

            <Pressable
              className="bg-white dark:bg-[#2A2A2A] border-[#F1F1F1] dark:border-[#3A3A3A]"
              style={{
                marginTop: 5,
                borderWidth: 1,
                borderRadius: 24,
                paddingVertical: 16,
                alignItems: "center",
                width: "95%",
                alignSelf: "center",
                elevation: 3,
                shadowColor: "#000000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 6,
              }}
            >
              <Text
                className="text-black dark:text-white text-base"
                style={{ fontFamily: "Inter_600SemiBold" }}
              >
                Rebook For Delivery
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
      )
     }
    </>
  );
};

export default UpcomingRide;