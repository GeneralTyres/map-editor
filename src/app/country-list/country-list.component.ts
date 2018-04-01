import { Component, OnInit } from '@angular/core';
import {CountryModel} from '../models/country.model';
import {CountryService} from '../services/country.service';
import {ActivatedRoute, Router} from '@angular/router';
import {StateService} from '../services/state.service';

@Component({
  selector: 'app-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.css']
})
export class CountryListComponent implements OnInit {
  countries: CountryModel[] = [];

  constructor(private countryService: CountryService,
              private stateService: StateService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.loadCountries();
  }

  loadCountries() {
    this.countryService.loadCountries().subscribe(
      (response) => {
        this.countries.push(...response);
      }
    );
  }

  goToCountry(country) {
    this.stateService.loadStates().subscribe(
      value => {
        this.stateService.setStates(value);
        this.countryService.setActiveCountry(country);
        this.router.navigate(['country']);
      }
    );
  }

}
