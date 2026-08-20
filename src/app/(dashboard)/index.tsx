import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

const HomeScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <LinearGradient
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={["#444444", "#F7F7F7", "#FFCF6F"]}
        className="flex-1"
      >
        <View className="flex-1 justify-center items-center px-5">
          <Text className="text-4xl font-bold text-gray-800 mb-2">
            Hello 👋
          </Text>
          <Text className="text-2xl text-gray-700 text-center font-semibold">
            Welcome to Solomon's Galaxy S9
          </Text>
          <View className="mt-4 bg-white/30 px-6 py-3 rounded-full">
            <Text className="text-sm text-gray-600 text-center">
              You're successfully signed in!
            </Text>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default HomeScreen;
