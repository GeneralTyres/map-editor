import { Injectable } from '@angular/core';
import {DataService} from './data.service';
import {CountryModel} from '../models/country.model';

@Injectable()
export class CountryService {

  activeCountry: CountryModel;

  constructor(private data: DataService) { }

  loadCountries() {
    return this.data.load('countries');
  }

  setActiveCountry(country: CountryModel) {
    this.activeCountry = country;
  }

  getActiveCountry() {
    return this.activeCountry;
  }

  saveCountry(country: any) {
    if (country.id) {
      return this.data.update('countries', country);
    } else {
      return this.data.create('countries', country);
    }
  }

}
