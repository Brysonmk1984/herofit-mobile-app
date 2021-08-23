
//import { validateAdmin } from '../services/mockService';
import avatars from './heroList.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Hero, ItemInstance, Item } from './types';

const lowercaseUnderscore = function(ally){
    if(ally !== null && typeof ally !== 'undefined'){
        return ally.replace(/\s+/g, '_').toLowerCase();
    }
};
const lowercaseDash = function(ally){
    if(ally !== null && typeof ally !== 'undefined'){
        return ally.replace(/\s+/g, '-').toLowerCase();
    }
};
const lowercaseSpace = function(ally){
    if(ally !== null && typeof ally !== 'undefined'){
        return ally.replace(/-|_/g, ' ').toLowerCase();
    }
};
const titlecaseUnderscore = function(ally){
    if(ally !== null && typeof ally !== 'undefined'){
        ally = ally[0].toUpperCase() + ally.substring(1);
        return ally.replace(/\s+/g, '_')
    }
}

const shuffleArray = function(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
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

const getUrlParamsAfterHash = function(){
let qs;  
if(window.location.href.indexOf('#') !== -1){
    qs = window.location.hash.replace(/[#]/g, "?");
}else{
    qs = window.location.href.split('+').join(' ');
}

var params = {},
    tokens,
    re = /[?&]?([^=]+)=([^&]*)/g;

while (tokens = re.exec(qs)) {
    params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
}

return params;

};
const getUrlParams = function(queryString){
    return new URLSearchParams(queryString);
}

function getCookie(name) {
const value = `; ${document.cookie}`;
const parts = value.split(`; ${name}=`);
if (parts.length === 2) return parts.pop().split(';').shift();
}

function setLsWithExpiry(key, value, ttl) {
  const now = new Date()
  // `item` is an object which contains the original value
  // as well as the time when it's supposed to expire
  const item = {
      value: value,
      expiry: now.getTime() + ttl
  }
  return AsyncStorage.setItem(key, JSON.stringify(item))
}

async function getLsWithExpiry(key) {
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

async function clearLs(key){
  AsyncStorage.removeItem(key);
  setTimeout(() =>{
    getLsWithExpiry(key)
    .then((val) =>{
      console.log('the val', val);
    })
  },1500);
}

function thousandsFormat(num){
  if(!num){
    return 0;
  }

  var num_parts = num.toString().split(".");
  num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return num_parts.join(".");
}

function roundNumbersTenth(num){
    if(num < 1){
        return (Math.floor(10*num)/10).toString().replace(/^0+/, "");
    }
    return (Math.floor(10*num)/10).toString();
}
function roundNumbersHundreth(num){
    if(num < 1){
        return (Math.floor(100*num)/100).toString().replace(/^0+/, "");
    }
    return (Math.floor(100*num)/100).toString();
}

function cloneObj(obj, deep=false){
    var result = {};
    for(let key in obj){
      if(deep && obj[key] instanceof Object){
         if(obj[key] instanceof Array){
           result[key] = [];
           obj[key].forEach(function(item){
              if(item instanceof Object){
                 result[key].push(cloneObj(item, true));
              } else {
                 result[key].push(item);
              }
           });
         } else {
           result[key] = cloneObj(obj[key]);
         }
      } else {
         result[key] = obj[key];
      }
    }
    return result
}

  // If the route is longer than just one directory, check only the first string for the public/private route check
  // eg - /users/myusername -> only check /users
  function _uniqueUrlCheck(path){
      if(path.split('/').length > 2){
          return '/' + path.split('/')[1];
      }
      return path;
  }

  function getAvatarAlias(character){
    const alias = avatars.find((av) => av.character === character).alias;
    return alias;
  }
  function determineFoeClass(type){
    const foeClasses = {
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

  function getImagePackage(basicPath, images = null, fileName = null, imgCategory = 'base'){
    
    // Not necessary in most circumstances, but useful if the width attribute on an image needs to be set.
    const width = {
        avatar : { sizes : '(max-width: 720px) 265px, 100vw', large : 500, small : 265 }, 
        pet : { sizes : '(max-width: 720px) 265px, 100vw', large : 500, small : 265 }, 
        default : '100vw'
    };
    
    // If an 'images' mapped object is supplied, use that to get the correct image links
    if(images){ 
        //console.log('IMAGES', images, 'IMAGE CATEGRY - ', imgCategory, 'DONE', images[imgCategory] );
        return {
          large : images[imgCategory][lowercaseUnderscore(basicPath)],
          small : images[imgCategory][lowercaseUnderscore(basicPath)+'_265'],
          width
        }
    }

    // If there's a filename attribute supplied, it means the image wasn't a part of the includedImage or other image file
    // Usually there will only be a 'large' image to use
    if(fileName){
        const name = fileName.split('.')[0];
        const path = basicPath.split(fileName)[0];
        const extension = basicPath.split(fileName)[1];

        return {
            large : basicPath,
            small : path + name + '_265'+ extension,
            width : width.default
        }
    }

    // If no mapped images file or filename supplied, just return the regular path as 'large' and the default width of 100vw
    return {
        large : basicPath,
        width : width.default
    }
  }

  function getHeroImagePackage(HEROES, category, character){
    const sizes = '(max-width: 720px) 265px, 100vw';
    const width = {large : 500, small : 265 };

    return {
        large : HEROES[category][character],
        small : HEROES[category][character + '_265'],
        sizes,
        width
    }
   
  }

  function getVillainImagePackage(VILLAINS, villainCategory, villainType){
    const sizes = '(max-width: 720px) 265px, 100vw';
    const width = {large : 500, small : 265 };
    let opacity = 100;
    
    function determineOpacity(villainType){
        switch(villainType){
            case 'shade':return 100;case 'wraith':return 90;
            case 'phantasm':return 80;case 'banshee':return 70;
            case 'phantom':return 60;case 'specter':return 50;
            case 'poltergeist':return 40;case 'apparition':return 30;default:return 100;
        }
    }

    if(villainCategory === 'spirits'){
        opacity = determineOpacity(villainType);
    }
    return {
        large : VILLAINS[villainCategory][villainType],
        small : VILLAINS[villainCategory][villainType + '_265'],
        sizes,
        width,
        opacity 
    }
   
  }

  function rankingSuffix(num){
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

  function determineSkinType(skin){
    if(!skin || skin.name === 'base'){
      return 'base';
    }else if(skin.name.includes('Shadow')){
      return "shadow";
    }else{
      return 'base';
    }
  }

  function determineSkinName(skin, characterName){
    if(!skin || skin.name === 'base'){
      return lowercaseUnderscore(characterName);
    }else if(skin.name.includes('Shadow')){
      return "shadow_" + lowercaseUnderscore(characterName);
    }else{
      return lowercaseUnderscore(characterName);
    }
  }

  function convertItemArrayToCategories(items){

    const defaultItems = {
      skins : items.filter(item => item.type === 'skin'),
      pets : items.filter(item => item.type === 'pet'),
      titles : items.filter(item => item.type === 'title'),
      consumables : items.filter(item => item.type === 'consumable'),
    };

    return defaultItems;
  }

function convertAorAn(nextWord){
  const vowels = ['a','e','i','o','u'];
  const firstLetterIsVowel = vowels.includes(nextWord[0].toLowerCase());
  return firstLetterIsVowel === true ? 'an' : 'a';
}
  

function capitalize(string : string){
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Combines item instances with default item templates
function convertItemIdsToFullItems(itemInstances : ItemInstance[], defaultItems : Item[]){
  const combinedItems = itemInstances.map((itemInstance : ItemInstance) : Item => {
    const matchingItem = defaultItems.find((item : Item) => item.id === itemInstance.itemID);
    return Object.assign({}, itemInstance, matchingItem);
  });

  return combinedItems;
}

function getHeroImage(characterName) {
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


export { lowercaseUnderscore, lowercaseDash, lowercaseSpace, titlecaseUnderscore, shuffleArray, getUrlParams, getUrlParamsAfterHash, getLsWithExpiry, setLsWithExpiry, clearLs, thousandsFormat, roundNumbersTenth, roundNumbersHundreth, cloneObj, getAvatarAlias, determineFoeClass, getImagePackage, getHeroImagePackage, getVillainImagePackage, rankingSuffix, determineSkinType, determineSkinName, convertItemArrayToCategories, convertItemIdsToFullItems,convertAorAn, capitalize, getHeroImage };