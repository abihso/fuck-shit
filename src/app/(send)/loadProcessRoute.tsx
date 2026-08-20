import { MaterialCommunityIcons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import polyline from "@mapbox/polyline";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleMaps } from "expo-maps";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
}

interface Coordinate {
  latitude: number;
  longitude: number;
}

const ProgressBar = ({ progressAnim }: { progressAnim: Animated.Value }) => {
  const widthInterpolation = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.progressTrack}>
      <Animated.View
        style={[styles.progressFill, { width: widthInterpolation }]}
      />
    </View>
  );
};

const LoadProcessRoute = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [showModal,setShowModal] = useState(false)

  const [pickup, setPickup] = useState<LocationData | null>(null);
  const [dropoff, setDropoff] = useState<LocationData | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<Coordinate[]>([]);
  const [distanceKm, setDistanceKm] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const screenBg = isDark ? "bg-[#121212]" : "bg-white";
  const cardBg = isDark ? "bg-[#1E1E1E]" : "bg-white";
  const iconBg = isDark ? "bg-[#2A2A2A]" : "bg-[#DCDBDB]";
  const textColor = isDark ? "text-white" : "text-black";
  const subTextColor = isDark ? "text-gray-400" : "text-gray-700";
  const iconColor = isDark ? "#9CA3AF" : "#4B5563";

  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 20000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(progressAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [progressAnim]);

  const handleProgressComplete = () => {
    Alert.alert(
      "Rider Search Complete",
      "We could not find a rider nearby. Please try again.",
      [
        {
          text: "OK",
          onPress: () => {
            progressAnim.setValue(0);
          },
        },
      ],
    );
  };

  const fetchRoute = async (start: LocationData, end: LocationData) => {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=polyline`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];

        const points = polyline.decode(route.geometry);
        const coords: Coordinate[] = points.map(([lat, lng]) => ({
          latitude: lat,
          longitude: lng,
        }));

        setRouteCoordinates(coords);
        setDistanceKm(parseFloat((route.distance / 1000).toFixed(2)));
      }
    } catch (error) {
      console.error("Failed to fetch route directions:", error);
      setRouteCoordinates([
        { latitude: start.latitude, longitude: start.longitude },
        { latitude: end.latitude, longitude: end.longitude },
      ]);
    }
  };

  useEffect(() => {
    const fetchStoredLocations = async () => {
      try {
        const storedPickup = await AsyncStorage.getItem("pickupLocation");
        const storedDropoff = await AsyncStorage.getItem("dropoffLocation");

        const parsedPickup: LocationData = storedPickup
          ? JSON.parse(storedPickup)
          : {
              latitude: 6.6745,
              longitude: -1.5716,
              address: "Pickup Location",
            };

        const parsedDropoff: LocationData = storedDropoff
          ? JSON.parse(storedDropoff)
          : {
              latitude: 6.7045,
              longitude: -1.5416,
              address: "Destination",
            };

        setPickup(parsedPickup);
        setDropoff(parsedDropoff);

        await fetchRoute(parsedPickup, parsedDropoff);
      } catch (error) {
        console.error("Error reading locations from AsyncStorage:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoredLocations();
  }, []);



  const pickupCoords = pickup || {
    latitude: 6.6745,
    longitude: -1.5716,
    address: "Pickup Location",
  };
  const dropoffCoords = dropoff || {
    latitude: 6.7045,
    longitude: -1.5416,
    address: "Destination",
  };

  const centerLat = (pickupCoords.latitude + dropoffCoords.latitude) / 2;
  const centerLng = (pickupCoords.longitude + dropoffCoords.longitude) / 2;

  return (
    <SafeAreaView className={`${screenBg} flex-1`}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* Map View */}
        <View className="h-[75%] bg-black">
          <GoogleMaps.View
            style={{ flex: 1 }}
            cameraPosition={{
              coordinates: {
                latitude: centerLat,
                longitude: centerLng,
              },
              zoom: 13,
            }}
            markers={[
              {
                coordinates: {
                  latitude: pickupCoords.latitude,
                  longitude: pickupCoords.longitude,
                },
                title: "Pickup Point",
                snippet: pickupCoords.address,
                anchor: { x: 0.5, y: 0.5 },
              },
              {
                coordinates: {
                  latitude: dropoffCoords.latitude,
                  longitude: dropoffCoords.longitude,
                },
                title: "Destination",
                snippet: dropoffCoords.address,
                anchor: { x: 0.5, y: 0.5 },
              },
            ]}
            polylines={[
              {
                coordinates: routeCoordinates,
                color: "#FDBF07",
                width: 10,
              },
            ]}
          />
        </View>

        <View
          className={`${cardBg} rounded-t-[40px] -mt-6 pt-3 px-5 z-10 flex-1 shadow-lg`}
        >
          <View className="m-5 flex-row justify-between items-end">
            <View>
              <Text
                style={{ fontFamily: "Inter_600SemiBold" }}
                className={`text-xs ${textColor}`}
              >
                Connecting to couriers
              </Text>
              <Text
                style={{ fontFamily: "Inter_300Light" }}
                className={`text-[8px] ${subTextColor}`}
              >
                Connecting to riders nearby
              </Text>
            </View>
            <View>
              <Text
                style={{ fontFamily: "Inter_600SemiBold" }}
                className={`text-[10px] ${textColor}`}
              >
                GH₵ 20.00
              </Text>
            </View>
          </View>
          <View className="my-5 px-5">
            {/* Animated Loading Bar */}
            <ProgressBar progressAnim={progressAnim} />
          </View>
          <View className="p-5 flex-row items-center justify-center gap-10">
            <Pressable>
              <View className="items-center">
                <View
                  className={`h-14 w-14 rounded-full ${iconBg} flex-row justify-center items-center`}
                >
                  <Feather name="map-pin" size={20} color={iconColor} />
                </View>
                <Text
                  style={{ fontFamily: "Inter_300Light" }}
                  className={`text-[10px] mt-2 ${subTextColor}`}
                >
                  Edit pickup
                </Text>
              </View>
            </Pressable>
            <Pressable onPress={() => setShowModal(true) } >
              <View className="items-center">
                <View
                  className={`h-14 w-14 rounded-full ${iconBg} flex-row justify-center items-center`}
                >
                  <MaterialCommunityIcons
                    name="car-off"
                    size={20}
                    color={iconColor}
                  />
                </View>
                <Text
                  style={{ fontFamily: "Inter_300Light" }}
                  className={`text-[10px] mt-2 ${subTextColor}`}
                >
                  
                  Cancel ride
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      {
        showModal && (
          <View className="absolute bottom-0 left-0 right-0 top-0 z-10">
        <View
          className={`${cardBg} rounded-t-[40px] -mt-6 py-10 shadow-lg absolute bottom-0 left-0 right-0 px-10`}
        >
          <View className="flex-row justify-center items-center">
            <Image
              source={require("../../../assets/images/bike-cancelled.png")}
              className="w-36 h-36"
            />
          </View>
          <Text
            style={{ fontFamily: "Inter_600SemiBold" }}
            className={` ${textColor} text-base mt-5`}
          >
            Are you sure you want to cancel this delivery?
          </Text>
          <Text
            style={{ fontFamily: "Inter_600SemiBold" }}
            className={`text-xs text-[#454545]  mt-1`}
          >
            If you cancel this, you may wait a while before you get the next
            available courier.
          </Text>
          <Pressable className="bg-red-500 py-3 mt-10 rounded-3xl" >
            <Text
            style={{ fontFamily: "Inter_600SemiBold" }}
            className={` text-white text-center text-base  mt-1`}
          >
            Cancel delivery
          </Text>
          </Pressable>
          <Pressable onPress={() => setShowModal(false)} className="bg-[#D8D8D8] py-3 mt-3 rounded-3xl" >
            <Text
            style={{ fontFamily: "Inter_600SemiBold" }}
            className={` text-center text-base  mt-1`}
          >
           Wait for rider/courier
          </Text>
          </Pressable>
        </View>
      </View>
        )
      }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  progressTrack: {
    height: 3,
    width: "100%",
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#0DC055",
    borderRadius: 3,
  },
});

export default LoadProcessRoute;
