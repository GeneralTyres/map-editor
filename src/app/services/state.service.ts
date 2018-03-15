import {Injectable} from '@angular/core';
import {DataService} from './data.service';
import {StateModel} from '../models/states.model';

@Injectable()
export class StateService{
  states: StateModel[];

  constructor(private data: DataService) {
  }

  loadStates() {
    return this.data.load('states');
  }

  getStatesByCountry(country) {
    const countryStates = [];
    for (let i = 0; i < this.states.length; i++) {
      if (country.id === this.states[i].countryId) {
        countryStates.push(this.states[i]);
      }
    }
    return countryStates;
  }
}
