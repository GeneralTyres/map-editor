import { Injectable } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

let self;

@Injectable()
export class BaseService {

  constructor(private domSanitizer: DomSanitizer) {
    self = this;
  }

  clone(object) {
    let copy;
    if (typeof object === 'string') {
      copy = '' + object;
      return copy;
    }
    copy = Array.isArray(object) ? [] : {};
    for (const key in object) {
      copy[key] = (typeof object[key] === 'object' && object[key] !== null) ? self.clone(object[key]) : object[key];
    }
    return copy;
  }

  /**
   * Returns all the objects that have the values of the specified property. It can be used for example, to find
   * all the boreholes with ids that you already have.
   * @param {array} array - The array which must be filtered
   * @param {string} property -  The property that filtering is based on
   * @param {array} values - The values that should be searched. (Ex. ids)
   * @return {Array} filteredArray - The objects that have the specified values
   */
  getObjectsWherePropertyHasValues(array, property, values) {
    const filteredArray = [];
    values.forEach(function(value) {
      array.forEach(function(entry) {
        if (entry[property] === value) {
          filteredArray.push(entry);
        }
      });
    });
    return filteredArray;
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
      for (const key in properties) {
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

  getPropertyValuesFromArray(array, property) {
    // Underscore pluck functionality
    // Extracts a list of property values from array
    if (array === null || array === undefined || array.length === 0) {
      return [];
    }
    const allPropertyValues = [];
    for (let i = 0; i < array.length; i++) {
      allPropertyValues.push(array[i][property]);
    }
    return allPropertyValues;
  }

  sortByDate(array: any, order) {
    if (order === 'asc') {
      return array.sort(
        function(a, b) {
          return a.date - b.date;
        }
      );
    } else if (order === 'desc') {
      return array.sort(
        function(a, b) {
          return b.date - a.date;
        }
      );
    }
    return array;
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

  /**
   * Kyk of die waarde geldig is.
   * @param value
   * @return {boolean}
   */
  isNotEmpty(value) {
    let isNotEmpty = false;
    if (value !== null && value !== undefined) {
      isNotEmpty = true;
    }
    return isNotEmpty;
  }

  /**
   * Kyk of die waarde geldig is.
   * @param value
   * @return {boolean}
   */
  isNotEmptyOrZero(value) {
    let isNotEmpty = false;
    if (value !== null && value !== undefined && value !== 0) {
      isNotEmpty = true;
    }
    return isNotEmpty;
  }

  /**
   * Transform a file into base64 code
   * @param input
   * @param item
   * @param propertyName
   */
  getFileBase64(input, item, propertyName) {
    const file = (input.target.files[0]);
    // Create a FileReader
    const reader = new FileReader();
    reader.readAsDataURL(file);
    // Add an event listener to deal with the file when the reader is complete
    reader.addEventListener('load', (event: any) => {
      // Get the event.target.result from the reader (base64 of the image)
      item[propertyName] = event.target.result;
    }, false);
  }

  searchFilter(item, propertyName, searchTerm) {
    if (searchTerm === '') {
      // searchText is empty, display all
      return true;
    } else if (searchTerm !== undefined) {
      // searchText is not empty, filter on names and alternative names
      if (item[propertyName].toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
        // match found for flowMeter name
        return true;
      }
    }
    // no match found
    return false;
  }

  searchAlphaNumericaly(list, propertyName, searchTerm) {
    list = list.filter(this.searchFilter);
  }

  /**
   * A simple check to see it a value is present in the provided array. It just returns true or false!
   * Last edited by:
   * @author Marco Pieterse
   * @param {array} array - An array of anything.
   * @param {value} value - The value you suspect may or may not be in the array.
   * @param {number} startIndex - From where the search should begin for the missing entry.
   * @return {boolean} flag - True of False.
   */
  checkIfArrayContains(array, value, startIndex) {
    if (self.isNotEmpty(startIndex)) {
      // Do nothing
    } else if (!self.isNotEmpty(startIndex)) {
      startIndex = 0;
    }
    let flag = false;
    const a = array.indexOf(value, startIndex);
    if (a !== -1) {
      flag = true;
    } else if (a === -1) {
      flag = false;
    }
    return flag;
  }

}
