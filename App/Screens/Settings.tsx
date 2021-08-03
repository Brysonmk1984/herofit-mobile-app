import React, { useContext } from 'react';
import { Button, Alert } from 'react-native';
import ScreenContainer from '../Components/ScreenContainer';
import { clearJwtInLocalStorage } from '../common/jwtModule';
import debugErrors from '../common/debugErrors';
import { Store, User } from '../common/types';
import { updateAlerts } from '../common/alerts';
import { deleteAccount } from '../api/account';
import { store } from '../store';

interface SettingsProps {

}

const Settings: React.FC<SettingsProps> = ({ navigation }) => {
  const { state, dispatch } = useContext<Store>(store);
  const { hero } = state;

  const createDeleteAlert = () => {
    return Alert.alert(
      "Delete Account",
      "WARNING: This is non-reversible!",
      [{
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
        },
        { text: "OK", onPress: () => handleDeleteAccount() }],
      { cancelable: true }
    );
  }
  
  function handleDeleteAccount(){
    // TODO: Delete immediately after account creation doesnt work, hero doesn't have ID
    const user : User = state.user;
    console.log('HHH', hero);
    deleteAccount({ username: user.username, avatarID : hero.id, email : user.email })
    .then(async (data) =>{
      updateAlerts([{ type : 'success', message : "Account has been deleted. We hope to see you again sometime." }], state, dispatch);
      dispatch({ type : 'RESET DEFAULTS' });
      
      setTimeout(() =>{
        return navigation.navigate('Auth', { screen : 'SignIn'});
      }, 3000);
    }).catch((error) =>{
      debugErrors(error, user, dispatch);
      updateAlerts([{ type : 'error', message : `Unable to delete account- ${error.message}` }], state, dispatch);
    });
  }

  function signOut() : void{
    clearJwtInLocalStorage();
    dispatch({type : 'SET ISSIGNEDIN', payload :  { isSignedIn : false }});
  }

  return (
    <ScreenContainer>
      <Button title="Delete JWT" onPress={signOut} />
      <Button title="Delete ACCOUNT" onPress={() => createDeleteAlert()} />
    </ScreenContainer>
  );
}

export default Settings;