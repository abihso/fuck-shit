import polyline from "@mapbox/polyline";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleMaps } from "expo-maps";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  useColorScheme,
  View
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

const ComfirmSendRoute = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [pickup, setPickup] = useState<LocationData | null>(null);
  const [dropoff, setDropoff] = useState<LocationData | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<Coordinate[]>([]);
  const [distanceKm, setDistanceKm] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchRoute = async (start: LocationData, end: LocationData) => {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=polyline`;

      const response = await fetch(url, {
        headers: {
          "User-Agent": "MyExpoApp/1.0",
        },
      });

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
      } else {
        throw new Error("No routes found");
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

  const estimatedMin = Math.max(3, Math.round((distanceKm / 25) * 60));
  const handleContinue = async () => {
    await AsyncStorage.setItem("distance", JSON.stringify(distanceKm));
    await AsyncStorage.setItem("time", JSON.stringify(estimatedMin));
    return router.push("/packageDetails");
  };

  const screenBg = isDark ? "bg-[#121212]" : "bg-white";
  const cardBg = isDark ? "bg-[#1E1E1E]" : "bg-white";
  const textColor = isDark ? "text-white" : "text-black";
  const subTextColor = isDark ? "text-gray-400" : "text-gray-500";
  const buttonBg = isDark ? "bg-[#2A2A2A]" : "bg-black";

  return (
    <SafeAreaView className={`${screenBg} flex-1`}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="h-[75%] bg-black">
          <GoogleMaps.View
            style={{ flex: 1 }}
            colorScheme={
              isDark
                ? GoogleMaps.MapColorScheme.DARK
                : GoogleMaps.MapColorScheme.LIGHT
            }
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
              },
              {
                coordinates: {
                  latitude: dropoffCoords.latitude,
                  longitude: dropoffCoords.longitude,
                },
                title: "Destination",
                snippet: dropoffCoords.address,
              },
            ]}
            polylines={
              routeCoordinates.length > 0
                ? [
                    {
                      coordinates: routeCoordinates,
                      color: "#FDBF07",
                      width: 6,
                    },
                  ]
                : []
            }
          />
        </View>

        <View
          className={`${cardBg} rounded-t-[40px] -mt-6 pt-3 px-5 z-10 flex-1 shadow-lg`}
        >
          <View className="mt-2">
            <View className="p-2">
              <View className="flex-row items-center justify-between h-20 py-2 px-2">
                <View className="flex-row items-center gap-2 flex-1 mr-2">
                  <Image
                    source={require("../../../assets/images/scooter-delivery-3d-illustration.png")}
                    className="w-10 h-10"
                  />
                  <View className="flex-1 gap-1">
                    <Text
                      numberOfLines={1}
                      className={`text-base ${textColor}`}
                      style={{ fontFamily: "Inter_600SemiBold" }}
                    >
                      {pickupCoords.address}
                    </Text>
                    <Text
                      className={`text-xs ${subTextColor}`}
                      style={{ fontFamily: "Inter_400Regular" }}
                    >
                      Motorcycle Ride • {distanceKm} km
                    </Text>
                  </View>
                </View>
                <View className="items-end gap-2">
                  <Text
                    className={`text-xs ${subTextColor}`}
                    style={{ fontFamily: "Inter_300Light" }}
                  >
                    ~{estimatedMin} min ride
                  </Text>
                  <Text
                    className={`text-xs ${textColor}`}
                    style={{ fontFamily: "Inter_600SemiBold" }}
                  >
                    GH₵ {(20 + distanceKm * 2.5).toFixed(2)}
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={handleContinue}
                className={`py-5 ${buttonBg} rounded-3xl mt-8`}
              >
                <Text
                  className="text-[#FDBF07] text-center"
                  style={{ fontFamily: "Inter_600SemiBold" }}
                >
                  Confirm route
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ComfirmSendRoute;
