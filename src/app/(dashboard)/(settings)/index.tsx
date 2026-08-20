import React from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
  Alert,
  useColorScheme,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import {UserData} from "../../../../assets/types";
import { SettingProps } from "../../../../assets/types";
import { router } from "expo-router";

import SettingsSection from "@/components/SettingsSection";
import AccountActions from "@/components/AccountActions";




// Main Component
const Setting: React.FC<SettingProps> = ({
  user,
  onNavigate,
  onSignOut,
  onDeleteAccount,
  onSwitchAccount,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
const { width } = Dimensions.get("window");
const isTablet = width >= 768;
const isSmallPhone = width < 375;


  // Default user data
  const userData: UserData = user || {
    name: "Antwi Boasiako Theophilus",
    phone: "+233 55 574 7931",
    email: "antwiboasiakotheophilus88@gmail.com",
  };



  // Settings data with correct routes
  const generalSettings = [
    {
      icon: "home" as const,
      title: "Add Home",
      route: "/(dashboard)/(settings)/addhome",
    },
    {
      icon: "briefcase" as const,
      title: "Add Work",
      route: "/(dashboard)/(settings)/addwork",
    },
    {
      icon: "map-pin" as const,
      title: "Shortcuts/Saved places",
      subtitle: "Manage saved locations",
      route: "/(dashboard)/(settings)/savedplaces",
    },
    {
      icon: "shield" as const,
      title: "Privacy",
      subtitle: "Manage the data you share with us",
      route: "/(dashboard)/(settings)/privacy",
    },
    {
      icon: "eye" as const,
      title: "Accessibility",
      subtitle: "Manage your accessibility settings",
      route: "/(dashboard)/(settings)/accessibility",
    },
    {
      icon: "message-circle" as const,
      title: "Communication",
      subtitle: "Choose your preferred contact method and manage notifications",
      route: "/(dashboard)/(settings)/communication",
    },
    {
      icon: "sun" as const,
      title: "Appearance",
      subtitle: isDark ? "Dark mode" : "Light mode",
      route: "/(dashboard)/(settings)/appearance",
    },
  ];

  const rideSettings = [
    {
      icon: "gift" as const,
      title: "Tip Automatically",
      subtitle: "Set a default tip amount for every ride/delivery",
      route: "/(dashboard)/(settings)/tipsettings",
    },
    {
      icon: "calendar" as const,
      title: "Reserve",
      subtitle: "Choose how you're matched with riders when you book ahead",
      route: "/(dashboard)/(settings)/reservesettings",
    },
    {
      icon: "bell" as const,
      title: "Commute alerts",
      subtitle: "Get notifications to request rides/delivery at the right time",
      route: "/(dashboard)/(settings)/commutealerts",
    },
  ];

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => {
          onSignOut?.();
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            onDeleteAccount?.();
          },
        },
      ],
    );
  };

  const handleNavigate = (route: string, params?: any) => {
    if (onNavigate) {
      onNavigate(route, params);
    } else {
      router.push(route as any);
    }
  };

  return (
    <SafeAreaView className={`${isDark ? "bg-[#121212]" : "bg-white"} flex-1`}>
      <ScrollView
        className="px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: isTablet ? 40 : 120 }}
      >
        {/* Header */}
        <Text
          className={`text-2xl mt-4 ${isDark ? "text-white" : "text-black"}`}
          style={{ fontFamily: "Inter_600SemiBold" }}
        >
          Settings
        </Text>

        {/* User Profile Section */}
        <View className="flex-row gap-4 mt-6 items-center">
          <Image
            source={
              userData.avatar
                ? { uri: userData.avatar }
                : require("../../../../assets/images/user.png")
            }
            className="w-14 h-14 rounded-full"
            resizeMode="cover"
          />
          <View className="flex-1">
            <Text
              className={`text-base ${isDark ? "text-white" : "text-black"}`}
              style={{ fontFamily: "Inter_600SemiBold" }}
            >
              {userData.name}
            </Text>
            <Text
              className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}
              style={{ fontFamily: "Inter_400Regular" }}
            >
              {userData.phone}
            </Text>
            <Text
              className={`text-[10px] ${isDark ? "text-gray-500" : "text-gray-500"}`}
              style={{ fontFamily: "Inter_400Regular" }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {userData.email}
            </Text>
          </View>
          <Pressable
            onPress={() => handleNavigate("EditProfile")}
            accessibilityLabel="Edit Profile"
            accessibilityRole="button"
            className="p-2"
          >
            <Feather
              name="edit-2"
              color={isDark ? "#9CA3AF" : "#4B5563"}
              size={18}
            />
          </Pressable>
        </View>

        {/* Verification Banner */}
        <Pressable
          className="h-14 bg-[#FDBF07] rounded-2xl px-4 mt-6 flex-row items-center gap-3"
          onPress={() => handleNavigate("VerifyAccount")}
          accessibilityLabel="Verify your account"
          accessibilityRole="button"
        >
          <Image
            source={require("../../../../assets/images/secure1.png")}
            className="w-10 h-10"
            resizeMode="contain"
          />
          <View className="flex-1">
            <Text
              className="text-sm text-black"
              style={{ fontFamily: "Inter_600SemiBold" }}
            >
              Enjoy smoother and safer delivery/rides
            </Text>
            <Text
              className="text-xs text-black"
              style={{ fontFamily: "Inter_400Regular" }}
            >
              Verify your account
            </Text>
          </View>
          <Feather name="chevron-right" color="#000" size={20} />
        </Pressable>

        {/* General Settings */}
        <SettingsSection
          title="General"
          items={generalSettings}
          onNavigate={handleNavigate}
          isDark={isDark}
        />

        {/* Ride/Delivery Preferences */}
        <SettingsSection
          title="Ride/Delivery Preference"
          items={rideSettings}
          onNavigate={handleNavigate}
          isDark={isDark}
        />

        {/* Account Actions */}
        <AccountActions
          onSwitchAccount={onSwitchAccount}
          onSignOut={handleSignOut}
          onDeleteAccount={handleDeleteAccount}
          isDark={isDark}
        />

        <Text
          className="text-center text-gray-400 text-xs mt-6"
          style={{ fontFamily: "Inter_400Regular" }}
        >
          Version 1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Setting;