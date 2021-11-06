import React, { useContext, useState } from "react";
import { Heading, Text, Box, View, Pressable, Link } from "native-base";
import { CharacterModal } from "../../../Components/ModalTemplates/ModalTemplates";
import { BodyContent } from "../../../Components/ModalTemplates/BasicModal/Content";
import { GlobalStateContext } from "../../../store";
import { CharacterName, Foe, Hero, Item, UserStatus } from "../../../common/types";
import useModal from "../../../common/hooks/useModal";
import LoadingInPane from "../../../Components/LoadingInPane";
import useGlobalToast from "../../../common/hooks/useGlobalToast";
import debugErrors from "../../../common/debugErrors";
import { sendHeroToBattle } from "../../../api/battle";
import { ModalActionHeader } from "../../../Components/ModalTemplates/ModalActionHeader";
import * as WebBrowser from "expo-web-browser";

interface GoToParams {
  foe: Foe;
  rewards: Item[] | null;
  character: CharacterName;
}
interface GoToBattleProps {
  id: string;
  goTo: (navigator: string, options: { screen: string; params: GoToParams }) => void;
}

export const GoToBattle: React.FC<GoToBattleProps> = ({ id, goTo }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const { openModal, closeModal } = useModal();
  const [loading, setLoading] = useState(false);
  const { addToast } = useGlobalToast();
  const { user, userStatus } = state;
  const hero = state.hero as Hero;

  let goToBattleOwlAdvice,
    goToBattleActionHeader,
    goToBattleActionText,
    goToBattleText,
    disabledButton = false;

  if (userStatus === "unconfirmed") {
    goToBattleOwlAdvice = `Hooo! You may think you're ready for battke, but you must do something for me first!`;
    goToBattleActionHeader = "caution";
    goToBattleActionText = "Action Required - Verify Account";
    goToBattleText = "Before you can go to battle, you must verify your account by clicking the link sent to your email.";
    disabledButton = true;
  } else if (hero.restedEnough) {
    goToBattleOwlAdvice = `The Dark Forces are ruthless adversaries with powerful abilities... attacking the mind and flesh! But I've trained you well, go get em!`;
    goToBattleActionHeader = "info";
    goToBattleActionText = "Battles happen automatically at 2 AM MST \n (for Europeans, that's 10 am CET)";
    goToBattleText = "\u2022 Earn XP, Photon Tokens, & items depending on the outcome \n\n  \u2022 How you exercise, spend your QP, and which pet you use drastically affect your battles \n\n    \u2022 Losing will 'Knock Out' your hero and force a night off ";
    disabledButton = false;
  } else {
    goToBattleOwlAdvice = `You are in no condition to battle the Dark Forces. Give your wounds time to heal, my young student.`;
    goToBattleActionHeader = "error";
    goToBattleActionText = "Health is too low!";
    goToBattleText = `${hero.name} must have at least ${Math.ceil(hero.maxHealth * 0.8)} Health (80% recovered) before going to go to battle. Your current recovery rate is ${hero.healthRegenRate} health per hour. Heal faster with more Quantum Points in 'Recovery', or buy a Health Potion.`;
    disabledButton = true;
  }

  async function handleGoToBattle() {
    // CREATE BATTLE AND UPDATE STATUS OF AVATAR
    if (hero.goToBattle === false) {
      setLoading(true);
      try {
        const { foe, rewards, goToBattle } = await sendHeroToBattle({ email: user.email, avatar: hero });

        dispatch({ type: "SET HERO", payload: { hero: { ...hero, goToBattle } } });

        setLoading(false);
        setTimeout(() => {
          closeModal("GoToBattle");
          goTo("App", { screen: "AwaitingBattle", params: { foe, rewards, character: hero.character } });
        }, 500);
      } catch (error) {
        error.message = "Unable to go to Battle, please try again later.";
        setLoading(false);
        closeModal("GoToBattle");
        addToast("error", error.message);
        return debugErrors(error, user);
      }
    }
  }

  return (
    <CharacterModal id={id} modalOpen={state.modalQueue[0] === id} speech={goToBattleOwlAdvice} buttonText="Go To Battle" disabled={disabledButton} modalAction={() => handleGoToBattle()}>
      <ModalActionHeader type={goToBattleActionHeader} text={goToBattleActionText} />
      <BodyContent>
        <View px={3}>
          <Text fontSize="md">{goToBattleText}</Text>

          <Link onPress={() => WebBrowser.openBrowserAsync(`https://herofit.io/battles/`)} alignSelf="center" my={3} _text={{ fontSize: "xl" }}>
            Learn More
          </Link>

          {loading && <LoadingInPane text="Preparing for battle..." />}
        </View>
      </BodyContent>
    </CharacterModal>
  );
};

export default GoToBattle;
