import {Injectable} from '@angular/core';
import {DataService} from './data.service';
import {StateModel} from '../models/states.model';
import {CountryModel} from '../models/country.model';
import {BaseService} from './base.service';

@Injectable()
export class StateService {
  states: StateModel[] = [];

  constructor(private data: DataService,
              private baseService: BaseService) {
  }

  loadStates() {
    return this.data.load('states', 0).subscribe(
      (response: StateModel[]) => {
        this.states = response;
      }
    );
  }

  getStates() {
    return this.states.slice();
  }

  saveState(state) {
    if (state.id) {
      return this.data.update('states', state);
    } else {
      return this.data.create('states', state);
    }
  }

  compare(a, b) {
    if (a.toDate < b.toDate) {
      return -1;
    }
    if (a.toDate > b.toDate) {
      return 1;
    }
    return 0;
  }

  getStatesByCountry(country) {
    const countryStates = [];
    for (let i = 0; i < this.states.length; i++) {
      if (country.id === this.states[i].countryId) {
        countryStates.push(this.states[i]);
      }
    }
    return countryStates.sort(this.compare);
  }


  /**
   * Get country object with state object attached.
   * @param countries
   * @param date
   * @return {any}
   */
  getStatesByCountryAndDate(countries, date) {
    // Kry die regte state vir die lande
    for (let j = 0; j < countries.length; j++) {
      // Kry lande se states
      let countryStates = this.baseService.getObjectsWhereKeysHaveValues(this.states, {countryId: countries[j].id});
      if (countryStates.length > 0) {
        // Sort country states
        countryStates = this.baseService.sortByDate(countryStates, 'asc');
        let selectedState = countryStates[0];
        for (let c = 0; c < countryStates.length; c++) {
          if (Number(countryStates[c].date) <= Number(date)) {
            selectedState = countryStates[c];
          }
        }
        countries[j].state = selectedState;
      }
    }
    return countries;
  }

  getNewestStateByCountryId(countryId) {
    const countryStates = this.baseService.getObjectsWhereKeysHaveValues(this.states, {countryId: countryId});
    countryStates.sort(function(a, b){return b.date - a.date});
    if (countryStates.length > 0) {
      return countryStates[0];
    } else {
      return null;
    }
  }
}
