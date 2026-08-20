import { useState } from "react";
import { Image, Pressable, Text, View, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import {
  FormControl,
  FormControlErrorText,
  FormControlError,
  FormControlErrorIcon,
} from "@/form-control";
import { Input, InputField, InputSlot } from "@/input";
import { Button, ButtonSpinner, ButtonText } from "@/button";

const Login = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  // Tab & Password visibility states
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [showPassword, setShowPassword] = useState(false);

  // Form field states
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    identifier?: string;
    password?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const handleMethod = (value: "email" | "phone") => {
    setAuthMethod(value);
    setIdentifier("");
    setFieldErrors({});
  };

  const handleLogin = () => {
    setLoading(true);
    // TODO: Add authentication logic here
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <SafeAreaView className="flex flex-1 bg-white dark:bg-black items-center px-5">
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      {/* Email / Phone Toggle Bar */}
      <View className="flex-row justify-between items-center bg-[#F4F4F4] px-2 h-16 mt-10 w-[85%] rounded-3xl">
        <Pressable
          onPress={() => handleMethod("email")}
          className={`w-[50%] py-3 rounded-3xl ${
            authMethod === "email" ? "bg-white shadow-3xl" : ""
          }`}
        >
          <Text
            className="self-center"
            style={{ fontFamily: "Inter_400Regular" }}
          >
            Email
          </Text>
        </Pressable>

        <Pressable
          onPress={() => handleMethod("phone")}
          className={`w-[50%] py-3 rounded-3xl ${
            authMethod === "phone" ? "bg-white shadow-3xl" : ""
          }`}
        >
          <Text
            className="self-center"
            style={{ fontFamily: "Inter_400Regular" }}
          >
            Phone
          </Text>
        </Pressable>
      </View>

      <View className="z-10 min-h-72 w-full bg-[#F4F4F4] mt-10 rounded-3xl px-5 py-8">
        <Text className="text-5xl" style={{ fontFamily: "Inter_600SemiBold" }}>
          Welcome
        </Text>
        <Text className="text-5xl" style={{ fontFamily: "Inter_600SemiBold" }}>
          Back
        </Text>
        <Text className="mt-3" style={{ fontFamily: "Inter_600SemiBold" }}>
          Enter your {authMethod === "email" ? "email" : "phone number"} and
          password to login
        </Text>

        {/* Dynamic Email / Phone Input */}
        <FormControl isInvalid={!!fieldErrors.identifier} className="mt-8">
          <Input
            isRequired
            className="border border-[#E0E0E0] py-2 px-5 h-16 rounded-3xl"
          >
            <InputField
              style={{ fontFamily: "Inter_400Regular" }}
              placeholder={
                authMethod === "email" ? "Email Address" : "Phone Number"
              }
              keyboardType={
                authMethod === "email" ? "email-address" : "phone-pad"
              }
              autoCapitalize="none"
              value={identifier}
              onChangeText={setIdentifier}
            />
          </Input>
          {fieldErrors.identifier && (
            <FormControlError>
              <FormControlErrorIcon />
              <FormControlErrorText>
                {fieldErrors.identifier}
              </FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>

        {/* Password Input with Eye Toggle */}
        <FormControl isInvalid={!!fieldErrors.password} className="mt-4">
          <Input
            isRequired
            className="border border-[#E0E0E0] py-2 px-5 h-16 rounded-3xl flex-row items-center justify-between"
          >
            <InputField
              className="flex-1"
              style={{ fontFamily: "Inter_400Regular" }}
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <InputSlot
              onPress={() => setShowPassword(!showPassword)}
              className="pr-2"
            >
              <Feather
                name={showPassword ? "eye" : "eye-off"}
                size={20}
                color="#666"
              />
            </InputSlot>
          </Input>
          {fieldErrors.password && (
            <FormControlError>
              <FormControlErrorIcon />
              <FormControlErrorText>
                {fieldErrors.password}
              </FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>

        <Pressable onPress={() => {}}>
          <Text
            style={{ fontFamily: "Inter_400Regular" }}
            className="text-sm text-right mt-3"
          >
            Forgot password
          </Text>
        </Pressable>

        <Button
          variant="default"
          className="bg-black h-14 rounded-3xl mt-7 flex-row items-center justify-center gap-2"
          size="sm"
          isDisabled={loading}
          onPress={handleLogin}
        >
          {loading && <ButtonSpinner color="gray" />}
          <ButtonText
            className="text-[#FDBF07] text-xl"
            style={{ fontFamily: "Inter_600SemiBold" }}
          >
            Sign in
          </ButtonText>
        </Button>

        <View className="flex flex-row justify-between items-center gap-1 mt-5">
          <View className="border-[#A9A9A9] border-[0.3px] w-2/6" />
          <Text className="text-xs" style={{ fontFamily: "Inter_400Regular" }}>
            Or continue with
          </Text>
          <View className="border-[#A9A9A9] border-[0.3px] w-2/6" />
        </View>

        <View className="flex flex-row justify-between mt-7">
          <Button
            variant="ghost"
            className="border h-14 rounded-3xl w-[48%] border-[#E0E0E0] flex-row items-center gap-2 justify-center"
          >
            <Image
              className="w-7 h-7"
              source={require("@/assets/images/facebook.png")}
            />
            <ButtonText style={{ fontFamily: "Inter_600SemiBold" }}>
              Facebook
            </ButtonText>
          </Button>
          <Button
            variant="ghost"
            className="border h-14 rounded-3xl w-[48%] border-[#E0E0E0] flex-row items-center gap-2 justify-center"
          >
            <Image
              className="w-7 h-7"
              source={require("@/assets/images/google.png")}
            />
            <ButtonText style={{ fontFamily: "Inter_600SemiBold" }}>
              Gmail
            </ButtonText>
          </Button>
        </View>
      </View>

      <View className="z-10 flex flex-row justify-center items-center gap-3 absolute bottom-5">
        <Text style={{ fontFamily: "Inter_400Regular" }} className="text-xs">
          Policies
        </Text>
        <Text style={{ fontFamily: "Inter_400Regular" }} className="text-xs">
          Support
        </Text>
        <Text style={{ fontFamily: "Inter_400Regular" }} className="text-xs">
          Help center
        </Text>
      </View>

      <View className="w-40 h-40 bg-[#EDEDEA] absolute -bottom-10 left-0 rotate-45 rounded-3xl" />
    </SafeAreaView>
  );
};

export default Login;
