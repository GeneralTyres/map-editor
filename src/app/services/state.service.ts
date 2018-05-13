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
    return this.data.load('states').subscribe(
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
    if (a.toDate < b.toDate)
      return -1;
    if (a.toDate > b.toDate)
      return 1;
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

  getStatesByCountryAndDate(countries, date, areas) {
    const currentStates = [];
    const filteredAreas = [];
    // Kry die regte state vir die lande
    for (let j = 0; j < countries.length; j++) {
      if (Number(countries[j].fromDate) < date && Number(countries[j].toDate) >= date) {
        const countryStates = this.baseService.getObjectsWhereKeysHaveValues(this.states, {countryId: countries[j].id});
        if (countryStates.length > 0) {
          countryStates.sort(this.baseService.sort);
          let selectedState = countryStates[0];
          for (let c = 0; c < countryStates.length; c++) {
            if (Number(countryStates[c].date) < Number(date)) {
              selectedState = countryStates[c];
              break;
            }
          }
          currentStates.push(selectedState);
        }

        // Kry die areas vir die state
        for (let o = 0; o < currentStates.length; o++) {
          for (let r = 0; r < areas.length; r++) {
            if (areas[r].id === currentStates[o].areaId) {
              filteredAreas.push(areas[r]);
            }
          }
        }
      }
    }
    return filteredAreas;
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
