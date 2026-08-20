import Feather from "@expo/vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View, useColorScheme } from "react-native";
import { Image } from "react-native";
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

const CancelledRide = ({ id }: ID) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const backend_url = process.env.EXPO_PUBLIC_BACKPRODUCTIONURL;

  
  const [data, setData] = useState<DeliveryGroup[]>([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        let task = await AsyncStorage.getItem("task");
        task = task ? JSON.parse(task) : "send";
        if (!storedUser) return;

        const user = JSON.parse(storedUser);

        if (!user?.userId) return;

        const res = await axios.get(`${backend_url}/users/${user.userId}/deliveries/${task}/cancelled`);
        setData(res.data.data);
      } catch (err: any) {
      }
    };

    getData();
  }, [backend_url]);

  function formatMonthYear(dateString?: string) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format(date);
  }

  function formatRelativeTime(dateString?: string) {
    if (!dateString) return '';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfTarget = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const diffInTime = startOfToday.getTime() - startOfTarget.getTime();
    const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays > 1 && diffInDays <= 7) return 'This week';
    if (diffInDays > 7 && diffInDays <= 14) return 'Last week';
    if (diffInDays > 14 && diffInDays <= 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays > 30 && diffInDays <= 60) return 'Last month';
    if (diffInDays > 60) return `${Math.floor(diffInDays / 30)} months ago`;

    if (diffInDays === -1) return 'Tomorrow';
    if (diffInDays < -1) return 'In the future';

    return date.toLocaleDateString();
  }

  function truncateString(str?: string, maxLength = 5) {
    if (!str) return '';
    if (str.length > maxLength) {
      return str.slice(0, maxLength) + '...';
    }
    return str;
  }

  return (
    <>
      <ScrollView
        className={`px-10 flex-1 ${isDark ? "bg-[#121212]" : "bg-white"}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {
          data.length === 0 ? (
            <View className="flex-1 items-center justify-center mt-20">
              
              <Text
                className={`text-lg ${isDark ? "text-white" : "text-black"}`}
                style={{ fontFamily: "Inter_600SemiBold" }}
              >
                No cancelled data found.
              </Text>
            </View>
          ) : (
             data.map((item, index) => {
          return (
            <View key={index}>
              <Text
                className={`text-sm mt-5 ${isDark ? "text-white" : "text-black"}`}
                style={{ fontFamily: "Inter_600SemiBold" }}
              >
                {formatMonthYear(item.date)}
              </Text>
              
              <View className={`${isDark ? "bg-[#1F2937]" : "bg-[#F7F7F7]"} min-h-48 mt-3 rounded-3xl p-3`}>
                {item.deliveries?.map((metadata, idx) => {
                  return (
                    <View key={idx} className="flex-row gap-3 items-center mt-1">
                      {/* <Feather name="map-pin" color={isDark ? "#9CA3AF" : "#4B5563"} size={20} /> */}

                      <Image source={require("../../assets/images/bike-cancelled.png")} className="w-5 h-5" />

                      <Pressable className={`flex-row min-h-12 py-1 justify-between items-center border-b ${isDark ? "border-gray-700" : "border-gray-200"} flex-1`}>
                        <View className="flex-1 pr-2">
                          <Text
                            className={`text-[8px] ${isDark ? "text-gray-400" : "text-[#716D6D]"} my-0.5`}
                            style={{ fontFamily: "Inter_400Regular" }}
                          >
                            {formatRelativeTime(metadata.createdAt)}
                          </Text>
                          <Text
                            className={`text-sm ${isDark ? "text-white" : "text-black"}`}
                            style={{ fontFamily: "Inter_400Regular" }} 
                          >
                            {truncateString(metadata.pickupAddress, 15)} - {truncateString(metadata.dropoffAddress, 10)}
                          </Text>
                          <Text
                            className={`text-[8px] mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                            style={{ fontFamily: "Inter_400Regular" }}
                          >
                            {metadata.distanceKm}km ride
                          </Text>
                        </View>
                        <Text
                          className={`text-[8px] ${isDark ? "text-gray-300" : "text-[#716D6D]"}`}
                          style={{ fontFamily: "Inter_600SemiBold" }}
                        >
                          GH₵ {metadata.totalAmount}
                        </Text>
                      </Pressable>
                    </View>
                  );
                })}
              </View>
            </View>
          );
        })
          )
        }
      </ScrollView>

      <Pressable className="absolute bottom-10 left-0 right-0 py-4 mx-10 bg-black dark:bg-white rounded-3xl mt-6 shadow-md">
        <Text
          className="text-[#FDBF07] dark:text-black text-center"
          style={{ fontFamily: "Inter_600SemiBold" }}
        >
          Continue
        </Text>
      </Pressable>
    </>
  );
};

export default CancelledRide;