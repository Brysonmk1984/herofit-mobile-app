import React, { useState, useEffect } from "react";
import { Image, Pressable, FlatList, SectionList, Box, Center, View, Text, Heading, VStack, FormControl, Input, Link, Button, IconButton, HStack, Divider } from "native-base";
import AnimatedLoader from "react-native-animated-loader";
import ScreenContainer from "../../Components/ScreenContainer/ScreenContainer";
import { Dimensions, Platform } from "react-native";
const Loading = () => {
  const loaderSize = Dimensions.get("window").width * 1.2;
  const [displayLoadingText, setDisplayLoadingText] = useState(true);
  //const messages = ["powering up...", "one last squat...", "power walking to the server...", "making sure we are using proper...", '"only five more miles"...', "communing with the elements...", "Doing pull-ups on our database..."];
  //const [message, setMessage] = useState("powering up...");

  // A loading message that cycles through the messages array above. Only used for initial load.
  // useEffect(() => {
  //   const messageInt = setInterval(() => {
  //     messages.push(messages.shift());
  //     setMessage(messages[0]);
  //   }, 3000);
  //   return () => clearInterval(messageInt);
  // }, []);

  useEffect(() => {
    const loadingInt = setInterval(() => {
      setDisplayLoadingText(val => !val);
    }, 800);

    return () => clearInterval(loadingInt);
  }, []);

  return (
    <ScreenContainer fullWidth={true} screenName="Loading">
      <Center alignItems="center" h="100%" w="100%">
        <VStack>
          <View w="100%">
            <Box textAlign="center" zIndex="1000">
              <Text display={displayLoadingText ? "flex" : "none"} fontFamily={Platform.OS === "android" ? "Roboto" : "Arial"} color="base.brand">
                Loading...
              </Text>
            </Box>
            <AnimatedLoader overlayColor="rgba(0,0,0,0)" animationStyle={{ width: loaderSize, height: loaderSize }} visible={true} source={require("./loader.json")} speed={1}>
              {/* <Text fontFamily="systemFont">{message}</Text> */}
            </AnimatedLoader>
          </View>
        </VStack>
      </Center>
    </ScreenContainer>
  );
};

export default Loading;
