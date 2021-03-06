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
import {TerritoryService} from '../../../services/territory.service';
import {BaseService} from '../../../services/base.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TerritoryModalComponent} from '../territory-modal/territory-modal.component';
import {TerritoryModel} from '../../../models/territory.model';
import {AreaModel} from '../../../models/area.model';
import {ReferenceWidgetComponent} from '../../shared-components/reference-widget/reference-widget.component';
import {CountryModalComponent} from '../country-modal/country-modal.component';
import {StateModalComponent} from '../state-modal/state-modal.component';

let self;

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {
  @ViewChild('f') slForm: NgForm;
  @ViewChild(ReferenceWidgetComponent) refWid: ReferenceWidgetComponent;

  activeCountry: CountryModel;
  // Wysig waardes
  creatingCountry = false;
  // State list
  states: StateModel[];
  territoryPreviewMap: any;
  poly: any;
  area: any = {
    polygon: '',
    polygonType: 0,
    colour: ''
  };
  showStateEdit = false;
  territories: any;
  activeTerritory;

  constructor(private countryService: CountryService,
              private router: Router,
              private stateSer: StateService,
              private mapService: MapService,
              private areaService: AreaService,
              private territoryService: TerritoryService,
              private baseService: BaseService,
              private modalService: NgbModal) {
    self = this;
    this.creatingCountry = false;
  }

  ngOnInit() {
    const user = sessionStorage.getItem('activeUser');
    if (!this.baseService.isNotEmpty(user)) {
      this.router.navigate(['home']);
    }
    this.activeCountry = this.countryService.getActiveCountry();
    if (!this.activeCountry) {
      // Die bladsy het geherlaai. Gaan terug na die lande lys
      this.router.navigate(['countries']);
    } else if (!this.activeCountry.id) {
      // Maak 'n nuwe land
      this.creatingCountry = true;
    } else {
      // Wysig 'n land\
      this.territories = this.territoryService.getTerritoriesByCountryId(this.activeCountry.id);
      this.loadTerritoryMap();
    }
    // Get country states
    this.states = this.stateSer.getStatesByCountry(this.activeCountry).sort(function(a, b) {
      return b.date - a.date;
    });
  }

  loadTerritoryMap() {
    const osmUrl = 'https://mt0.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
      osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      osm = L.tileLayer(osmUrl, {
        maxZoom: 18,
        attribution: osmAttrib
      });

    // initialize the map on the "map" div with a given center and zoom
    this.territoryPreviewMap = L.map(
      'territoryPreview',
      {editable: true}).setView([-0.163360, 13.053125],
      3).addLayer(osm);
    if (this.territories.length > 0) {
      this.displayAreaById(this.territories[0].areaId);
    }
  }

  editCountry() {
    const modalRef = this.modalService.open(CountryModalComponent, { size: 'lg', beforeDismiss: () => false });
    modalRef.componentInstance.activeCountry = this.activeCountry;
    modalRef.result.then((value: CountryModel) => {
      if (this.baseService.isNotEmpty(value)) {
        // Doen iets na save
        this.countryService.setActiveCountry(value);
        this.router.navigate(['country']);
      }
    });
  }

  createNewState() {
    const newState = new StateModel();
    newState.countryId = this.activeCountry.id;
    this.activateState(newState, null);
  }

  activateState(state, index) {
    const modalRef = this.modalService.open(StateModalComponent, { size: 'lg', beforeDismiss: () => false });
    modalRef.componentInstance.activeState = state;
    modalRef.result.then(value => {
      // Doen iets na save
      if ((index === undefined || index === null) && value.id) {
        this.states.push(value);
      }
    });
  }

  deleteState(state, index) {
    this.stateSer.deleteState(state).subscribe(() => {
      this.states.splice(index, 1);
    });
  }

  displayAreaById(areaId) {
    if (this.poly) {
      this.poly.remove();
    }
    const area = this.areaService.getAreaByAreaId(areaId);
    if (!area) {
      // this.createNewPolygon();
    } else {
      this.area = area;
      const polygon = JSON.parse(area.polygon);
      this.poly = L.polygon(polygon, {color: area.colour}).addTo(this.territoryPreviewMap);
    }
    this.territoryPreviewMap.fitBounds(this.poly.getBounds());
    // this.poly.enableEdit();
  }

  /**
   * Vertoon die gebied se besonderhede op die bladsy. Skep ook die gebied se area op die kaart
   * @param {*} territory - territory to be edited
   * @param {*} area - area to be edited
   * @param {Number} index - index of entity
   */
  activateTerritory(territory, area, index) {
    const modalRef = this.modalService.open(TerritoryModalComponent, { size: 'lg', beforeDismiss: () => false });
    modalRef.componentInstance.activeTerritory = territory;
    if (!area) {
      modalRef.componentInstance.activeArea = this.areaService.getAreaByAreaId(territory.areaId);
    } else {
      modalRef.componentInstance.activeArea = area;
    }
    // Wanneer die modal toe maak
    modalRef.result.then(value => {
      // Doen iets na save
      if ((index === undefined || index === null) && value) {
        this.territories.push(value);
      }
    });
  }

  /**
   * Skep 'n nuwe gebied
   */
  createNewTerritory() {
    // Maak nuwe territory
    const newTerritory = new TerritoryModel();
    newTerritory.countryId = this.activeCountry.id;
    this.activateTerritory(newTerritory, new AreaModel(), null);
  }

  /**
   * Copy 'n nuwe gebied
   */
  duplicateNewTerritory(territory) {
    // Maak nuwe territory
    const newTerritory = new TerritoryModel();
    const newArea = new AreaModel();
    const dupArea = this.areaService.getAreaByAreaId(territory.areaId);
    newArea.polygon = dupArea.polygon;
    newArea.polygonType = dupArea.polygonType;
    newArea.colour = dupArea.colour;
    newTerritory.countryId = this.activeCountry.id;
    this.activateTerritory(newTerritory, newArea, null);
  }

  /**
   * Verwyder die gebied
   * @param territory
   * @param {Number} index - index of entity
   */
  deleteTerritory(territory, index) {
    this.territoryService.deleteTerritory(territory).subscribe(() => {
      this.territories.splice(index, 1);
    });
  }

}
