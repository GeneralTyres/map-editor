import { Injectable } from '@angular/core';

let self;

@Injectable()
export class BaseService {

  constructor() {
    self = this;
  }

  /**
   * A function that filters trough an array to and gets objects that have the specified property values.
   * @param {array} array - The array to be filtered
   * @param {object} properties - An object that contains the properties and desired values
   * @return {Array} matchingObjectsArray - An array of the matching objects
   */
  getObjectsWhereKeysHaveValues(array, properties) {
    // Underscore where functionality
    // eg properties = {"id": 1, "name": 'some name'}
    // Returns an array of all the values that contain all of the key-value pairs listed in properties.
    const matchingObjectsArray = [];
    for (let i = 0; i < array.length; i++) {
      let allKeyValuesMatch = true;
      for (let key in properties) {
        if (array[i][key] !== properties[key]) {
          allKeyValuesMatch = false;
        }
      }
      if (allKeyValuesMatch === true) {
        matchingObjectsArray.push(array[i]);
      }
    }
    return matchingObjectsArray;
  }

  sort(a, b) {
    return b.date - a.date;
  }

  regularA = /[^a-zA-Z]/g;
  regularN = /[^0-9]/g;

  alphaNumericSort(arrayToSort, attributeName) {
    return arrayToSort.sort(function(a, b) {
      const aA = a[attributeName].replace(self.regularA, "");
      const bA = b[attributeName].replace(self.regularA, "");
      if (aA === bA) {
        const aN = parseInt(a[attributeName].replace(self.regularN, ""), 10);
        const bN = parseInt(b[attributeName].replace(self.regularN, ""), 10);
        return aN === bN ? 0 : aN > bN ? 1 : -1;
      } else {
        return aA > bA ? 1 : -1;
      }
    });
  }

}
