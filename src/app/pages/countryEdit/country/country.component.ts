import {Component, OnInit, ViewChild} from '@angular/core';
import {CountryService} from '../../../services/country.service';
import {CountryModel} from '../../../models/country.model';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import 'leaflet';
import 'leaflet-editable';
import {StateModel} from '../../../models/states.model';
import {StateService} from '../../../services/state.service';
import {AreaService} from '../../../services/area.service';
import {MapService} from '../../../services/map.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

let self;

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {
  @ViewChild('f') slForm: NgForm;

  country: CountryModel;
  createMode = true;
  // State list
  states: StateModel[];
  activeState: StateModel = new StateModel(null, null, null, '', '', '', '', null, null);
  map: any;
  poly: any;
  area: any = {
    polygon: '',
    polygonType: 0,
    colour: ''
  };
  showStateEdit = false;


  constructor(private countryService: CountryService,
              private router: Router,
              private stateSer: StateService,
              private mapService: MapService,
              private areaService: AreaService,
              private spinnerService: Ng4LoadingSpinnerService) {
    self = this;
  }

  ngOnInit() {
    this.country = this.countryService.getActiveCountry();
    if (!this.country) {
      this.createMode = true;
      this.country = new CountryModel(null, '', '', '', '', '');
    } else {
      this.createMode = false;
    }
    // Load map
    this.loadMap();
    // Get country states
    this.states = this.stateSer.getStatesByCountry(this.country).sort(function(a, b) {
      return b.date - a.date;
    });
    if (this.states.length !== 0) {
      this.activateState(this.states[0]);
    }
  }

  loadMap() {
    const osmUrl = 'https://mt0.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
      osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      osm = L.tileLayer(osmUrl, {
        maxZoom: 18,
        attribution: osmAttrib
      });

    // initialize the map on the "map" div with a given center and zoom
    this.map = L.map('map', {editable: true}).setView([-0.163360, 13.053125], 3).addLayer(osm);

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
    const reader = new FileReader();
    reader.readAsDataURL(file);
    // Add an event listener to deal with the file when the reader is complete
    reader.addEventListener('load', (event: any) => {
      // Get the event.target.result from the reader (base64 of the image)
      const base64 = event.target.result;
      this.country.flag = base64;
    }, false);
  }

  saveState() {
    this.spinnerService.show();
    this.area.polygon =  this.mapService.convertLeafletPolygonToString(this.poly);
    this.mapService.saveArea(this.area).subscribe(
      (response: any) => {
        this.activeState.areaId = response.id;
        this.activeState.countryId = this.country.id;
        const newState = false;
        this.stateSer.saveState(this.activeState).subscribe(
          (stateResponse: StateModel) => {
            this.spinnerService.hide();
            this.poly.disableEdit();
            self.showStateEdit = false;
          }
        );
      }
    );
  }

  createNewState() {
    this.showStateEdit = true;
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
    this.showStateEdit = true;
    this.poly.enableEdit();
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

  editState() {
    this.showStateEdit = true;
    this.poly.enableEdit();
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
  }

}
