import React, { useState, useEffect } from "react";
import { Box, Center, View, Text, VStack } from "native-base";

import ScreenContainer from "../../Components/ScreenContainer/ScreenContainer";
import { Dimensions, Platform } from "react-native";
const Loading = () => {
  const [displayLoadingText, setDisplayLoadingText] = useState(true);

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
          </View>
        </VStack>
      </Center>
    </ScreenContainer>
  );
};

export default Loading;
