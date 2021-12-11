import React, { useContext, useEffect, useState } from "react";
import { View, Text, ScrollView, Link } from "native-base";
import { BasicModal } from "../../../Components/ModalTemplates/ModalTemplates";
import { BodyContent } from "../../../Components/ModalTemplates/BasicModal/Content";
import { GlobalStateContext } from "../../../store";
import HeroInitiationChecklist from "./Components/HeroInitiationChecklist";
import { resendEmailConfirmation } from "../../../api/authentication";
import debugErrors from "../../../common/debugErrors";
import { LoadingInPane } from "../../../Components/CustomComponents";
import { getUser } from "../../../api/user";
import useModal from "../../../common/hooks/useModal";
import useGlobalToast from "../../../common/hooks/useGlobalToast";
import { ModalActionHeader } from "../../../Components/ModalTemplates/ModalActionHeader";
import useSignOut from "../../../common/hooks/useSignout";
import { Alert } from "react-native";

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
  const { signOut } = useSignOut();
  const { addToast } = useGlobalToast();

  function resendEmailLink() {
    try {
      resendEmailConfirmation({ email: state.user.email, isMobileApp: true }).then(data => {
        addToast("success", "Please check your email to verify account. Check your spam folder if the message is not in your inbox. Sometimes the email takes a few minutes to arrive.", 5000);
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
      console.log("HERE", error);
      debugErrors(error, state.user);
      setLoading(false);
    }
  }

  function _handleSignout() {
    Alert.alert(
      "Warning!",
      `If you close this window without confirming your email, you'll be redirected to the login screen.`,
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => {},
        },
        {
          text: "I understand",
          onPress: () => {
            signOut();
          },
        },
      ],
      { cancelable: true },
    );
  }

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
    <BasicModal id={id} modalOpen={state.modalQueue[0] === id} modalAction={() => handleEmailConfirmed()} disabled={disableButton} title="Please Confirm Your Email!" buttonText="Ok, I did it!" closeModalAction={state.userStatus === "unconfirmed" ? () => _handleSignout() : undefined} hideCloseButton={true}>
      <ModalActionHeader type="caution" text="Must click the link in your email" />
      <BodyContent>
        {showChecklist ? (
          <ScrollView>
            <HeroInitiationChecklist crossedOut={[true, true]} />
          </ScrollView>
        ) : (
          <View>
            <Text textAlign="center" fontSize="xl" my={7}>
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
