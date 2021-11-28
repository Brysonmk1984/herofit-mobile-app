// Takes in an object along with an array of property values
// Returns a new object that has all property keys from the array assigned with

import { EquippableItemType, Hero, ServerItemType } from "./types";

// corresponding property values from the objectInQuestion
function _subsetObject<T, K>(objectInQuestion: T | object, propertyNames: K): T | object {
  if (!Array.isArray(propertyNames)) {
    throw new Error("propertyNames must be an array!");
  }

  const filteredObject = {};
  propertyNames.forEach(p => {
    filteredObject[p] = objectInQuestion[p];
  });
  return filteredObject;
}

// Takes in an object along with an array of property values
// Returns a boolean determining whether or not an object is of the passed in type
// Also tells the typescript compiler that objectInQuestion is in fact the passed in T variable
function objectIsOfType<T, K>(objectInQuestion: T | object, propertyNames: K): objectInQuestion is T {
  if (typeof objectInQuestion !== "object") {
    throw new Error("objectInQuestion must be an object!");
  }
  const filteredObject = _subsetObject<T, K>(objectInQuestion, propertyNames) as object;

  let allPropertiesExist = true;
  for (let property in filteredObject) {
    if (objectInQuestion[property] === null || typeof objectInQuestion[property] === "undefined") {
      allPropertiesExist = false;
    }
  }
  return allPropertiesExist;
}

function isExistingHero(hero: unknown): hero is Hero {
  return hero.hasOwnProperty("id");
}

function determineEquippableType(type: ServerItemType): type is EquippableItemType {
  const equippableTypes = ["skin", "pet", "title"];
  return equippableTypes.includes(type);
}

export { objectIsOfType, isExistingHero, determineEquippableType };
