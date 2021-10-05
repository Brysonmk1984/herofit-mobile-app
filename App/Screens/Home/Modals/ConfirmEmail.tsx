import React, { useContext, useEffect, useState } from "react";
import { Heading, Box, View, Text, ScrollView, Link } from "native-base";
import * as MailComposer from "expo-mail-composer";
import { BasicModal } from "../../../Components/ModalTemplates/ModalTemplates";
import { ActionHeader, BodyContent } from "../../../Components/ModalTemplates/BasicModal/Content";
import { GlobalStateContext } from "../../../store";
import HeroInitiationChecklist from "./Components/HeroInitiationChecklist";
import { resendEmailConfirmation } from "../../../api/authentication";
import debugErrors from "../../../common/debugErrors";
import { makeRedirectUri } from "expo-auth-session";
import { LoadingInPane } from "../../../Components/CustomComponents";
import { getUser } from "../../../api/user";
import useModal from "../../../common/hooks/useModal";
import useGlobalToast from "../../../common/hooks/useGlobalToast";

interface ConfirmEmailProps {
  id: string;
  modalAction?: () => void;
}

const ConfirmEmail: React.FC<ConfirmEmailProps> = ({ id, modalAction }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const { openModal, closeModal } = useModal();
  const [loading, setLoading] = useState(false);
  const [disableButton, setDisableButton] = useState(true);
  const [showChecklist, setShowChecklist] = useState(false);
  const { addToast } = useGlobalToast();
  // const [request, response, promptAsync] = useAuthRequest(
  //   {
  //     redirectUri: makeRedirectUri({
  //       // For usage in bare and standalone
  //       // the "redirect" must match your "Authorization Callback Domain" in the Strava dev console.
  //       //native: "your.app://redirect",
  //       useProxy: false,
  //       native: "herofit://test",
  //     }),
  //   },
  //   discovery,
  // );

  function resendEmailLink() {
    try {
      resendEmailConfirmation({ email: state.user.email, isMobileApp: true }).then(data => {
        addToast("success", "Please check your email to verify account. Check your spam folder if the message is not in your inbox. Sometimes the email takes a few minutes to arrive.");
      });
    } catch (error) {
      addToast("error", error.message);
      return debugErrors(error);
    }
  }

  async function handleEmailConfirmed() {
    setLoading(true);

    try {
      // * First time the user is assigned
      const { user } = await getUser({ email: state.user.email });

      if (user.active) {
        dispatch({ type: "SET USER", payload: { user, isSignedIn: true } });
        dispatch({ type: "SET HERO", payload: { hero: { ...state.hero } } });
        dispatch({ type: "SET USER STATUS", payload: { userStatus: user.active ? "active" : "unconfirmed" } });
        closeModal("ChooseActivityEntry");
      } else {
        addToast("error", "Email Has not been confirmed; please click the link in your inbox.");
      }
      setLoading(false);
    } catch (error) {
      debugErrors(error, state.user);
      setLoading(false);
    }
  }

  useEffect(() => {
    // setTimeout(() => {
    //   setShowChecklist(false);
    // }, 4000);
    // Timeout is only to prevent the user from clicking the action button right away without checking email
    setTimeout(() => {
      setDisableButton(false);
    }, 8000);
  }, []);

  return (
    <BasicModal id={id} modalOpen={state.modalQueue[0] === id} modalAction={() => handleEmailConfirmed()} disabled={disableButton} title="Please Confirm Your Email!" buttonText="Ok, I did it!" preventClose={state.userStatus === "unconfirmed" ? true : false}>
      <ActionHeader type="warning" text="Must click the link in your email" />
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

        {loading && <LoadingInPane text="Confirming Email..." />}
      </BodyContent>
    </BasicModal>
  );
};

export default ConfirmEmail;
