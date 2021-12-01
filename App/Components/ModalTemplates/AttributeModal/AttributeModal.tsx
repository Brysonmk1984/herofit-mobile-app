import React, { useMemo } from "react";
import { Modal, Text, Box, Button, Center, FlatList, HStack, View, Pressable, VStack, ScrollView } from "native-base";
import ModalCloseButton from "../ModalCloseButton";
import useModal from "../../../common/hooks/useModal";
import ModalHeaderImage from "../ModalHeaderImage";
import { ModalContent } from "../ModalContent";

import AttributeImage from "./AttributeImage";
import { AttrObj, Stat } from "../../../common/types";
import useAspectRatio from "../../../common/hooks/useAspectRatio";

interface AttributeModalProps {
  children: React.ReactChild;
  id: string;
  modalOpen: boolean;
  attrObj: AttrObj;
  isShortPhone: boolean;
}

const AttributeModal: React.FC<AttributeModalProps> = ({ children, id, modalOpen, attrObj, isShortPhone }) => {
  const { closeModal } = useModal();

  return (
    <Modal id={id} isOpen={modalOpen} onClose={() => closeModal(id)} _backdrop={{ backgroundColor: "layout.modalBackdrop" }}>
      <ModalContent>
        <Box flex={0.2} flexBasis={85} justifyContent="center" bgColor="base.background">
          <ModalHeaderImage bgColor="base.background">
            <AttributeImage attribute={attrObj.lcName} size={105} />
          </ModalHeaderImage>
          <ModalCloseButton bgColor="base.background" />
        </Box>

        {/* Action Header */}
        <Box>
          <Center justifyContent="center" bgColor={`base.${attrObj.lcName}`} py={2}>
            <Text color="white" textAlign="center" fontSize="4xl" fontFamily="heading">
              {attrObj.lcName}
            </Text>
          </Center>
          <Center bgColor="primary.600" pt={0.6} pb={1}>
            <Text fontSize="md" color="base.white">
              {attrObj.type}
            </Text>
          </Center>
        </Box>

        {/* Description Details */}
        {children}

        <VStack px={3} pb={2} space={1}>
          {!isShortPhone && (
            <Text fontFamily="heading" fontSize="lg">
              Earned By:
            </Text>
          )}
          <Text color={`base.${attrObj.lcName}`} fontSize="md">
            {attrObj.earnedBy}
          </Text>
        </VStack>

        {/* Action Button */}
        <Box flex={1} flexBasis={70} justifyContent="flex-end">
          <Button mb={2} bgColor="base.success" shadow={3} _text={{ fontFamily: "heading", fontSize: "4xl", lineHeight: 45, color: "base.white" }} onPress={() => closeModal(id)} borderTopRightRadius={0} borderTopLeftRadius={0}>
            OK
          </Button>
        </Box>
      </ModalContent>
    </Modal>
  );
};

export default AttributeModal;
