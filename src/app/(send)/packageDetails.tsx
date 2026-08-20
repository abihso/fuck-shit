import Feather from "@expo/vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Contacts from "expo-contacts/legacy";
import { router } from "expo-router";
import { PhoneNumberUtil } from "google-libphonenumber";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ContactItem extends Contacts.Contact {
  phoneNumbers?: Contacts.PhoneNumber[];
}

interface CountryCode {
  flag: string;
  code: string;
  country: string;
  isoCode: string; // Used for phone validation
}

const COUNTRIES: CountryCode[] = [
  { flag: "🇬🇭", code: "+233", country: "Ghana", isoCode: "GH" },
  { flag: "🇳🇬", code: "+234", country: "Nigeria", isoCode: "NG" },
  { flag: "🇺🇸", code: "+1", country: "United States", isoCode: "US" },
  { flag: "🇬🇧", code: "+44", country: "United Kingdom", isoCode: "GB" },
  { flag: "🇰🇪", code: "+254", country: "Kenya", isoCode: "KE" },
  { flag: "🇿🇦", code: "+27", country: "South Africa", isoCode: "ZA" },
  { flag: "🇨🇦", code: "+1", country: "Canada", isoCode: "CA" },
];

interface BulletItem {
  id: string;
  text: string;
}

const DATA: BulletItem[] = [
  { id: "1", text: "Fits in delivery bag" },
  { id: "2", text: "Fits on delivery bike" },
  { id: "3", text: "Up to 30 kg" },
  { id: "4", text: "Up to 120*80*60 cm" },
  { id: "5", text: "Max GHS 500 value" },
];

const phoneUtil = PhoneNumberUtil.getInstance();

type StoredUser = {
  userId?: string;
  fullName?: string;
  phoneNumber?: string;
};

type StoredLocation = {
  address?: string;
  latitude?: number;
  longitude?: number;
};

const PackageDetails = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const backend_url = process.env.EXPO_PUBLIC_BACKPRODUCTIONURL;

  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [receiverName, setReceiverName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(
    COUNTRIES[0],
  );
  const [task, setTask] = useState<"send" | "receive">("send");

  useEffect(() => {
    const fetchTask = async () => {
      try {
        let storedTask = await AsyncStorage.getItem("task");
        storedTask = JSON.parse(storedTask || "null");
        if (storedTask == "send" || storedTask == "receive") {
          setTask(storedTask);
        }
      } catch (error) {
      }
    };

    fetchTask();
  }, []);

  const screenBg = isDark ? "bg-[#121212]" : "bg-white";
  const cardBg = isDark ? "bg-[#1E1E1E]" : "bg-[#F0ECEC]";
  const inputBg = isDark ? "bg-[#2A2A2A]" : "bg-white";
  const textColor = isDark ? "text-white" : "text-black";
  const subTextColor = isDark ? "text-gray-400" : "text-gray-700";
  const iconColor = isDark ? "#9CA3AF" : "#4B5563";
  const borderColor = isDark ? "border-gray-800" : "border-gray-100";
  const buttonBg = isDark ? "bg-[#2A2A2A]" : "bg-black";

  const validatePhone = (number: string, country: CountryCode): boolean => {
    const digitsOnly = number.replace(/\D/g, "");

    if (!digitsOnly) {
      setPhoneError("Phone number is required.");
      return false;
    }

    try {
      const parsedNumber = phoneUtil.parseAndKeepRawInput(
        digitsOnly,
        country.isoCode,
      );

      const isValid = phoneUtil.isValidNumberForRegion(
        parsedNumber,
        country.isoCode,
      );

      if (!isValid) {
        setPhoneError(`Invalid phone number for ${country.country}.`);
        return false;
      }

      setPhoneError("");
      return true;
    } catch {
      if (digitsOnly.length >= 7 && digitsOnly.length <= 15) {
        setPhoneError("");
        return true;
      }
      setPhoneError("Invalid phone number format.");
      return false;
    }
  };

  const handleOpenContacts = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();

      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
        });

        if (data && data.length > 0) {
          setContacts(data as ContactItem[]);
          setModalVisible(true);
        } else {
          Alert.alert("No Contacts Found", "Your contact list is empty.");
        }
      } else {
        Alert.alert(
          "Permission Denied",
          "Please grant contacts permission in your device settings to select a contact.",
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load contacts.");

    }
  };

  const handleSelectContact = (contact: ContactItem) => {
    if (contact.name) {
      setReceiverName(contact.name);
    }

    if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
      let rawNumber = contact.phoneNumbers[0].number || "";
      let cleanNumber = rawNumber.replace(/[\s\-\(\)]/g, "");

      if (cleanNumber.startsWith(selectedCountry.code)) {
        cleanNumber = cleanNumber.replace(selectedCountry.code, "");
      }

      setPhoneNumber(cleanNumber);
      validatePhone(cleanNumber, selectedCountry);
    }

    setModalVisible(false);
  };

  const handleContinue = async () => {
    
    setLoading(true);
    if (!receiverName.trim()) {
      setLoading(false);
      Alert.alert("Required", "Please enter the receiver's name.");
      return;
    }

    const isPhoneValid = validatePhone(phoneNumber, selectedCountry);

    if (isPhoneValid) {
      const userString = await AsyncStorage.getItem("user");
      const pickupString = await AsyncStorage.getItem("pickupLocation");
      const dropoffString = await AsyncStorage.getItem("dropoffLocation");
      const distanceString = await AsyncStorage.getItem("distance");

      const userInfor = userString
        ? (JSON.parse(userString) as StoredUser)
        : null;
      const pickupLocation = pickupString
        ? (JSON.parse(pickupString) as StoredLocation)
        : null;
      const dropoffLocation = dropoffString
        ? (JSON.parse(dropoffString) as StoredLocation)
        : null;
      const distance = distanceString ? Number(JSON.parse(distanceString)) : 0;
      const price = (20 + distance * 2.5).toFixed(2);

      axios
        .post(
          `${backend_url}/deliveries`,
          {
            senderId: userInfor?.userId,
            deliveryType: task,
            pickupAddress: pickupLocation?.address,
            pickupLatitude: pickupLocation?.latitude,
            pickupLongitude: pickupLocation?.longitude,
            pickupContactName: userInfor?.fullName,
            pickupContactPhone: userInfor?.phoneNumber,
            pickupInstructions: "none",
            dropoffAddress: dropoffLocation?.address,
            dropoffLatitude: dropoffLocation?.latitude,
            dropoffLongitude: dropoffLocation?.longitude,
            recipientName: receiverName,
            recipientPhone: phoneNumber,
            dropoffInstructions: "none",
            packageWeightKg: 0,
            distanceKm: distance,
            deliveryFee: price,
            totalAmount: price,
            paymentMethod: "cash",
          },
          {
            withCredentials: true,
          },
        )
        .then((res) => {

          Alert.alert(
            "From NorthRide",
            "Request made successfully please wait for our response",
          );
          setTimeout(() => {
            router.push("/(send)/loadProcessRoute");
          }, 2000);
        })
        .catch((err) => {})
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    const fetchStoredLocations = async () => {
      try {
        const storedPickup = await AsyncStorage.getItem("pickupLocation");
        const storedDropoff = await AsyncStorage.getItem("dropoffLocation"); 

      } catch (error) {

        
      }
    };

    fetchStoredLocations();
  }, []);

  return (
    <SafeAreaView className={`${screenBg} flex-1`}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        className="px-5 py-5"
      >
        <Pressable onPress={() => router.back()}>
          <Feather name="arrow-left" color={iconColor} size={20} />
        </Pressable>
        <Text
          className={`text-xl mt-3 ${textColor}`}
          style={{ fontFamily: "Inter_600SemiBold" }}
        >
          Delivery details
        </Text>

        {/* Schedule Pickup Info Card */}
        <View className={`mt-5 rounded-3xl ${cardBg} gap-3 p-4`}>
          <View className="h-14 justify-between flex-row items-center">
            <View className="flex-row gap-2">
              <View className={`w-10 h-10 rounded-full ${inputBg}`} />
              <View>
                <Text
                  className={`text-xs ${subTextColor}`}
                  style={{ fontFamily: "Inter_400Regular" }}
                >
                  Pickup in 19 min
                </Text>
                <Text
                  className={`text-sm ${textColor}`}
                  style={{ fontFamily: "Inter_600SemiBold" }}
                >
                  Pickup in 19 min
                </Text>
              </View>
            </View>
            <Feather name="chevron-right" color={iconColor} size={18} />
          </View>
          <View
            className={`border-b w-[95%] ${isDark ? "border-gray-700" : "border-[#C7C7C7]"} self-end`}
          />
          <View className="h-14 justify-between flex-row items-center">
            <View className="flex-row gap-2">
              <View className={`w-10 h-10 rounded-full ${inputBg}`} />
              <View>
                <Text
                  className={`text-xs ${subTextColor}`}
                  style={{ fontFamily: "Inter_400Regular" }}
                >
                  Pickup in 19 min
                </Text>
                <Text
                  className={`text-sm ${textColor}`}
                  style={{ fontFamily: "Inter_600SemiBold" }}
                >
                  Pickup in 19 min
                </Text>
              </View>
            </View>
            <Feather name="chevron-right" color={iconColor} size={18} />
          </View>
        </View>

        {/* Receiver Section Header */}
        <View className="flex-row justify-between mt-5 items-center">
          <Text
            className={`text-sm ${textColor}`}
            style={{ fontFamily: "Inter_600SemiBold" }}
          >
            {
              task === "send" ? "Receiver's details" : "Sender's details"
            }
          </Text>
          <Pressable onPress={handleOpenContacts}>
            <Text
              className="text-[9px] text-[#1B9100]"
              style={{ fontFamily: "Inter_600SemiBold" }}
            >
              Add from Contacts
            </Text>
          </Pressable>
        </View>

        {/* Inputs Container */}
        <View className={`mt-5 rounded-3xl ${cardBg} p-4`}>
          <TextInput
            placeholder={
              task === "send" ? "Receiver's name" : "Sender's name"
            }
            placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
            value={receiverName}
            onChangeText={setReceiverName}
            className={`rounded-2xl p-5 ${textColor} ${inputBg}`}
            style={{ fontFamily: "Inter_600SemiBold" }}
          />

          <View className="flex-row mt-3 gap-3">
            <Pressable
              onPress={() => setCountryModalVisible(true)}
              className={`${inputBg} rounded-2xl p-4 flex-row items-center justify-between gap-1`}
            >
              <Text className="text-base">{selectedCountry.flag}</Text>
              <Text
                className={`text-xs ${textColor}`}
                style={{ fontFamily: "Inter_600SemiBold" }}
              >
                {selectedCountry.code}
              </Text>
              <Feather name="chevron-down" size={14} color={iconColor} />
            </Pressable>

            <TextInput
              placeholder="Phone number"
              placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={(text) => {
                setPhoneNumber(text);
                validatePhone(text, selectedCountry);
              }}
              className={`rounded-2xl p-5 ${textColor} ${inputBg} flex-1 ${
                phoneError ? "border border-red-500" : ""
              }`}
              style={{ fontFamily: "Inter_600SemiBold" }}
            />
          </View>

          {/* Validation Error Message */}
          {phoneError ? (
            <Text className="text-red-500 text-xs mt-2 ml-1">{phoneError}</Text>
          ) : null}
        </View>

        {/* Check Requirements & Bullet List */}
        <View
          className={`mt-5 rounded-3xl ${cardBg} p-4 flex-row justify-between`}
        >
          <View className="flex-1 pr-2">
            <Text
              className={`text-base mb-3 ${textColor}`}
              style={{ fontFamily: "Inter_600SemiBold" }}
            >
              Check requirements
            </Text>

            {DATA.map((item) => (
              <View key={item.id} className="flex-row items-start mb-2">
                <Text className={`text-lg leading-6 mr-2 ${subTextColor}`}>
                  •
                </Text>
                <Text
                  className={`flex-1 text-sm leading-6 ${subTextColor}`}
                  style={{ fontFamily: "Inter_400Regular" }}
                >
                  {item.text}
                </Text>
              </View>
            ))}
          </View>
          <View className="flex-row justify-center items-center">
            <Image
              source={require("../../../assets/images/scooter-delivery-3d-illustration.png")}
              className="w-36 h-36"
            />
          </View>
        </View>

        {/* Dangerous Items Disclaimer */}
        <View className={`mt-5 rounded-3xl ${cardBg} p-4`}>
          <Text
            className={`text-base mb-3 ${textColor}`}
            style={{ fontFamily: "Inter_600SemiBold" }}
          >
            Check requirements
          </Text>
          <Text
            className={`text-[10px] mb-3 ${subTextColor}`}
            style={{ fontFamily: "Inter_400Regular" }}
          >
            Check Prescription medication, drugs (both legal and illegal),
            alcohol, firearms, weapons, illegal items, or any dangerous item
          </Text>
        </View>

        {/* Terms and Conditions Disclaimer */}
        <View className={`mt-5 rounded-3xl ${cardBg} p-4`}>
          <Text
            className={`text-[10px] mb-3 ${subTextColor}`}
            style={{ fontFamily: "Inter_400Regular" }}
          >
            By using NorthRide send, you accept the{" "}
            <Text className="text-[#009A29]">Terms and Conditions</Text>.
            Parcels must comply with our local laws. Illegal activities will be
            reported to authorities and can result in loss of access to the
            NorthRide’s platform. All items are sent at your own risk{" "}
          </Text>
        </View>
      </ScrollView>

      {/* Sticky Action Footer */}
      <View className={`px-5 py-3 ${screenBg} border-t ${borderColor}`}>
        <Pressable
          onPress={handleContinue}
          disabled={loading}
          className={`py-4 ${buttonBg} rounded-3xl active:opacity-80`}
        >
          {loading ? (
            <ActivityIndicator color="#FDBF07" />
          ) : (
            <Text
              className="text-[#FDBF07] text-center"
              style={{ fontFamily: "Inter_400Regular" }}
            >
              Continue
            </Text>
          )}
        </Pressable>
      </View>

      {/* Modal Contact Picker */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView className={`flex-1 ${screenBg} px-5 pt-3`}>
          <View className="flex-row justify-between items-center mb-4">
            <Text
              style={{ fontFamily: "Inter_400Regular" }}
              className={`text-xl ${textColor}`}
            >
              Select Contact
            </Text>
            <Pressable onPress={() => setModalVisible(false)}>
              <Text
                style={{ fontFamily: "Inter_400Regular" }}
                className="text-red-500 font-semibold text-base"
              >
                Cancel
              </Text>
            </Pressable>
          </View>

          <FlatList
            data={contacts}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Pressable
                className={`py-3 border-b ${borderColor}`}
                onPress={() => handleSelectContact(item)}
              >
                <Text
                  style={{ fontFamily: "Inter_400Regular" }}
                  className={`text-base font-medium ${textColor}`}
                >
                  {item.name}
                </Text>
                {item.phoneNumbers && item.phoneNumbers.length > 0 && (
                  <Text
                    style={{ fontFamily: "Inter_400Regular" }}
                    className={`text-xs ${subTextColor} mt-0.5`}
                  >
                    {item.phoneNumbers[0].number}
                  </Text>
                )}
              </Pressable>
            )}
          />
        </SafeAreaView>
      </Modal>

      {/* Modal Country Code Picker */}
      <Modal
        visible={countryModalVisible}
        animationType="slide"
        onRequestClose={() => setCountryModalVisible(false)}
      >
        <SafeAreaView className={`flex-1 ${screenBg} px-5 pt-3`}>
          <View className="flex-row justify-between items-center mb-4">
            <Text className={`text-xl font-bold ${textColor}`}>
              Select Country Code
            </Text>
            <Pressable onPress={() => setCountryModalVisible(false)}>
              <Text className="text-red-500 font-semibold text-base">
                Cancel
              </Text>
            </Pressable>
          </View>

          <FlatList
            data={COUNTRIES}
            keyExtractor={(item) => item.code + item.country}
            renderItem={({ item }) => (
              <Pressable
                className={`py-4 border-b ${borderColor} flex-row items-center justify-between`}
                onPress={() => {
                  setSelectedCountry(item);
                  validatePhone(phoneNumber, item);
                  setCountryModalVisible(false);
                }}
              >
                <View className="flex-row items-center gap-3">
                  <Text className="text-2xl">{item.flag}</Text>
                  <Text
                    style={{ fontFamily: "Inter_400Regular" }}
                    className={`text-base font-medium ${textColor}`}
                  >
                    {item.country}
                  </Text>
                </View>
                <Text className={`text-base ${subTextColor} font-semibold`}>
                  {item.code}
                </Text>
              </Pressable>
            )}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default PackageDetails;
