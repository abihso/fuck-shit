import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  Text,
  useColorScheme,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
const ShareLocation = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [address, setAddress] = useState<AddressType | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [granted, setGranted] = useState(false);
  const [refresh,setRefresh] = useState(1)
  useEffect(() => {
    async function getCurrentLocation() {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          setLoading(false);
          return;
        }

        setGranted(true);

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
  }, [refresh]);

  // Dynamic Theme Colors
  const textColor = isDark ? "text-white" : "text-black";
  const subTextColor = isDark ? "text-gray-400" : "text-[#333333]";
  const screenBg = isDark ? "bg-[#121212]" : "bg-white";
 const getShortLocationName = () => {
    if (!address) return "Loading...";
    const parts = [];
    if (address.city) parts.push(address.city);
    if (address.region) parts.push(address.region);
    return parts.length > 0 ? parts.join(", ") : "Location found";
  };
  return (
    <SafeAreaView className={`flex-1 ${screenBg}`}>
      {/* Image Section - Better fit with cover */}
      <View className="h-[350px] w-full bg-black overflow-hidden ">
        <Image
          source={require("../../../assets/images/globe.jpeg")}
          className="h-full w-full"
          resizeMode="cover"
        />
      </View>

      {/* Content Section */}
      <View className="px-7 mt-10 flex-1">
        <Text
          className={`text-lg ${textColor}`}
          style={{ fontFamily: "Inter_600SemiBold" }}
        >
          Share Your Location To find
        </Text>
        <Text
          className={`text-lg ${textColor}`}
          style={{ fontFamily: "Inter_600SemiBold" }}
        >
          The best Ride/Delivery
        </Text>
        <Text
          className={`text-lg ${textColor}`}
          style={{ fontFamily: "Inter_600SemiBold" }}
        >
          Around
        </Text>
        <Text
          className={`text-[7px] ${subTextColor} mt-3`}
          style={{ fontFamily: "Inter_400Regular" }}
        >
          Your Location
        </Text>
        {granted ? (
          <Text
            className={`text-xs ${textColor}`}
            style={{ fontFamily: "Inter_600SemiBold" }}
          >
            { `${getShortLocationName()}` }
          </Text>
        ) : (
          <Text
            className={`text-xs ${textColor}`}
            style={{ fontFamily: "Inter_600SemiBold" }}
          >
            NO ACCESS
          </Text>
        )}
        {
          !granted && (
            <Pressable onPress={() => setRefresh(pre => pre + 1)} className="bg-blue-500 px-6 py-4 rounded-3xl mt-4 " >
              <Text
            className={`text-xs ${textColor} text-center`}
            style={{ fontFamily: "Inter_600SemiBold" }}
          >
            ALLOW ACCESS
          </Text>
            </Pressable>
          )
        }

        {/* Button - Better positioning */}
        <View className="flex-1 justify-end pb-8">
          <Pressable
            className={`w-full h-12 rounded-full flex-row items-center justify-center px-5 ${
              isDark ? "bg-[#2A2A2A]" : "bg-[#FDBF07]"
            }`}
            onPress={() => router.push("/(dashboard)/(home)")}
          >
            <Text
              className={`text-sm ${isDark ? "text-[#FDBF07]" : "text-black"}`}
              style={{ fontFamily: "Inter_600SemiBold" }}
            >
             {
              granted ? "Share Location" : "Continue Without Location"
             }
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

export default ShareLocation;
