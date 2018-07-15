import {Component, Input, OnInit} from '@angular/core';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TerritoryService} from '../../../services/territory.service';
import {AreaService} from '../../../services/area.service';
import {AreaModel} from '../../../models/area.model';
import {MapService} from '../../../services/map.service';

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
  // activeArea: any;
  map: any;
  editPolygon: any;

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
      const poly = e.target;
      this.currentPolygon = e.layer;
      self.editPolygon = this.currentPolygon;
    });
    // if (this.editPolygon) {
    //   this.editPolygon.remove();
    // }
    if (!this.activeArea.polygon) {
      // his.createNewPolygon();t
    } else {
      const polygon = JSON.parse(this.activeArea.polygon);
      this.editPolygon = L.polygon(polygon, {color: this.activeArea.colour}).addTo(this.map);
      this.editPolygon.enableEdit();
      this.map.fitBounds(this.editPolygon.getBounds());
    }
  }

  save() {
    this.activeArea.polygon = this.mapSerivce.convertLeafletPolygonToString(this.editPolygon);
    // Save die area
    this.areaService.saveArea(this.activeArea).subscribe((area: any) => {
      this.areaService.addArea(area);
      // Set die gebied se areaId
      this.activeTerritory.areaId = area.id;
      // Save die territory
      this.territoryService.saveTerritory(this.activeTerritory).subscribe(territory => {
        this.activeModal.close(territory);
      });
    });
  }

}
