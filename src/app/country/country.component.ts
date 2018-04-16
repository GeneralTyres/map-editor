import {Component, OnInit, ViewChild} from '@angular/core';
import {CountryService} from '../services/country.service';
import {CountryModel} from '../models/country.model';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {
  @ViewChild('f') slForm: NgForm;

  country: CountryModel;
  createMode = true;

  constructor(private countryService: CountryService,
              private router: Router) {}

  ngOnInit() {
    this.country = this.countryService.getActiveCountry();
    if (!this.country) {
      this.createMode = true;
      this.country = new CountryModel(null, '', '', '', '', '');
    } else {
      this.createMode = false;
    }
  }

  onSubmit(form: NgForm) {
    if (this.createMode) {
      this.countryService.saveCountry(this.country).subscribe(
        (response: CountryModel) => {
          this.router.navigate(['../countries']);
        }
      );
    }
  }

  toggleCreateMode() {
    this.createMode = !this.createMode;
  }

  processImage(input) {
    const file = (input.target.files[0]);
    // Create a FileReader
    let reader = new FileReader();
    reader.readAsDataURL(file);
    // Add an event listener to deal with the file when the reader is complete
    reader.addEventListener("load", (event:any) => {
      // Get the event.target.result from the reader (base64 of the image)
      const base64 = event.target.result;
      this.country.flag = base64;
    }, false);
  }

}
