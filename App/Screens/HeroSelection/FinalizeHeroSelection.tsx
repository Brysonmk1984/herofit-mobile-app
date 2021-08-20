import React, { useState, useEffect } from 'react';
import { FormControl, Input } from 'native-base';
import debugErrors from '../../common/debugErrors';
import { checkAvatarName } from '../../api/avatar';
import { useDebounce } from 'use-debounce';
import { ScreenContainer, Header, Subheader, ScreenActionButton, LoreText, Pane, StatDisplay, Icon, HelperText } from '../../Components/CustomComponents';


// Finalize Hero Selection Screen 
// Name the Hero and get finish initializing hero
const FinalizeHeroSelection = ({ route, navigation }) => {
  const [heroName, setHeroName] = useState(null);
  const [heroNameIsLegit, setHeroNameIsLegit] = useState(false);
  const [helperText, setHelperText] = useState(null);
  const [debouncedHeroName] = useDebounce(heroName, 1000);

  const { alias, colors } = route.params.selectedHero;

  function handleNameInput(name : string): void{
    setHeroName(name);
    setHeroNameIsLegit(false);
    if(name){
      return setHelperText("Checking Availability...");
    }
    setHelperText(null);
  }

  function handleFinishSelection(){
    const namedHero = {
      name : heroName,
      ...route.params.selectedHero
    }
    return navigation.push('SpendQP', { hero : namedHero });
  }

  useEffect(() =>{
    const name = debouncedHeroName;
    checkAvatarName({ name })
    .then((data) =>{
      const { availability } = data;
      if(availability){
        if(name.length >= 3 && name.length <= 25){
          setHelperText("LooksGood!");
          setHeroNameIsLegit(true);
        }else{
          if(name.length < 3){
            setHelperText("Hero Name must be at least 3 characters");
          }else if(name.length > 25){
            setHelperText("Hero Name must be no more than 25 characters");
          }
          setHeroNameIsLegit(false);
        }
      }else{
        setHelperText("Hero Name is taken, please try again");
        setHeroNameIsLegit(false);
      }
    }).catch((error) =>{
      setHelperText(null);
      return debugErrors(error);
    });
  }, [debouncedHeroName]);

  return (
    <ScreenContainer screenName={route.name} bg={colors[0]} hero={alias}>
        <Header text={"Hero Name"} color={colors[1]} />
        <Pane>
          <FormControl isRequired isInvalid={!heroNameIsLegit}>
            <FormControl.Label>Choose an epic hero name</FormControl.Label>
            <Input
              value={heroName}
              onChangeText={value => handleNameInput(value)}
              placeholder="Hero Name"
              shadow={1}
            />
          </FormControl>
          { helperText && <HelperText type={helperText === 'Checking Availability...' ? 'caution' : heroNameIsLegit ? 'success' : 'error'} text={helperText} /> }
        </Pane>

      <ScreenActionButton disabled={!heroNameIsLegit} name="Let's Go!" action={handleFinishSelection}  />
    </ScreenContainer>
  )
}

export default FinalizeHeroSelection;