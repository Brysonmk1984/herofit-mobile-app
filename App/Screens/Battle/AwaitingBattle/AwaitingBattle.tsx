import React, { useState, useEffect, useContext, useMemo } from "react";
import { Pressable, useWindowDimensions } from "react-native";
import { MainStackProps } from "../../../common/types-navigator";
import { ScreenContainer } from "../../../Components/CustomComponents";
import VsSection from "./VsSection";
import HeroSection from "./HeroSection";
import FoeSection from "./FoeSection";
import { fetchBattleReport, runSpecificBattle } from "../../../api/battle";
import { getAvatar } from "../../../api/avatar";
import debugErrors from "../../../common/debugErrors";
import { GlobalStateContext } from "../../../store";
import { Hero } from "../../../common/types";
import { convertItemIdsToFullItems } from "../../../common/helperFunctions";
import ItemDetail from "../../Home/Components/BottomDrawer/HiddenInventory/Modals/ItemDetail";
import useModal from "../../../common/hooks/useModal";
import useAspectRatio from "../../../common/hooks/useAspectRatio";
import { CommonActions } from "@react-navigation/native";

const AwaitingBattle: React.FC<MainStackProps<"AwaitingBattle">> = ({ navigation, route }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const { deviceWidth, deviceHeight, deviceAspectType } = useMemo(() => useAspectRatio(), []);

  const { foe, rewards, character, isInstant } = route.params;
  const hero = state.hero as Hero;
  const { allGameItems, latestBattle } = state;
  const [pressedItem, setPressedItem] = useState(null);
  const { openModal } = useModal();

  async function handleNavigation() {
    if (isInstant) {
      try {
        // BATTLE ENDPOINT
        await runSpecificBattle({ avatarID: hero.id });

        // Get updated Hero and latest Battle Report
        const allPromises = Promise.all([getAvatar({ email: hero.owner }), fetchBattleReport({ avatarID: hero.id })]);
        const [p1, p2] = await allPromises;

        const { hero: updatedHero } = p1;
        const { latestBattle } = p2;

        // Takes item instance IDs and assigns full items to the hero under 'equipped' property
        // updates state with new avatar
        const equipped = convertItemIdsToFullItems(updatedHero.equipped, allGameItems);
        updatedHero.equipped = equipped;
        dispatch({ type: "SET HERO", payload: { hero: updatedHero } });
        dispatch({ type: "UPDATE LATEST BATTLE", payload: { latestBattle } });
        navigation.push("BattleReport", { battleReport: latestBattle });
      } catch (error) {
        return debugErrors(error);
      }
    } else {
      navigation.pop();
    }
  }

  useEffect(() => {
    const screenPop = setTimeout(() => {
      handleNavigation();
    }, 5000);

    return () => clearTimeout(screenPop);
  }, []);

  useEffect(() => {
    if (pressedItem) {
      openModal("AwaitingBattleItemDetail");
    }
  }, [pressedItem]);

  // Disable going back for instant battle items
  useEffect(() => {
    if (isInstant) {
      navigation.dispatch(state => {
        // Remove the AwaitingBattle route from the stack
        const routes = state.routes.filter(r => r.name !== "Home");

        return CommonActions.reset({
          ...state,
          routes,
          index: routes.length - 1,
        });
      });
    }
  }, [isInstant]);

  return (
    <ScreenContainer screenName={route.name}>
      <HeroSection rewards={rewards} height={deviceHeight} width={deviceWidth} setPressedItem={setPressedItem} handleNavigation={isInstant ? () => null : handleNavigation} />
      <FoeSection foe={foe} height={deviceHeight} width={deviceWidth} character={character} handleNavigation={isInstant ? () => null : handleNavigation} />
      <VsSection isLongPhone={deviceAspectType === "long"} height={deviceHeight} handleNavigation={isInstant ? () => null : handleNavigation} disableCountdown={isInstant ? true : false} />

      {pressedItem && <ItemDetail id="AwaitingBattleItemDetail" item={pressedItem} character={character} buttonText="OK" />}
    </ScreenContainer>
  );
};

export default AwaitingBattle;
