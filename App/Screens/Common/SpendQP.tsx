import React, { useState, useEffect, useContext, useReducer } from "react";
import { Image, Pressable, FlatList, SectionList, Box, Center, ScrollView, View, Text, Heading, VStack, FormControl, Input, Link, Button, IconButton, HStack, Divider } from "native-base";
import { GlobalStateContext } from "../../store";
import spendQPReducer from "../../common/SpendQPReducer";
import { updateAlerts } from "../../common/alerts";
import { fetchAstrologySeason } from "../../api/calculate";
import debugErrors from "../../common/debugErrors";
import { Stats, HeroTemplate, Hero, HeroWithStats, SelectedHero, DefaultHeroProperties, ExistingHeroProperties, EachHeroProperty, ExistingHeroPropertiesAsUnion } from "../../common/types";
import { ScreenContainer, Header, Subheader, ScreenActionButton, LoreText, Pane, StatDisplay, Icon, HelperText } from "../../Components/CustomComponents";
import defaultStats from "../../common/defaultStats.json";
import { AuthStackProps } from "../../common/types-navigator";
import { DEFAULT_HERO_PROPERTIES, EXISTING_HERO_PROPERTIES } from "../../common/CONSTANTS";
import { isExistingHero, objectIsOfType } from "../../common/typeGuards";

/*
  FOR TESTING SPENDQP PAGE
*/
// const mockHero = {
//   "character": "Chrono Guy",
//   "alias": "Chrono Guy",
//   "description": "Time Traveling Renegade",
//   "history": "This enigmatic time traveler has been appearing with increasing frequency as the world has descended into chaos. While he has explained publicly that he's from two thousand years in the future and here to 'maintain the timeline of order', it's unclear what his exact motives are, who he works for and what the implications are of his very existence.",
//   "image": "../../../assets/images/heroes/chrono_guy/chrono_guy.webp",
//   "fire": 0,
//   "earth": 0,
//   "water": 0,
//   "air": 10,
//   "colors": [
//       "#4B4B4B",
//       "#E25926"
//   ]
// }

const SpendQP = ({ route, navigation }: AuthStackProps<"SpendQP">) => {
  // Global State
  const { state, dispatch } = useContext(GlobalStateContext);

  // Hero is passed as a route param if it's a new user, otherwise grab the hero from state
  const hero = route.params?.hero ?? state.hero;
  const userStatus = state.userStatus;
  /*
  FOR TESTING SPENDQP PAGE
*/
  //const hero = mockHero;
  //const userStatus = "new";

  const initialState: Stats = { qp: isExistingHero(hero) ? hero.qp : 5, power: 100, health: 100, armor: 0, recovery: 5, fire: 0, earth: 0, water: 0, air: 0, aether: 0, qpPower: 0, qpHealth: 0, qpArmor: 0, qpRecovery: 0, qpFire: 0, qpEarth: 0, qpAir: 0, qpWater: 0, qpAether: 0 };
  const [qpState, qpDispatch] = useReducer(spendQPReducer, initialState);

  const attributes = ["Power", "Health", "Armor", "Recovery", "Fire", "Earth", "Water", "Air", "Aether"];
  const qpAttributes = attributes.map(attr => {
    const lcAttr = attr.toLowerCase();
    return {
      stat: attr,
      value: qpState[lcAttr],
      description: defaultStats.find(item => item.stat === attr).description,
    };
  });

  function _handleFinishSpendingQP() {
    // prettier-ignore
    interface QpDefaults { aether: number; air: number; armor: number; earth: number; fire: number; health: number; power: number; qp: number; qpAether: number; qpAir: number; qpArmor: number; qpEarth: number; qpFire: number; qpHealth: number; qpPower: number; qpRecovery: number; qpWater: number; recovery: number; water: number; }

    // Hero After QP spent
    const updatedHero: SelectedHero & QpDefaults & { name: string } = Object.assign({}, hero, { ...qpState });

    // Need to perform a check using a "User-Defined Type Guard" to see if it's an existing user or new user based on Hero properties
    const existingHeroProperties = EXISTING_HERO_PROPERTIES;

    // PropertySubsetArray = Pick<Hero, EachHeroProperty> is saying type Hero, but only with properties contianed in EachHeroProperty. Then get the keys only so it's as a union type rather than an interface
    type PropertySubsetArray = keyof Pick<Hero, ExistingHeroPropertiesAsUnion>;
    // PropertySubsetArray[] is an array of Hero properties that are JUST the properties that are present on existing Heroes
    if (objectIsOfType<Hero, PropertySubsetArray[]>(updatedHero, existingHeroProperties)) {
      // If hero is an existing Hero, check against existing Hero type and pop navigation stack
      // Not sure why I need to add the assertion at the end... the conditional affirms it's an existing user
      const updatedHero: Hero = Object.assign({}, hero, { ...qpState }) as unknown as Hero;
      //console.log("DONE SETTINGS STATS ON HERO", updatedHero);
      dispatch({ type: "SET HERO", payload: { hero: updatedHero } });
      //go back to previous (home) screen
      navigation.navigate("Home");
    } else {
      // Otherwise, if hero is not an existing hero, assign all the correct properties for new heroes
      const updatedHeroWithDefaults: HeroWithStats & DefaultHeroProperties = Object.assign(DEFAULT_HERO_PROPERTIES, updatedHero, { maxHealth: updatedHero.health, status: "Rested" });
      //console.log("DONE SETTINGS STATS ON HERO", updatedHeroWithDefaults);
      dispatch({ type: "SET HERO", payload: { hero: updatedHeroWithDefaults } });
      //navigation.push("Register");
      navigation.pop();
    }
  }

  // As long as hero has QP, let them increment stats
  const incrementAttribute = function (stat: string): void {
    if (qpState.qp > 0) {
      return qpDispatch({ type: "INCREMENT VALUE", payload: { stat } });
    } else if (userStatus === "new" && qpState.qp === 0) {
      // New user, spent all points
      _handleFinishSpendingQP();
    } else {
      // Not a new user, user spent all points so redirect to Home screen
      navigation.navigate("Home");
    }
  };

  useEffect(() => {
    if (userStatus === "new") {
      // Fetch Astrology season for initial bonus based on season
      (async () => {
        try {
          const elmPackage = await fetchAstrologySeason({ date: null });
          const sign = elmPackage.sign;
          const element = elmPackage.element.toLowerCase();

          qpDispatch({ type: "ASTRO INCREMENT BY 5", payload: { stat: element } });
          updateAlerts([{ type: "info", message: `+5 ${element} bonus for ${sign} season!` }], state, dispatch);
        } catch (error) {
          debugErrors(error);
        }
      })();
    }
  }, [userStatus]);

  return (
    <ScreenContainer screenName={route.name}>
      <Header text={`Quantum Points [${qpState.qp}]`} />
      {userStatus === "new" && (
        <Center mt={0} mb={5}>
          <Heading>
            <Text color="primary.800" fontFamily="heading" fontSize="xl">
              Stat points affect your battles and recovery
            </Text>
          </Heading>
        </Center>
      )}
      <ScrollView>
        <FlatList
          data={qpAttributes.filter(item => item.stat !== "Aether")}
          keyExtractor={(item, i) => i.toString()}
          renderItem={({ item }) => {
            const lcStatName = item.stat.toLowerCase();
            const disabled = qpState.qp === 0;
            return (
              <Box borderRadius={10} bg={`base.${lcStatName}`} my={2} borderBottomWidth={1} borderBottomColor="primary.300" shadow={5}>
                <HStack alignItems="center" space={0}>
                  <View flex={4}>
                    <StatDisplay iconWatermark reversedText={true} stat={item.stat} value={item.value} description={item.description} />
                  </View>

                  <Pressable disabled={disabled} ml={2} alignItems="center" justifyContent="center" h={100} borderTopRightRadius={10} borderBottomRightRadius={10} flex={1} bg="base.white" opacity={1} onPress={() => incrementAttribute(lcStatName)}>
                    <Text textAlign="center" color={disabled ? "muted.200" : `base.${lcStatName}`} fontSize={65}>
                      +
                    </Text>
                  </Pressable>
                </HStack>
              </Box>
            );
          }}
        />
      </ScrollView>

      <ScreenActionButton text="Let's Go!" action={_handleFinishSpendingQP} />
    </ScreenContainer>
  );
};

export default SpendQP;
