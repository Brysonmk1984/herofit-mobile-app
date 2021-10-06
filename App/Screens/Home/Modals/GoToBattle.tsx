import React, { useContext } from "react";
import { Heading, Text, Box, View } from "native-base";
import { CharacterModal } from "../../../Components/ModalTemplates/ModalTemplates";
import { ActionHeader, BodyContent } from "../../../Components/ModalTemplates/BasicModal/Content";
import { GlobalStateContext } from "../../../store";
import { Hero, UserStatus } from "../../../common/types";

interface GoToBattleProps {
  id: string;
  userStatus: UserStatus;
  modalQueue: string[];
  hero: Hero;
  modalAction: () => void;
}

export const GoToBattle: React.FC<GoToBattleProps> = ({ id, userStatus, modalQueue, hero, modalAction = { modalAction } }) => {
  //const { state } = useContext(GlobalStateContext);

  let goToBattleOwlAdvice,
    goToBattleActionHeader,
    goToBattleActionText,
    goToBattleText,
    disabledButton = false;

  if (userStatus === "unconfirmed") {
    goToBattleOwlAdvice = `Hooo! You may think you're ready for battke, but you must do something for me first!`;
    goToBattleActionHeader = "warning";
    goToBattleActionText = "Action Required - Verify Account";
    goToBattleText = "Before you can go to battle, you must verify your account by clicking the link sent to your email.";
    disabledButton = true;
  } else if (hero.restedEnough) {
    goToBattleOwlAdvice = `The Dark Forces are ruthless adversaries with powerful abilities... attacking the mind and flesh! But I've trained you well, go get em!`;
    goToBattleActionHeader = "info";
    goToBattleActionText = "Battles happen automatically at 2 AM MST \n (for Europeans, that's 10 am CET)";
    goToBattleText = "\u2022 Earn XP, Photon Tokens, & items depending on the outcome \n \u2022 How you exercise, spend your QP, and which pet you use drastically affect your battles \n   \u2022 Losing will 'Knock Out' your hero and force a night off ";
    disabledButton = false;
  } else {
    goToBattleOwlAdvice = `You are in no condition to battle the Dark Forces. Give your wounds time to heal, my young student.`;
    goToBattleActionHeader = "error";
    goToBattleActionText = "Health is too low!";
    goToBattleText = `${hero.name} must have at least ${Math.ceil(hero.maxHealth * 0.8)} Health (80% recovered) before going to go to battle. Your current recovery rate is ${hero.healthRegenRate} health per hour. Heal faster with more Quantum Points in 'Recovery', or Buy a Health Potion.`;
    disabledButton = true;
  }

  return (
    <CharacterModal id={id} modalOpen={modalQueue[0] === id} speech={goToBattleOwlAdvice} buttonText="Go To Battle" disabled={disabledButton} modalAction={modalAction}>
      <ActionHeader type={goToBattleActionHeader} text={goToBattleActionText} />
      <BodyContent>
        <View px={5}>
          <Text fontSize="md">{goToBattleText}</Text>
        </View>
      </BodyContent>
    </CharacterModal>
  );
};

export default GoToBattle;
