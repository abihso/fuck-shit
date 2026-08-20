
import { useEffect, useState, useRef } from "react";
import {
  Image,
  Pressable,
  Text,
  View,
  FlatList,
  Dimensions,
  FlatList as FlatListType,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "@expo-google-fonts/inter/useFonts";
import { Inter_400Regular } from "@expo-google-fonts/inter/400Regular";
import { Inter_300Light } from "@expo-google-fonts/inter/300Light";
import { Inter_600SemiBold } from "@expo-google-fonts/inter/600SemiBold";
import { Shadow } from "react-native-shadow-2";
import { router } from "expo-router";


const image1 = require("../../assets/images/womanriding.jpeg");
const image2 = require("../../assets/images/Manwithbox.jpeg");
const image3 = require("../../assets/images/Happywoman.jpeg");

export default function HomeScreen() {
  const { width } = Dimensions.get("window");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_300Light,
    Inter_600SemiBold,
  });

  const images = [image1, image2, image3];

  const flatListRef = useRef<FlatListType | null>(null);
  const intervalRef = useRef<number | null>(null); 

  

  const goToNextSlide = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(nextIndex);

    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }
  };

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      goToNextSlide();
    }, 4000); 
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentIndex]);


  if (!fontsLoaded) {
    return null;
  }

  return (
    
    <SafeAreaView className="flex-1 items-center justify-center bg-white dark:bg-[#0e0e0e]">
      <View className="flex-1 items-center">
        <View className="h-4/5" style={{ width: width }}>
          <FlatList
            ref={flatListRef}
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / width,
              );
              setCurrentIndex(index);
            }}
            renderItem={({ item }) => (
              <View style={{ width: width, height: "100%" }}>
                <Image
                  source={item}
                  style={{
                    width: width,
                    height: "100%",
                    resizeMode: "cover",
                  }}
                />
              </View>
            )}
            keyExtractor={(_, index) => index.toString()}
            onScrollToIndexFailed={(info) => {
              const wait = new Promise((resolve) => setTimeout(resolve, 500));
              wait.then(() => {
                if (flatListRef.current) {
                  flatListRef.current.scrollToIndex({
                    index: info.index,
                    animated: true,
                  });
                }
              });
            }}
          />
        </View>

        <View className="absolute left-10 flex-row items-center gap-2 justify-center mt-10">
          {images.map((_, index) => (
            <View
              key={index}
              className={`w-14 h-1 ${index === currentIndex ? "bg-[#DCA501]" : "bg-white"}`}
            />
          ))}
        </View>

        <View className="absolute bottom-20 items-center justify-center w-full">
          <Shadow
            distance={100}
            startColor="#0e0e0e"
            offset={[0, 4]}
            containerStyle={{
              marginBottom: -230,
            }}
            style={{
              borderRadius: 225,
              width: 500,
              height: 450,
            }}
          >
            <View className="w-[500px] h-[450px] pl-20 rounded-[225px] bg-[#0e0e0e]">
              <View className="-mt-2 -ml-2">
                <Text
                  className="text-white text-lg"
                  style={{ fontFamily: "Inter_400Regular" }}
                >
                  FAST
                </Text>
                <Text
                  className="text-white text-xs"
                  style={{ fontFamily: "Inter_300Light" }}
                >
                  Fast delivery to your door step
                </Text>
                <Text
                  className="text-white text-xs"
                  style={{ fontFamily: "Inter_300Light" }}
                >
                  We deliver straight to your door — no missed packages, no
                  hassle.
                </Text>
                <Text
                  className="text-white text-xs"
                  style={{ fontFamily: "Inter_300Light" }}
                >
                  Speedy delivery. Right to you.
                </Text>
              </View>
              <View>
                <Pressable
                  onPress={() => router.push("/(auth)")}
                  className="bg-[#DCA501] -ml-2 w-[85%] h-10 items-center justify-center rounded-lg mt-10"
                >
                  <Text
                    className="text-white text-xs"
                    style={{ fontFamily: "Inter_600SemiBold", fontSize: 12 }}
                  >
                    I already have an account
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    router.push("/(auth)/register");
                  }}
                  className="bg-[#FFFFFF] -ml-2 w-[85%] h-10 items-center justify-center rounded-lg mt-5"
                >
                  <Text
                    className="text-black text-xs"
                    style={{ fontFamily: "Inter_600SemiBold", fontSize: 12 }}
                  >
                    Create a new Account
                  </Text>
                </Pressable>
              </View>
              <View className="flex-row gap-3 mt-24 justify-center items-center -ml-20">
                <Text
                  style={{ fontFamily: "Inter_600SemiBold", fontSize: 10 }}
                  className="text-white"
                >
                  policies
                </Text>
                <Text
                  style={{ fontFamily: "Inter_600SemiBold", fontSize: 10 }}
                  className="text-white"
                >
                  Supports
                </Text>
                <Text
                  style={{ fontFamily: "Inter_600SemiBold", fontSize: 10 }}
                  className="text-white"
                >
                  Help center
                </Text>
              </View>
              <Pressable className="absolute top-56 z-50 right-24">
                <Text
                  className="text-white"
                  style={{ fontFamily: "Inter_600SemiBold", fontSize: 10 }}
                >
                  Forget password?
                </Text>
              </Pressable>
            </View>
          </Shadow>
        </View>
        <View
          className={`absolute left-0 h-40 w-40 ${currentIndex == 0 ? "bg-[#DCA501]" : currentIndex == 1 ? "bg-[#F01B1B]" : "bg-[#9EE8E8]"}  -rotate-12 -mb-16 -ml-8 rounded-[40px] bottom-0`}
        ></View>
      </View>
      
    </SafeAreaView>
  );
}
