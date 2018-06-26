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
import {TerritoryService} from '../../../services/territory.service';

let self;

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {
  @ViewChild('f') slForm: NgForm;

  country: CountryModel;
  editCountry = true;
  editEras = true;
  // State list
  states: StateModel[];
  activeState: StateModel = new StateModel(null, null, null, '', '', '', 0, 0, 0, '', null, null);
  map: any;
  poly: any;
  area: any = {
    polygon: '',
    polygonType: 0,
    colour: ''
  };
  showStateEdit = false;
  territories: any;
  activeTerritory: any = {
    name: '',
    date: null
  };

  constructor(private countryService: CountryService,
              private router: Router,
              private stateSer: StateService,
              private mapService: MapService,
              private areaService: AreaService,
              private territoryService: TerritoryService,
              private spinnerService: Ng4LoadingSpinnerService) {
    self = this;
  }

  ngOnInit() {
    this.country = this.countryService.getActiveCountry();
    if (!this.country) {
      this.editCountry = true;
      this.country = new CountryModel(null, '', '', '', '', '');
    } else {
      this.editCountry = false;
    }
    // Get country states
    this.states = this.stateSer.getStatesByCountry(this.country).sort(function(a, b) {
      return b.date - a.date;
    });
    if (this.states.length !== 0) {
      this.activateState(this.states[0]);
    }
    this.territories = this.territoryService.getTerritoriesByCountryId(this.country.id);
    this.loadTerritoryMap();
  }

  loadTerritoryMap() {
    const osmUrl = 'https://mt0.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
      osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      osm = L.tileLayer(osmUrl, {
        maxZoom: 18,
        attribution: osmAttrib
      });

    // initialize the map on the "map" div with a given center and zoom
    this.map = L.map('map', {editable: true}).setView([-0.163360, 13.053125], 3).addLayer(osm);
    L.NewPolygonControl = L.Control.extend({
      options: {
        position: 'topleft'
      },
      onAdd: function (map) {
        const container = L.DomUtil.create('div', 'leaflet-control leaflet-bar'),
          link = L.DomUtil.create('a', '', container);
        link.title = 'Create a new polygon';
        link.innerHTML = '▱';
        L.DomEvent.on(link, 'click', L.DomEvent.stop)
          .on(link, 'click', function () {
            map.editTools.startPolygon();
          });
        container.style.display = 'block';
        map.editTools.on('editable:enabled', function (e) {
          container.style.display = 'none';
        });
        map.editTools.on('editable:disable', function (e) {
          container.style.display = 'block';
        });
        map.editTools.on('editable:drawing:move', function (e) {

        });
        return container;
      }
    });
    L.AddPolygonShapeControl = L.Control.extend({
      options: {
        position: 'topleft'
      },
      onAdd: function (map) {
        const container = L.DomUtil.create('div', 'leaflet-control leaflet-bar'),
          link = L.DomUtil.create('a', '', container);
        link.title = 'Create a new polygon';
        link.innerHTML = '▱▱';
        L.DomEvent.on(link, 'click', L.DomEvent.stop)
          .on(link, 'click', function () {
            if (!map.editTools.currentPolygon) return;
            map.editTools.currentPolygon.editor.newShape();
          });
        container.style.display = 'none';
        map.editTools.on('editable:enabled', function (e) {
          container.style.display = 'block';
        });
        map.editTools.on('editable:disable', function (e) {
          container.style.display = 'none';
        });
        return container;
      }
    });
    this.map.addControl(new L.NewPolygonControl());
    this.map.addControl(new L.AddPolygonShapeControl());
    this.map.editTools.on('editable:enable', function (e) {
      if (this.currentPolygon) this.currentPolygon.disableEdit();
      this.currentPolygon = e.layer;
      this.fire('editable:enabled');
    });
    this.map.editTools.on('editable:drawing:move', function (e) {
      const poly = e.target;
      this.currentPolygon = e.layer;
      self.poly = this.currentPolygon;
      console.log('this.currentPolygon', this.currentPolygon.getLatLngs());
    });
  }

  onSubmit(form: NgForm) {
    if (this.editCountry) {
      this.spinnerService.show();
      this.countryService.saveCountry(this.country).subscribe(
        (response: CountryModel) => {
          this.spinnerService.hide();
          this.router.navigate(['../countries']);
        }
      );
    }
  }

  /**
   * Maak die land besonderede bewerkbaar
   */
  toggleEditCountry() {
    this.editCountry = !this.editCountry;
  }

  /**
   * Maak die eras besonderede bewerkbaar
   */
  toggleEditEra() {
    this.editEras = !this.editEras;
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
    if (this.activeState.countryId !== null) {
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
  }

  saveTerritory() {
    if (this.activeTerritory.countryId !== null) {
      this.spinnerService.show();
      this.area.polygon =  this.mapService.convertLeafletPolygonToString(this.poly);
      this.mapService.saveArea(this.area).subscribe(
        (response: any) => {
          this.activeTerritory.areaId = response.id;
          this.activeTerritory.countryId = this.country.id;
          this.territoryService.saveTerritory(this.activeTerritory).subscribe(
            (stateResponse: any) => {
              this.spinnerService.hide();
              this.poly.disableEdit();
            }
          );
        }
      );
    }
  }

  createNewState() {
    // Load map
    this.loadTerritoryMap();
    this.showStateEdit = true;
    this.activeState = new StateModel(null, (this.country ? this.country.id : null), null, '', '',  '',
      0, 0, 0, '', 0, 0);
    if (this.poly) {
      this.poly.remove();
    }
    this.createNewPolygon();
    this.poly.enableEdit();
    this.map.fitBounds(this.poly.getBounds());
  }

  createNewPolygon() {
    if (this.poly) {
      this.poly.remove();
    }
    this.poly = L.polygon([[-0.514916, 13.756250], [-12.713968, 38.717188], [-31.192780, 14.810938]]).addTo(this.map);
    this.map.fitBounds(this.poly.getBounds());
    this.poly.enableEdit();
  }

  extendState(oldState) {
    this.showStateEdit = true;
    this.displayAreaById(oldState.areaId);
    const state = new StateModel(null, oldState.countryId, null, '', '', '', 0, 0,
      0, '', 0, 0);
    this.activateState(state);
    this.poly.enableEdit();
  }

  activateState(state) {
    if (state.areaId) {
      // this.displayAreaById(state.areaId);
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
    if (!area) {
      this.createNewPolygon();
    } else {
      this.area.colour = area.colour;
      const polygon = JSON.parse(area.polygon);
      this.poly = L.polygon(polygon, {color: area.colour}).addTo(this.map);
    }
    this.map.fitBounds(this.poly.getBounds());
  }

  activateTerritory(territory) {
    if (this.poly) {
      this.poly.remove();
    }
    const area = this.areaService.getAreaByAreaId(territory.areaId);
    this.activeTerritory = territory;
    if (!area) {
      this.createNewPolygon();
    } else {
      this.area.colour = area.colour;
      const polygon = JSON.parse(area.polygon);
      this.poly = L.polygon(polygon, {color: area.colour}).addTo(this.map);
    }
    this.map.fitBounds(this.poly.getBounds());
  }

  /**
   * Skep 'n nuwe gebied
   */
  createNewTerritory() {
    // Maak nuwe polygon
    this.createNewPolygon();
  }

}
