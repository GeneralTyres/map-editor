import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TerritoryService} from '../../../services/territory.service';
import {AreaService} from '../../../services/area.service';
import {MapService} from '../../../services/map.service';
import {ReferenceModel} from '../../../models/reference.model';
import {ReferenceWidgetComponent} from '../../shared-components/reference-widget/reference-widget.component';

let self;

@Component({
  selector: 'app-territory-modal',
  templateUrl: './territory-modal.component.html',
  styleUrls: ['./territory-modal.component.css']
})
export class TerritoryModalComponent implements OnInit {

  @Input() activeTerritory;
  @Input() activeArea;
  @Input() closeFunction;
  @ViewChild(ReferenceWidgetComponent) refWid: ReferenceWidgetComponent;
  // activeArea: any;
  date = 0;
  map: any;
  editPolygon: any;
  featureGroup: any = L.featureGroup();
  stateTypeOptions = [
    {
      name: 'Unified People',
      dashArray: 0
    },
    {
      name: 'Tribal',
      dashArray: 4
    },
    {
      name: 'Species',
      dashArray: 8
    }
  ];

  constructor(public activeModal: NgbActiveModal,
              private areaService: AreaService,
              private mapSerivce: MapService,
              public territoryService: TerritoryService) {

    self = this;
  }

  ngOnInit() {
    // Get Area
    // if (!this.activeTerritory.areaId) {
    //   this.activeArea = new AreaModel();
    // } else {
    //   this.activeArea = this.areaService.getAreaByAreaId(this.activeTerritory.areaId);
    // }
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
    this.map = L.map('map', {editable: true}).setView([-8.916216, 25.709375], 4).addLayer(osm);
    const newPolygonControl = L.Control.extend({
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
    const addPolygonShapeControl = L.Control.extend({
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
    this.map.addControl(new newPolygonControl());
    this.map.addControl(new addPolygonShapeControl());
    this.map.editTools.on('editable:enable', function (e) {
      if (this.currentPolygon) this.currentPolygon.disableEdit();
      this.currentPolygon = e.layer;
      this.fire('editable:enabled');
    });
    // Save die polygon in die variable
    this.map.editTools.on('editable:drawing:move', function (e) {
      this.currentPolygon = e.layer;
      self.editPolygon = this.currentPolygon;
    });
    // if (this.editPolygon) {
    //   this.editPolygon.remove();
    // }
    if (!this.activeArea.polygon) {
      // his.createNewPolygon();
    } else {
      const polygon = JSON.parse(this.activeArea.polygon);
      this.editPolygon = L.polygon(polygon, {color: this.activeArea.colour}).addTo(this.map);
      this.editPolygon.enableEdit();
      this.map.fitBounds(this.editPolygon.getBounds());
    }
    // Om die map weer te center
    setTimeout(function() {
      self.map.invalidateSize();
    }, 100);
  }

  showYear(date: number) {
    this.featureGroup.clearLayers();
    this.featureGroup = L.featureGroup(this.mapSerivce.getCountryLayer(date, false));
    this.featureGroup.addTo(this.map);
  }

  save() {
    this.refWid.saveReference().subscribe((value: ReferenceModel) => {
      this.activeArea.polygon = this.mapSerivce.convertLeafletPolygonToString(this.editPolygon);
      // Save die area
      this.areaService.saveArea(this.activeArea).subscribe((area: any) => {
        this.areaService.addArea(area);
        // Set die gebied se areaId
        this.activeTerritory.areaId = area.id;
        this.activeTerritory.referenceId = value.id;
        // Save die territory
        this.territoryService.saveTerritory(this.activeTerritory).subscribe(territory => {
          this.activeModal.close(territory);
        });
      });
    });
  }

}
