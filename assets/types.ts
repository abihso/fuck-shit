import Feather from "@expo/vector-icons/Feather";

export interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
}


export interface UserData {
  name: string;
  phone: string;
  email: string;
  avatar?: string;
}

export interface SettingProps {
  user?: UserData;
  onNavigate?: (route: string, params?: any) => void;
  onSignOut?: () => void;
  onDeleteAccount?: () => void;
  onSwitchAccount?: () => void;
}

export interface SettingsItemProps {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showArrow?: boolean;
  isDark?: boolean;
}

export interface SettingsSectionProps {
  title?: string;
  items: Array<{
    icon: keyof typeof Feather.glyphMap;
    title: string;
    subtitle?: string;
    route: string;
  }>;
  onNavigate?: (route: string, params?: any) => void;
  isDark?: boolean;
}
