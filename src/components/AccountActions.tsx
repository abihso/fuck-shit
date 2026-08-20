import { Pressable, View,Text } from "react-native";

const AccountActions: React.FC<{
  onSwitchAccount?: () => void;
  onSignOut?: () => void;
  onDeleteAccount?: () => void;
  isDark?: boolean;
}> = ({ onSwitchAccount, onSignOut, onDeleteAccount, isDark = false }) => {
  const borderClass = isDark ? "border-gray-800" : "border-gray-200";
  const textClass = isDark ? "text-white" : "text-black";

  return (
    <View className="mt-6">
      <Pressable
        className={`border-b ${borderClass} py-4 pl-5`}
        onPress={onSwitchAccount}
        accessibilityLabel="Switch Account"
        accessibilityRole="button"
      >
        <Text
          className={`text-sm ${textClass}`}
          style={{ fontFamily: "Inter_600SemiBold" }}
        >
          Switch Account
        </Text>
      </Pressable>
      <Pressable
        className={`border-b ${borderClass} py-4 pl-5`}
        onPress={onSignOut}
        accessibilityLabel="Sign Out"
        accessibilityRole="button"
      >
        <Text
          className="text-sm text-red-500"
          style={{ fontFamily: "Inter_600SemiBold" }}
        >
          Sign Out
        </Text>
      </Pressable>
      <Pressable
        className="py-4 pl-5"
        onPress={onDeleteAccount}
        accessibilityLabel="Delete Account"
        accessibilityRole="button"
      >
        <Text
          className="text-sm text-red-500"
          style={{ fontFamily: "Inter_600SemiBold" }}
        >
          Delete Account
        </Text>
      </Pressable>
    </View>
  );
};


export default AccountActions;