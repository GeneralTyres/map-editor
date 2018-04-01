import {Component, OnInit, ViewChild} from '@angular/core';
import {CountryService} from '../services/country.service';
import {CountryModel} from '../models/country.model';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {
  @ViewChild('f') slForm: NgForm;

  country: CountryModel;

  constructor(private countryService: CountryService) {

  }

  ngOnInit() {
    this.country = this.countryService.getActiveCountry();
    if (this.country) {
      setTimeout(() => {    // <<<---    using ()=> syntax
        this.slForm.setValue({
          name: this.country.name,
          description: this.country.description,
          fromDate: this.country.fromDate,
          toDate: this.country.toDate
        });
      }, 500);
    } else {
      this.country = new CountryModel(null, '', '', '', '')
    }
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const country = {
        id: this.country.id,
        name: value.name,
        description: value.description,
        fromDate: value.fromDate,
        toDate: value.toDate
    };
    console.log('country ::', country);
    this.countryService.saveCountry(country).subscribe(
      (response) => {
        console.log('response ::', response);
    }
    );
    // form.reset();
  }

}
