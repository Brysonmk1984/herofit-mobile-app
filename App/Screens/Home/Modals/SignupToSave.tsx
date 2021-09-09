import React, { useContext } from "react";
import { Heading, Box, View, Text } from "native-base";
import { CharacterModal } from "../../../Components/ModalTemplates/ModalTemplates";
import { ActionHeader, BodyContent } from "../../../Components/ModalTemplates/BasicModal/Content";
import { GlobalStateContext } from "../../../store";

interface SignupToSaveProps {
  id: string;
  modalAction: () => void;
}

// SIGNUP TO SAVE CHARACTER POPUP
const SignupToSave: React.FC<SignupToSaveProps> = ({ id, modalAction }) => {
  const { state } = useContext(GlobalStateContext);
  return (
    <CharacterModal id={id} modalOpen={state.modalQueue[0] === id} speech="What's this? a new student? hmmm... I'll consider it. Tell me about yourself, drifter." modalAction={modalAction}>
      <ActionHeader type="warning" text="Sign Up to Save your Hero" />
      <BodyContent>
        <View p={3} backgroundColor="base.background">
          <Heading borderBottomWidth={2} borderColor="primary.900" textAlign="center">
            <Text fontSize="2xl" fontFamily="heading">
              The Hero's Initiation
            </Text>
          </Heading>
          <Box pl={10}>
            <Text strikeThrough={true} opacity={0.5}>
              1. Choose your Hero
            </Text>
            <Text>2. Create a HeroFit Account</Text>
            <Text>3. Confirm Email</Text>
            <Text>4. Choose Strava or Manual Mode</Text>
          </Box>
        </View>
      </BodyContent>
    </CharacterModal>
  );
};

export default SignupToSave;
