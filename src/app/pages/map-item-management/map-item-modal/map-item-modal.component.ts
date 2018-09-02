import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ReferenceModel} from '../../../models/reference.model';
import {ReferenceWidgetComponent} from '../../shared-components/reference-widget/reference-widget.component';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {MapItemService} from '../../../services/mapItem.service';
import {MapItemModel} from '../../../models/mapItem.model';
import {BaseService} from '../../../services/base.service';
import 'leaflet';
import {MapItemTypeService} from '../../../services/mapItemType.service';
import {MapItemTypeModel} from '../../../models/mapItemType.model';

let self;

@Component({
  selector: 'app-map-item-modal',
  templateUrl: './map-item-modal.component.html',
  styleUrls: ['./map-item-modal.component.css']
})
export class MapItemModalComponent implements OnInit {

  map: any;
  marker: any;
  divIcon: any;
  mapItemTypes: MapItemTypeModel[] = [];
  dropDownSettings = {};
  @Input() activeMapItem;
  @ViewChild(ReferenceWidgetComponent) refWid: ReferenceWidgetComponent;

  icon = L.icon({
    iconUrl: '../../../../../assets/images/icons/torch.svg',

    iconSize:     [38, 95], // size of the icon
    iconAnchor:   [20, 50], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
  });

  constructor(public activeModal: NgbActiveModal,
              private mapItemService: MapItemService,
              private mapItemTypeService: MapItemTypeService,
              private baseService: BaseService) {
    self = this;
  }

  ngOnInit() {
    this.dropDownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'name',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };
    // load die data
    this.loadData();
    if (this.baseService.isNotEmptyOrZero(this.activeMapItem.itemType)) {
      console.log('this.activeMapItem.itemType ::', this.activeMapItem.itemType);
      const icon = this.mapItemTypeService.getMapItemTypeByMapItemTypeId(this.activeMapItem.itemType).icon;
      console.log('icon ::', icon);
      this.divIcon = new L.DivIcon({
        className: 'map-item-marker',
        html: '<div class="row map-item-marker"><div class="col-md-4">' +
        '<img class="map-item-icon float-left" src="' + icon + '"/></div>' +
        '<div class="col-md-8" style="padding: 0"><p class="map-item-label">' + self.activeMapItem.name + '</p></div></div>'
      });
    } else {
      this.divIcon = new L.DivIcon({
        className: 'map-item-marker',
        html: '<div class="row map-item-marker"><div class="col-md-3">' +
        '<img class="map-item-icon float-left"/></div>' +
        '<div class="col-md-8" style="padding: 0"><p class="map-item-label">' + self.activeMapItem.name + '</p></div></div>'
      });
    }

    this.buildMap();
    if (this.baseService.isNotEmptyOrZero(this.activeMapItem.itemType)) {
      const itemType = this.mapItemTypeService.getMapItemTypeByMapItemTypeId(this.activeMapItem.itemType);
      this.activeMapItem.itemType = [{id: itemType.id, name: itemType.name, icon: itemType.icon}];
    }
  }

  loadData() {
    this.mapItemTypes = this.mapItemTypeService.getMapItemTypes();
  }

  buildMap() {
    const osmUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      osm = L.tileLayer(osmUrl, {
        maxZoom: 18,
        attribution: osmAttrib
      });
    // initialize the map on the "map" div with a given center and zoom
    this.map = L.map('mapItemMap').setView([-0.163360, 13.053125], 3).addLayer(osm);
    // Add events
    this.map.on('click', function(e) {
      self.
      setNewItemLocation(e.latlng.lat, e.latlng.lng);
    });
    if (this.activeMapItem.latitude !== 0 &&
        this.activeMapItem.longitude !== 0) {
      const newLatLng = new L.LatLng(this.activeMapItem.latitude, this.activeMapItem.longitude);
      this.marker = L.marker(newLatLng, {icon: this.divIcon}).addTo(this.map);
      const latLngs = [ this.marker.getLatLng() ];
      const markerBounds = L.latLngBounds(latLngs);
      this.map.fitBounds(markerBounds);
      this.map.setZoom(8);
    }
    // Om die map weer te center
    setTimeout(function() {
      self.map.invalidateSize();
    }, 100);
  }

  drawMarkers(newLatLng) {
    this.map.clearLayers();
    this.marker = L.marker(newLatLng, {icon: this.icon}).addTo(this.map);
  }

  setMarkerLocation(lat, lng) {
    const newLatLng = new L.LatLng(lat, lng);
    if (this.baseService.isNotEmpty(this.marker)) {
      this.marker.setLatLng(newLatLng);
    } else {
      // Add marker to map at click location; add popup window
      this.drawMarkers(newLatLng);
    }
  }

  setNewItemLocation(lat, lng) {
    this.activeMapItem.latitude = lat;
    this.activeMapItem.longitude = lng;
    this.setMarkerLocation(lat, lng);
  }

  saveMapItem() {
    console.log('this.activeMapItem ::', this.activeMapItem);
    this.activeMapItem.itemType = this.activeMapItem.itemType[0].id;
    this.refWid.saveReference().subscribe((value: ReferenceModel) => {
      this.activeMapItem.referenceId = value.id;
      this.mapItemService.saveMapItem(this.activeMapItem).subscribe(
        (response: MapItemModel) => {
          this.activeModal.close(response);
        });
    });
  }

}
