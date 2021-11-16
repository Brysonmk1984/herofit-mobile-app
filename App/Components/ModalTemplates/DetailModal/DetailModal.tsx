import React from "react";
import { Box, Button, Modal, View, Text, Image } from "native-base";
import useModal from "../../../common/hooks/useModal";
import { EveryElement, HeroChoice, SelectedHero } from "../../../common/types";
import { HeroImage } from "../../HeroImage/HeroImage";
import BodyContent from "../ItemModal/BodyContent";
import ItemHeader from "../ItemModal/ItemHeader";
import ItemLore from "../ItemModal/ItemLore";
import ModalCloseButton from "../ModalCloseButton";
import { ModalContent } from "../ModalContent";
import ModalHeaderImage from "../ModalHeaderImage";
import DetailTitle from "./DetailTitle";

interface DetailModalProps {
  id: string;
  modalOpen: boolean;
  modalAction?: () => void;
  character?: HeroChoice;
  gameElement?: EveryElement;
  buttonText?: string;
}

const DetailModal: React.FC<DetailModalProps> = ({ id, modalOpen, modalAction, character, gameElement, buttonText = "OK" }) => {
  const { closeModal } = useModal();

  if (typeof gameElement !== "undefined") {
    throw new Error("NEED TO ADD SUPPORT FOR ELEMENT DESCRIPTION!");
  }

  function handleModalAction(idToClose: string, modalAction: () => void) {
    if (modalAction) {
      modalAction();
    }
    closeModal(idToClose);
  }

  return (
    <Modal isOpen={modalOpen} onClose={() => closeModal(id)} _backdrop={{ backgroundColor: "layout.modalBackdrop" }}>
      <ModalContent>
        <Box zIndex="1000" flexBasis={65} justifyContent="center" bgColor="base.background">
          <ModalHeaderImage bgColor="base.background">{character ? <HeroImage character={character.character} width="115" height="115" /> : null}</ModalHeaderImage>
          <ModalCloseButton bgColor="base.background" />
        </Box>

        <DetailTitle title={character.alias} subtitle={character.description} characterColors={character.colors} />
        <BodyContent>
          <Box overflow="hidden" minHeight="100" mb={5}>
            <View zIndex={100} flexWrap="wrap" justifyContent="center" flexDirection="row" bgColor="base.background" py={2} mb={3}>
              <Text mt={-1} pb={1} px={2} bgColor="base.background" fontFamily="cursive">
                {character.history}
              </Text>
              <Image position="absolute" bottom={-10} source={require("../../../../assets/images/layout/torn-paper.webp")} alt={null} />
            </View>
          </Box>
          {/* Add any other info here */}
          <Box flex={1} flexBasis={70} justifyContent="flex-end">
            <Button mb={2} shadow={3} onPress={() => handleModalAction(id, modalAction)} borderTopRightRadius={0} borderTopLeftRadius={0}>
              {buttonText.toUpperCase()}
            </Button>
          </Box>
        </BodyContent>
      </ModalContent>
    </Modal>
  );
};

export default DetailModal;
