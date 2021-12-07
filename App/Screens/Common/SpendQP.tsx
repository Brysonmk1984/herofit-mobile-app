import React, { useState, useEffect, useContext, useReducer } from "react";
import { Alert } from "react-native";
import { Image, Pressable, FlatList, SectionList, Box, Center, ScrollView, View, Text, Heading, VStack, FormControl, Input, Link, Button, IconButton, HStack, Divider } from "native-base";
import { GlobalStateContext } from "../../store";
import spendQPReducer from "../../common/SpendQPReducer";
import { fetchAstrologySeason } from "../../api/calculate";
import debugErrors from "../../common/debugErrors";
import { Stats, Hero, HeroWithStats, SelectedHero, DefaultHeroProperties, ExistingHeroProperties, EachHeroProperty, ExistingHeroPropertiesAsUnion } from "../../common/types";
import { ScreenContainer, Header, Subheader, ScreenActionButton, LoreText, Pane, StatDisplay, Icon, HelperText } from "../../Components/CustomComponents";
import defaultStats from "../../common/defaultStats.json";
import { AuthStackProps } from "../../common/types-navigator";
import { DEFAULT_HERO_PROPERTIES, EXISTING_HERO_PROPERTIES } from "../../common/CONSTANTS";
import { isExistingHero, objectIsOfType } from "../../common/typeGuards";
import useDidMount from "../../common/hooks/useDidMount";
import { updateAvatarStats } from "../../api/avatar";
import useGlobalToast from "../../common/hooks/useGlobalToast";
import PaneSupportText from "../../Components/PaneSupportText";
import usePrevious from "../../common/hooks/usePrevious";
import AttributeDetail from "../../Components/Modals/AttributeDetail";
import useModal from "../../common/hooks/useModal";

const SpendQP = ({ route, navigation }: AuthStackProps<"SpendQP">) => {
  // Global State
  const { state, dispatch } = useContext(GlobalStateContext);
  const { mounted } = useDidMount();
  // Hero is passed as a route param if it's a new user, otherwise grab the hero from state
  const hero = route.params?.hero ?? state.hero;
  const userStatus = state.userStatus;
  const existingHero = isExistingHero(hero);
  const { addToast } = useGlobalToast();
  const { openModal } = useModal();
  // Used for more detail modal only
  const [selectedAttribute, setSelectedAttribute] = useState(null);

  let initialState: Stats = (() => {
    if (existingHero) {
      const existingHeroStats = (({ qp, power, health, maxHealth, armor, recovery, fire, earth, water, air, aether, qpPower, qpHealth, qpArmor, qpRecovery, qpFire, qpEarth, qpAir, qpWater, qpAether }) => ({ qp, power, health, maxHealth, armor, recovery, fire, earth, water, air, aether, qpPower, qpHealth, qpArmor, qpRecovery, qpFire, qpEarth, qpAir, qpWater, qpAether }))(hero);
      return existingHeroStats;
    } else {
      return { qp: 10, power: 100, health: 100, maxHealth: 100, armor: 0, recovery: 5, fire: 0, earth: 0, water: 0, air: 0, aether: 0, qpPower: 0, qpHealth: 0, qpArmor: 0, qpRecovery: 0, qpFire: 0, qpEarth: 0, qpAir: 0, qpWater: 0, qpAether: 0 };
    }
  })();

  const [qpState, qpDispatch] = useReducer(spendQPReducer, initialState);
  const prevQp = usePrevious(qpState.qp);
  const attributes = ["Power", "Health", "Armor", "Recovery", "Fire", "Earth", "Water", "Air", "Aether"];
  const qpAttributes = attributes.map(attr => {
    const lcAttr = attr.toLowerCase();
    return {
      stat: attr,
      value: attr === "Health" ? qpState["maxHealth"] : qpState[lcAttr],
      descriptionShort: defaultStats.find(item => item.stat === attr).descriptionShort,
    };
  });

  async function _handleStatSave() {
    if (prevQp === qpState.qp) {
      return navigation.pop();
    }

    try {
      const updatedHero: Hero = Object.assign({}, hero, { ...qpState }) as unknown as Hero;

      const data = await updateAvatarStats({ avatar: updatedHero, email: state.user.email, id: state.user.id });

      // Only used for epic elemental skins at the moment
      if (data.length) {
        data.forEach(reward => {
          addToast("success", `EARNED ITEM: ${reward.name} ${reward.type}, ${reward.description}`);
        });
      }

      dispatch({ type: "SET HERO", payload: { hero: updatedHero } });
      addToast("success", "Quantum Points Activated!");
      return navigation.pop();
    } catch (error) {
      debugErrors(error, state.user);
      return addToast("error", error.message);
    }
  }

  function _handleNewUserStatFinish() {
    // prettier-ignore
    interface QpDefaults { aether: number; air: number; armor: number; earth: number; fire: number; health: number; power: number; qp: number; qpAether: number; qpAir: number; qpArmor: number; qpEarth: number; qpFire: number; qpHealth: number; qpPower: number; qpRecovery: number; qpWater: number; recovery: number; water: number; }
    const updatedHero: SelectedHero & QpDefaults & { name: string } = Object.assign({}, hero, { ...qpState });
    const updatedHeroWithDefaults: HeroWithStats & DefaultHeroProperties = Object.assign(DEFAULT_HERO_PROPERTIES, updatedHero);

    dispatch({ type: "SET HERO", payload: { hero: updatedHeroWithDefaults } });
    dispatch({ type: "SET INITIAL HOMESCREEN LOAD", payload: { initialHomescreenLoad: "Home" } });
  }

  useEffect(() => {
    if (userStatus === "new") {
      // Fetch Astrology season for initial bonus based on season
      (async () => {
        try {
          const elmPackage = await fetchAstrologySeason({ date: null });
          const sign = elmPackage.sign;
          const element = elmPackage.element.toLowerCase();

          qpDispatch({ type: "ASTRO INCREMENT BY 5", payload: { stat: element } });
          addToast("info", `+5 ${element} bonus for ${sign} season!`);
        } catch (error) {
          debugErrors(error);
        }
      })();
    }
  }, [userStatus]);

  useEffect(() => {
    if (mounted) {
      if (existingHero) {
        // After a stat is incremented on screen and in the spendQpReducer, if no more qp left, save adjusted hero changes to DB
        if (prevQp !== qpState.qp && qpState.qp === 0) {
          _handleStatSave();
        }
      } else {
        // For new users, only save values to DB after all completed
        if (qpState.qp === 0) {
          _handleNewUserStatFinish();
        }
      }
    }
  }, [mounted, qpState.qp, prevQp]);

  useEffect(() => {
    if (selectedAttribute) {
      openModal("AttributeDetail");
    }
  }, [selectedAttribute]);

  // If a user finished setting inital stats, redirect them to home
  // These needs to happen after global state is updated
  useEffect(() => {
    if (state.initialHomescreenLoad === "Home") {
      navigation.push("Home");
    }
  }, [state.initialHomescreenLoad]);

  return (
    <ScreenContainer screenName={route.name}>
      <Header text={`Quantum Points [${qpState.qp}]`} mt={3} mb={-2} />

      <FlatList
        ListHeaderComponent={
          userStatus === "new" && (
            <Pane mt={5}>
              <PaneSupportText iconName="info" iconColor="base.info" text="Stat points affect your battles and recovery">
                But don't worry about picking the best stats; you can always reset your points later on with a Retrocausal Capsule
              </PaneSupportText>
            </Pane>
          )
        }
        data={qpAttributes.filter(item => {
          // Aether should only be present for existing users who are over 100
          if (item.stat === "Aether") {
            if (existingHero) {
              return hero.level >= 100 ? true : false;
            }
            return false;
          }
          return true;
        })}
        keyExtractor={(item, i) => i.toString()}
        renderItem={({ item }) => {
          const lcStatName = item.stat.toLowerCase();
          const disabled = qpState.qp === 0;
          return (
            <Box borderRadius={14} bg={`base.${lcStatName}`} m={3} shadow={5}>
              <HStack alignItems="center" space={0}>
                <View flex={4}>
                  <StatDisplay iconWatermark reversedText={lcStatName === "aether" ? false : true} stat={item.stat} value={item.value} description={item.descriptionShort} setSelectedAttribute={setSelectedAttribute} />
                </View>

                {!disabled && (
                  <Pressable ml={2} alignItems="center" justifyContent="center" h={100} borderTopRightRadius={13} borderBottomRightRadius={13} flex={1} bg="base.white" onPress={() => qpDispatch({ type: "INCREMENT VALUE", payload: { stat: lcStatName === "health" ? "maxHealth" : lcStatName } })}>
                    <Text textAlign="center" fontSize={65}>
                      +
                    </Text>
                  </Pressable>
                )}
              </HStack>
            </Box>
          );
        }}
      />
      <ScreenActionButton text="Done" action={() => (existingHero ? _handleStatSave() : _handleNewUserStatFinish())} />
      {selectedAttribute && <AttributeDetail id="AttributeDetail" attribute={selectedAttribute} />}
    </ScreenContainer>
  );
};

export default SpendQP;
