import React, { useContext, useEffect, useState } from "react";
import { Heading, Box, View, Text, ScrollView } from "native-base";
import { BasicModal } from "../../../Components/ModalTemplates/ModalTemplates";
import { ActionHeader, BodyContent } from "../../../Components/ModalTemplates/BasicModal/Content";
import { GlobalStateContext } from "../../../store";

interface ConfirmEmailProps {
  id: string;
  modalAction: () => void;
}

const ConfirmEmail: React.FC<ConfirmEmailProps> = ({ id, modalAction }) => {
  const { state } = useContext(GlobalStateContext);
  const [disableButton, setDisableButton] = useState(true);

  useEffect(() => {
    // Timeout is only to prevent the user from clicking the action button right away without checking email
    setTimeout(() => {
      setDisableButton(false);
    }, 4000);
  }, []);

  return (
    <BasicModal id={id} modalOpen={state.modalQueue[0] === id} modalAction={() => modalAction()} disabled={disableButton} title="Please Confirm Your Email!" buttonText="Ok, I did it!" preventClose={state.userStatus === "unconfirmed" ? true : false}>
      <ActionHeader type="warning" text="Confirm Email & Receive +5 QP" />
      <BodyContent>
        <ScrollView>
          <View p={3} backgroundColor="base.background" alignItems="center">
            <Text fontWeight="bold">Please click the link in your inbox at: </Text>
            <Text my={3} color="base.highlight">
              {state.user?.email}
            </Text>
            <Text fontSize="xs" fontStyle="italic">
              *Be sure to check the spam folder if it's not there.
            </Text>
          </View>
          <View>
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
              <Text>3. Confirm Email</Text>
              <Text>4. Choose Strava or Manual Mode</Text>
            </Box>
          </View>
        </ScrollView>
      </BodyContent>
    </BasicModal>
  );
};

export default ConfirmEmail;
