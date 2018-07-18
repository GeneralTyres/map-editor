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

  /**
   * Verwyder die era
   * @param state
   * @return {Observable<ArrayBuffer>}
   */
  deleteState(state) {
    return this.data.delete('states', state);
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

  getStateByCountryIdAndDate(countryId: number, date: number) {
    let countryStates = this.baseService.getObjectsWhereKeysHaveValues(this.states, {countryId: countryId});
    countryStates = this.baseService.sortByDate(countryStates, 'decs');
    let currentState;
    for (let i = 0; i < countryStates.length; i++) {
      if (Number(countryStates[i].date) <= date) {
        currentState = countryStates[i];
        break;
      }
    }
    return currentState;
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
