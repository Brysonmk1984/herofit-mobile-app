import React, { useContext, useState } from "react";
import { Text, Box, View, Link, HStack, VStack, Image } from "native-base";
import { CharacterModal } from "../../../Components/ModalTemplates/ModalTemplates";
import { BodyContent } from "../../../Components/ModalTemplates/BasicModal/Content";
import { GlobalStateContext } from "../../../store";
import { CharacterName, Foe, Hero, Item } from "../../../common/types";
import useModal from "../../../common/hooks/useModal";
import LoadingInPane from "../../../Components/LoadingInPane";
import useGlobalToast from "../../../common/hooks/useGlobalToast";
import debugErrors from "../../../common/debugErrors";
import { sendHeroToBattle } from "../../../api/battle";
import { ModalActionHeader } from "../../../Components/ModalTemplates/ModalActionHeader";
import * as WebBrowser from "expo-web-browser";
import Icon from "../../../Components/Icon";

interface GoToParams {
  foe: Foe;
  rewards: Item[] | null;
  character: CharacterName;
}
interface GoToBattleProps {
  id: string;
  goTo: (screen: string, params: GoToParams) => void;
  openBottomDrawerFromParent: () => void;
}

export const GoToBattle: React.FC<GoToBattleProps> = ({ id, goTo, openBottomDrawerFromParent }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const { openModal, closeModal } = useModal();
  const [loading, setLoading] = useState(false);
  const { addToast } = useGlobalToast();
  const { user, userStatus } = state;
  const hero = state.hero as Hero;

  let goToBattleOwlAdvice,
    goToBattleActionHeader,
    goToBattleActionText,
    disabledButton = false;

  if (hero.restedEnough) {
    goToBattleOwlAdvice = `The Dark Forces are ruthless adversaries with powerful abilities... attacking the mind and flesh! But I've trained you well, go get em!`;
    goToBattleActionHeader = "info";
    goToBattleActionText = "Battles happen automatically at 8 AM UTC";
    disabledButton = false;
  } else {
    goToBattleOwlAdvice = `HOO!! Look at you.. You are in no condition to battle the Dark Forces. Give your wounds time to heal, my young neonate.`;
    goToBattleActionHeader = "error";
    goToBattleActionText = "Health is too low!";
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
          goTo("AwaitingBattle", { foe, rewards, character: hero.character });
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

  function handlePotionLink() {
    closeModal("GoToBattle");
    openBottomDrawerFromParent();
  }

  return (
    <CharacterModal id={id} modalOpen={state.modalQueue[0] === id} speech={goToBattleOwlAdvice} buttonText="Go To Battle" disabled={disabledButton} modalAction={() => handleGoToBattle()} disabled={loading}>
      <ModalActionHeader type={goToBattleActionHeader} text={goToBattleActionText} />
      <BodyContent>
        <View>
          {hero.restedEnough ? (
            <VStack>
              <HStack space={5}>
                <Image source={require("../../../../assets/images/misc/photon_stack.webp")} size={50} alt="Photon Tokens" />
                <Box flex={1}>
                  <Text fontSize="md">Earn Photon Tokens, XP & items depending on the outcome</Text>
                </Box>
              </HStack>
              <HStack space={5}>
                <Image mt={2} source={require("../../../../assets/images/misc/quantum_points.webp")} size={50} alt="Photon Tokens" />
                <Box flex={1}>
                  <Text fontSize="md">How you exercise, spend your QP, and which pet you use drastically affect your battles</Text>
                </Box>
              </HStack>
              <HStack space={5}>
                <Icon iconName="knockout" size={50} />
                <Box flex={1}>
                  <Text fontSize="md">Losing will 'Knock Out' your hero and force a night off</Text>
                </Box>
              </HStack>
            </VStack>
          ) : (
            <Text>
              {hero.name} must have at least <Text color="base.highlight">{Math.ceil(hero.maxHealth * 0.8)}</Text> Health (80% recovered) before going to go to battle. Your current recovery rate is <Text color="base.highlight">{hero.healthRegenRate}</Text> health per hour. Heal faster with more Quantum Points in 'Recovery', or use a{" "}
              <Link mb={-1} onPress={handlePotionLink}>
                Health Potion
              </Link>
              .
            </Text>
          )}

          {loading ? (
            <LoadingInPane text="Preparing for battle..." />
          ) : (
            <Link onPress={() => WebBrowser.openBrowserAsync(`https://herofit.io/battles/`)} alignSelf="center" my={6} _text={{ fontSize: "xl" }}>
              Learn More
            </Link>
          )}
        </View>
      </BodyContent>
    </CharacterModal>
  );
};

export default GoToBattle;
