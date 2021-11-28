import heroList from "./heroList.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ItemInstance, Item, FoeType, HeroChoice, CharacterName, CharacterAlias, SkinLcUnderscoreName, SkinName, ServerItemType } from "./types";
import { getBoulderBroImage, getChronoGuyImage, getCompostCreatureImage, getEmpathAureliaImage, getFiltronFiveImage, getNaturalNinjaImage, getRepeteImage, getSolarCelesteImage, getTimberTerrorImage, getWilhelmTheWildImage } from "./heroImageVariants";
import herofitTheme from "../styles/herofitTheme";
import { Alert } from "react-native";

function capitalize<T = string>(val: T) {
  if (typeof val === "string") {
    return val.charAt(0).toUpperCase() + val.slice(1);
  }
  throw new Error(`${val} is not a String; can't transform`);
}

const lowercaseUnderscore = function <T = string>(val: T) {
  if (typeof val === "string") {
    return val.replace(/(\s|-)+/g, "_").toLowerCase();
  }
  throw new Error(`${val} is not a String; can't transform`);
};

const lowercaseDash = function <T = string>(val: T) {
  if (typeof val === "string") {
    return val.replace(/(\s|_)+/g, "-").toLowerCase();
  }
  throw new Error(`${val} is not a String; can't transform`);
};

const lowercaseSpace = function <T = string>(val: T) {
  if (typeof val === "string") {
    return val.replace(/(\s|_|-)+/g, " ").toLowerCase();
  }
  throw new Error(`${val} is not a String; can't transform`);
};

const titlecaseUnderscore = function <T = string>(val: T) {
  if (typeof val === "string") {
    const uppercaseVal = val[0].toUpperCase() + val.substring(1);
    return uppercaseVal.replace(/(\s|-)+/g, "_");
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

function setLsWithExpiry(key: string, value: any, ttl: number) {
  const now = new Date();
  // `item` is an object which contains the original value
  // as well as the time when it's supposed to expire
  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  };
  return AsyncStorage.setItem(key, JSON.stringify(item));
}

async function getLsWithExpiry(key: string): Promise<any | false> {
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

function roundNumberToTenthReturnNumber(number: number) {
  return Math.round(number * 10) / 10;
}

function roundNumberToThousandthReturnNumber(number: number) {
  return Math.round(number * 1000) / 1000;
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
      //throw new Error("No matching image");
      console.error(`No Matching Image - ${lcName}`);
  }
}

function getHeroImage(characterName: CharacterName, skin?: SkinName): number {
  // No skin / costume; just return base character image
  if (!skin) {
    return _getBaseHeroImage(characterName);
  }

  // Figure out which Skin / Costume to use
  const lcName = lowercaseUnderscore(characterName);
  const lcSkin = lowercaseUnderscore<SkinName>(skin) as SkinLcUnderscoreName;
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
      //throw new Error("No matching image");
      console.error(`No Matching Image - ${lcSkin}`);
  }
}

function getFoeImage(foeType: FoeType, heroCharacterName?: CharacterName): number {
  const lcType = lowercaseUnderscore(foeType);

  // If a Character Name is passed, it means the foe is the Shadow-Self
  // "Shadow Self" is the name of the "Shadow-Self" skin
  if (heroCharacterName) {
    return getHeroImage(heroCharacterName, "Shadow Self");
  }

  switch (lcType) {
    // Spirits
    case "wraith":
      return require("../../assets/images/foes/spirits/wraith.webp");
    case "specter":
      return require("../../assets/images/foes/spirits/specter.webp");
    case "apparition":
      return require("../../assets/images/foes/spirits/apparition.webp");
    case "banshee":
      return require("../../assets/images/foes/spirits/banshee.webp");
    case "poltergeist":
      return require("../../assets/images/foes/spirits/poltergeist.webp");
    case "phantasm":
      return require("../../assets/images/foes/spirits/phantasm.webp");
    case "shade":
      return require("../../assets/images/foes/spirits/shade.webp");
    case "phantom":
      return require("../../assets/images/foes/spirits/phantom.webp");
    // Elementals
    case "gusty_rascal":
      return require("../../assets/images/foes/elementals/gusty_rascal.webp");
    case "rock_skipper":
      return require("../../assets/images/foes/elementals/rock_skipper.webp");
    case "flame_fiend":
      return require("../../assets/images/foes/elementals/flame_fiend.webp");
    case "splash_artist":
      return require("../../assets/images/foes/elementals/splash_artist.webp");
    case "wheezing_jinn":
      return require("../../assets/images/foes/elementals/wheezing_jinn.webp");
    case "granite_golem":
      return require("../../assets/images/foes/elementals/granite_golem.webp");
    case "burning_jinn":
      return require("../../assets/images/foes/elementals/burning_jinn.webp");
    case "cyclonic_siren":
      return require("../../assets/images/foes/elementals/cyclonic_siren.webp");
    case "storming_oni":
      return require("../../assets/images/foes/elementals/storming_oni.webp");
    case "hulking_aggro_crag":
      return require("../../assets/images/foes/elementals/hulking_aggro_crag.webp");
    case "scorching_archfiend":
      return require("../../assets/images/foes/elementals/scorching_archfiend.webp");
    case "high_priestess_of_the_tides":
      return require("../../assets/images/foes/elementals/high_priestess_of_the_tides.webp");
    // Titans
    case "plaguebringer":
      return require("../../assets/images/foes/titans/plaguebringer.webp");
    case "guardian_of_the_depths":
      return require("../../assets/images/foes/titans/guardian_of_the_depths.webp");
    default:
      //throw new Error("No image by that foe type");
      console.error("No image by that foe type");
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
    case "snowshoe_hare":
      return require("../../assets/images/items/pets/snowshoe_hare.webp");
    case "splash_artist":
      return require("../../assets/images/foes/elementals/splash_artist.webp");
    case "rock_skipper":
      return require("../../assets/images/foes/elementals/rock_skipper.webp");
    case "flame_fiend":
      return require("../../assets/images/foes/elementals/flame_fiend.webp");
    case "gusty_rascal":
      return require("../../assets/images/foes/elementals/gusty_rascal.webp");
    default:
      console.error(`No Matching Image - ${lcName}`);
  }
}

function equippedSkin(equipped: Item[]): Item {
  return equipped.find(i => i.type === "costume");
}

function equippedPet(equipped: Item[]): Item {
  return equipped.find(i => i.type === "pet");
}

function equippedTitle(equipped: Item[]): Item {
  return equipped.find(i => i.type === "title");
}

function getColorFromClassName(className) {
  switch (className) {
    case "repete-theme":
      return "#9B9B9B";
    case "filtron-five-theme":
      return "#EBEBEB";
    case "timber-terror-theme":
      return "#3D2A18";
    case "chorno-guy-theme":
      return "#4B4B4B";
    case "solar-warrior-theme":
      return "#EBDD49";
    case "wildspeaker-theme":
      return "#533B27";
    case "natural-ninja-theme":
      return "#0C2613";
    case "empath-theme":
      return "#B9AF73";
    case "boulder-bro-theme":
      return "#986634";
    case "compost-creature-theme":
      return "#796D20";
    case "brand-highlight":
      return "#d4af37";
    case "air-tint":
    case "air-highlight":
      return "#16a0f5";
    case "water-tint":
    case "water-highlight":
      return "#0f5e9c";
    case "earth-tint":
    case "earth-highlight":
      return "#8A360F";
    case "fire-tint":
    case "fire-highlight":
      return "#e25822";
    case "aether-tint":
    case "aether-highlight":
      return "#FFFFC2";
    case "skin-banshee":
    case "skin-wraith":
    case "skin-phantom":
    case "skin-phantasm":
      return "#0000000";
    case "skin-specter":
    case "skin-poltergeist":
    case "skin-apparition":
    case "skin-shade":
      return "#FFFFFF";
    case "royal-purple-tint":
      return "#7851a9";
    case "health-tint":
      return "#A42420";
    case "infected-tint":
      return "#8da728";
    case "pink-tint":
      return "#9d174d";
    default:
      console.log(`no matching color for - ${className}, returning white`);
      return "#fff";
  }
}

function getColorFromItemName(name: string, reverseDefault?: boolean) {
  const lcName = lowercaseUnderscore(name);

  switch (lcName) {
    case "white_belt":
    case "white_light_warrior":
      return "#f8f8ff";
    case "yellow_belt":
      return "rgb(245, 245, 64)";
    case "orange_belt":
      return "rgb(245, 174, 42)";
    case "blue_belt":
      return "rgb(63, 63, 205)";
    case "purple_belt":
      return "#800080";
    case "green_belt":
      return "rgb(35, 153, 35)";
    case "red_belt":
      return "rgb(194, 25, 25)";
    case "brown_belt":
      return "rgb(129, 17, 17)";
    case "black_belt":
    case "black_belt_sensei":
      return "#000000";
    default:
      return reverseDefault ? "#f8f8ff" : "#57534e";
  }
}

function checkForMultipleItem(itemName) {
  const belt = ["white-belt", "yellow-belt", "orange-belt", "blue-belt", "purple-belt", "green-belt", "red-belt", "brown-belt"];
  const origin = ["timber-terror-origin", "filtron-five-origin", "repete-origin", "wildspeaker-origin", "solar-warrior-origin", "chrono-guy-origin", "compost-creature-origin", "empath-origin", "boulder-bro-origin", "natural-ninja-origin"];

  if (belt.includes(itemName)) {
    return "belt";
  } else if (origin.includes(itemName)) {
    return "origin";
  }
  return itemName;
}

function determineDataSrcType(dataSrcId: string) {
  // A length of 8 means the user has Strava set up in HeroFit
  if (dataSrcId?.length === 8) {
    return "Strava";
  }
  return "Manual";
}

function getFoeColor(foeType: FoeType) {
  const lcType = lowercaseUnderscore(foeType);
  switch (lcType) {
    // Spirits
    case "wraith":
    case "specter":
    case "apparition":
    case "banshee":
    case "poltergeist":
    case "phantasm":
    case "shade":
    case "phantom":
    case "shadow_self":
      return "#000";
    // Elementals
    case "rock_skipper":
    case "granite_golem":
    case "hulking_aggro_crag":
      return "#8A360F";
    case "splash_artist":
    case "cyclonic_siren":
    case "high_priestess_of_the_tides":
      return "#0f5e9c";
    case "gusty_rascal":
    case "wheezing_jinn":
    case "storming_oni":
      return "#16a0f5";
    case "flame_fiend":
    case "burning_jinn":
    case "scorching_archfiend":
      return "#e25822";
    // Titans
    case "plaguebringer":
      return "#8da728";
    case "guardian_of_the_depths":
      return "#a13d2d";
    default:
      console.error("Foe Color - No image by that foe type");
  }
}

function determineScenario(scenarioNum: number) {
  switch (scenarioNum) {
    case 0:
      return {
        type: "Hero attacked unprepared foe",
        description: "Bonus power to hero, health reduction to foe",
      };

    case 1:
      return {
        type: "Hero attacked defending foe",
        description: "Bonus health to foe",
      };

    case 2:
      return {
        type: "Hero and Foe met on open field",
        description: "Slight power bonus to hero & foe",
      };

    case 3:
      return {
        type: "Foe attacked unprepared hero",
        description: "Bonus power to foe, health reduction to Hero",
      };
    case 4:
      return {
        type: "Foe attacked defending hero",
        description: "Bonus health to Hero",
      };
    case 5:
      return {
        type: "Both hero and foe fought defensively",
        description: "Slight bonus health to hero & foe",
      };

    default:
      break;
  }
}

function convertItemTypeName(serverItemType: ServerItemType) {
  if (serverItemType === "skin") {
    return "costume";
  }
  return serverItemType;
}

function determineItemTypeColor(serverItemType: ServerItemType) {
  switch (serverItemType) {
    case "codex":
    case "consumable":
    case "skin":
    case "codex":
    case "pet":
      return herofitTheme.colors.base[serverItemType];
    default:
      console.error("Foe Color - No image by that foe type");
  }
}

// Determine what type of activity-entry the users is using based on their dataSrcId
// This will need to be updated when new 3rd parties are added
function checkDataSrcType(id: string) {
  if (id) {
    if (id.includes("hf-")) {
      return "herofit";
    } else {
      return "strava";
    }
  }
  return null;
}

const createAlert = (title: string, message: string, cb: () => void) => {
  return Alert.alert(
    title,
    message,
    [
      { text: "Cancel", style: "cancel" },
      { text: "OK", onPress: () => cb() },
    ],
    { cancelable: true },
  );
};

export { lowercaseUnderscore, lowercaseDash, lowercaseSpace, titlecaseUnderscore, shuffleArray, getLsWithExpiry, setLsWithExpiry, clearLs, thousandsFormat, roundNumbersTenth, roundNumbersHundreth, cloneObj, convertAorAn, getHeroAlias, rankingSuffix, determineSkinType, determineSkinName, convertItemArrayToCategories, convertItemIdsToFullItems, capitalize, getHeroImage, getFoeImage, getPetImage, equippedSkin, equippedPet, equippedTitle, getColorFromClassName, getColorFromItemName, checkForMultipleItem, determineDataSrcType, roundNumberToTenthReturnNumber, roundNumberToThousandthReturnNumber, getFoeColor, determineScenario, convertItemTypeName, determineItemTypeColor, checkDataSrcType, createAlert };
