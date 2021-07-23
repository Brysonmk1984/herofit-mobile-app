import { getUser } from '../api/user';
import { getAvatar } from '../api/avatar';
import { fetchAllGameItems } from '../api/inventory';
import { convertItemIdsToFullItems } from '../common/helperFunctions';
import { fetchBattleReport } from '../api/battle';

async function initDetails(dispatch){
  try{
    console.log(1);
    const { user } = await getUser({ initMessage : true });
    const [p1, p2] = await Promise.all([getAvatar({ email : user.email }), fetchAllGameItems()]);
    const hero = p1.hero;
    const items  = p2.items;

    const { latestBattle } =  await fetchBattleReport({ avatarID : hero.id });

    console.log('MADE IT!', user, hero, items, latestBattle);
      // Takes item instance IDs and assigns full items to the hero under 'equipped' property
      convertItemIdsToFullItems(hero.equipped, items);
      dispatch({type : 'SET EXISTING USER INIT DATA', payload : { user, hero, items, latestBattle, isSignedIn : true } });
  } catch(error){
    console.log('ERROR!', error);
  }
  
}

export default initDetails;