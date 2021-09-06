import React, { useContext, useEffect, useState, createRef } from "react";
import { Image, Pressable, FlatList, SectionList, Box, Center, View, Text, Heading, VStack, FormControl, Input, Link, Button, IconButton, HStack, Divider, ScrollView, Radio } from "native-base";
import ScreenContainer from "../../Components/ScreenContainer/ScreenContainer";
import debugErrors from "../../common/debugErrors";
import { GlobalStateContext } from "../../store";
import { Item } from "../../common/types";
import { MainDrawerProps } from "../../common/types-navigator";
import { CharacterModal, FeedbackModal, BasicModal } from "../../Components/Modal/Modals";
import { ActionHeader, BodyContent } from "../../Components/Modal/Content";
import useModal from "../../common/hooks/useModal";
import FeedbackChoiceForm from "../../Components/Forms/FeedbackChoiceForm";
import { getUser } from "../../api/user";
import { updateAlerts } from "../../common/alerts";
import { ActivityEntrySelect } from "../../Components/Forms/ActivityEntrySelect";
import { insertManualDataSrcId, insertStravaCredentials } from "../../api/authentication";
import updateDataSrcId from "./AuthFinalSteps/AuthFlow";
import StravaConnect from "./AuthFinalSteps/StravaConnect";

const Home: React.FC<MainDrawerProps<"Home">> = ({ navigation, route }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const { openModal, closeModal } = useModal();
  const [emailUnconfirmed, setEmailUnconfirmed] = useState(false);
  const [activityRadioValue, setActivityRadioValue] = useState(null);
  const { name, status, health, maxHealth, activityXP, battleXP, photonTokens, goToBattle, equipped, qp } = state.hero;

  function renderItem({ item }: Item) {
    return (
      <View>
        <Text>{item.name}</Text>
      </View>
    );
  }

  function renderHeroDetails() {
    return (
      <View>
        <Text>Hero Name: {name}</Text>
        <Text>Status: {status}</Text>
        <Text>
          Health: {health} / {maxHealth}
        </Text>
        <Text>XP: {activityXP + battleXP}</Text>
        <Text>PT: {photonTokens}</Text>
        <Text>Awaiting Battle: {String(goToBattle)}</Text>
        <FlatList data={equipped} renderItem={renderItem} keyExtractor={(item, i) => i.toString()} />
        <Button
          onPress={() => {
            openModal("confirmEmail");
          }}
        >
          Open Modal
        </Button>

        <Button
          onPress={() => {
            openModal("levelUp");
          }}
        >
          Open Modal
        </Button>
      </View>
    );
  }

  async function handleEmailConfirmed() {
    console.log("myaction!");
    try {
      // * First time the user is assigned
      const { user } = await getUser({ email: state.user.email });
      console.log("UPDATED USER!", user);
      if (user.active) {
        dispatch({ type: "SET USER", payload: { user } });
        dispatch({ type: "SET HERO", payload: { hero: { ...state.hero, qp: qp + 5 } } });

        setTimeout(() => {
          closeModal("confirmEmail");
          openModal("ChooseActivityLogging");
        }, 3000);
        // Open next modal
      } else {
        updateAlerts([{ type: "error", message: "Email Has not been confirmed; please click the link in your inbox." }], state, dispatch);
      }
    } catch (error) {
      debugErrors(error, state.user);
    }
  }

  useEffect(() => {
    //console.log("SU", state.userStatus, state.user);
    if (state.userStatus === "new") {
      setTimeout(() => {
        openModal("SignUp");
      }, 2000);
    } else if (state.userStatus === "unconfirmed") {
      setEmailUnconfirmed(true);
      setTimeout(() => {
        openModal("ConfirmEmail");
        // Timeout is only to prevent the user from clicking the action button right away without checking email
        setTimeout(() => {
          setEmailUnconfirmed(false);
        }, 4000);
      }, 2000);
    } else if (state.user === null || !state.user.dataSrcId) {
      //console.log("!!!!IN", state.user?.dataSrcId);
      openModal("ChooseActivityEntry");
      // setTimeout(() => {

      //   openModal("ChooseActivityEntry");
      // }, 2000);
    }
  }, []);

  return (
    <ScreenContainer screenName={route.name}>
      {renderHeroDetails()}
      {/* SIGNUP MODAL */}
      <CharacterModal id="SignUp" modalOpen={state.modalQueue[0] === "SignUp"} speech="What's this? a new student? hmmm... I'll consider it. Tell me about yourself, drifter." modalAction={() => navigation.push("Register")}>
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

      {/* CONFIRM EMAIL MODAL */}
      <BasicModal id="ConfirmEmail" modalOpen={state.modalQueue[0] === "ConfirmEmail"} modalAction={handleEmailConfirmed} disabled={emailUnconfirmed} title="Please Confirm Your Email!" buttonText="Ok, I did it!">
        <ActionHeader type="warning" text="Confirm Email & Receive +5 QP" />
        <BodyContent>
          {emailUnconfirmed ? (
            <View p={3} backgroundColor="base.background" alignItems="center">
              <Text fontWeight="bold">Please click the link in your inbox at: </Text>
              <Text my={7} color="base.highlight">
                {state.user?.email}
              </Text>
              <Text fontSize="xs" fontStyle="italic">
                *Be sure to check the spam folder if it's not there.
              </Text>
            </View>
          ) : (
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
          )}
        </BodyContent>
      </BasicModal>

      {/* ACTIVITY ENTRY MODAL */}
      <CharacterModal id="ChooseActivityEntry" modalOpen={state.modalQueue[0] === "ChooseActivityEntry"} speech="Now that you're a pupil in my Dojo?, we'll need to hold you accountable!" modalAction={() => updateDataSrcId(state.user?.email, activityRadioValue)} disabled={!state.user?.dataSrcId}>
        <ActionHeader type="info" text="How will you log activities?" />
        <BodyContent>
          <ActivityEntrySelect activityRadioValue={activityRadioValue} setActivityRadioValue={setActivityRadioValue} />
          {activityRadioValue === "Strava" && <StravaConnect />}
        </BodyContent>
      </CharacterModal>

      {/* <BasicModal id="patchUpdate" modalOpen={state.modalQueue[0] === "patchUpdate"} title="BIG SURPRISE!">
        <BodyContent>
          <Text>THE CONTENT</Text>
        </BodyContent>
      </BasicModal> */}

      {/* <FeedbackModal id="feedback" modalOpen={state.modalQueue[0] === "feedback"} title="Quick Question">
        <FeedbackChoiceForm id="feedback" title={"How would you feel if you could never play HeroFit again?"} postSubmitAction={() => formActionHappens("feedback")} />
      </FeedbackModal> */}

      <Button onPress={() => navigation.toggleDrawer()}>Drawer</Button>
    </ScreenContainer>
  );
};

export default Home;
