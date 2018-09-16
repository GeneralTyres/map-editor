import {Component, Input, OnInit} from '@angular/core';
import {CountryModel} from '../../../models/country.model';
import {StateModel} from '../../../models/states.model';

@Component({
  selector: 'app-country-dashboard',
  templateUrl: './country-dashboard.component.html',
  styleUrls: ['./country-dashboard.component.css']
})
export class CountryDashboardComponent implements OnInit {
  @Input() activeCountry: CountryModel;
  @Input() activeStates: StateModel[] = [new StateModel()];

  constructor() { }

  ngOnInit() {

  }

}
