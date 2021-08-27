// Takes in an object along with an array of property values
// Returns a new object that has all property keys from the array assigned with 
// corresponding property values from the objectInQuestion
function _subsetObject<T>(objectInQuestion: (T | object), propertyNames: string[]): object {
  const filteredObject = {};
  propertyNames.forEach(p => {
    filteredObject[p] = objectInQuestion[p];
  });
  return filteredObject;
}

// Takes in an object along with an array of property values
// Returns a boolean determining whether or not an object is of the passed in type
function objectIsOfType<T>(objectInQuestion : (T | object), propertyNames : string[]) : objectInQuestion is T{
  const filteredObject = _subsetObject<T>(objectInQuestion, propertyNames);

  let allPropertiesExist = true;
  for (let property in filteredObject) {
    if (objectInQuestion[property] === null || typeof objectInQuestion[property] === "undefined") {
      allPropertiesExist = false;
    }
  }
  return allPropertiesExist;

}

export { objectIsOfType }