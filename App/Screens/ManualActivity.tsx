import React, { useContext } from "react";
import { Center, Heading, Box, HStack, Text, ScrollView, FlatList, View } from "native-base";
import { ScreenContainer, ScreenActionButton, Header } from "../Components/CustomComponents";
import { AuthStackProps } from "../common/types-navigator";
import { GlobalStateContext } from "../store";

const ManualActivity = ({ route, navigation }: AuthStackProps<"SpendQP">) => {
  // Global State
  const { state, dispatch } = useContext(GlobalStateContext);

  const activities = [];

  return (
    <ScreenContainer screenName={route.name}>
      <Header text="Manual Activity" />

      <Center mt={0} mb={5}>
        <Heading>
          <Text color="primary.800" fontFamily="heading" fontSize="xl">
            Manually record an activity you've completed
          </Text>
        </Heading>
      </Center>

      <ScrollView>
        <FlatList
          data={activities}
          keyExtractor={(item, i) => i.toString()}
          renderItem={({ item }) => {
            const lcStatName = item.stat.toLowerCase();

            return (
              <Box borderRadius={10} bg={`base.${lcStatName}`} my={2} borderBottomWidth={1} borderBottomColor="primary.300" shadow={5}>
                <HStack alignItems="center" space={0}>
                  <View>test</View>
                  <View>test2</View>
                  <View>test3</View>
                </HStack>
              </Box>
            );
          }}
        />
      </ScrollView>

      <ScreenActionButton text="Done" action={() => console.log("SUBMIT!")} />
    </ScreenContainer>
  );
};

export default ManualActivity;
