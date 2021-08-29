import React, { useState } from "react";
import { Button, Modal, Center, NativeBaseProvider, Text, Box, Image, View } from "native-base";
import ModalActionButton from "./ModalActionButton";
import ModalCloseButton from "./ModalCloseButton";
import { CharacterHeader } from "./CharacterHeader";
import { CharacterDialog } from "./CharacterDialog";

const GlobalModal = ({ modalOpen, modalAction }: { modalOpen: boolean; modalAction: (modalOpen: boolean) => void }) => {
  console.log("MA=", modalAction);
  return (
    <Modal flex={1} top={0} isOpen={modalOpen} onClose={() => modalAction(false)} _backdrop={{ backgroundColor: "layout.modalBackdrop" }}>
      <Modal.Content p={0} maxWidth="400px">
        <CharacterHeader>
          <Image w={105} position="absolute" left={-12} top={-40} alignSelf={"flex-end"} source={require("../../../assets/images/misc/sensei-modal-header.webp")} size={100} alt={"Master Sensei Owl"} />
          <CharacterDialog>
            <Text lineHeight={16} fontSize={14} fontFamily="handwriting">
              Your health is too low!!! Eat some more protein and get much stronger before you go battle the dark forces
            </Text>
          </CharacterDialog>
          <ModalCloseButton backgroundColor="base.background" />
        </CharacterHeader>
        <Box height="100%" overflow="hidden">
          <Modal.Header backgroundColor="base.warning">
            <Text color="white" textAlign="center" fontSize="3xl" fontFamily="heading">
              Modal Title
            </Text>
          </Modal.Header>
          <View p={3} pb={90} flex={1}>
            {/* <Modal.Header>
              <Text fontSize="2xl" fontFamily="heading">
                Modal Title
              </Text>
            </Modal.Header> */}
            <Modal.Body>
              <Text>
                Sit nulla est ex deserunt exercitation anim occaecat. Nostrud ullamco deserunt aute id consequat veniam incididunt duis in sint irure nisi. Mollit officia cillum Lorem ullamco minim nostrud elit officia tempor esse quis. Sunt ad dolore quis aute consequat. Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis. Velit duis sit officia eiusmod Lorem aliqua enim ullamco deserunt aute id consequat veniam incididunt duis in sint irure nisi. Mollit officia cillum Lorem ullamco minim nostrud elit officia tempor esse quis. Sunt ad dolore quis aute consequat. Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis. Velit duis sit officia eiusmod Lorem aliqua enim exercitation reprehenderit magna aute tempor cupidatat consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis. Velit duis sit officia eiusmod Lorem aliqua enim ullamco deserunt aute id consequat veniam incididunt duis in sint irure nisi. Mollit officia cillum Lorem ullamco minim nostrud elit officia tempor
                esse quis. Sunt ad dolore quis aute consequat. Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis. Velit duis sit officia eiusmod Lorem aliqua enim
              </Text>
              <Text>
                la est ex deserunt exercitation anim occaecat. Nostrud ullamco deserunt aute id consequat veniam incididunt duis in sint irure nisi. Mollit officia cillum Lorem ullamco minim nostrud elit officia tempor esse quis. Sunt ad dolore quis aute consequat. Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis. Velit duis sit officia eiusmod Lorem aliqua enim ullamco deserunt aute id consequat veniam incididunt duis in sint irure nisi. Mollit officia cillum Lorem ullamco minim nostrud elit officia tempor esse quis. Sunt ad dolore quis aute consequat. Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis. Velit duis sit officia eiusmod Lorem aliqua enim exercitation reprehenderit magna aute tempor cupidatat consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis. Velit duis sit officia eiusmod Lorem aliqua enim ullamco deserunt aute id consequat veniam incididunt duis in sint irure nisi. Mollit officia cillum Lorem ullamco minim nostrud elit officia tempor esse
                quis. Sunt ad dolore quis aute consequat. Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis. Velit duis sit officia eiusmod Lorem aliqua enim
              </Text>
              <Text>unt ad dolore quis aute consequat. Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis. Velit duis sit officia eiusmod Lorem aliqua enim</Text>
            </Modal.Body>
          </View>

          <Modal.Footer width="95%" bottom={85} left={5}>
            <ModalActionButton text={"ACCEPT"} action={() => modalAction(false)} />
          </Modal.Footer>
        </Box>
      </Modal.Content>
    </Modal>
  );
};

export default GlobalModal;
