import {Component, Input, OnInit} from '@angular/core';
import {StateModel} from '../models/states.model';
import {StateService} from '../services/state.service';
import {CountryModel} from '../models/country.model';
import {CountryService} from '../services/country.service';
import 'leaflet';
import 'leaflet-editable';
import {DataService} from '../services/data.service';
import {MapService} from '../services/map.service';
import {AreaService} from '../services/area.service';

@Component({
  selector: 'app-states-list',
  templateUrl: './states-list.component.html',
  styleUrls: ['./states-list.component.css']
})
export class StatesListComponent implements OnInit {

  @Input() country: CountryModel;

  map: any;
  poly: any;
  area: any = {
    polygon: '',
    polygonType: 0,
    colour: ''
  };
  states: StateModel[];
  activeState: StateModel = new StateModel(null, null, null, '', '', null, null);
  createMode = false;

  constructor(private stateSer: StateService,
              private countryService: CountryService,
              private data: DataService,
              private mapService: MapService,
              private areaService: AreaService) { }

  ngOnInit() {
    console.log('this.createMode ::', this.createMode)
    const osmUrl = 'https://mt0.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
      osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      osm = L.tileLayer(osmUrl, {
        maxZoom: 18,
        attribution: osmAttrib
      });

    // initialize the map on the "map" div with a given center and zoom
    this.map = L.map('map', {editable: true}).setView([43.1, 1.2], 12).addLayer(osm);

    this.map.on('editable:editing', function (e) {
      //
    });
    // Get country states
    this.states = this.stateSer.getStatesByCountry(this.country).sort(function(a, b){return b.date - a.date});
    if (this.states.length > 0) {
      this.activateState(this.states[0]);
    }
  }

  saveState() {
    this.area.polygon =  this.mapService.convertLeafletPolygonToString(this.poly);
    this.mapService.saveArea(this.area).subscribe(
      response => {
        this.activeState.areaId = response.id;
        this.activeState.countryId = this.country.id;
        const newState = false;
        this.stateSer.saveState(this.activeState).subscribe(
          () => {

          }
        );
      }
    );
  }

  createNewState() {
    this.activeState = new StateModel(null, (this.country ? this.country.id : null), null, '', '',  '',
      '', 0, 0);
    if (this.poly) {
      this.poly.remove();
    }
    this.poly = L.polygon([[-0.514916, 13.756250], [-12.713968, 38.717188], [-31.192780, 14.810938]]).addTo(this.map);
    this.poly.enableEdit();
    this.map.fitBounds(this.poly.getBounds());
  }

  extendState(oldState) {
    this.displayAreaById(oldState.areaId);
    const state = new StateModel(null, oldState.countryId, null, '', '', '', '',
      0, 0);
    this.activateState(state);
  }

  activateState(state) {
    if (state.areaId) {
      this.displayAreaById(state.areaId);
    }
    this.activeState = state;
  }

  displayAreaById(areaId) {
    if (this.poly) {
      this.poly.remove();
    }
    const area = this.areaService.getAreaByAreaId(areaId);
    this.area.colour = area.colour;
    const polygon = JSON.parse(area.polygon);
    this.poly = L.polygon(polygon, {color: area.colour}).addTo(this.map);
    this.map.fitBounds(this.poly.getBounds());
    this.poly.enableEdit();
  }

}
