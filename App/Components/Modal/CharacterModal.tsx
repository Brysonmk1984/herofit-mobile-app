import React, { useState } from "react";
import { Button, Modal, Center, NativeBaseProvider, Text, Box, Image, View, ScrollView } from "native-base";
import CharacterModalActionButton from "./CharacterModalActionButton";
import ModalCloseButton from "./ModalCloseButton";
import { CharacterHeader } from "./CharacterHeader";
import { CharacterDialog } from "./CharacterDialog";
import { Icon } from "../CustomComponents";

const CharacterModal = ({ modalOpen, modalAction }: { modalOpen: boolean; modalAction: (modalOpen: boolean) => void }) => {
  return (
    <Modal isOpen={modalOpen} onClose={() => modalAction(false)} _backdrop={{ backgroundColor: "layout.modalBackdrop" }}>
      <Modal.Content p={0}>
        <CharacterHeader>
          <Image w={105} position="absolute" left={-12} top={-20} alignSelf={"flex-end"} source={require("../../../assets/images/misc/sensei-modal-header.webp")} size={100} alt={"Master Sensei Owl"} />
          <CharacterDialog>
            <Text pr={5} lineHeight={16} fontSize={15} fontFamily="handwriting">
              Your health is too low!!! Eat somedddd more protsadadas ein and get much stronger before you go batore you go battle the dark forces
            </Text>
          </CharacterDialog>
          <ModalCloseButton backgroundColor="base.background" />
        </CharacterHeader>
        <View paddingBottom={74}>
          <View justifyContent="center" flexDirection="row" backgroundColor="base.warning" py={2}>
            <Text mr={2}>
              <Icon iconName="warning" color="white" size={8} />
            </Text>
            <Text color="white" textAlign="center" fontSize="3xl" fontFamily="heading">
              Health IS Too Low!
            </Text>
          </View>
          <ScrollView padding={3}>
            {/* <Modal.Header>
              <Text fontSize="2xl" fontFamily="heading">
                Modal Title
              </Text>
            </Modal.Header> */}
            <Text>consequat. Magna exercitation reprehenderit magna ag. Mollit dolor eiusmod sunt ex incididunt cillum quis. Velit duis sit officia eiusmod Lorem aliqua enimna exercitation reprehenderit magna aute tempor cupidatat citation reprehenderit magna ag. Mollit dolor eiusmod sunt ex incididunt cillum quis. Velit duis sit officia eiusmod Lorem aliqua enimna exercitation reprehenderit magna aute tempor cu consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis. Velit duis sit officia eiusmod Lorem aliqua enim</Text>
          </ScrollView>
        </View>
        <CharacterModalActionButton text={"ACCEPT"} action={() => modalAction(false)} />
      </Modal.Content>
    </Modal>
  );
};

export default CharacterModal;
