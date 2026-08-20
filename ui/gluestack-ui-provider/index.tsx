import { OverlayProvider } from "@gluestack-ui/core/overlay/creator";
import { ToastProvider } from "@gluestack-ui/core/toast/creator";
import { useColorScheme } from "nativewind";
import React, { useEffect } from "react";
import { View, ViewProps } from "react-native";
import { config } from "./config";
import {
  useCalendarTheme as useCalendarThemeHook,
  useGluestackColors as useGluestackColorsHook,
} from "./useGluestackColors";

export type ModeType = "light" | "dark" | "system";

// Re-export color hooks
export const useGluestackColors = useGluestackColorsHook;
export const useCalendarTheme = useCalendarThemeHook;
export type { GluestackColors } from "./useGluestackColors";

export function GluestackUIProvider({
  mode = "light",
  ...props
}: {
  mode?: ModeType;
  children?: React.ReactNode;
  style?: ViewProps["style"];
}) {
  const { colorScheme, setColorScheme } = useColorScheme();
  const resolvedMode =
    mode === "system" ? (colorScheme === "dark" ? "dark" : "light") : mode;

  useEffect(() => {
    setColorScheme(resolvedMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedMode]);

  const activeTheme = colorScheme === "dark" ? config.dark : config.light;

  return (
    <View
      style={[
        activeTheme,
        { flex: 1, height: "100%", width: "100%" },
        props.style,
      ]}
    >
      <OverlayProvider>
        <ToastProvider>{props.children}</ToastProvider>
      </OverlayProvider>
    </View>
  );
}
