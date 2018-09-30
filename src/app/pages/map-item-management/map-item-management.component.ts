import { Component, OnInit } from '@angular/core';
import {BaseService} from '../../services/base.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MapItemService} from '../../services/mapItem.service';
import {MapItemModel} from '../../models/mapItem.model';
import {MapItemModalComponent} from './map-item-modal/map-item-modal.component';
import {MapItemTypeService} from '../../services/mapItemType.service';
import {MapItemTypeModel} from '../../models/mapItemType.model';

let self;

@Component({
  selector: 'app-map-item-management',
  templateUrl: './map-item-management.component.html',
  styleUrls: ['./map-item-management.component.css']
})
export class MapItemManagementComponent implements OnInit {

  mapItems: MapItemModel[] = [];
  mapItemTypes: MapItemTypeModel[] = [];
  displayedMapItems: MapItemModel[] = [];
  searchText = '';
  page = 1;
  mapItemTypeSelection = [];

  constructor(private mapItemService: MapItemService,
              private mapItemTypeService: MapItemTypeService,
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

  filter() {
    // filter by text
    this.displayedMapItems = this.mapItems.filter(this.searchFilter);
    // filter by type
    const typeIds = [];
    for (let t = 0; t < self.mapItemTypeSelection.length; t++) {
      if (self.mapItemTypeSelection[t].checked) {
        typeIds.push(self.mapItemTypeSelection[t].id);
      }
    }
    this.displayedMapItems =
      this.baseService.getObjectsWherePropertyHasValues(
        this.mapItems,
        'itemType',
        typeIds);
    this.displayedMapItems = this.baseService.alphaNumericSort(this.displayedMapItems, 'name');
  }

  searchFilter(mapItem) {
    if (self.searchText === '') {
      // searchText is empty, display all
      return true;
    } else if (self.searchText !== undefined) {
      // searchText is not empty, filter on names and alternative names
      if (mapItem.name.toLowerCase().indexOf(self.searchText.toLowerCase()) > -1) {
        // match found for flowMeter name
        return true;
      }
    }
    // no match found
    return false;
  }

  get pageItems() {
    return this.displayedMapItems.slice((this.page - 1) * 10, this.page * 10);
  }

  getData() {
    this.mapItems = this.mapItemService.getMapItems();
    this.mapItemTypes = this.mapItemTypeService.getMapItemTypes();
    // Set check boxes
    for (let c = 0; c < this.mapItemTypes.length; c++) {
      this.mapItemTypeSelection.push(
        {id: this.mapItemTypes[c].id,
          name: this.mapItemTypes[c].name,
          checked: 1,
          icon: this.mapItemTypes[c].icon
        });
    }
    this.displayedMapItems = this.baseService.alphaNumericSort(this.mapItems, 'name');
  }

  filterItemsByType(typeId: number) {
    // Check if the array already contains value
    const index = self.mapItemTypeSelection.indexOf(typeId);
    // If value is present is present, remove it
    if (index > -1) {
      self.mapItemTypeSelection.splice(index, 1);
      // If value is not present, add it
    } else if (index === -1) {
      self.mapItemTypeSelection.push(typeId);
    }
    self.filter();
  }

  /**
   * Brings up the modal to create a new country. The country object is saved in the modal component and the result is
   * returned as value. The new map item is then added to the list.
   */
  createNewMapItem() {
    const modalRef = this.modalService.open(MapItemModalComponent, { size: 'lg', beforeDismiss: () => false });
    modalRef.componentInstance.activeMapItem = new MapItemModel();
    modalRef.result.then((value: MapItemModel) => {
      if (this.baseService.isNotEmpty(value)) {
        // Doen iets na save
        this.mapItems.push(value);
        // this.countryService.setActiveCountry(value);
        // this.router.navigate(['country']);
      }
    });
  }

  editMapItem(mapItem) {
    const modalRef = this.modalService.open(MapItemModalComponent, { size: 'lg', beforeDismiss: () => false });
    console.log('mapItem ::', mapItem);
    modalRef.componentInstance.activeMapItem = mapItem;
    modalRef.result.then((value: MapItemModel) => {
      if (this.baseService.isNotEmpty(value)) {
        // Doen iets na save
        // this.countryService.setActiveCountry(value);
        // this.router.navigate(['country']);
      }
    });
  }

}
