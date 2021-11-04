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
import * as WebBrowser from "expo-web-browser";

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
  const [result, setResult] = useState(null);

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
    console.log("ASD", state.user.email);
    setLoading(true);

    try {
      // * First time the user is assigned
      const { user } = await getUser({ email: state.user.email });
      console.log("THE USER", user);
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
      console.log("HERE", error);
      debugErrors(error, state.user);
      setLoading(false);
    }
  }

  // async function openEmailApp() {
  //   try {
  //     await MailComposer.composeAsync({});
  //   } catch (error) {
  //     if (error.toString() === "Error: Mail services are not available. Make sure you're signed into the Mail app") {
  //       return addToast("error", "Mail services are not available. Make sure you're signed into the Mail app");
  //     }
  //     return addToast("error", "Unable to use Phone's mail application, try verifying through a web browser.");
  //   }
  // }

  // async function openWebBrowser() {
  //   try {
  //     let result = await WebBrowser.openBrowserAsync();
  //     setResult(result);
  //     console.log("RESULT=", result);
  //   } catch (error) {
  //     console.log("ERRRROR", error);
  //   }
  // }

  useEffect(() => {
    if (state.modalQueue[0] === id) {
      // Timeout is only to prevent the user from clicking the action button right away without checking email
      const disableButtonTimeout = setTimeout(() => {
        setDisableButton(false);
      }, 10000);

      return () => clearTimeout(disableButtonTimeout);
    }
  }, [state.modalQueue[0]]);

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
            {/* <Link p={1} justifyContent={"center"} _text={{ fontSize: "2xl", textDecoration: "underline" }} onPress={openEmailApp} mt={1}>
              Open Email App
            </Link>
            <Link mb={3} p={1} justifyContent={"center"} _text={{ fontSize: "2xl", textDecoration: "underline" }} onPress={openWebBrowser} mt={1}>
              Open Web Browser
            </Link> */}

            <Text textAlign="center" fontSize="xl">
              Go ahead, we'll wait!
            </Text>
            <Link display={disableButton ? "none" : "flex"} p={3} justifyContent={"center"} _text={{ fontSize: "lg", textDecoration: "underline" }} onPress={resendEmailLink} mt={1}>
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
