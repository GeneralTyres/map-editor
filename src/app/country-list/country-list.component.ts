import { Component, OnInit } from '@angular/core';
import {CountryModel} from '../models/country.model';
import {CountryService} from '../services/country.service';
import {ActivatedRoute, Router} from '@angular/router';
import {StateService} from '../services/state.service';
import {LoaderService} from '../services/loader.service';

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
              private router: Router,
              private loaderService: LoaderService) { }

  ngOnInit() {
    this.loaderService.loadAll().then(
      () => {
        this.getData();
      }
    );
  }

  getData() {
    this.countries = this.countryService.getCountries();
  }

  goToCountry(country) {
    this.countryService.setActiveCountry(country);
    this.loaderService.navigate('country');
  }

  createNewCountry() {
    this.countryService.setActiveCountry(null);
    this.loaderService.navigate('country');
  }

}
