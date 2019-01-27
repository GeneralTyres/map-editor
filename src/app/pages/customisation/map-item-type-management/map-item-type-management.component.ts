import { Component, OnInit } from '@angular/core';
import { MapItemTypeService } from '../../../services/mapItemType.service';
import { MapItemTypeModel } from '../../../models/mapItemType.model';
import {BaseService} from '../../../services/base.service';
import {DomSanitizer} from '@angular/platform-browser';

let self;

@Component({
  selector: 'app-map-item-type-management',
  templateUrl: './map-item-type-management.component.html',
  styleUrls: ['./map-item-type-management.component.css']
})
export class MapItemTypeManagementComponent implements OnInit {

  mapItemTypes: MapItemTypeModel[];
  displayedMapItemTypes: MapItemTypeModel[];
  activeMapItemType: MapItemTypeModel = new MapItemTypeModel();
  searchText = '';

  constructor(
    private baseService: BaseService,
    private mapItemTypeService: MapItemTypeService,
    private domSanitizer: DomSanitizer) {

    self = this;
  }

  ngOnInit() {
    this.mapItemTypes = this.mapItemTypeService.getMapItemTypes();
    this.displayedMapItemTypes = this.mapItemTypes;
    // Make first mapItemType the active mapItemType
    if (this.displayedMapItemTypes.length > 0) {
      this.activeMapItemType = this.displayedMapItemTypes[0];
    }
  }

  search() {
    this.displayedMapItemTypes = this.mapItemTypes.filter(this.searchFilter);
  }

  searchFilter(mapItemType) {
    if (self.searchText === '') {
      // searchText is empty, display all
      return true;
    } else if (self.searchText !== undefined) {
      // searchText is not empty, filter on names and alternative names
      if (mapItemType.name.toLowerCase().indexOf(self.searchText.toLowerCase()) > -1) {
        // match found for flowMeter name
        return true;
      }
    }
    // no match found
    return false;
  }

  createNewMapItemType() {
    this.activeMapItemType = new MapItemTypeModel();
    this.mapItemTypes.unshift(this.activeMapItemType);
  }

  saveMapItemType() {
    let created = false;
    if (!this.baseService.isNotEmptyOrZero(this.activeMapItemType.id)) {
      created = true;
    }
    // this.activeMapItemType.icon = this.activeMapItemType.icon.changingThisBreaksApplicationSecurity;
    this.mapItemTypeService.saveMapItemType(this.activeMapItemType).subscribe((value: MapItemTypeModel) => {
      this.activeMapItemType = value;
      if (created) {
        this.activateMapItemType(value);
        this.displayedMapItemTypes.push(value);
      }
    });
  }

  activateMapItemType(mapItemType) {
    this.activeMapItemType = mapItemType;
  }

  uploadImage(input) {
    this.baseService.getFileBase64(input, this.activeMapItemType, 'icon');
  }

  deleteType(mapItemType, index) {
    this.mapItemTypeService.deleteMapType(mapItemType).subscribe( value => {
      this.mapItemTypes.splice(index, 1);
      this.activateMapItemType(new MapItemTypeModel());
    });
  }

}
