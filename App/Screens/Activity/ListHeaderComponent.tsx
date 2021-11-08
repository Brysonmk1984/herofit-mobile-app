import React from "react";
import { HStack, Text } from "native-base";

interface ListHeaderComponentProps {}

const ListHeaderComponent: React.FC<ListHeaderComponentProps> = ({}) => {
  return (
    <HStack justifyContent="space-between" borderBottomWidth={1} borderBottomColor="base.primary">
      <Text flex={3} flexBasis={20} textAlign="left" fontFamily="heading" fontSize="sm">
        Date
      </Text>
      <Text flex={1.1} textAlign="right" fontFamily="heading">
        Duration
      </Text>
      <Text flex={1.2} textAlign="right" fontFamily="heading">
        Distance
      </Text>
      <Text flex={0.9} textAlign="right" fontFamily="heading">
        Avg{"\n"}Speed
      </Text>
      <Text flex={0.9} textAlign="right" fontFamily="heading">
        Max{"\n"}Speed
      </Text>
      <Text flex={0.9} textAlign="right" fontFamily="heading">
        Elev{"\n"}Gain
      </Text>
      {/* <Text flex={1.1} textAlign="right" fontFamily="heading">
        Hero{"\n"}Gains
      </Text> */}
    </HStack>
  );
};
export default ListHeaderComponent;
