import {Component, OnInit} from '@angular/core';
import {CountryModel} from '../../../models/country.model';
import {CountryService} from '../../../services/country.service';
import {ActivatedRoute, Router} from '@angular/router';
import {StateService} from '../../../services/state.service';
import {BaseService} from '../../../services/base.service';

let self;

@Component({
  selector: 'app-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.css']
})
export class CountryListComponent implements OnInit {
  countries: CountryModel[] = [];
  displayedCountries: CountryModel[] = [];
  searchText = '';

  constructor(private countryService: CountryService,
              private stateService: StateService,
              private route: ActivatedRoute,
              private router: Router,
              private baseService: BaseService) {
    self = this;
  }

  ngOnInit() {
    this.getData();
  }

  search() {
    this.displayedCountries = this.countries.filter(this.searchFilter);
  }

  searchFilter(country) {
    if (self.searchText === '') {
      // searchText is empty, display all
      return true;
    } else if (self.searchText !== undefined) {
      // searchText is not empty, filter on names and alternative names
      if (country.name.toLowerCase().indexOf(self.searchText.toLowerCase()) > -1) {
        // match found for flowMeter name
        return true;
      }
    }
    // no match found
    return false;
  }

  getData() {
    this.countries = this.countryService.getCountries();
    this.displayedCountries = this.baseService.alphaNumericSort(this.countries, 'name');
  }

  goToCountry(country) {
    this.countryService.setActiveCountry(country);
    this.router.navigate(['country']);
  }

  createNewCountry() {
    this.countryService.setActiveCountry(new CountryModel());
    this.router.navigate(['country']);
  }

}
