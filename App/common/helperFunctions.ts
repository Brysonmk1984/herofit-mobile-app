
import heroList from './heroList.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ItemInstance, Item, FoeTypes, FoeClasses, HeroChoice, CharacterName, CharacterAlias} from './types';

function capitalize(string : string){
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const lowercaseUnderscore = function(val : string){
  return val?.replace(/\s+/g, '_').toLowerCase() ?? undefined 
};

const lowercaseDash = function(val : string){
  return val?.replace(/\s+/g, '-').toLowerCase() ?? undefined 
};

const lowercaseSpace = function(val : string){
  return val?.replace(/\s+/g, '-').toLowerCase() ?? undefined 
};

const titlecaseUnderscore = function(val : string){
  if(val !== null && typeof val !== 'undefined'){
    val = val[0].toUpperCase() + val.substring(1);
      return val.replace(/\s+/g, '_')
  }
}

const shuffleArray = function(array : any[]) {
  let currentIndex = array.length, temporaryValue : unknown, randomIndex : number;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function setLsWithExpiry(key : string, value : string, ttl : number) {
  const now = new Date()
  // `item` is an object which contains the original value
  // as well as the time when it's supposed to expire
  const item = {
      value: value,
      expiry: now.getTime() + ttl
  }
  return AsyncStorage.setItem(key, JSON.stringify(item))
}

async function getLsWithExpiry(key : string) : Promise<string | null> {
  try{
    const itemStr = await AsyncStorage.getItem(key);
    if(!itemStr){
      throw new Error('No Token');
    }
    const item = JSON.parse(itemStr);
    const now = new Date();
    // compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
      // If the item is expired, delete the item from storage
      // and return null
      AsyncStorage.removeItem(key);
      return null;
    }
    return item.value;
  }catch(e){
    return null;
  }
}

async function clearLs(key : string){
  AsyncStorage.removeItem(key);
}

function thousandsFormat(num : string | number){
  if(!num){
    return '0';
  }

  var num_parts = num.toString().split(".");
  num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return num_parts.join(".");
}

function roundNumbersTenth(num : number) : string{
  if(num < 1){
      return (Math.floor(10 * num)/10).toString().replace(/^0+/, "");
  }
  return (Math.floor(10 * num)/10).toString();
}

function roundNumbersHundreth(num : number) : string{
  if(num < 1){
      return (Math.floor(100*num)/100).toString().replace(/^0+/, "");
  }
  return (Math.floor(100*num)/100).toString();
}

interface AnyObject{
  [key: string]: any
}

function cloneObj(obj : AnyObject, deep = false){
  let result = {};
  for(let key in obj){
    if(deep && obj[key] instanceof Object){
        if(obj[key] instanceof Array){
          result[key] = [];
          obj[key].forEach((item) => {
            if(item instanceof Object){
              result[key].push(cloneObj(item, true));
            } else {
              result[key].push(item);
            }
          });
        }else{
          result[key] = cloneObj(obj[key]);
        }
    }else{
      result[key] = obj[key];
    }
  }
  return result
}

function getHeroAlias(character : CharacterName) : CharacterAlias {
  const heroes : HeroChoice[] = heroList as HeroChoice[];
  return heroes.find((h) => h.character === character)?.alias;
}

function determineFoeClass(type : FoeTypes){
  const foeClasses : FoeClasses = {
    spirits : ['wraith', 'specter', 'apparition','banshee','poltergeist','phantasm','shade','phantom', 'shadow-self'],
    elementals : ['gusty rascal', 'rock skipper', 'flame fiend', 'splash artist', 'wheezing jinn', 'granite golem', 'burning jinn', 'cyclonic siren', 'storming oni', 'hulking aggro crag', 'scorching archfiend', 'high priestess of the tides'],
    titans : ['plaguebringer']
  }
  let parentClass = null;
  for(let targetClass in foeClasses ){
    const containedInClass = foeClasses[targetClass].includes(type);
    if(containedInClass){
        parentClass = targetClass;
      break;
    }
  }
  return parentClass;
}

function rankingSuffix(num : number){
  const numStr = num.toString();
  const lastChar = numStr.charAt(numStr.length-1);
  const elevenAndTwelve = [11,111,1111,11111,12,112,1112,11112, 13];
  const matchesEorT = elevenAndTwelve.includes(num);
  if(matchesEorT){
    return 'th';
  }else if(lastChar === '1'){
    return 'st';
  }else if(lastChar === '2'){
    return 'nd';
  }else if(lastChar === '3'){
    return 'rd';
  }else{
    return 'th';
  }
}

function determineSkinType(skin : Item){
  if(!skin || skin.name === 'base'){
    return 'base';
  }else if(skin.name.includes('Shadow')){
    return "shadow";
  }else{
    return 'base';
  }
}

function determineSkinName(skin : Item, characterName : CharacterName){
  if(!skin || skin.name === 'base'){
    return lowercaseUnderscore(characterName);
  }else if(skin.name.includes('Shadow')){
    return "shadow_" + lowercaseUnderscore(characterName);
  }else{
    return lowercaseUnderscore(characterName);
  }
}

function convertItemArrayToCategories(items : Item[]){
  return {
    skins : items.filter(item => item.type === 'skin'),
    pets : items.filter(item => item.type === 'pet'),
    titles : items.filter(item => item.type === 'title'),
    consumables : items.filter(item => item.type === 'consumable'),
  };
}

function convertAorAn(nextWord : string){
  const vowels = ['a','e','i','o','u'];
  const firstLetterIsVowel = vowels.includes(nextWord[0].toLowerCase());
  return firstLetterIsVowel === true ? 'an' : 'a';
}

// Combines item instances with default item templates
function convertItemIdsToFullItems(itemInstances : ItemInstance[], defaultItems : Item[]){
  const combinedItems = itemInstances.map((itemInstance : ItemInstance) : Item => {
    const matchingItem = defaultItems.find((item : Item) => item.id === itemInstance.itemID);
    return Object.assign({}, itemInstance, matchingItem);
  });

  return combinedItems;
}

function getHeroImage(characterName : string) : string {
  const lcName = lowercaseUnderscore(characterName);
  switch (lcName) {
    case "timber_terror":
      return require('../../assets/images/heroes/timber_terror/timber_terror.webp');
    case "repete":
      return require('../../assets/images/heroes/repete/repete.webp');
    case "filtron_five":
      return require('../../assets/images/heroes/filtron_five/filtron_five.webp');
    case "chrono_guy":
      return require('../../assets/images/heroes/chrono_guy/chrono_guy.webp');
    case "solar_celeste":
      return require('../../assets/images/heroes/solar_celeste/solar_celeste.webp');
    case "wilhelm_the_wild":
      return require('../../assets/images/heroes/wilhelm_the_wild/wilhelm_the_wild.webp');
    case "natural_ninja":
        return require('../../assets/images/heroes/natural_ninja/natural_ninja.webp');
    case "empath_aurelia":
        return require('../../assets/images/heroes/empath_aurelia/empath_aurelia.webp');
    case "boulder_bro":
        return require('../../assets/images/heroes/boulder_bro/boulder_bro.webp');
    case "compost_creature":
        return require('../../assets/images/heroes/compost_creature/compost_creature.webp');
    default:
      throw new Error('No matching image');
  }
}

export { lowercaseUnderscore, lowercaseDash, lowercaseSpace, titlecaseUnderscore, shuffleArray, getLsWithExpiry, setLsWithExpiry, clearLs, thousandsFormat, roundNumbersTenth, roundNumbersHundreth, cloneObj, getHeroAlias, determineFoeClass, rankingSuffix, determineSkinType, determineSkinName, convertItemArrayToCategories, convertItemIdsToFullItems,convertAorAn, capitalize, getHeroImage };