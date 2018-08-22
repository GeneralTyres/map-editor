import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {CountryModel} from '../../../models/country.model';
import {ReferenceModel} from '../../../models/reference.model';
import {ReferenceWidgetComponent} from '../../shared-components/reference-widget/reference-widget.component';
import {CountryService} from '../../../services/country.service';

@Component({
  selector: 'app-country-modal',
  templateUrl: './country-modal.component.html',
  styleUrls: ['./country-modal.component.css']
})
export class CountryModalComponent implements OnInit {

  @Input() activeCountry;
  @ViewChild(ReferenceWidgetComponent) refWid: ReferenceWidgetComponent;

  constructor(public activeModal: NgbActiveModal,
              private countryService: CountryService) { }

  ngOnInit() {
  }

  saveCountry() {
    this.refWid.saveReference().subscribe((value: ReferenceModel) => {
      this.activeCountry.referenceId = value.id;
      this.countryService.saveCountry(this.activeCountry).subscribe(
        (response: CountryModel) => {
          this.activeModal.close(response);
        });
    });
  }

  processImage(input) {
    const file = (input.target.files[0]);
    // Create a FileReader
    const reader = new FileReader();
    reader.readAsDataURL(file);
    // Add an event listener to deal with the file when the reader is complete
    reader.addEventListener('load', (event: any) => {
      // Get the event.target.result from the reader (base64 of the image)
      const base64 = event.target.result;
      this.activeCountry.flag = base64;
    }, false);
  }

}
