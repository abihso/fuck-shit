import { Inter_300Light } from "@expo-google-fonts/inter/300Light";
import { Inter_400Regular } from "@expo-google-fonts/inter/400Regular";
import { Inter_600SemiBold } from "@expo-google-fonts/inter/600SemiBold";
import { Inter_900Black } from "@expo-google-fonts/inter/900Black";
import { useFonts } from "@expo-google-fonts/inter/useFonts";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { Href, Link, router } from "expo-router";
import { useEffect, useRef, useState } from "react";

import {
  ActivityIndicator,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Register = () => {
  const [fontsLoaded] = useFonts([
    Inter_400Regular,
    Inter_300Light,
    Inter_600SemiBold,
    Inter_900Black,
  ]);



  // State for sign-up method toggle
  const [signUpMethod, setSignUpMethod] = useState<"email" | "phone">("email");

  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [errorP, setErrorP] = useState<string | boolean>(false);
  const [errorE, setErrorE] = useState<string | boolean>(false);
  const [errorV, setErrorV] = useState<string | boolean>(false);
  const [showEmailCode, setShowEmailCode] = useState(false);
  const [code, setCode] = useState(["", "", "", "", "", ""]);

  // Create refs for OTP inputs with proper typing
  const inputRefs = useRef<{ [key: number]: TextInput | null }>({});

  


  const verifyCode = async () => {
     const fullCode = code.join("");
  };

  // Format phone number for display
  const formatPhoneForDisplay = (phoneNumber: string) => {
    if (!phoneNumber) return "";
    // Show first 2 digits and last 4 digits
    return phoneNumber.slice(0, 2) + "****" + phoneNumber.slice(-4);
  };
  if (!fontsLoaded) {
    return null;
  }
  return (
    <SafeAreaView>
      <LinearGradient
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={["#444444", "#F7F7F7", "#FFCF6F"]}
      >
        {showEmailCode && (
          <View className="absolute flex-row justify-center items-center z-10 top-0 bottom-0 left-0 right-0 bg-[#000000c7]">
            <LinearGradient
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
              colors={["#FFE69D", "#FFFFFF", "#9D9D9D"]}
              style={{ borderRadius: 20 }}
            >
              <View className="items-center justify-center min-w-[80%] min-h-40 py-4 px-6">
                <Image
                  className="h-10 w-10 mb-2"
                  source={require("../../../assets/images/open-brown-envelope.jpg")}
                />
                <Text style={{ fontFamily: "Inter_600SemiBold" }}>
                  Check your {signUpMethod === "email" ? "email" : "phone"}
                </Text>
                <Text
                  style={{ fontFamily: "Inter_600SemiBold" }}
                  className="text-center text-xs mb-4"
                >
                  We sent a verification code to{" "}
                  {signUpMethod === "email"
                    ? email.slice(0, 2).toLowerCase() +
                      "****" +
                      email.slice(-12).toLowerCase()
                    : formatPhoneForDisplay(phone)}
                </Text>

                {/* OTP Inputs */}
                <View className="flex-row justify-between gap-3 mt-2">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <TextInput
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      className="w-12 h-12 border bg-black text-white rounded-lg text-center text-lg"
                      style={{ fontFamily: "Inter_600SemiBold" }}
                      maxLength={1}
                      keyboardType="numeric"
                      value={code[index]}
                      onChangeText={(text) => {
                        const newCode = [...code];
                        newCode[index] = text;
                        setCode(newCode);

                        if (text.length === 1 && index < 5) {
                          const nextInput = inputRefs.current[index + 1];
                          if (nextInput) {
                            nextInput.focus();
                          }
                        }
                      }}
                      onKeyPress={({ nativeEvent }) => {
                        if (
                          nativeEvent.key === "Backspace" &&
                          index > 0 &&
                          !code[index]
                        ) {
                          const prevInput = inputRefs.current[index - 1];
                          if (prevInput) {
                            prevInput.focus();
                          }
                        }
                      }}
                    />
                  ))}
                </View>

                {errorV && (
                  <Text className="text-red-500 text-xs mt-2">{errorV}</Text>
                )}

                <Pressable
                  onPress={verifyCode}
                  className="bg-black w-2/4 py-2 mb-4 rounded-full items-center mt-5"
                >
                  <Text
                    className="text-xl text-white"
                    style={{ fontFamily: "Inter_600SemiBold" }}
                  >
                    Verify
                  </Text>
                </Pressable>

                <Link className="" href={"/(auth)/login"}>
                  <Ionicons name="arrow-back" />
                  <Text
                    className="text-xs"
                    style={{ fontFamily: "Inter_600SemiBold" }}
                  >
                    Back to login
                  </Text>
                </Link>

                <Pressable
                  onPress={() => setShowEmailCode(false)}
                  className="absolute top-4 right-7"
                >
                  <Ionicons name="close" size={20} />
                </Pressable>
              </View>
            </LinearGradient>
          </View>
        )}

        <View className="h-full py-10 px-5">
          <Text
            className="text-4xl mt-5"
            style={{ fontFamily: "Inter_600SemiBold" }}
          >
            Hi
          </Text>
          <Text
            className="text-4xl"
            style={{ fontFamily: "Inter_600SemiBold" }}
          >
            there!
          </Text>
          <Text
            className="text-sm mt-3"
            style={{ fontFamily: "Inter_600SemiBold" }}
          >
            Join our us for the best delivery system
          </Text>
          <Text
            className="text-md mt-10"
            style={{ fontFamily: "Inter_600SemiBold" }}
          >
            Sign up with
          </Text>

          {/* Toggle Switch */}
          <View className="h-16 flex-row items-center justify-between bg-[#F5FFDB] rounded-full mt-3 p-1">
            <Pressable
              onPress={() => setSignUpMethod("email")}
              className={`w-[48%] h-full rounded-full justify-center flex items-center ${
                signUpMethod === "email" ? "bg-white" : ""
              }`}
              style={
                signUpMethod === "email"
                  ? {
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                      elevation: 5,
                    }
                  : {}
              }
            >
              <Text
                style={{ fontFamily: "Inter_600SemiBold" }}
                className={`text-xs ${signUpMethod === "email" ? "" : "text-gray-500"}`}
              >
                Email
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setSignUpMethod("phone")}
              className={`w-[48%] h-full rounded-full justify-center flex items-center ${
                signUpMethod === "phone" ? "bg-white" : ""
              }`}
              style={
                signUpMethod === "phone"
                  ? {
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                      elevation: 5,
                    }
                  : {}
              }
            >
              <Text
                style={{ fontFamily: "Inter_600SemiBold" }}
                className={`text-xs ${signUpMethod === "phone" ? "" : "text-gray-500"}`}
              >
                Phone
              </Text>
            </Pressable>
          </View>

          {/* Dynamic Input Field */}
          {signUpMethod === "email" ? (
            <>
              <TextInput
                placeholder="Email"
                placeholderTextColor={"#455A64"}
                onChangeText={(text) => setEmail(text)}
                className="mt-10 rounded-full bg-[#F5FFDB] text-black py-4 pl-3"
                style={{ fontFamily: "Inter_600SemiBold" }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errorE && (
                <Text
                  className="text-[10px] ml-12 mt-1 text-red-400"
                  style={{ fontFamily: "Inter_600SemiBold" }}
                >
                  {errorE}
                </Text>
              )}
            </>
          ) : (
            <>
              <TextInput
                placeholder="Phone Number"
                placeholderTextColor={"#455A64"}
                onChangeText={(text) => setPhone(text)}
                className="mt-10 rounded-full bg-[#F5FFDB] text-black py-4 pl-3"
                style={{ fontFamily: "Inter_600SemiBold" }}
                keyboardType="phone-pad"
              />
              {errorE && (
                <Text
                  className="text-[10px] ml-12 mt-1 text-red-400"
                  style={{ fontFamily: "Inter_600SemiBold" }}
                >
                  {errorE}
                </Text>
              )}
            </>
          )}

          <TextInput
            placeholder="Password"
            placeholderTextColor={"#455A64"}
            onChangeText={(text) => setPassword(text)}
            className="mt-10 rounded-full bg-[#F5FFDB] text-black py-4 pl-3"
            style={{ fontFamily: "Inter_600SemiBold" }}
            secureTextEntry
          />
          {errorP && (
            <Text
              className="text-[10px] ml-12 mt-1 text-red-400"
              style={{ fontFamily: "Inter_600SemiBold" }}
            >
              {errorP}
            </Text>
          )}

          <Pressable
            // onPress={}
            disabled={loading}
            className="bg-black h-12 rounded-full flex-row items-center justify-center mt-10"
          >
            {loading ? (
              <ActivityIndicator color="#FDBF07" />
            ) : (
              <Text
                style={{ fontFamily: "Inter_600SemiBold" }}
                className="text-[#FDBF07] text-2xl"
              >
                Sign Up
              </Text>
            )}
          </Pressable>

          <Text
            className="text-xs text-center mt-5"
            style={{ fontFamily: "Inter_600SemiBold" }}
          >
            or
          </Text>

          <View className="flex-row gap-3 mt-4 justify-center items-center">
            <Pressable onPress={() => {}}>
              <Image
                className="h-10 w-10"
                source={require("../../../assets/images/google.png")}
              />
            </Pressable>
            <Pressable>
              <Image
                className="h-10 w-10"
                source={require("../../../assets/images/facebook.png")}
              />
            </Pressable>
            <Pressable>
              <Image
                className="h-10 w-10"
                source={require("../../../assets/images/github.png")}
              />
            </Pressable>
          </View>

          <Pressable>
            <Text
              className="text-right text-xs mr-2 mt-2"
              style={{ fontFamily: "Inter_600SemiBold" }}
            >
              Forgot password
            </Text>
          </Pressable>

          <Pressable
            className="mt-3"
            onPress={() => router.push("/(auth)/login")}
          >
            <Text
              className="text-center"
              style={{ fontFamily: "Inter_600SemiBold" }}
            >
              Already have an account? Log in
            </Text>
          </Pressable>

          <View className="flex-row gap-3 justify-center w-full absolute bottom-0">
            <Text
              style={{ fontFamily: "Inter_600SemiBold" }}
              className="text-xs"
            >
              Policies
            </Text>
            <Text
              style={{ fontFamily: "Inter_600SemiBold" }}
              className="text-xs"
            >
              Supports
            </Text>
            <Text
              style={{ fontFamily: "Inter_600SemiBold" }}
              className="text-xs"
            >
              Help center
            </Text>
          </View>

          <View
            className={`absolute right-0 h-40 w-40 bg-[#FDDA94] -rotate-45 -mr-16 rounded-[40px] bottom-20`}
          ></View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Register;
