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
import {StateModalComponent} from '../state-modal/state-modal.component';
import {TerritoryModel} from '../../../models/territory.model';
import {AreaModel} from '../../../models/area.model';

let self;

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {
  @ViewChild('f') slForm: NgForm;

  country: CountryModel;
  // Wysig waardes
  creatingCountry = false;
  editCountry = true;
  editEras = true;
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
    this.country = this.countryService.getActiveCountry();
    if (!this.country) {
      // Die bladsy het geherlaai. Gaan terug na die lande lys
      this.router.navigate(['countries']);
    } else if (!this.country.id) {
      // Maak 'n nuwe land
      this.editCountry = true;
      this.creatingCountry = true;
    } else {
      // Wysig 'n land
      this.editCountry = true;
      this.territories = this.territoryService.getTerritoriesByCountryId(this.country.id);
      this.loadTerritoryMap();
    }
    // Get country states
    this.states = this.stateSer.getStatesByCountry(this.country).sort(function(a, b) {
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
    this.territoryPreviewMap = L.map('territoryPreview', {editable: true}).setView([-0.163360, 13.053125], 3).addLayer(osm);
    if (this.territories.length > 0) {
      this.displayAreaById(this.territories[0].areaId);
    }
  }

  saveCountry() {
    if (this.editCountry) {
      this.countryService.saveCountry(this.country).subscribe(
        (response: CountryModel) => {
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

  createNewState() {
    const newState = new StateModel();
    newState.countryId = this.country.id;
    this.activateState(newState, null);
  }

  activateState(state, index) {
    const modalRef = this.modalService.open(StateModalComponent, { size: 'lg', beforeDismiss: () => false });
    modalRef.componentInstance.activeState = state;
    modalRef.result.then(value => {
      // Doen iets na save
      if ((index === undefined || index === null) && value) {
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
    newTerritory.countryId = this.country.id;
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
    newTerritory.countryId = this.country.id;
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
