import { Component, OnInit } from '@angular/core';
import {BaseService} from '../../services/base.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CountryModalComponent} from '../countryEdit/country-modal/country-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MapItemService} from '../../services/mapItem.service';
import {MapItemTypeModel} from '../../models/mapItemType.model';
import {MapItemModel} from '../../models/mapItem.model';
import {MapItemModalComponent} from './map-item-modal/map-item-modal.component';

let self;

@Component({
  selector: 'app-map-item-management',
  templateUrl: './map-item-management.component.html',
  styleUrls: ['./map-item-management.component.css']
})
export class MapItemManagementComponent implements OnInit {

  mapItems: MapItemModel[] = [];
  displayedMapItems: MapItemModel[] = [];
  searchText = '';

  constructor(private mapItemService: MapItemService,
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
    this.displayedMapItems = this.mapItems.filter(this.searchFilter);
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

  getData() {
    this.mapItems = this.mapItemService.getMapItems();
    console.log('this.mapItems ::', this.mapItems);
    this.displayedMapItems = this.baseService.alphaNumericSort(this.mapItems, 'name');
  }

  // Dashboard
  // goToCountry(country) {
  //   this.countryService.setActiveCountry(country);
  //   this.router.navigate(['country']);
  // }

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
