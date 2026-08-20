import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { useFocusEffect, useIsFocused } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  BackHandler,
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const isTablet = width >= 768;
const isSmallPhone = width < 375;

// Data constants
const SHOP_CATEGORIES = [
  {
    id: 1,
    icon: require("../../../../assets/images/groceries.png"),
    title: "Groceries",
  },
  {
    id: 2,
    icon: require("../../../../assets/images/medicine.png"),
    title: "Pharmacy",
  },
  {
    id: 3,
    icon: require("../../../../assets/images/pizza.png"),
    title: "Pizza",
  },
  {
    id: 4,
    icon: require("../../../../assets/images/scooter-delivery-3d-illustration.png"),
    title: "Bikes",
  },
];

const PROMOTIONS = [
  {
    id: 1,
    image: require("../../../../assets/images/food1.png"),
    name: "Pizza Palace",
    distance: "15 KM away",
    location: "Tamale, Northern Region",
    rating: 4.5,
  },
  {
    id: 2,
    image: require("../../../../assets/images/food2.png"),
    name: "Burger King",
    distance: "10 KM away",
    location: "Accra, Greater Accra",
    rating: 4.8,
  },
  {
    id: 3,
    image: require("../../../../assets/images/food1.png"),
    name: "Tasty Bites",
    distance: "8 KM away",
    location: "Kumasi, Ashanti Region",
    rating: 4.6,
  },
];

// Type definitions
interface AddressType {
  city?: string | null;
  region?: string | null;
  country?: string | null;
  street?: string | null;
  name?: string | null;
  postalCode?: string | null;
  district?: string | null;
  subregion?: string | null;
  timezone?: string | null;
  isoCountryCode?: string | null;
}

const HomeScreen = () => {
  const isFocused = useIsFocused();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";



  // Theme color constants for icons & components
  const iconColor = isDark ? "#FFFFFF" : "#333333";

  useEffect(() => {
    if (isFocused) {
      const handler = BackHandler.addEventListener("hardwareBackPress", () => {
        return true;
      });

      return () => handler.remove();
    }

    return () => {};
  }, [isFocused]);

  const [address, setAddress] = useState<AddressType | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getCurrentLocation() {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          setLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        let reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (reverseGeocode.length > 0) {
          const geocodedAddress: AddressType = {
            city: reverseGeocode[0].city,
            region: reverseGeocode[0].region,
            country: reverseGeocode[0].country,
            street: reverseGeocode[0].street,
            name: reverseGeocode[0].name,
            postalCode: reverseGeocode[0].postalCode,
            district: reverseGeocode[0].district,
            subregion: reverseGeocode[0].subregion,
            timezone: reverseGeocode[0].timezone,
            isoCountryCode: reverseGeocode[0].isoCountryCode,
          };
          setAddress(geocodedAddress);
        }
      } catch (error) {
        setErrorMsg("Error getting location");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    getCurrentLocation();
  }, []);

  const getShortLocationName = () => {
    if (!address) return "Loading...";
    const parts = [];
    if (address.city) parts.push(address.city);
    if (address.region) parts.push(address.region);
    return parts.length > 0 ? parts.join(", ") : "Location found";
  };

  return (
    <>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: isDark ? "#121212" : "#FFFFFF" }}
        className={`flex-1 ${isDark ? "bg-[#121212]" : "bg-white"}`}
      >
      

        {/* Header */}
        <View
          className={`
        flex-row px-${isTablet ? "8" : "5"} 
        justify-between items-center 
        ${isTablet ? "h-14" : "h-10"} 
        ${isDark ? "bg-[#1E1E1E]" : "bg-[#F2F2F2]"}
      `}
        >
          <Pressable
            className={isTablet ? "p-3" : "p-2"}
            onPress={() => Alert.alert("Message", "Menu clicked")}
          >
            <FontAwesome
              name="ellipsis-v"
              size={isTablet ? 24 : 20}
              color={iconColor}
            />
          </Pressable>
          <View className={`flex-row ${isTablet ? "gap-5" : "gap-3"}`}>
            <FontAwesome
              name="bell-o"
              size={isTablet ? 24 : 20}
              color={iconColor}
            />
            <FontAwesome
              name="comment-o"
              size={isTablet ? 24 : 20}
              color={iconColor}
            />
          </View>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{ paddingBottom: isTablet ? 40 : 120 }}
        >
          <View className={`px-${isTablet ? "8" : "5"}`}>
            {/* Location and Profile */}
            <View
              className={`
            flex-row justify-between items-center 
            ${isTablet ? "mt-10" : "mt-7"}
          `}
            >
              <View
                className={`flex-row ${isTablet ? "gap-4" : "gap-2"} items-center`}
              >
                <Feather
                  name="map-pin"
                  color={iconColor}
                  size={isTablet ? 32 : 24}
                />
                <View>
                  <Text
                    className={`
                    ${isDark ? "text-white" : "text-black"}
                    ${
                      isTablet
                        ? "text-base"
                        : isSmallPhone
                          ? "text-[8px]"
                          : "text-[10px]"
                    }
                  `}
                    style={{ fontFamily: "Inter_600SemiBold" }}
                  >
                    {getShortLocationName()}
                  </Text>
                  <Text
                    className={`
                    ${isDark ? "text-gray-400" : "text-gray-500"}
                    ${
                      isTablet
                        ? "text-xs"
                        : isSmallPhone
                          ? "text-[6px]"
                          : "text-[7px]"
                    }
                  `}
                    style={{ fontFamily: "Inter_600SemiBold" }}
                  >
                    Last Visit, Yesterday
                  </Text>
                </View>
              </View>
              <Image
                source={require("../../../../assets/images/user.png")}
                className={isTablet ? "w-16 h-16" : "w-12 h-12"}
              />
            </View>

            {/* Welcome Text */}
            <Text
              className={`
              ${isDark ? "text-white" : "text-black"}
              ${isTablet ? "text-4xl" : isSmallPhone ? "text-xl" : "text-2xl"} 
              ${isTablet ? "mt-10" : "mt-7"}
            `}
              style={{ fontFamily: "Inter_600SemiBold" }}
            >
              Welcome, Theophilus...
            </Text>

            {/* Search Bar */}
            <View>
              <TextInput
                style={{ fontFamily: "Inter_300Light" }}
                className={`
                rounded-full ${isTablet ? "mt-6" : "mt-4"} 
                ${isDark ? "bg-[#2A2A2A] text-white" : "bg-[#F2F2F2] text-gray-800"}
                ${isTablet ? "py-6" : "py-4"} 
                items-center ${isTablet ? "pl-16" : "pl-12"}
              `}
                placeholder={
                  isTablet ? "Search for shops, restaurants..." : "Search..."
                }
                placeholderTextColor={isDark ? "#71717A" : "#9ca3af"}
              />
              <FontAwesome
                name="search"
                color={isDark ? "#71717A" : "#9ca3af"}
                size={isTablet ? 22 : 18}
                className={`
                absolute ${isTablet ? "top-9" : "top-8"} 
                ${isTablet ? "left-7" : "left-5"}
              `}
              />
            </View>

            {/* Shops Section */}
            <Text
              className={`
              ${isDark ? "text-white" : "text-black"}
              ${isTablet ? "mt-5" : "mt-3"} 
              ${isTablet ? "text-xl" : "text-base"}
            `}
              style={{ fontFamily: "Inter_400Regular" }}
            >
              Shops
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className={`
              ${isTablet ? "px-1" : "px-0"} 
              ${isTablet ? "mt-5" : "mt-3"}
            `}
            >
              <View className={`flex-row ${isTablet ? "gap-4" : "gap-2"}`}>
                {SHOP_CATEGORIES.map((shop) => (
                  <LinearGradient
                    key={shop.id}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    colors={
                      isDark ? ["#2A2A2A", "#1E1E1E"] : ["#F0F0F0", "#EDF2F2"]
                    }
                    style={{
                      borderRadius: 12,
                      width: isTablet ? 160 : isSmallPhone ? 90 : 112,
                      height: isTablet ? 160 : isSmallPhone ? 90 : 112,
                    }}
                  >
                    <View className="h-full w-full rounded-xl justify-center items-center">
                      <Image
                        source={shop.icon}
                        className={
                          isTablet
                            ? "w-16 h-16"
                            : isSmallPhone
                              ? "w-10 h-10"
                              : "w-12 h-12"
                        }
                      />
                      <Text
                        style={{ fontFamily: "Inter_600SemiBold" }}
                        className={`
                        ${isDark ? "text-white" : "text-black"}
                        ${isTablet ? "mt-2" : "mt-1"} 
                        ${isTablet ? "text-base" : isSmallPhone ? "text-[8px]" : "text-xs"}
                      `}
                      >
                        {shop.title}
                      </Text>
                    </View>
                  </LinearGradient>
                ))}
              </View>
            </ScrollView>

            {/* Promotions Section 1 */}
            <View className={isTablet ? "my-6" : "my-3"}>
              <View className="flex-row justify-between my-5">
                <Text
                  className={`
                ${isDark ? "text-white" : "text-black"}
                ${isTablet ? "mb-4" : "mb-3"} 
                ${isTablet ? "text-xl" : "text-base"}
              `}
                  style={{ fontFamily: "Inter_400Regular" }}
                >
                  Promotions
                </Text>
                <Pressable
                  className={`
                ${isDark ? "bg-[#2A2A2A]" : "bg-[#D9D9D9]"} 
                flex-row items-center justify-center px-5 rounded-xl
              `}
                >
                  <Text
                    className={`
                  ${isDark ? "text-white" : "text-black"}
                  ${isTablet ? "text-xl" : "text-base"}
                `}
                    style={{ fontFamily: "Inter_400Regular" }}
                  >
                    See all{" "}
                    <AntDesign name="arrow-right" size={15} color={iconColor} />
                  </Text>
                </Pressable>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ flexDirection: "row-reverse" }}
              >
                <View
                  className={`flex-row ${isTablet ? "gap-4" : "gap-2"} px-1`}
                >
                  {PROMOTIONS.map((item) => (
                    <View
                      key={item.id}
                      className={`
                      ${isTablet ? "w-80" : "w-64"} 
                      ${isTablet ? "h-56" : "h-48"} 
                      rounded-xl overflow-hidden 
                      ${isDark ? "bg-[#1E1E1E]" : "bg-white"} 
                      shadow-md
                    `}
                    >
                      <Image
                        source={item.image}
                        className={`w-full ${isTablet ? "h-40" : "h-32"}`}
                        resizeMode="cover"
                      />
                      <View
                        className={`
                      p-${isTablet ? "3" : "2"} 
                      ${isDark ? "bg-[#2A2A2A]" : "bg-[#ECECEC]"} 
                      ${isTablet ? "pt-4" : "pt-3"} 
                      ${isTablet ? "pb-4" : "pb-3"}
                    `}
                      >
                        <View className="flex-row justify-between">
                          <Text
                            className={`
                            ${isDark ? "text-white" : "text-black"} 
                            ${isTablet ? "text-lg" : "text-sm"} 
                            font-semibold
                          `}
                            style={{ fontFamily: "Inter_600SemiBold" }}
                          >
                            {item.name}
                          </Text>
                          <Text
                            className={`
                            ${isTablet ? "text-sm" : "text-xs"} 
                            ${isDark ? "text-gray-400" : "text-gray-500"} 
                            flex justify-center items-center
                          `}
                            style={{ fontFamily: "Inter_400Regular" }}
                          >
                            <Ionicons
                              name="link"
                              size={isTablet ? 18 : 14}
                              color={isDark ? "#A1A1AA" : "#333"}
                            />{" "}
                            {item.distance}
                          </Text>
                        </View>
                        <View className="flex-row justify-between mt-1">
                          <Text
                            className={`
                            ${isDark ? "text-white" : "text-black"} 
                            ${isTablet ? "text-sm" : "text-[10px]"} 
                            font-semibold
                          `}
                            style={{ fontFamily: "Inter_600SemiBold" }}
                          >
                            <Feather name="map-pin" color={iconColor} />
                            {item.location}
                          </Text>
                          <Text
                            className={`
                            ${isTablet ? "text-sm" : "text-xs"} 
                            ${isDark ? "text-gray-400" : "text-gray-500"} 
                            flex-row justify-center items-center
                          `}
                            style={{ fontFamily: "Inter_400Regular" }}
                          >
                            <Ionicons
                              name="star"
                              size={isTablet ? 18 : 14}
                              color="#FDBF07"
                            />{" "}
                            {item.rating}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Suggested Section */}
            <View className={isTablet ? "my-6" : ""}>
              <View className="flex-row justify-between my-5">
                <Text
                  className={`
                ${isDark ? "text-white" : "text-black"}
                ${isTablet ? "mb-4" : "mb-3"} 
                ${isTablet ? "text-xl" : "text-base"}
              `}
                  style={{ fontFamily: "Inter_400Regular" }}
                >
                  Suggested for you
                </Text>
                <Pressable
                  className={`
                ${isDark ? "bg-[#2A2A2A]" : "bg-[#D9D9D9]"} 
                flex-row items-center justify-center px-5 rounded-xl
              `}
                >
                  <Text
                    className={`
                  ${isDark ? "text-white" : "text-black"}
                  ${isTablet ? "text-xl" : "text-base"}
                `}
                    style={{ fontFamily: "Inter_400Regular" }}
                  >
                    See all
                    <AntDesign name="arrow-right" size={15} color={iconColor} />
                  </Text>
                </Pressable>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ flexDirection: "row-reverse" }}
              >
                <View
                  className={`flex-row ${isTablet ? "gap-4" : "gap-2"} px-1`}
                >
                  {PROMOTIONS.map((item) => (
                    <View
                      key={item.id}
                      className={`
                      ${isTablet ? "w-80" : "w-64"} 
                      ${isTablet ? "h-56" : "h-48"} 
                      rounded-xl overflow-hidden 
                      ${isDark ? "bg-[#1E1E1E]" : "bg-white"} 
                      shadow-md
                    `}
                    >
                      <Image
                        source={item.image}
                        className={`w-full ${isTablet ? "h-40" : "h-32"}`}
                        resizeMode="cover"
                      />
                      <View
                        className={`
                      p-${isTablet ? "3" : "2"} 
                      ${isDark ? "bg-[#2A2A2A]" : "bg-[#ECECEC]"} 
                      ${isTablet ? "pt-4" : "pt-3"} 
                      ${isTablet ? "pb-4" : "pb-3"}
                    `}
                      >
                        <View className="flex-row justify-between">
                          <Text
                            className={`
                            ${isDark ? "text-white" : "text-black"} 
                            ${isTablet ? "text-lg" : "text-sm"} 
                            font-semibold
                          `}
                            style={{ fontFamily: "Inter_600SemiBold" }}
                          >
                            {item.name}
                          </Text>
                          <Text
                            className={`
                            ${isTablet ? "text-sm" : "text-xs"} 
                            ${isDark ? "text-gray-400" : "text-gray-500"} 
                            flex justify-center items-center
                          `}
                            style={{ fontFamily: "Inter_400Regular" }}
                          >
                            <Ionicons
                              name="link"
                              size={isTablet ? 18 : 14}
                              color={isDark ? "#A1A1AA" : "#333"}
                            />{" "}
                            {item.distance}
                          </Text>
                        </View>
                        <View className="flex-row justify-between mt-1">
                          <Text
                            className={`
                            ${isDark ? "text-white" : "text-black"} 
                            ${isTablet ? "text-sm" : "text-[10px]"} 
                            font-semibold
                          `}
                            style={{ fontFamily: "Inter_600SemiBold" }}
                          >
                            <Feather name="map-pin" color={iconColor} />{" "}
                            {item.location}
                          </Text>
                          <Text
                            className={`
                            ${isTablet ? "text-sm" : "text-xs"} 
                            ${isDark ? "text-gray-400" : "text-gray-500"} 
                            flex-row justify-center items-center
                          `}
                            style={{ fontFamily: "Inter_400Regular" }}
                          >
                            <Ionicons
                              name="star"
                              size={isTablet ? 18 : 14}
                              color="#FDBF07"
                            />{" "}
                            {item.rating}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default HomeScreen;
