import jwt_decode from "jwt-decode";
import { getUser } from '../api/user';
import { getAvatar } from '../api/avatar';
import { fetchAllGameItems } from '../api/inventory';
import { convertItemIdsToFullItems } from './helperFunctions';
import { fetchBattleReport } from '../api/battle';
import { updateAlerts } from './alerts';

// FETCH ALL THE NEEDED DATA FOR INITIALIZING THE HOME SCREEN
// Either accepts the jwt token and gets email from it in the case of already-valid jwt, or accepts email as a parameter in the case of signing in
// user, hero, items, latestBattle
async function fetchInitialData(token, dispatch, state, email = null){
  try{
    // Decode the JWT to get email, needed for fetching avatar
    if(token){
      ({ email } = jwt_decode(token));
    }
    
    console.log('THE EMAIL', email);
    // Fetch the user, avatar, and all game items
    const [p1, p2, p3, p4] = await Promise.all([getUser({ initMessage : true }), getAvatar({ email }), fetchAllGameItems(), fetchBattleReport({ owner : email })]);
    const user = p1.user;
    const hero = p2.hero;
    const items  = p3.items;
    const latestBattle = p4.latestBattle;
    //console.log('MADE IT!', user, hero, items, latestBattle);
    // Takes item instance IDs and assigns full items to the hero under 'equipped' property
    convertItemIdsToFullItems(hero.equipped, items);
    dispatch({type : 'SET EXISTING USER INIT DATA', payload : { user, hero, items, latestBattle, isSignedIn : true } });
  } catch(error){
    const message = error.error.message;
    updateAlerts([{ type : 'error', message }], state, dispatch);
  }

}

export default fetchInitialData;