import React, { useContext } from "react";
import { Heading, Text, Box } from "native-base";
import { CharacterModal } from "../../../Components/ModalTemplates/ModalTemplates";
import { ActionHeader, BodyContent } from "../../../Components/ModalTemplates/BasicModal/Content";
import { GlobalStateContext } from "../../../store";

interface SignupFinishedProps {
  id: string;
}

// SIGNUP PROCESS ALL FINISHED
const SignupFinished: React.FC<SignupFinishedProps> = ({ id }) => {
  const { state } = useContext(GlobalStateContext);
  return (
    <CharacterModal id={id} modalOpen={state.modalQueue[0] === id} speech="Promise you show great amounts of, my fledgling. Now Go do your exercises!" buttonText="OK, GREAT!">
      <ActionHeader type="success" text="All Done!" />
      <BodyContent>
        <Heading borderBottomWidth={2} borderColor="primary.900" textAlign="center">
          <Text fontSize="2xl" fontFamily="heading">
            The Hero's Initiation
          </Text>
        </Heading>
        <Box pl={10}>
          <Text strikeThrough={true} opacity={0.5}>
            1. Choose your Hero
          </Text>
          <Text strikeThrough={true} opacity={0.5}>
            2. Create a HeroFit Account
          </Text>
          <Text strikeThrough={true} opacity={0.5}>
            3. Confirm Email
          </Text>
          <Text strikeThrough={true} opacity={0.5}>
            4. Choose Strava or Manual Mode
          </Text>
        </Box>
      </BodyContent>
    </CharacterModal>
  );
};

export default SignupFinished;
