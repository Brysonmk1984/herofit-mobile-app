import React, { useContext, useState, createRef } from 'react';
import { View, Text, Button } from 'react-native';
import DelayInput from "react-native-debounce-input";
import debugErrors from '../../common/debugErrors';
import { GlobalStateContext } from '../../store';
import { getHeroList } from '../../api/authentication';
import { checkAvatarName } from '../../api/avatar';
import ScreenContainer from '../../Components/ScreenContainer';

// Finalize Hero Selection Screen 
// Name the Hero and get finish initializing hero
const FinalizeHeroSelection = ({ route, navigation }) => {
  const [heroName, setHeroName] = useState(null);
  const [ heroNameIsLegit, setHeroNameIsLegit ] = useState(false);
  const [checkingMessage, setCheckingMessage] = useState(false);
  const [helperText, setHelperText] = useState(null);
  const inputRef = createRef();
  const { state, dispatch } = useContext(GlobalStateContext);
  const { hero } = route.params;

  function handleNameInput(name : string): void{
    setCheckingMessage(true);
    checkAvatarName({ name })
    .then((data) =>{
      setCheckingMessage(false);
      if(data.error){
        const error = data.error;
        return debugErrors(error);
      }
      const { availability } = data;
      if(availability){
        setHeroName(name);

        if(name.length >= 3 && name.length <= 25){
          setHelperText(null);
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
        setHelperText("Hero Name is already in use, please select another!");
        setHeroNameIsLegit(false);
      }
    });
    
  }

  function handleFinishSelection(){
    

    const namedHero = {
      name : heroName,
      //qp : 10,
      ...hero
    }

    return navigation.navigate('SpendQP', { hero : namedHero });
  }


  return (
    <ScreenContainer>
      <View>
        <View>
          {
            checkingMessage ? 
              <View>
                <Text>Checking Availability...</Text>
              </View>
            : helperText ? 
              <View>
                <Text>{ helperText }</Text>
              </View> 
            : null
          }
        </View>
        <DelayInput
          value={heroName}
          minLength={3}
          inputRef={inputRef}
          onChangeText={value => handleNameInput(value)}
          delayTimeout={400}
          placeholder="Hero Name"
          required={true}
          style={{ margin: 10, padding: 10, height: 40, borderColor: "gray", borderWidth: 1 }}
        />
        <Button title="Let's Go!" disabled={!heroNameIsLegit} onPress={() => handleFinishSelection()} />
      </View>
    </ScreenContainer>
  )
}

export default FinalizeHeroSelection;