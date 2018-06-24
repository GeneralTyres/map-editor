import { Injectable } from '@angular/core';
import {DataService} from './data.service';
import {CountryModel} from '../models/country.model';
import {StateModel} from '../models/states.model';
import {StateService} from './state.service';
import {BaseService} from './base.service';

@Injectable()
export class CountryService {

  activeCountry: CountryModel;
  countryList: CountryModel[];

  constructor(private baseService: BaseService,
              private data: DataService,
              private stateService: StateService) { }

  /**
   * Load Countries and store them
   * @return {Promise<any>}
   */
  loadCountries() {
    return new Promise((resolve, reject) =>
      this.data.load('countries', 0).subscribe(
        (response: CountryModel[] ) => {
          this.countryList = response;
          resolve();
        }
      ));
  }

  // Active Country for country dashboard
  setActiveCountry(country: CountryModel) {
    this.activeCountry = country;
  }

  /**
   * Active Country for country dashboard
   * @return {CountryModel}
   */
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

  getCountries() {
    return this.countryList.slice();
  }

  getCountryById(countryId) {
    const country = this.baseService.getObjectsWhereKeysHaveValues(this.countryList, {id: countryId});
    return country[0];
  }

  getCountriesByDate(date: number) {
    const countries: CountryModel[] = this.getCountries();
    const matchingCountries: CountryModel[] = [];
    for (let i = 0; i < countries.length; i++) {
      if ((Number(countries[i].fromDate) <= date) && (date < Number(countries[i].toDate))) {
        matchingCountries.push(countries[i]);
      }
    }
    return matchingCountries;
  }

  /**
   * Get all the country objects with the current state and territory attached.
   * @param date
   */
  getFullCountriesByDate(date: number) {
    // Get conutries
    let currentCountries: CountryModel[] = this.getCountriesByDate(date);
    const currentCountriesIds: number[] = this.baseService.getPropertyValuesFromArray(currentCountries, 'id');
    // Get country states
    currentCountries = this.stateService.getStatesByCountryAndDate(currentCountries, date);
  }

}
