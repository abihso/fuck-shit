import { View,Text } from "react-native";
import SettingsItem from "./SettingsItem";
import { router } from "expo-router";
import { SettingsSectionProps } from "@/assets/types";

const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  items,
  onNavigate,
  isDark = false,
}) => (
  <View className="mt-6">
    {title && (
      <Text
        className={`text-base mb-2 ${isDark ? "text-white" : "text-black"}`}
        style={{ fontFamily: "Inter_600SemiBold" }}
      >
        {title}
      </Text>
    )}
    {items.map((item, index) => (
      <SettingsItem
        key={index}
        icon={item.icon}
        title={item.title}
        subtitle={item.subtitle}
        isDark={isDark}
        onPress={() => {
          if (onNavigate) {
            onNavigate(item.route);
          } else {
            router.push(item.route as any);
          }
        }}
      />
    ))}
  </View>
);

export default SettingsSection;
