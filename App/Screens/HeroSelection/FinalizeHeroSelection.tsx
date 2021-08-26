import React, { useState, useEffect, useContext } from "react";
import { FormControl, Input } from "native-base";
import { useDebounce } from "use-debounce";
import { GlobalStateContext } from "../../store";
import debugErrors from "../../common/debugErrors";
import { checkAvatarName } from "../../api/avatar";

import { ScreenContainer, Header, Subheader, ScreenActionButton, LoreText, Pane, StatDisplay, Icon, HelperText } from "../../Components/CustomComponents";
import { AuthStackProps } from "../../common/types-navigator";
import { SelectedHero } from "../../common/types";

// Finalize Hero Selection Screen
// Name the Hero and get finish initializing hero
const FinalizeHeroSelection = ({ route, navigation }: AuthStackProps<"FinalizeHeroSelection">) => {
  const { state, dispatch } = useContext(GlobalStateContext);

  const [heroName, setHeroName] = useState(null);
  const [heroNameIsLegit, setHeroNameIsLegit] = useState(false);
  const [helperText, setHelperText] = useState(null);
  const [debouncedHeroName] = useDebounce(heroName, 500);

  const { alias, colors, selectedHero } = route.params;
  function handleFinishSelection() {
    const namedSelectedHero: SelectedHero & { name: string } = {
      name: heroName,
      ...selectedHero,
    };
    console.log("NAMED HERO", namedSelectedHero);
    return navigation.push("SpendQP", { hero: namedSelectedHero });
  }

  useEffect(() => {
    const name = debouncedHeroName;
    setHeroNameIsLegit(false);
    if (name) {
      setHelperText("Checking Availability...");
    } else {
      return setHelperText(null);
    }

    checkAvatarName({ name })
      .then(data => {
        const { availability } = data;

        if (availability) {
          if (name.length >= 3 && name.length <= 25) {
            setHelperText("Looks good!");
            setHeroNameIsLegit(true);
          } else {
            if (name.length < 3) {
              setHelperText("Hero Name must be at least 3 characters");
            } else if (name.length > 25) {
              setHelperText("Hero Name must be no more than 25 characters");
            }
            setHeroNameIsLegit(false);
          }
        } else {
          setHelperText("Hero Name is taken, please try again");
          setHeroNameIsLegit(false);
        }
      })
      .catch(error => {
        console.log("ERR", error);
        setHelperText(null);
        return debugErrors(error);
      });
  }, [debouncedHeroName]);

  useEffect(() => {
    dispatch({ type: "SET NEW USER", payload: { newUser: true } });
  }, []);

  return (
    <ScreenContainer screenName={route.name} bg={colors[0]} hero={alias}>
      <Header text={"Hero Name"} color={colors[1]} />
      <Pane>
        <FormControl isRequired isInvalid={!heroNameIsLegit}>
          <FormControl.Label>Choose an epic hero name</FormControl.Label>
          <Input value={heroName} onChangeText={name => setHeroName(name)} placeholder="Hero Name" shadow={1} />
        </FormControl>
        {helperText && <HelperText type={helperText === "Checking Availability..." ? "caution" : heroNameIsLegit ? "success" : "error"} text={helperText} />}
      </Pane>

      <ScreenActionButton disabled={!heroNameIsLegit} name="Next" action={handleFinishSelection} />
    </ScreenContainer>
  );
};

export default FinalizeHeroSelection;
