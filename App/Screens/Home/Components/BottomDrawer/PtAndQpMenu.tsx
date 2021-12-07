import React from "react";
import { View, Box, Text, Image, HStack, Pressable } from "native-base";
import Triangle from "./Triangle";
import { thousandsFormat } from "../../../../common/helperFunctions";

interface PtAndQpMenuProps {
  photonTokens: number;
  qp: number;
  openBottomDrawer: () => void;
  push: () => void;
  initialDisabledLinks: boolean;
}

const PtAndQpMenu: React.FC<PtAndQpMenuProps> = ({ photonTokens, qp, openBottomDrawer, push, initialDisabledLinks }) => {
  return (
    <>
      <Box zIndex={100} elevation={100} borderBottomColor="base.brand" borderBottomWidth={1}>
        <HStack h={35} borderColor="base.brand" borderTopWidth={1} justifyContent="space-between">
          <Pressable flex={1} backgroundColor="base.primary" onPress={initialDisabledLinks ? null : () => push("SpendQP")}>
            <HStack ml={10}>
              <Text lineHeight={36} fontFamily="heading" color="base.qp" fontSize={31}>
                {qp}
              </Text>
              <Text mr={16} ml={2} pr={2} lineHeight={36} fontFamily="heading" color="primary.800" fontSize={31}>
                QP
              </Text>
            </HStack>

            <Image position="absolute" elevation={1001} left={-30} top={-23} size={70} source={require("../../../../../assets/images/misc/quantum_points.webp")} />
          </Pressable>
          <Box zIndex={1001} elevation={1001} position="absolute" left="50%" top={-36} marginLeft={-44}>
            <Triangle action={openBottomDrawer} />
          </Box>
          <Pressable flex={1} elevation={1001} onPress={initialDisabledLinks ? null : () => openBottomDrawer()} backgroundColor="base.primary">
            <HStack justifyContent="flex-end" mr={36}>
              <Text lineHeight={36} fontFamily="heading" color="primary.800" fontSize={31}>
                PT
              </Text>
              <Text ml={2} mr={2} lineHeight={36} fontSize={31} fontFamily="heading" color="base.pt">
                {thousandsFormat(photonTokens)}
              </Text>
            </HStack>

            <Image position="absolute" elevation={1001} right={-22} top={-33} size="75" source={require("../../../../../assets/images/misc/photon_stack.webp")} />
          </Pressable>
        </HStack>
      </Box>
    </>
  );
};
export default PtAndQpMenu;
