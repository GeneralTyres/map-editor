import {Injectable} from '@angular/core';
import {DataService} from './data.service';
import {StateModel} from '../models/states.model';
import {CountryModel} from '../models/country.model';

@Injectable()
export class StateService {
  states: StateModel[] = [];

  constructor(private data: DataService) {
  }

  loadStates() {
    return this.data.load('states');
  }

  saveState(state) {
    if (state.id) {
      return this.data.update('states', state);
    } else {
      delete state.id;
      return this.data.create('states', state);
    }
  }

  setStates(states: any[]) {
    for (let i = 0; i < states.length; i++) {
      this.states.push(new StateModel(
        states[i].id,
        states[i].countryId,
        states[i].fromDate,
        states[i].toDate,
        states[i].createdAt,
        states[i].updatedAt));
    }
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

  getStatesByCountryAndDate(countries, date, areas, states) {
    console.log('date ::', date)
    console.log('areas ::', areas)
    this.states = states;
    console.log('this.states ::', this.states)
    const countryStates = [];
    const filteredAreas = [];
    for (let j = 0; j < countries.length; j++) {
      for (let i = 0; i < this.states.length; i++) {
        if (countries[j].id === this.states[i].countryId && this.states[i].fromDate <= date && this.states[i].toDate > date) {
          countryStates.push(this.states[i]);
        }
      }
    }
    console.log('countryStates ::', countryStates)
    for (let o = 0; o < countryStates.length; o++) {
      for (let r = 0; r < areas.length; r++) {
        if (areas[r].id === countryStates[o].areaId) {
          filteredAreas.push(areas[r]);
        }
      }
    }
    return filteredAreas;
  }
}
