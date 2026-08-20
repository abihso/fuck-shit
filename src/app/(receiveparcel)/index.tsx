import PastRide from "@/components/pastRide";

import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import MapView, { Region } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

const GOOGLE_PLACES_API_KEY = "AIzaSyA-snrIEiM4BNj7NmkqsC9ifvr_dbyKxyA";

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
}

// Pickup Suggestions Sub-Component
const PickupSuggestionsList = ({
  isLoading,
  suggestions,
  onSelect,
}: {
  isLoading: boolean;
  suggestions: LocationData[];
  onSelect: (item: LocationData) => void;
}) => {
  if (isLoading) {
    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="small" color="#A98516" />
      </View>
    );
  }

  if (suggestions.length > 0) {
    return (
      <View
        className="bg-[#F7F7F7] rounded-2xl mt-2 p-2 border border-gray-100 z-50 "
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        }}
      >
        {suggestions.map((item, idx) => (
          <Pressable
            key={`pickup-${idx}`}
            onPress={() => onSelect(item)}
            className={`flex-row items-center gap-3 p-3 border-b border-gray-200 ${
              suggestions.length - 1 === idx && "border-b-0"
            }`}
          >
            <Feather name="map-pin" color="#4B5563" size={18} />
            <Text
              style={{ fontFamily: "Inter_400Regular" }}
              className="text-xs text-gray-800 flex-1"
            >
              {item.address}
            </Text>
          </Pressable>
        ))}
      </View>
    );
  }

  return null;
};

const DropoffSuggestionsList = ({
  isLoading,
  suggestions,
  onSelect,
}: {
  isLoading: boolean;
  suggestions: LocationData[];
  onSelect: (item: LocationData) => void;
}) => {
  if (isLoading) {
    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="small" color="#A98516" />
      </View>
    );
  }

  if (suggestions.length > 0) {
    return (
      <View
        className="bg-[#F7F7F7] rounded-2xl mt-2 p-2 border border-gray-100 z-50"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        }}
      >
        {suggestions.map((item, idx) => (
          <Pressable
            key={`dropoff-${idx}`}
            onPress={() => onSelect(item)}
            className={`flex-row items-center gap-3 p-3 border-b border-gray-200 ${
              suggestions.length - 1 === idx && "border-b-0"
            }`}
          >
            <Feather name="map-pin" color="#4B5563" size={18} />
            <Text
              style={{ fontFamily: "Inter_400Regular" }}
              className="text-xs text-gray-800 flex-1"
            >
              {item.address}
            </Text>
          </Pressable>
        ))}
      </View>
    );
  }

  return null;
};

const ReciveParcels = () => {
  const mapRef = useRef<MapView | null>(null);

  // Selected locations
  const [pickupLocation, setPickupLocation] = useState<LocationData | null>(
    null,
  );
  const [dropoffLocation, setDropoffLocation] = useState<LocationData | null>(
    null,
  );

  // Search Inputs State
  const [pickupInput, setPickupInput] = useState<string>("");
  const [dropoffInput, setDropoffInput] = useState<string>("");

  // Refs to prevent recursive re-searches on option selection
  const isPickupSelectedRef = useRef(false);
  const isDropoffSelectedRef = useRef(false);

  // Suggestions & Loading States
  const [pickupSuggestions, setPickupSuggestions] = useState<LocationData[]>(
    [],
  );
  const [dropoffSuggestions, setDropoffSuggestions] = useState<LocationData[]>(
    [],
  );
  const [isSearchingPickup, setIsSearchingPickup] = useState<boolean>(false);
  const [isSearchingDropoff, setIsSearchingDropoff] = useState<boolean>(false);

  // Modal Control State
  const [selectingTarget, setSelectingTarget] = useState<
    "pickup" | "dropoff" | null
  >(null);
  const [tempCoords, setTempCoords] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: 5.6037, // Default center
    longitude: -0.187,
  });
  const [tempAddress, setTempAddress] = useState<string>("Loading location...");
  const [isGeocoding, setIsGeocoding] = useState<boolean>(false);
  const [screen, setScreen] = useState("book");

  // Get current device location on startup
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        try {
          let currentLocation = await Location.getCurrentPositionAsync({});
          const coords = {
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
          };
          const address = await fetchAddress(coords);
          const initialLoc = { ...coords, address };

          isPickupSelectedRef.current = true;
          setPickupLocation(initialLoc);
          setPickupInput(address);
          setTempCoords(coords);
          setTempAddress(address);
        } catch (error) {
          console.log("Error getting initial location", error);
        }
      }
    })();
  }, []);

  // Debounced Pickup Search (Google Places)
  useEffect(() => {
    let active = true;

    if (!pickupInput.trim()) {
      setPickupSuggestions([]);
      setIsSearchingPickup(false);
      return;
    }

    if (isPickupSelectedRef.current) {
      isPickupSelectedRef.current = false;
      return;
    }

    const timer = setTimeout(() => {
      if (active) {
        fetchGooglePlacesAutocomplete(pickupInput, "pickup", () => active);
      }
    }, 400);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [pickupInput]);

  // Debounced Dropoff Search (Google Places)
  useEffect(() => {
    let active = true;

    if (!dropoffInput.trim()) {
      setDropoffSuggestions([]);
      setIsSearchingDropoff(false);
      return;
    }

    if (isDropoffSelectedRef.current) {
      isDropoffSelectedRef.current = false;
      return;
    }

    const timer = setTimeout(() => {
      if (active) {
        fetchGooglePlacesAutocomplete(dropoffInput, "dropoff", () => active);
      }
    }, 400);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [dropoffInput]);

  // Reverse Geocoding Helper
  const fetchAddress = async (coords: {
    latitude: number;
    longitude: number;
  }) => {
    try {
      const addressList = await Location.reverseGeocodeAsync(coords);
      if (addressList && addressList.length > 0) {
        const item = addressList[0];
        const placeName = item.name || item.street || item.district || "";
        const city = item.city || item.subregion || item.region || "";
        return placeName
          ? `${placeName}, ${city}`
          : city || "Selected Location";
      }
    } catch (e) {
      console.log("Geocoding failed", e);
    }
    return `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`;
  };

  /**
   * Fetches up to 5 predictions using Google Places API
   */
  const fetchGooglePlacesAutocomplete = async (
    input: string,
    target: "pickup" | "dropoff",
    isStillActive: () => boolean,
  ) => {
    if (target === "pickup") setIsSearchingPickup(true);
    else setIsSearchingDropoff(true);

    try {
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        input,
      )}&key=${GOOGLE_PLACES_API_KEY}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!isStillActive()) return;

      if (data.status === "OK" && data.predictions) {
        // Retrieve top predictions
        const predictions = data.predictions.slice(0, 7);

        // Fetch detailed geometry coordinates for each prediction
        const suggestionsWithCoords = await Promise.all(
          predictions.map(async (place: any) => {
            const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=geometry&key=${GOOGLE_PLACES_API_KEY}`;
            const detailsRes = await fetch(detailsUrl);
            const detailsData = await detailsRes.json();

            const location = detailsData.result?.geometry?.location;
            return {
              address: place.description,
              latitude: location ? location.lat : tempCoords.latitude,
              longitude: location ? location.lng : tempCoords.longitude,
            };
          }),
        );

        if (!isStillActive()) return;

        if (target === "pickup") {
          setPickupSuggestions(suggestionsWithCoords);
        } else {
          setDropoffSuggestions(suggestionsWithCoords);
        }
      } else {
        if (target === "pickup") setPickupSuggestions([]);
        else setDropoffSuggestions([]);
      }
    } catch (error) {
      console.log("Google Places fetch error:", error);
    } finally {
      if (isStillActive()) {
        if (target === "pickup") setIsSearchingPickup(false);
        else setIsSearchingDropoff(false);
      }
    }
  };

  const selectSuggestion = (
    item: LocationData,
    target: "pickup" | "dropoff",
  ) => {
    if (target === "pickup") {
      isPickupSelectedRef.current = true;
      setPickupLocation(item);
      setPickupInput(item.address);
      setPickupSuggestions([]);
    } else {
      isDropoffSelectedRef.current = true;
      setDropoffLocation(item);
      setDropoffInput(item.address);
      setDropoffSuggestions([]);
    }
  };

  const handleSelectCurrentLocation = async () => {
    try {
      let currentLocation = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };
      const address = await fetchAddress(coords);
      const loc = { ...coords, address };

      isPickupSelectedRef.current = true;
      setPickupLocation(loc);
      setPickupInput(address);
      setPickupSuggestions([]);
    } catch (error) {
      Alert.alert("Error", "Could not fetch current location.");
    }
  };

  const handleSelectCurrentLocationForDropOff = async () => {
    try {
      let currentLocation = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };
      const address = await fetchAddress(coords);
      const loc = { ...coords, address };

      // Set dropoff flag so search hook ignores the text change
      isDropoffSelectedRef.current = true;
      setDropoffLocation(loc);
      setDropoffInput(address);
      setDropoffSuggestions([]); // Clear suggestion list
    } catch (error) {
      Alert.alert("Error", "Could not fetch current location.");
    }
  };

  const openMapPicker = (target: "pickup" | "dropoff") => {
    let targetCoords = tempCoords;
    if (target === "pickup" && pickupLocation) {
      targetCoords = {
        latitude: pickupLocation.latitude,
        longitude: pickupLocation.longitude,
      };
      setTempAddress(pickupLocation.address);
    } else if (target === "dropoff" && dropoffLocation) {
      targetCoords = {
        latitude: dropoffLocation.latitude,
        longitude: dropoffLocation.longitude,
      };
      setTempAddress(dropoffLocation.address);
    }
    setTempCoords(targetCoords);
    setSelectingTarget(target);

    // Animate map to target coordinates once open
    setTimeout(() => {
      mapRef.current?.animateToRegion({
        ...targetCoords,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      });
    }, 300);
  };

  const handleRegionChangeComplete = async (region: Region) => {
    const latDiff = Math.abs(region.latitude - tempCoords.latitude);
    const lngDiff = Math.abs(region.longitude - tempCoords.longitude);

    if (latDiff < 0.0001 && lngDiff < 0.0001) return;

    const coords = { latitude: region.latitude, longitude: region.longitude };
    setTempCoords(coords);
    setIsGeocoding(true);
    const address = await fetchAddress(coords);
    setTempAddress(address);
    setIsGeocoding(false);
  };

  const confirmLocationSelection = () => {
    const selectedData: LocationData = {
      latitude: tempCoords.latitude,
      longitude: tempCoords.longitude,
      address: tempAddress,
    };

    if (selectingTarget === "pickup") {
      isPickupSelectedRef.current = true;
      setPickupLocation(selectedData);
      setPickupInput(tempAddress);
      setPickupSuggestions([]);
    } else if (selectingTarget === "dropoff") {
      isDropoffSelectedRef.current = true;
      setDropoffLocation(selectedData);
      setDropoffInput(tempAddress);
      setDropoffSuggestions([]);
    }
    setSelectingTarget(null);
  };

  const handleSubmit = async () => {
    if (!pickupLocation) {
      return Alert.alert("Hello", "Please select or type a pickup location");
    }
    if (!dropoffLocation) {
      return Alert.alert("Hello", "Please select or type a dropoff location");
    }
    try {
      await AsyncStorage.setItem(
        "pickupLocation",
        JSON.stringify(pickupLocation),
      );
      await AsyncStorage.setItem(
        "dropoffLocation",
        JSON.stringify(dropoffLocation),
      );

      console.log("Locations successfully saved to storage!");

      // Proceed to next route
      router.push("/(receiveparcel)/confirmReceiveRoute");
    } catch (error) {
      console.error("Failed to save locations to storage:", error);
    }
  };

  return (
    <SafeAreaView className="bg-white flex-1">
      <View className="bg-[#F7F7F7] py-3 pl-5">
        <View className="flex-row items-center p-1">
          <Pressable
            className="p-1"
            onPress={() => router.push("/(dashboard)/(menu)")}
          >
            <AntDesign name="close" size={13} color={"black"} />
          </Pressable>
          <Text style={{ fontFamily: "Inter_600SemiBold" }}>Receive</Text>
        </View>
        <View className="flex-row pl-5 mt-3 items-center -mb-3 gap-5">
          <Pressable onPress={() => setScreen("book")}>
            <View
              className={`${
                screen === "book" && "border-b border-[#A98516]"
              } px-2 py-1 `}
            >
              <Text
                style={{ fontFamily: "Inter_600SemiBold" }}
                className="text-xs"
              >
                Book
              </Text>
            </View>
          </Pressable>
          <Pressable onPress={() => setScreen("past")}>
            <View
              className={`${
                screen === "past" && "border-b border-[#A98516]"
              } px-2 py-1 `}
            >
              <Text
                style={{ fontFamily: "Inter_600SemiBold" }}
                className="text-xs"
              >
                Past
              </Text>
            </View>
          </Pressable>
          <Pressable>
            <View className=" px-2 py-1">
              <Text
                style={{ fontFamily: "Inter_600SemiBold" }}
                className="text-xs"
              >
                Upcoming
              </Text>
            </View>
          </Pressable>
          <Pressable>
            <View className=" px-2 py-1">
              <Text
                style={{ fontFamily: "Inter_600SemiBold" }}
                className="text-xs"
              >
                Cancelled
              </Text>
            </View>
          </Pressable>
        </View>
      </View>

      {screen === "book" ? (
        <View className="flex-1">
          {/* Main Scrollable Form */}
          <ScrollView
            className="px-5 flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* --- PICKUP LOCATION --- */}
            <View className="flex-row justify-between items-center mt-10">
              <Text
                className="text-xs"
                style={{ fontFamily: "Inter_600SemiBold" }}
              >
                Pickup location
              </Text>
              <Pressable onPress={() => openMapPicker("pickup")}>
                <Text className="text-xs text-amber-500 font-semibold">
                  Select on map
                </Text>
              </Pressable>
            </View>

            <View className="flex-row items-center">
              <View className="w-[90%] mt-4 relative justify-center">
                <FontAwesome
                  name="search"
                  size={18}
                  color="#6B7280"
                  style={{ position: "absolute", left: 12, zIndex: 10 }}
                />
                <TextInput
                  style={{ fontFamily: "Inter_600SemiBold" }}
                  value={pickupInput}
                  onChangeText={(text) => {
                    isPickupSelectedRef.current = false;
                    setPickupInput(text);
                  }}
                  placeholder="Search pickup location or type place..."
                  className="rounded-3xl py-3 pl-10 pr-4 bg-[#F2F2F2] text-gray-800 text-sm"
                />
              </View>
              <View className="w-[10%] flex-row justify-center mt-4">
                <Pressable onPress={() => openMapPicker("pickup")}>
                  <AntDesign name="plus" size={20} color="#000000" />
                </Pressable>
              </View>
            </View>

            <PickupSuggestionsList
              isLoading={isSearchingPickup}
              suggestions={pickupSuggestions}
              onSelect={(item) => selectSuggestion(item, "pickup")}
            />

            <View className="flex-row gap-3 justify-between">
              <Pressable
                onPress={handleSelectCurrentLocation}
                className="bg-[#F7F7F7] mt-4 px-5 rounded-3xl py-3 flex-row gap-3 items-center"
              >
                <Feather name="send" size={18} color="#000000" />
                <Text
                  className="text-sm"
                  style={{ fontFamily: "Inter_600SemiBold" }}
                >
                  Current Location
                </Text>
              </Pressable>
              <Pressable
                onPress={() => openMapPicker("pickup")}
                className="bg-[#F7F7F7] mt-4 px-5 rounded-3xl py-3 flex-row gap-3 items-center"
              >
                <Feather name="map-pin" size={18} color="#000000" />
                <Text
                  className="text-sm"
                  style={{ fontFamily: "Inter_600SemiBold" }}
                >
                  Select with map
                </Text>
              </Pressable>
            </View>

            <View className="flex-row items-center mt-6 self-end">
              <FontAwesome name="long-arrow-up" size={15} color="#000" />
              <FontAwesome name="long-arrow-down" size={15} color="#000" />
            </View>

            {/* --- DROPOFF LOCATION --- */}
            <View className="flex-row justify-between items-center mt-2">
              <Text
                className="text-xs"
                style={{ fontFamily: "Inter_600SemiBold" }}
              >
                Dropoff location
              </Text>
              <Pressable onPress={() => openMapPicker("dropoff")}>
                <Text className="text-xs text-amber-500 font-semibold">
                  Select on map
                </Text>
              </Pressable>
            </View>

            <View className="flex-row items-center">
              <View className="w-[90%] mt-4 relative justify-center">
                <FontAwesome
                  name="search"
                  size={18}
                  color="#6B7280"
                  style={{ position: "absolute", left: 12, zIndex: 10 }}
                />
                <TextInput
                  style={{ fontFamily: "Inter_600SemiBold" }}
                  value={dropoffInput}
                  onChangeText={(text) => {
                    isDropoffSelectedRef.current = false;
                    setDropoffInput(text);
                  }}
                  placeholder="Search dropoff location or type place..."
                  className="rounded-3xl py-3 pl-10 pr-4 bg-[#F2F2F2] text-gray-800 text-sm"
                />
              </View>
              <View className="w-[10%] flex-row justify-center mt-4">
                <Pressable onPress={() => openMapPicker("dropoff")}>
                  <AntDesign name="plus" size={20} color="#000000" />
                </Pressable>
              </View>
            </View>

            <DropoffSuggestionsList
              isLoading={isSearchingDropoff}
              suggestions={dropoffSuggestions}
              onSelect={(item) => selectSuggestion(item, "dropoff")}
            />
            <View className="flex-row gap-3 justify-between">
              <Pressable
                onPress={handleSelectCurrentLocationForDropOff}
                className="bg-[#F7F7F7] mt-4 px-5 rounded-3xl py-3 flex-row gap-3 items-center"
              >
                <Feather name="send" size={18} color="#000000" />
                <Text
                  className="text-sm"
                  style={{ fontFamily: "Inter_600SemiBold" }}
                >
                  Current Location
                </Text>
              </Pressable>
              <Pressable
                onPress={() => openMapPicker("dropoff")}
                className="bg-[#F7F7F7] mt-4 px-5 rounded-3xl py-3 flex-row gap-3 items-center"
              >
                <Feather name="map-pin" size={18} color="#000000" />
                <Text
                  className="text-sm"
                  style={{ fontFamily: "Inter_600SemiBold" }}
                >
                  Select with map
                </Text>
              </Pressable>
            </View>
          </ScrollView>

          {/* Sticky Bottom Continue Button Container */}
          <View className="px-5 py-4 bg-white border-t border-gray-100">
            <Pressable
              onPress={handleSubmit}
              className="py-4 bg-black rounded-3xl"
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
      ) : screen === "past" ? (
        <PastRide />
      ) : (
        ""
      )}

      {/* --- MAP SELECTION MODAL --- */}
      <Modal
        visible={selectingTarget !== null}
        animationType="slide"
        onRequestClose={() => setSelectingTarget(null)}
      >
        <SafeAreaView className="flex-1 bg-white">
          <View className="p-4 flex-row justify-between items-center bg-white border-b border-gray-100 z-10">
            <Text
              className="text-base capitalize"
              style={{ fontFamily: "Inter_600SemiBold" }}
            >
              Select {selectingTarget} Location
            </Text>
            <Pressable onPress={() => setSelectingTarget(null)}>
              <AntDesign name="close" size={22} color="black" />
            </Pressable>
          </View>

          {/* Map View Container */}
          <View className="flex-1 relative">
            <MapView
              ref={mapRef}
              style={{ flex: 1 }}
              initialRegion={{
                latitude: tempCoords.latitude,
                longitude: tempCoords.longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.015,
              }}
              onRegionChangeComplete={handleRegionChangeComplete}
            />

            <View className="absolute top-1/2 left-1/2 -ml-4 -mt-8 pointer-events-none items-center justify-center z-10">
              <FontAwesome name="map-marker" size={36} color="#FDBF07" />
            </View>
          </View>

          <View className="p-4 bg-white border-t border-gray-100">
            <View className="mb-3">
              <Text className="text-xs text-gray-400">Location Name:</Text>
              <Text className="text-sm font-semibold text-gray-800">
                {isGeocoding ? "Locating place..." : tempAddress}
              </Text>
            </View>
            <Pressable
              onPress={confirmLocationSelection}
              disabled={isGeocoding}
              className={`py-3 rounded-3xl ${
                isGeocoding ? "bg-gray-400" : "bg-black"
              }`}
            >
              <Text
                className="text-[#FDBF07] text-center"
                style={{ fontFamily: "Inter_600SemiBold" }}
              >
                Confirm {selectingTarget}
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default ReciveParcels;
// ReciveParcels
