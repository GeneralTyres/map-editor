import { Component, OnInit } from '@angular/core';
import {TraitService} from '../../../services/trait.service';
import {TraitModel} from '../../../models/trait.model';
import {BaseService} from '../../../services/base.service';
import {DomSanitizer} from '@angular/platform-browser';

let self;

@Component({
  selector: 'app-trait-management',
  templateUrl: './trait-management.component.html',
  styleUrls: ['./trait-management.component.css']
})
export class TraitManagementComponent implements OnInit {

  traits: TraitModel[];
  displayedTraits: TraitModel[];
  activeTrait: TraitModel = new TraitModel();
  searchText = '';

  constructor(
    private baseService: BaseService,
    private traitService: TraitService,
    private domSanitizer: DomSanitizer) {

    self = this;
  }

  ngOnInit() {
    this.traits = this.traitService.getTraits();
    this.displayedTraits = this.traits;
    // Make first trait the active trait
    if (this.displayedTraits.length > 0) {
      this.activeTrait = this.displayedTraits[0];
    }
  }

  search() {
    this.displayedTraits = this.traits.filter(this.searchFilter);
  }

  searchFilter(trait) {
    if (self.searchText === '') {
      // searchText is empty, display all
      return true;
    } else if (self.searchText !== undefined) {
      // searchText is not empty, filter on names and alternative names
      if (trait.name.toLowerCase().indexOf(self.searchText.toLowerCase()) > -1) {
        // match found for flowMeter name
        return true;
      }
    }
    // no match found
    return false;
  }

  createNewTrait() {
    this.activeTrait = new TraitModel();
    this.traits.unshift(this.activeTrait);
  }

  saveTrait() {
    // this.activeTrait.icon = this.activeTrait.icon.changingThisBreaksApplicationSecurity;
    this.traitService.saveTrait(this.activeTrait).subscribe((value: TraitModel) => {
      this.activeTrait = value;
    });
  }

  activateTrait(trait) {
    this.activeTrait = trait;
  }

  uploadImage(input) {
    this.baseService.getFileBase64(input, this.activeTrait, 'icon');
  }

}
