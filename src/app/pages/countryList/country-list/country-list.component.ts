import {Component, OnInit} from '@angular/core';
import {CountryModel} from '../../../models/country.model';
import {CountryService} from '../../../services/country.service';
import {ActivatedRoute, Router} from '@angular/router';
import {StateService} from '../../../services/state.service';
import {BaseService} from '../../../services/base.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CountryModalComponent} from '../../countryEdit/country-modal/country-modal.component';

let self;

@Component({
  selector: 'app-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.css']
})
export class CountryListComponent implements OnInit {

  activeCountry: CountryModel = new CountryModel();
  countries: CountryModel[] = [];
  displayedCountries: CountryModel[] = [];
  searchText = '';

  constructor(private countryService: CountryService,
              private stateService: StateService,
              private route: ActivatedRoute,
              private router: Router,
              private baseService: BaseService,
              private modalService: NgbModal) {
    self = this;
  }

  ngOnInit() {
    const user = sessionStorage.getItem('activeUser');
    if (!this.baseService.isNotEmpty(user)) {
      this.router.navigate(['home']);
    }
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
    const modalRef = this.modalService.open(CountryModalComponent, { size: 'lg', beforeDismiss: () => false });
    this.activeCountry = new CountryModel();
    modalRef.componentInstance.activeCountry = this.activeCountry;
    modalRef.result.then((value: CountryModel) => {
      if (this.baseService.isNotEmpty(value)) {
        // Doen iets na save
        this.countryService.setActiveCountry(value);
        this.router.navigate(['country']);
      }
    });
  }

}
