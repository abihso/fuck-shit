import PastRide from "@/components/pastRide";

import CancelledRide from "@/components/CancelledRide";
import DropoffSuggestionsList from "@/components/DropoffSuggestionsList";
import PickupSuggestionsList from "@/components/PickupSuggestionsList";
import UpcomingRide from "@/components/UpcomingRide";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import MapView, { Region } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import type { LocationData } from "../../../assets/types";
const GOOGLE_PLACES_API_KEY = "AIzaSyA-snrIEiM4BNj7NmkqsC9ifvr_dbyKxyA";

const MyRides = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const mapRef = useRef<MapView | null>(null);
  const [pickupLocation, setPickupLocation] = useState<LocationData | null>(
    null,
  );

  const [dropoffLocation, setDropoffLocation] = useState<LocationData | null>(
    null,
  );
  const [pickUpLoading, setPickUpLoading] = useState(false);
  const [dropOffLoading, setDropOffLoading] = useState(false);
  const [pickupInput, setPickupInput] = useState<string>("");
  const [dropoffInput, setDropoffInput] = useState<string>("");
  const isPickupSelectedRef = useRef(false);
  const isDropoffSelectedRef = useRef(false);
  const [pickupSuggestions, setPickupSuggestions] = useState<LocationData[]>(
    [],
  );
  const [dropoffSuggestions, setDropoffSuggestions] = useState<LocationData[]>(
    [],
  );
  const [isSearchingPickup, setIsSearchingPickup] = useState<boolean>(false);
  const [isSearchingDropoff, setIsSearchingDropoff] = useState<boolean>(false);
  const [isSwapped, setIsSwapped] = useState<boolean>(false);
  const [selectingTarget, setSelectingTarget] = useState<
    "pickup" | "dropoff" | null
  >(null);
  const [tempCoords, setTempCoords] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: 5.6037,
    longitude: -0.187,
  });
  const [tempAddress, setTempAddress] = useState<string>("Loading location...");
  const [isGeocoding, setIsGeocoding] = useState<boolean>(false);
  const [screen, setScreen] = useState("book");
  const [id, setId] = useState("");
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
   * Fetches predictions using Google Places API
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
        const predictions = data.predictions.slice(0, 7);

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
    setPickUpLoading(true);
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
    } finally {
      setPickUpLoading(false);
    }
  };

  const handleSelectCurrentLocationForDropOff = async () => {
    setDropOffLoading(true);
    try {
      let currentLocation = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };
      const address = await fetchAddress(coords);
      const loc = { ...coords, address };

      isDropoffSelectedRef.current = true;
      setDropoffLocation(loc);
      setDropoffInput(address);
      setDropoffSuggestions([]);
    } catch (error) {
      Alert.alert("Error", "Could not fetch current location.");
    } finally {
      setDropOffLoading(false);
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

  const handleSwapLocations = () => {
    setIsSwapped((prev) => !prev);

    // Swap input text values
    const tempInput = pickupInput;
    setPickupInput(dropoffInput);
    setDropoffInput(tempInput);

    // Swap location objects
    const tempLoc = pickupLocation;
    setPickupLocation(dropoffLocation);
    setDropoffLocation(tempLoc);

    // Swap suggestions
    const tempSuggestions = pickupSuggestions;
    setPickupSuggestions(dropoffSuggestions);
    setDropoffSuggestions(tempSuggestions);
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

      

      router.push("/(rides)/confirmRideRoute");
    } catch (error) {
      console.error("Failed to save locations to storage:", error);
    }
  };

  const iconColor = isDark ? "#FFFFFF" : "#000000";
  const textColor = isDark ? "text-white" : "text-black";
  const subTextColor = isDark ? "text-gray-400" : "text-gray-600";
  const headerBg = isDark ? "bg-[#1E1E1E]" : "bg-[#F7F7F7]";
  const inputBg = isDark ? "bg-[#2A2A2A]" : "bg-[#F2F2F2]";
  const cardBg = isDark ? "bg-[#1E1E1E]" : "bg-[#F7F7F7]";
  const screenBg = isDark ? "bg-[#121212]" : "bg-white";
  const borderBottomColor = isDark ? "border-gray-800" : "border-gray-100";

  const pickupSection = (
    <View>
      <View className="flex-row justify-between items-center mt-10">
        <Text
          className={`text-xl ${textColor}`}
          style={{ fontFamily: "Inter_600SemiBold" }}
        >
          Pickup location
        </Text>
      </View>

      <View className="flex-row items-center">
        <View className="w-[90%] mt-4 relative justify-center">
          <FontAwesome
            name="search"
            size={18}
            color={isDark ? "#9CA3AF" : "#6B7280"}
            style={{ position: "absolute", left: 15, zIndex: 10 }}
          />
          <TextInput
            style={{ fontFamily: "Inter_600SemiBold" }}
            value={pickupInput}
            onChangeText={(text) => {
              isPickupSelectedRef.current = false;
              setPickupInput(text);
            }}
            placeholder="Search pickup location or type place..."
            placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
            className={`rounded-3xl py-5 pl-12 pr-4 ${inputBg} ${textColor} text-sm`}
          />
        </View>
        <View className="w-[10%] flex-row justify-center mt-4">
          <Pressable onPress={() => openMapPicker("pickup")}>
            <AntDesign name="plus" size={20} color={iconColor} />
          </Pressable>
        </View>
      </View>

      <PickupSuggestionsList
        isLoading={isSearchingPickup}
        suggestions={pickupSuggestions}
        onSelect={(item) => selectSuggestion(item, "pickup")}
        isDark={isDark}
      />

      <View className="flex-row gap-3 justify-between">
        <Pressable
          onPress={handleSelectCurrentLocation}
          disabled={pickUpLoading}
          className={`${cardBg} mt-4 px-5 rounded-3xl py-5 flex-row gap-3 items-center w-[50%]`}
        >
          <Feather name="send" size={18} color={iconColor} />
          {pickUpLoading ? (
            <ActivityIndicator color={iconColor} />
          ) : (
            <Text
              className={`text-base ${textColor}`}
              style={{ fontFamily: "Inter_600SemiBold" }}
            >
              Current Location
            </Text>
          )}
        </Pressable>
        <Pressable
          onPress={() => openMapPicker("pickup")}
          className={`${cardBg} mt-4 px-5 rounded-3xl py-3 flex-row gap-3 items-center w-[50%]`}
        >
          <Feather name="map-pin" size={18} color={iconColor} />
          <Text
            className={`text-base ${textColor}`}
            style={{ fontFamily: "Inter_600SemiBold" }}
          >
            Select with map
          </Text>
        </Pressable>
      </View>
    </View>
  );

  const dropoffSection = (
    <View>
      <View className="flex-row justify-between items-center mt-10">
        <Text
          className={`text-xl ${textColor}`}
          style={{ fontFamily: "Inter_600SemiBold" }}
        >
          Dropoff location
        </Text>
      </View>

      <View className="flex-row items-center">
        <View className="w-[90%] mt-4 relative justify-center">
          <FontAwesome
            name="search"
            size={18}
            color={isDark ? "#9CA3AF" : "#6B7280"}
            style={{ position: "absolute", left: 15, zIndex: 10 }}
          />
          <TextInput
            style={{ fontFamily: "Inter_600SemiBold" }}
            value={dropoffInput}
            onChangeText={(text) => {
              isDropoffSelectedRef.current = false;
              setDropoffInput(text);
            }}
            placeholder="Search dropoff location or type place..."
            placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
            className={`rounded-3xl py-5 pl-12 pr-4 ${inputBg} ${textColor} text-sm`}
          />
        </View>
        <View className="w-[10%] flex-row justify-center mt-4">
          <Pressable onPress={() => openMapPicker("dropoff")}>
            <AntDesign name="plus" size={20} color={iconColor} />
          </Pressable>
        </View>
      </View>

      <DropoffSuggestionsList
        isLoading={isSearchingDropoff}
        suggestions={dropoffSuggestions}
        onSelect={(item) => selectSuggestion(item, "dropoff")}
        isDark={isDark}
      />

      <View className="flex-row gap-3 justify-between">
        <Pressable
          onPress={handleSelectCurrentLocationForDropOff}
          disabled={dropOffLoading}
          className={`${cardBg} mt-4 px-5 rounded-3xl py-5 flex-row gap-3 items-center w-[50%]`}
        >
          <Feather name="send" size={18} color={iconColor} />
          {dropOffLoading ? (
            <ActivityIndicator color={iconColor} />
          ) : (
            <Text
              className={`text-base ${textColor}`}
              style={{ fontFamily: "Inter_600SemiBold" }}
            >
              Current Location
            </Text>
          )}
        </Pressable>
        <Pressable
          onPress={() => openMapPicker("dropoff")}
          className={`${cardBg} mt-4 px-5 rounded-3xl py-3 flex-row gap-3 items-center w-[50%]`}
        >
          <Feather name="map-pin" size={18} color={iconColor} />
          <Text
            className={`text-base ${textColor}`}
            style={{ fontFamily: "Inter_600SemiBold" }}
          >
            Select with map
          </Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView className={`${screenBg} flex-1`}>
      {/* Navigation & Tab Header */}
      <View className={`${headerBg} py-3 pl-5`}>
        <View className="flex-row items-center p-1">
          <Pressable
            className="p-1"
            onPress={() => router.push("/(dashboard)/(menu)")}
          >
            <AntDesign name="close" size={13} color={iconColor} />
          </Pressable>
          <Text
            className={`text-xl ml-3 ${textColor}`}
            style={{ fontFamily: "Inter_600SemiBold" }}
          >
          Rides
          </Text>
        </View>
        <View className="flex-row pl-5 mt-3 items-center -mb-3 gap-5">
          <Pressable onPress={() => setScreen("book")}>
            <View
              className={`${
                screen === "book" && "border-b border-[#A98516]"
              } px-2 py-1`}
            >
              <Text
                style={{ fontFamily: "Inter_400Regular" }}
                className={`text-base ${
                  screen === "book" ? textColor : subTextColor
                }`}
              >
                Book
              </Text>
            </View>
          </Pressable>
          <Pressable onPress={() => setScreen("past")}>
            <View
              className={`${
                screen === "past" && "border-b border-[#A98516]"
              } px-2 py-1`}
            >
              <Text
                style={{ fontFamily: "Inter_400Regular" }}
                className={`text-base ${
                  screen === "past" ? textColor : subTextColor
                }`}
              >
                Past
              </Text>
            </View>
          </Pressable>
          <Pressable onPress={() => setScreen("Upcoming")}>
            <View
              className={`${
                screen === "Upcoming" && "border-b border-[#A98516]"
              } px-2 py-1`}
            >
              <Text
                style={{ fontFamily: "Inter_400Regular" }}
                className={`text-base ${subTextColor}`}
              >
                Upcoming
              </Text>
            </View>
          </Pressable>
          <Pressable onPress={() => setScreen("cancelled")}>
            <View
              className={`${screen === "cancelled" && "border-b border-[#A98516]"} px-2 py-1`}
            >
              <Text
                style={{ fontFamily: "Inter_400Regular" }}
                className={`text-base ${subTextColor}`}
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
            {isSwapped ? dropoffSection : pickupSection}

            <Pressable onPress={handleSwapLocations}>
              <View className="flex-row items-center mt-6 self-end">
                <FontAwesome name="long-arrow-up" size={15} color={iconColor} />
                <FontAwesome
                  name="long-arrow-down"
                  size={15}
                  color={iconColor}
                />
              </View>
            </Pressable>

            {isSwapped ? pickupSection : dropoffSection}
          </ScrollView>

          {/* Sticky Bottom Action Button Container */}
          <View
            className={`px-5 py-5 ${screenBg} border-t ${borderBottomColor}`}
          >
            <Pressable
              onPress={handleSubmit}
              className={`py-5 ${
                isDark ? "bg-[#2A2A2A]" : "bg-black"
              } rounded-3xl`}
            >
              <Text
                className="text-[#FDBF07] text-center"
                style={{ fontFamily: "Inter_600SemiBold" }}
              >
                Continue
              </Text>
            </Pressable>
          </View>
        </View>
      ) : screen === "past" ? (
        <PastRide id={id} />
      ) : screen === "Upcoming" ? (
        <UpcomingRide id={id} />
      ) : screen === "cancelled" ? (
        <CancelledRide id={id} />
      ) : null}

      {/* --- MAP SELECTION MODAL --- */}
      <Modal
        visible={selectingTarget !== null}
        animationType="slide"
        onRequestClose={() => setSelectingTarget(null)}
      >
        <SafeAreaView className={`flex-1 ${screenBg}`}>
          <View
            className={`p-4 flex-row justify-between items-center ${screenBg} border-b ${borderBottomColor} z-10`}
          >
            <Text
              className={`text-base capitalize ${textColor}`}
              style={{ fontFamily: "Inter_600SemiBold" }}
            >
              Select {selectingTarget} Location
            </Text>
            <Pressable onPress={() => setSelectingTarget(null)}>
              <AntDesign name="close" size={22} color={iconColor} />
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

            <View className="absolute top-1/2 left-1/2 -ml-4 -mt-8 pointer-events-none items-center justify-center z-15">
              <FontAwesome name="map-marker" size={36} color="#FDBF07" />
            </View>
          </View>

          <View className={`p-4 ${screenBg} border-t ${borderBottomColor}`}>
            <View className="mb-3">
              <Text className={`text-xs ${subTextColor}`}>Location Name:</Text>
              <Text className={`text-sm font-semibold ${textColor}`}>
                {isGeocoding ? "Locating place..." : tempAddress}
              </Text>
            </View>
            <Pressable
              onPress={confirmLocationSelection}
              disabled={isGeocoding}
              className={`py-3 rounded-3xl ${
                isGeocoding
                  ? "bg-gray-400"
                  : isDark
                    ? "bg-[#2A2A2A]"
                    : "bg-black"
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

export default MyRides;
