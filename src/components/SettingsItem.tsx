import { SettingsItemProps } from "@/assets/types";
import Feather from "@expo/vector-icons/Feather";
import { View,Text, Pressable } from "react-native";

const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  showArrow = true,
  isDark = false,
}) => (
  <View className="flex-row gap-3 items-center mt-3">
    <Feather name={icon} color={isDark ? "#9CA3AF" : "#4B5563"} size={20} />
    <Pressable
      onPress={onPress}
      className={`flex-row h-12 justify-between items-center border-b ${
        isDark ? "border-gray-800" : "border-gray-200"
      } flex-1`}
      accessibilityLabel={title}
      accessibilityRole="button"
    >
      <View>
        <Text
          className={`text-sm ${isDark ? "text-white" : "text-black"}`}
          style={{ fontFamily: "Inter_600SemiBold" }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            className={`text-[8px] ${isDark ? "text-gray-400" : "text-[#716D6D]"} mt-0.5`}
            style={{ fontFamily: "Inter_400Regular" }}
          >
            {subtitle}
          </Text>
        )}
      </View>
      {showArrow && (
        <Feather
          name="chevron-right"
          color={isDark ? "#4B5563" : "#D1D5DB"}
          size={16}
        />
      )}
    </Pressable>
  </View>
);

export default SettingsItem;