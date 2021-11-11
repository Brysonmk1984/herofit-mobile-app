import React from "react";
import { View, Box, Text, Image, HStack, Pressable } from "native-base";
import Triangle from "./Triangle";
import { thousandsFormat } from "../../../../common/helperFunctions";

interface PtAndQpMenuProps {
  photonTokens: number;
  qp: number;
  openBottomDrawer: () => void;
  push: () => void;
}

const PtAndQpMenu: React.FC<PtAndQpMenuProps> = ({ photonTokens, qp, openBottomDrawer, push }) => {
  return (
    <>
      <Pressable zIndex={100} elevation={100} position="absolute" left={-30} top={-26} onPress={() => push("SpendQP")}>
        <Image size="75" source={require("../../../../../assets/images/misc/quantum_points.webp")} />
      </Pressable>

      <Box shadow={8}>
        <HStack h={33} borderColor="base.brand" borderTopWidth={1} zIndex={100} justifyContent="space-between">
          <Pressable pl={43} backgroundColor="base.primaryAlt" flex={2.5} onPress={() => push("SpendQP")}>
            {qp ? (
              <View flexDirection="row">
                <Text ml={0} lineHeight={37} fontFamily="heading" color="primary.800" fontSize={34}>
                  QP
                </Text>
                <Text ml={2} lineHeight={37} fontFamily="heading" color="primary.800" fontSize={34}>
                  {qp}
                </Text>
              </View>
            ) : (
              <Text lineHeight={37} fontFamily="heading" color="primary.800" fontSize={30}>
                Quantum
              </Text>
            )}
          </Pressable>
          <Box zIndex="1001" position="absolute" left="50%" top={-38} marginLeft={-44}>
            <Triangle action={openBottomDrawer} />
          </Box>
          <Pressable onPress={() => openBottomDrawer()} flex={2.5} backgroundColor="base.primaryAlt">
            <Box pl={27}>
              <View flexDirection="row">
                <Text lineHeight={37} fontSize={34} fontFamily="heading" color="primary.800">
                  {thousandsFormat(photonTokens)}
                </Text>
                <Text ml={2} lineHeight={37} fontFamily="heading" color="primary.800" fontSize={34}>
                  PT
                </Text>
              </View>
            </Box>
            <Image position="absolute" right={-25} top={-42} size="75" source={require("../../../../../assets/images/misc/photon_stack.webp")} />
          </Pressable>
        </HStack>
      </Box>
    </>
  );
};
export default PtAndQpMenu;
