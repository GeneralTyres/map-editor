import { Component, OnInit } from '@angular/core';
import {StateModel} from '../models/states.model';
import {StateService} from '../services/state.service';
import {CountryModel} from '../models/country.model';
import {CountryService} from '../services/country.service';
import 'leaflet';
import 'leaflet-editable';
import {DataService} from '../services/data.service';
import {MapService} from '../services/map.service';

@Component({
  selector: 'app-states-list',
  templateUrl: './states-list.component.html',
  styleUrls: ['./states-list.component.css']
})
export class StatesListComponent implements OnInit {

  map: any;
  poly: any;
  area: any = {
    polygon: '',
    polygonType: 0,
    colour: ''
  };
  states: StateModel[];
  country: CountryModel;
  activeState: StateModel = new StateModel(null, null, null, '', '');

  constructor(private stateSer: StateService,
              private countryService: CountryService,
              private data: DataService,
              private mapService: MapService) { }

  ngOnInit() {
    const osmUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      osm = L.tileLayer(osmUrl, {
        maxZoom: 18,
        attribution: osmAttrib
      });

    // initialize the map on the "map" div with a given center and zoom
    this.map = L.map('map', {editable: true}).setView([43.1, 1.2], 12).addLayer(osm);

    this.map.on('editable:editing', function (e) {
      console.log(e);
    });

    this.poly = L.polygon([[43.1, 1.2], [43.2, 1.3], [43.3, 1.2]]).addTo(this.map);
    this.poly.enableEdit();

    this.country = this.countryService.getActiveCountry();
    // Get country states
    this.states = this.stateSer.getStatesByCountry(this.country);
    if (this.country) {
      this.activeState.countryId = this.country.id;
    }
  }

  saveState() {
    this.area.polygon =  this.mapService.convertLeafletPolygonToString(this.poly);
    this.mapService.saveArea(this.area).subscribe(
      response => {
        console.log('response ::', response);
        this.activeState.areaId = response.id;
        this.activeState.countryId = this.country.id;
        console.log('this.activeState ::', this.activeState)
        this.stateSer.saveState(this.activeState).subscribe(
          response => {
            console.log('response ::', response);
          }
        );
      }
    );

  }

}
