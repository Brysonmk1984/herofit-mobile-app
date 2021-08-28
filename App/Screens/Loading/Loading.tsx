import React, { useState, useEffect } from "react";
import { Image, Pressable, FlatList, SectionList, Box, Center, View, Text, Heading, VStack, FormControl, Input, Link, Button, IconButton, HStack, Divider } from "native-base";
import AnimatedLoader from "react-native-animated-loader";
import ScreenContainer from "../../Components/ScreenContainer/ScreenContainer";
import { MainDrawerProps } from "../../common/types-navigator";

const Loading = () => {
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

  return (
    <ScreenContainer fullWidth={true} screenName="Loading">
      <View justifyContent="center" alignItems="center" h="100%">
        <VStack>
          <View>
            <AnimatedLoader visible={true} source={require("./loader.json")} speed={1}>
              {/* <Text fontFamily="systemFont">{message}</Text> */}
            </AnimatedLoader>
          </View>
        </VStack>
      </View>
    </ScreenContainer>
  );
};

export default Loading;
