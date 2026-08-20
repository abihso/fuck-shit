import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import { LocationData } from "../../assets/types";
const DropoffSuggestionsList = ({
  isLoading,
  suggestions,
  onSelect,
  isDark,
}: {
  isLoading: boolean;
  suggestions: LocationData[];
  onSelect: (item: LocationData) => void;
  isDark: boolean;
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
        className={`${
          isDark
            ? "bg-[#1E1E1E] border-gray-800"
            : "bg-[#F7F7F7] border-gray-100"
        } rounded-2xl mt-2 p-2 border z-50`}
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
            className={`flex-row items-center gap-3 p-3 border-b ${
              isDark ? "border-gray-800" : "border-gray-200"
            } ${suggestions.length - 1 === idx && "border-b-0"}`}
          >
            <Feather
              name="map-pin"
              color={isDark ? "#9CA3AF" : "#4B5563"}
              size={18}
            />
            <Text
              style={{ fontFamily: "Inter_400Regular" }}
              className={`text-xs flex-1 ${
                isDark ? "text-gray-200" : "text-gray-800"
              }`}
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


export default DropoffSuggestionsList;