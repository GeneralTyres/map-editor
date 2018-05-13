import {Component, OnInit, Input} from '@angular/core';
import 'leaflet';
import 'leaflet-editable';
import {CountryModel} from '../models/country.model';
import {StateService} from '../services/state.service';
import {AreaService} from '../services/area.service';

@Component({
  selector: 'app-country-map',
  templateUrl: './country-map.component.html',
  styleUrls: ['./country-map.component.css']
})
export class CountryMapComponent implements OnInit {
  @Input() mapCountry: CountryModel;

  map: any;
  newestState: any;
  newestArea: any;

  constructor(private stateService: StateService,
              private areaService: AreaService) { }

  ngOnInit() {
    if (this.mapCountry.hasOwnProperty('id')) {
      if (this.mapCountry.id) {
        this.newestState = this.stateService.getNewestStateByCountryId(this.mapCountry.id);
        if (this.newestState) {
          this.newestArea = this.areaService.getAreaByAreaId(this.newestState.areaId);
        }
      }
      this.buildMap();
    }
  }

  buildMap() {
    const osmUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      osm = L.tileLayer(osmUrl, {
        maxZoom: 18,
        attribution: osmAttrib
      });
    // initialize the map on the "map" div with a given center and zoom
    this.map = L.map('countryMap').setView([-0.163360, 13.053125], 3).addLayer(osm);
    if (this.mapCountry.id && this.newestState) {
      const newState = L.polygon(JSON.parse(this.newestArea.polygon),
        {color: this.newestArea.colour, dashArray: '15, 10, 5'}).addTo(this.map);
      this.map.fitBounds(newState.getBounds());
    }

  }

}
