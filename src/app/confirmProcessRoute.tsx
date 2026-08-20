import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Inter_300Light,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_900Black,
} from "@expo-google-fonts/inter";
import { useFonts } from "@expo-google-fonts/inter/useFonts";
import polyline from "@mapbox/polyline";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleMaps } from "expo-maps";
import { router } from "expo-router";

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
}

interface Coordinate {
  latitude: number;
  longitude: number;
}

const ComfirmProcessRoute = () => {
  const [fontsLoaded] = useFonts([
    Inter_400Regular,
    Inter_300Light,
    Inter_600SemiBold,
    Inter_900Black,
  ]);

  const [pickup, setPickup] = useState<LocationData | null>(null);
  const [dropoff, setDropoff] = useState<LocationData | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<Coordinate[]>([]);
  const [distanceKm, setDistanceKm] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch actual route path along streets using OSRM
  const fetchRoute = async (start: LocationData, end: LocationData) => {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=polyline`;

      // Pass User-Agent header so OSRM demo server doesn't drop the request
      const response = await fetch(url, {
        headers: {
          "User-Agent": "MyExpoApp/1.0",
        },
      });

      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];

        // Decode geometry string into lat/lng array
        const points = polyline.decode(route.geometry);
        const coords: Coordinate[] = points.map(([lat, lng]) => ({
          latitude: lat,
          longitude: lng,
        }));

        setRouteCoordinates(coords);
        // Distance in kilometers returned by OSRM
        setDistanceKm(parseFloat((route.distance / 1000).toFixed(2)));
      } else {
        throw new Error("No routes found");
      }
    } catch (error) {
      console.error("Failed to fetch route directions:", error);
      // Fallback straight line if fetch fails
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

        // Get street routes
        await fetchRoute(parsedPickup, parsedDropoff);
      } catch (error) {
        console.error("Error reading locations from AsyncStorage:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoredLocations();
  }, []);

  if (!fontsLoaded || loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#FDBF07" />
      </View>
    );
  }

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

  return (
    <SafeAreaView className="bg-white flex-1">
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
                      coordinates: routeCoordinates, // Fixed prop name
                      color: "#FDBF07",         // Fixed prop name
                      width: 6,                 // Fixed prop name
                    },
                  ]
                : []
            }
          />
        </View>

        <View className="bg-white rounded-t-[40px] -mt-6 pt-3 px-5 z-10 flex-1 shadow-lg">
          <View className="mt-2">
            <View className="p-2">
              <View className="flex-row items-center justify-between h-20 py-2 px-2">
                <View className="flex-row items-center gap-2 flex-1 mr-2">
                  <Image
                    source={require("../../assets/images/scooter-delivery-3d-illustration.png")}
                    className="w-10 h-10"
                  />
                  <View className="flex-1">
                    <Text
                      numberOfLines={1}
                      className="text-base"
                      style={{ fontFamily: "Inter_600SemiBold" }}
                    >
                      {pickupCoords.address}
                    </Text>
                    <Text
                      className="text-xs text-gray-500"
                      style={{ fontFamily: "Inter_400Regular" }}
                    >
                      Motorcycle Ride • {distanceKm} km
                    </Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text
                    className="text-xs"
                    style={{ fontFamily: "Inter_300Light" }}
                  >
                    ~{estimatedMin} min ride
                  </Text>
                  <Text
                    className="text-xs "
                    style={{ fontFamily: "Inter_600SemiBold" }}
                  >
                    GH₵ {(20 + distanceKm * 2.5).toFixed(2)}
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={() => router.push("/pay")}
                className="py-4 bg-black rounded-3xl mt-8"
              >
                <Text
                  className="text-[#FDBF07] text-center"
                  style={{ fontFamily: "Inter_400Regular" }}
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

export default ComfirmProcessRoute;