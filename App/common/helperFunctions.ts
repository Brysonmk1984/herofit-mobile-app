import heroList from "./heroList.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ItemInstance, Item, FoeTypes, FoeClasses, HeroChoice, CharacterName, CharacterAlias, Skin, SkinName } from "./types";
import { getBoulderBroImage, getChronoGuyImage, getCompostCreatureImage, getEmpathAureliaImage, getFiltronFiveImage, getNaturalNinjaImage, getRepeteImage, getSolarCelesteImage, getTimberTerrorImage, getWilhelmTheWildImage } from "./heroImageVariants";

function capitalize<T = string>(val: T) {
  if (typeof val === "string") {
    return val.charAt(0).toUpperCase() + val.slice(1);
  }
  throw new Error(`${val} is not a String; can't transform`);
}

const lowercaseUnderscore = function <T = string>(val: T) {
  if (typeof val === "string") {
    return val.replace(/\s+/g, "_").toLowerCase();
  }
  throw new Error(`${val} is not a String; can't transform`);
};

const lowercaseDash = function <T = string>(val: T) {
  if (typeof val === "string") {
    val.replace(/\s+/g, "-").toLowerCase();
  }
  throw new Error(`${val} is not a String; can't transform`);
};

const lowercaseSpace = function <T = string>(val: T) {
  if (typeof val === "string") {
    return val.replace(/\s+/g, "-").toLowerCase();
  }
  throw new Error(`${val} is not a String; can't transform`);
};

const titlecaseUnderscore = function <T = string>(val: T) {
  if (typeof val === "string") {
    const uppercaseVal = val[0].toUpperCase() + val.substring(1);
    return uppercaseVal.replace(/\s+/g, "_");
  }
  throw new Error(`${val} is not a String; can't transform`);
};

const shuffleArray = function (array: any[]) {
  let currentIndex = array.length,
    temporaryValue: unknown,
    randomIndex: number;

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
};

function setLsWithExpiry(key: string, value: string, ttl: number) {
  const now = new Date();
  // `item` is an object which contains the original value
  // as well as the time when it's supposed to expire
  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  };
  return AsyncStorage.setItem(key, JSON.stringify(item));
}

async function getLsWithExpiry(key: string): Promise<string | false> {
  try {
    const itemStr = await AsyncStorage.getItem(key);
    if (!itemStr) {
      throw new Error("No Token");
    }
    const item = JSON.parse(itemStr);
    const now = new Date();
    // compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
      // If the item is expired, delete the item from storage
      // and return null
      AsyncStorage.removeItem(key);
      return false;
    }
    return item.value;
  } catch (e) {
    return false;
  }
}

async function clearLs(key: string) {
  AsyncStorage.removeItem(key);
}

function thousandsFormat(num: string | number) {
  if (!num) {
    return "0";
  }

  var num_parts = num.toString().split(".");
  num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return num_parts.join(".");
}

function roundNumbersTenth(num: number): string {
  if (num < 1) {
    return (Math.floor(10 * num) / 10).toString().replace(/^0+/, "");
  }
  return (Math.floor(10 * num) / 10).toString();
}

function roundNumbersHundreth(num: number): string {
  if (num < 1) {
    return (Math.floor(100 * num) / 100).toString().replace(/^0+/, "");
  }
  return (Math.floor(100 * num) / 100).toString();
}

interface AnyObject {
  [key: string]: any;
}

function cloneObj(obj: AnyObject, deep = false) {
  let result = {};
  for (let key in obj) {
    if (deep && obj[key] instanceof Object) {
      if (obj[key] instanceof Array) {
        result[key] = [];
        obj[key].forEach(item => {
          if (item instanceof Object) {
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
  return result;
}

function convertAorAn(nextWord: string) {
  const vowels = ["a", "e", "i", "o", "u"];
  const firstLetterIsVowel = vowels.includes(nextWord[0].toLowerCase());
  return firstLetterIsVowel === true ? "an" : "a";
}

function getHeroAlias(character: CharacterName): CharacterAlias {
  const heroes: HeroChoice[] = heroList as HeroChoice[];
  return heroes.find(h => h.character === character)?.alias;
}

function determineFoeClass(type: FoeTypes) {
  const foeClasses: FoeClasses = {
    spirits: ["wraith", "specter", "apparition", "banshee", "poltergeist", "phantasm", "shade", "phantom", "shadow-self"],
    elementals: ["gusty rascal", "rock skipper", "flame fiend", "splash artist", "wheezing jinn", "granite golem", "burning jinn", "cyclonic siren", "storming oni", "hulking aggro crag", "scorching archfiend", "high priestess of the tides"],
    titans: ["plaguebringer"],
  };
  let parentClass = null;
  for (let targetClass in foeClasses) {
    const containedInClass = foeClasses[targetClass].includes(type);
    if (containedInClass) {
      parentClass = targetClass;
      break;
    }
  }
  return parentClass;
}

function rankingSuffix(num: number) {
  const numStr = num.toString();
  const lastChar = numStr.charAt(numStr.length - 1);
  const elevenAndTwelve = [11, 111, 1111, 11111, 12, 112, 1112, 11112, 13];
  const matchesEorT = elevenAndTwelve.includes(num);
  if (matchesEorT) {
    return "th";
  } else if (lastChar === "1") {
    return "st";
  } else if (lastChar === "2") {
    return "nd";
  } else if (lastChar === "3") {
    return "rd";
  } else {
    return "th";
  }
}

function determineSkinType(skin: Item) {
  if (!skin || skin.name === "base") {
    return "base";
  } else if (skin.name.includes("Shadow")) {
    return "shadow";
  } else {
    return "base";
  }
}

function determineSkinName(skin: Item, characterName: CharacterName) {
  if (!skin || skin.name === "base") {
    return lowercaseUnderscore(characterName);
  } else if (skin.name.includes("Shadow")) {
    return "shadow_" + lowercaseUnderscore(characterName);
  } else {
    return lowercaseUnderscore(characterName);
  }
}

function convertItemArrayToCategories(items: Item[]) {
  return {
    skins: items.filter(item => item.type === "skin"),
    pets: items.filter(item => item.type === "pet"),
    titles: items.filter(item => item.type === "title"),
    consumables: items.filter(item => item.type === "consumable"),
  };
}

// Combines item instances with default item templates
function convertItemIdsToFullItems(itemInstances: ItemInstance[], defaultItems: Item[]) {
  const combinedItems = itemInstances.map((itemInstance: ItemInstance): Item => {
    const matchingItem = defaultItems.find((item: Item) => item.id === itemInstance.itemID);
    return Object.assign({}, itemInstance, matchingItem);
  });

  return combinedItems;
}

function _getBaseHeroImage(characterName: string): number {
  const lcName = lowercaseUnderscore(characterName);
  switch (lcName) {
    case "timber_terror":
      return require("../../assets/images/heroes/timber_terror/timber_terror.webp");
    case "repete":
      return require("../../assets/images/heroes/repete/repete.webp");
    case "filtron_five":
      return require("../../assets/images/heroes/filtron_five/filtron_five.webp");
    case "chrono_guy":
      return require("../../assets/images/heroes/chrono_guy/chrono_guy.webp");
    case "solar_celeste":
      return require("../../assets/images/heroes/solar_celeste/solar_celeste.webp");
    case "wilhelm_the_wild":
      return require("../../assets/images/heroes/wilhelm_the_wild/wilhelm_the_wild.webp");
    case "natural_ninja":
      return require("../../assets/images/heroes/natural_ninja/natural_ninja.webp");
    case "empath_aurelia":
      return require("../../assets/images/heroes/empath_aurelia/empath_aurelia.webp");
    case "boulder_bro":
      return require("../../assets/images/heroes/boulder_bro/boulder_bro.webp");
    case "compost_creature":
      return require("../../assets/images/heroes/compost_creature/compost_creature.webp");
    default:
      throw new Error("No matching image");
  }
}

function getHeroImage(characterName: string, skin?: SkinName): number {
  // No skin / costume; just return base character image
  if (!skin) {
    return _getBaseHeroImage(characterName);
  }

  // Figure out which Skin / Costume to use
  const lcName = lowercaseUnderscore(characterName);
  const lcSkin = lowercaseUnderscore<Skin>(skin);
  switch (lcName) {
    case "timber_terror":
      return getTimberTerrorImage(lcSkin);
    case "repete":
      return getRepeteImage(lcSkin);
    case "filtron_five":
      return getFiltronFiveImage(lcSkin);
    case "chrono_guy":
      return getChronoGuyImage(lcSkin);
    case "solar_celeste":
      return getSolarCelesteImage(lcSkin);
    case "wilhelm_the_wild":
      return getWilhelmTheWildImage(lcSkin);
    case "natural_ninja":
      return getNaturalNinjaImage(lcSkin);
    case "empath_aurelia":
      return getEmpathAureliaImage(lcSkin);
    case "boulder_bro":
      return getBoulderBroImage(lcSkin);
    case "compost_creature":
      return getCompostCreatureImage(lcSkin);
    default:
      throw new Error("No matching image");
  }
}

function getPetImage(petName: string): number {
  // Figure out which pet to use
  const lcName = lowercaseUnderscore(petName);
  switch (lcName) {
    case "alpha_dog":
      return require("../../assets/images/items/pets/alpha_dog.webp");
    case "arizona_rattlesnake":
      return require("../../assets/images/items/pets/arizona_rattlesnake.webp");
    case "betta_fish":
      return require("../../assets/images/items/pets/betta_fish.webp");
    case "black_cat":
      return require("../../assets/images/items/pets/black_cat.webp");
    case "covert_chameleon":
      return require("../../assets/images/items/pets/covert_chameleon.webp");
    case "dubious_decoy":
      return require("../../assets/images/items/pets/dubious_decoy.webp");
    case "feisty_coon":
      return require("../../assets/images/items/pets/feisty_coon.webp");
    case "fire_breathing_whelp":
      return require("../../assets/images/items/pets/fire_breathing_whelp.webp");
    case "hearty_llama_of_wellbeing":
      return require("../../assets/images/items/pets/hearty_llama_of_wellbeing.webp");
    case "mystical_unicorn":
      return require("../../assets/images/items/pets/mystical_unicorn.webp");
    case "octopus_of_cunning":
      return require("../../assets/images/items/pets/octopus_of_cunning.webp");
    case "orchid_mantis":
      return require("../../assets/images/items/pets/orchid_mantis.webp");
    case "plagueling":
      return require("../../assets/images/items/pets/plagueling.webp");
    case "raven_of_omens":
      return require("../../assets/images/items/pets/raven_of_omens.webp");
    case "spirit_hawk":
      return require("../../assets/images/items/pets/spirit_hawk.webp");
  }
}

function equippedSkin(equipped: Item[]): SkinName | undefined {
  return equipped.find(i => i.type === "skin")?.name as SkinName | undefined;
}

function equippedPet(equipped: Item[]): Item {
  return equipped.find(i => i.type === "pet");
}

function equippedTitle(equipped: Item[]): string | undefined {
  return equipped.find(i => i.type === "title")?.name;
}

export { lowercaseUnderscore, lowercaseDash, lowercaseSpace, titlecaseUnderscore, shuffleArray, getLsWithExpiry, setLsWithExpiry, clearLs, thousandsFormat, roundNumbersTenth, roundNumbersHundreth, cloneObj, convertAorAn, getHeroAlias, determineFoeClass, rankingSuffix, determineSkinType, determineSkinName, convertItemArrayToCategories, convertItemIdsToFullItems, capitalize, getHeroImage, getPetImage, equippedSkin, equippedPet, equippedTitle };
