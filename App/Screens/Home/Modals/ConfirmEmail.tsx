import React, { useContext, useEffect, useState } from "react";
import { Heading, Box, View, Text, ScrollView, Link } from "native-base";
import * as MailComposer from "expo-mail-composer";
import { BasicModal } from "../../../Components/ModalTemplates/ModalTemplates";
import { ActionHeader, BodyContent } from "../../../Components/ModalTemplates/BasicModal/Content";
import { GlobalStateContext } from "../../../store";
import HeroInitiationChecklist from "./Components/HeroInitiationChecklist";
import { resendEmailConfirmation } from "../../../api/authentication";
import { updateAlerts } from "../../../common/alerts";
import debugErrors from "../../../common/debugErrors";
import { makeRedirectUri } from "expo-auth-session";

interface ConfirmEmailProps {
  id: string;
  modalAction: () => void;
}

const ConfirmEmail: React.FC<ConfirmEmailProps> = ({ id, modalAction }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const [disableButton, setDisableButton] = useState(true);
  const [showChecklist, setShowChecklist] = useState(true);
  console.log(state.user.email);

  const [request, response, promptAsync] = useAuthRequest(
    {
      redirectUri: makeRedirectUri({
        // For usage in bare and standalone
        // the "redirect" must match your "Authorization Callback Domain" in the Strava dev console.
        //native: "your.app://redirect",
        useProxy: false,
        native: "herofit://test",
      }),
    },
    discovery,
  );

  function resendEmailLink() {
    try {
      resendEmailConfirmation({ email: state.user.email, isMobileApp: true }).then(data => {
        updateAlerts([{ type: "success", message: "Please check your email to verify account. Check your spam folder if the message is not in your inbox. Sometimes the email takes a few minutes to arrive." }], state, dispatch);
      });
    } catch (error) {
      updateAlerts([{ type: "error", message: error.message }], state, dispatch);
      return debugErrors(error);
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setShowChecklist(false);
    }, 4000);
    // Timeout is only to prevent the user from clicking the action button right away without checking email
    setTimeout(() => {
      setDisableButton(false);
    }, 8000);
  }, []);

  return (
    <BasicModal id={id} modalOpen={state.modalQueue[0] === id} modalAction={() => modalAction()} disabled={disableButton} title="Please Confirm Your Email!" buttonText="Ok, I did it!" preventClose={state.userStatus === "unconfirmed" ? true : false}>
      <ActionHeader type="warning" text="Confirm Email & Receive +5 QP" />
      <BodyContent>
        {showChecklist ? (
          <ScrollView>
            <HeroInitiationChecklist crossedOut={[true, true]} />
          </ScrollView>
        ) : (
          <View>
            <Link p={1} justifyContent={"center"} _text={{ fontSize: "2xl", textDecoration: "underline" }} onPress={() => MailComposer.composeAsync({})} mt={1}>
              Open Email App
            </Link>
            <Link p={1} justifyContent={"center"} _text={{ fontSize: "2xl", textDecoration: "underline" }} onPress={() => resendEmailLink()} mt={1}>
              Resend Link
            </Link>
          </View>
        )}
      </BodyContent>
    </BasicModal>
  );
};

export default ConfirmEmail;
