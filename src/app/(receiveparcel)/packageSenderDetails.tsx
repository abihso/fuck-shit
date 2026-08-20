import Feather from "@expo/vector-icons/Feather";
import * as Contacts from "expo-contacts/legacy";
import { router } from "expo-router";
import { PhoneNumberUtil } from "google-libphonenumber";
import { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
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

const PackageSenderDetails = () => {
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [countryModalVisible, setCountryModalVisible] = useState(false);

  // Form States
  const [receiverName, setReceiverName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(
    COUNTRIES[0]
  );

  // Validation function
  const validatePhone = (number: string, country: CountryCode): boolean => {
    // Basic trim & digit cleaning
    const digitsOnly = number.replace(/\D/g, "");

    if (!digitsOnly) {
      setPhoneError("Phone number is required.");
      return false;
    }

    try {
      // Validate using google-libphonenumber
      const parsedNumber = phoneUtil.parseAndKeepRawInput(
        digitsOnly,
        country.isoCode
      );

      const isValid = phoneUtil.isValidNumberForRegion(
        parsedNumber,
        country.isoCode
      );

      if (!isValid) {
        setPhoneError(`Invalid phone number for ${country.country}.`);
        return false;
      }

      setPhoneError("");
      return true;
    } catch {
      // Fallback simple validation if parsing fails (e.g. 7 to 15 digits)
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
          "Please grant contacts permission in your device settings to select a contact."
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load contacts.");
      console.error(error);
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

  const handleContinue = () => {
    if (!receiverName.trim()) {
      Alert.alert("Required", "Please enter the receiver's name.");
      return;
    }

    const isPhoneValid = validatePhone(phoneNumber, selectedCountry);

    if (isPhoneValid) {
      const fullNumber = `${selectedCountry.code}${phoneNumber.replace(
        /\D/g,
        ""
      )}`;
      Alert.alert("Success", `Proceeding with phone: ${fullNumber}`);
      // Navigation action goes here
    }
  };

  return (
    <SafeAreaView className="bg-white flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        className="px-5 py-5"
      >
        {/* Back Navigation */}
        <Pressable onPress={() => router.back()}>
          <Feather name="arrow-left" color="#4B5563" size={20} />
        </Pressable>

        <Text
          className="text-xl mt-3"
          style={{ fontFamily: "Inter_600SemiBold" }}
        >
          Delivery details
        </Text>

        {/* Location Info Box */}
        <View className="mt-5 rounded-3xl bg-[#F0ECEC] p-4">
          <View className="flex-row min-h-20 gap-3">
            <View className="h-14 w-14 bg-white rounded-full" />
            <View className="border-b border-gray-300 w-[85%] flex-row justify-between">
              <View className="justify-center h-14">
                <Text
                  className="text-[8px]"
                  style={{ fontFamily: "Inter_600SemiBold" }}
                >
                  Pickup in 19 min
                </Text>
                <Text
                  className="text-xs mt-1"
                  style={{ fontFamily: "Inter_600SemiBold" }}
                >
                  Kronum, kumasi
                </Text>
              </View>
              <Feather
                name="chevron-right"
                className="mt-4"
                color="#4B5563"
                size={20}
              />
            </View>
          </View>

          <View className="flex-row min-h-20 gap-3 mt-3">
            <View className="h-14 w-14 bg-white rounded-full" />
            <View className="w-[85%] flex-row justify-between">
              <View className="justify-center h-14">
                <Text
                  className="text-[8px]"
                  style={{ fontFamily: "Inter_600SemiBold" }}
                >
                  Pickup in 19 min
                </Text>
                <Text
                  className="text-xs mt-1"
                  style={{ fontFamily: "Inter_600SemiBold" }}
                >
                  Kronum, kumasi
                </Text>
              </View>
              <Feather
                name="chevron-right"
                className="mt-4"
                color="#4B5563"
                size={20}
              />
            </View>
          </View>
        </View>

        {/* Receiver Section Header */}
        <View className="flex-row justify-between mt-5 items-center">
          <Text className="text-sm" style={{ fontFamily: "Inter_600SemiBold" }}>
            Sender
          </Text>
          <Pressable onPress={handleOpenContacts}>
            <Text
              className="text-sm text-[#1B9100]"
              style={{ fontFamily: "Inter_600SemiBold" }}
            >
              Add from Contacts
            </Text>
          </Pressable>
        </View>

        {/* Inputs Container */}
        <View className="mt-5 rounded-3xl bg-[#F0ECEC] p-4">
          <TextInput
            placeholder="Receiver's name"
            placeholderTextColor="#9CA3AF"
            value={receiverName}
            onChangeText={setReceiverName}
            className="rounded-2xl p-5 text-black bg-white"
            style={{ fontFamily: "Inter_600SemiBold" }}
          />

          <View className="flex-row mt-3 gap-3">
            <Pressable
              onPress={() => setCountryModalVisible(true)}
              className="bg-white rounded-2xl p-4 flex-row items-center justify-between gap-1"
            >
              <Text className="text-base">{selectedCountry.flag}</Text>
              <Text
                className="text-xs text-black"
                style={{ fontFamily: "Inter_600SemiBold" }}
              >
                {selectedCountry.code}
              </Text>
              <Feather name="chevron-down" size={14} color="#4B5563" />
            </Pressable>

            <TextInput
              placeholder="Phone number"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={(text) => {
                setPhoneNumber(text);
                validatePhone(text, selectedCountry);
              }}
              className={`rounded-2xl p-5 text-black bg-white flex-1 ${
                phoneError ? "border border-red-500" : ""
              }`}
              style={{ fontFamily: "Inter_600SemiBold" }}
            />
          </View>

          {/* Validation Error Message */}
          {phoneError ? (
            <Text className="text-red-500 text-xs mt-2 ml-1">
              {phoneError}
            </Text>
          ) : null}
        </View>

        {/* Check Requirements & Bullet List */}
        <View className="mt-5 rounded-3xl bg-[#F0ECEC] p-4">
          <Text
            className="text-base mb-3"
            style={{ fontFamily: "Inter_600SemiBold" }}
          >
            Check requirements
          </Text>

          {DATA.map((item) => (
            <View key={item.id} className="flex-row items-start mb-2">
              <Text className="text-lg leading-6 mr-2 text-gray-700">•</Text>
              <Text
                className="flex-1 text-sm leading-6 text-gray-700"
                style={{ fontFamily: "Inter_400Regular" }}
              >
                {item.text}
              </Text>
            </View>
          ))}
        </View>

        <View className="mt-5 rounded-3xl bg-[#F0ECEC] p-4">
          <Text
            className="text-base mb-3"
            style={{ fontFamily: "Inter_600SemiBold" }}
          >
            Check requirements
          </Text>
          <Text
            className="text-[10px] mb-3"
            style={{ fontFamily: "Inter_400Regular" }}
          >
            Check Prescription medication, drugs (both legal and illegal),
            alcohol, firearms, weapons, illegal items, or any dangerous item
          </Text>
        </View>

        <View className="mt-5 rounded-3xl bg-[#F0ECEC] p-4">
          <Text
            className="text-[10px] mb-3"
            style={{ fontFamily: "Inter_400Regular" }}
          >
            By using NorthRide send, you accept the{" "}
            <Text className="text-[#009A29]">Terms and Conditions </Text>.
            Parcels must comply with our local laws. Illegal activities will be
            reported to authorities and can result in loss of access to the
            NorthRide’s platform. All items are sent at your own risk{" "}
          </Text>
        </View>
      </ScrollView>

      {/* Floating Action Button Footer */}
      <View className="px-5 py-3 bg-white border-t border-gray-100">
        <Pressable
          onPress={handleContinue}
          className="py-4 bg-black rounded-3xl active:opacity-80"
        >
          <Text
            className="text-[#FDBF07] text-center"
            style={{ fontFamily: "Inter_400Regular" }}
          >
            Continue
          </Text>
        </Pressable>
      </View>

      {/* Modal Contact Picker */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView className="flex-1 bg-white px-5 pt-3">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold">Select Contact</Text>
            <Pressable onPress={() => setModalVisible(false)}>
              <Text className="text-red-500 font-semibold text-base">
                Cancel
              </Text>
            </Pressable>
          </View>

          <FlatList
            data={contacts}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Pressable
                className="py-3 border-b border-gray-100 active:bg-gray-50"
                onPress={() => handleSelectContact(item)}
              >
                <Text className="text-base font-medium text-gray-800">
                  {item.name}
                </Text>
                {item.phoneNumbers && item.phoneNumbers.length > 0 && (
                  <Text className="text-xs text-gray-500 mt-0.5">
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
        <SafeAreaView className="flex-1 bg-white px-5 pt-3">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold">Select Country Code</Text>
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
                className="py-4 border-b border-gray-100 flex-row items-center justify-between active:bg-gray-50"
                onPress={() => {
                  setSelectedCountry(item);
                  validatePhone(phoneNumber, item);
                  setCountryModalVisible(false);
                }}
              >
                <View className="flex-row items-center gap-3">
                  <Text className="text-2xl">{item.flag}</Text>
                  <Text className="text-base font-medium text-gray-800">
                    {item.country}
                  </Text>
                </View>
                <Text className="text-base text-gray-500 font-semibold">
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

export default PackageSenderDetails;