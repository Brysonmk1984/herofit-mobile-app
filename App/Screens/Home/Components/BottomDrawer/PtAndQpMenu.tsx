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
      <Box zIndex={100} elevation={100}>
        <HStack h={39} borderColor="base.brand" borderTopWidth={1} justifyContent="space-between">
          <Pressable pl={46} backgroundColor="base.primary" flex={2.5} onPress={initialDisabledLinks ? null : () => push("SpendQP")}>
            {qp ? (
              <View flexDirection="row">
                <Text ml={0} lineHeight={40} fontFamily="heading" color="primary.800" fontSize={34}>
                  QP
                </Text>
                <Text ml={2} lineHeight={40} fontFamily="heading" color="base.qp" fontSize={34}>
                  {qp}
                </Text>
              </View>
            ) : (
              <Text lineHeight={40} fontFamily="heading" color="primary.800" fontSize={32}>
                Quantum
              </Text>
            )}
            <Image position="absolute" elevation={1001} left={-25} top={-25} size={70} source={require("../../../../../assets/images/misc/quantum_points.webp")} />
          </Pressable>
          <Box zIndex={1001} elevation={1001} position="absolute" left="50%" top={-36} marginLeft={-44}>
            <Triangle action={openBottomDrawer} />
          </Box>
          <Pressable elevation={1001} onPress={initialDisabledLinks ? null : () => openBottomDrawer()} flex={2.5} backgroundColor="base.primary">
            <Box pl={27}>
              <View flexDirection="row">
                <Text lineHeight={40} fontSize={34} fontFamily="heading" color="base.pt">
                  {thousandsFormat(photonTokens)}
                </Text>
                <Text ml={2} lineHeight={40} fontFamily="heading" color="primary.800" fontSize={34}>
                  PT
                </Text>
              </View>
            </Box>
            <Image position="absolute" elevation={1001} right={-20} top={-35} size="75" source={require("../../../../../assets/images/misc/photon_stack.webp")} />
          </Pressable>
        </HStack>
      </Box>
    </>
  );
};
export default PtAndQpMenu;
