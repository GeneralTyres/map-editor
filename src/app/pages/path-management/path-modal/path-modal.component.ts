import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ReferenceModel} from '../../../models/reference.model';
import {ReferenceWidgetComponent} from '../../shared-components/reference-widget/reference-widget.component';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {BaseService} from '../../../services/base.service';
import {PathModel} from '../../../models/path.model';
import {PathService} from '../../../services/path.service';
import {PathTypeService} from '../../../services/pathType.service';
import {PathTypeModel} from '../../../models/pathType.model';
import {MapService} from '../../../services/map.service';
import 'leaflet';
import {MapItemService} from '../../../services/mapItem.service';
import {MapItemTypeService} from '../../../services/mapItemType.service';

let self;

@Component({
  selector: 'app-path-modal',
  templateUrl: './path-modal.component.html',
  styleUrls: ['./path-modal.component.css']
})
export class PathModalComponent implements OnInit {

  map: any;
  pathTypes: PathTypeModel[] = [];
  dropDownSettings = {};
  editPolyline: any;
  @Input() activePath;
  @ViewChild(ReferenceWidgetComponent) refWid: ReferenceWidgetComponent;
  featureGroup: any = L.featureGroup();
  date = 0;

  icon = L.icon({
    iconUrl: '../../../../../assets/images/icons/torch.svg',

    iconSize:     [38, 95], // size of the icon
    iconAnchor:   [20, 50], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
  });

  constructor(public activeModal: NgbActiveModal,
              private pathService: PathService,
              private pathTypeService: PathTypeService,
              private baseService: BaseService,
              private mapService: MapService,
              private mapItemService: MapItemService,
              private mapItemTypeService: MapItemTypeService) {
    self = this;
  }

  ngOnInit() {
    this.dropDownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'name',
      pathsShowLimit: 5,
      allowSearchFilter: true
    };
    // load die data
    this.loadData();

    this.buildMap();
    if (this.baseService.isNotEmptyOrZero(this.activePath.pathTypeId)) {
      const pathType = this.pathTypeService.getPathTypeByPathTypeId(this.activePath.pathTypeId);
      this.activePath.pathTypeId = [{id: pathType.id, name: pathType.name, options: pathType.options}];
    }
  }

  loadData() {
    this.pathTypes = this.pathTypeService.getPathTypes();
  }

  buildMap() {
    const osmUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      osm = L.tileLayer(osmUrl, {
        maxZoom: 18,
        attribution: osmAttrib
      });
    // initialize the map on the "map" div with a given center and zoom
    this.map = L.map('pathMap', {editable: true}).setView([-0.163360, 13.053125], 3).addLayer(osm);
    // Add events
    const newPolygonControl = L.Control.extend({
      options: {
        position: 'topleft'
      },
      onAdd: function (map) {
        const container = L.DomUtil.create('div', 'leaflet-control leaflet-bar'),
          link = L.DomUtil.create('a', '', container);
        link.title = 'Create a new polyline';
        link.innerHTML = '▱';
        L.DomEvent.on(link, 'click', L.DomEvent.stop)
          .on(link, 'click', function () {
            map.editTools.startPolyline();
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
    // Save die polyLine in die variable
    this.map.editTools.on('editable:drawing:move', function (e) {
      this.currentPolygon = e.layer;
      self.editPolyline = this.currentPolygon;
    });
    if (this.activePath.polyline === '') {
      // his.createNewPolygon();
    } else {
      let polyline = JSON.parse(this.activePath.polyline);
      if (typeof polyline === 'string') {
        polyline = JSON.parse(polyline);
      }
      this.editPolyline = L.polyline(polyline).addTo(this.map);
      this.editPolyline.enableEdit();
      this.map.fitBounds(this.editPolyline.getBounds());
    }
    // Om die map weer te center
    setTimeout(function() {
      self.map.invalidateSize();
    }, 100);
  }

  showYear(date: number) {
    this.featureGroup.clearLayers();
    this.featureGroup = L.featureGroup(this.mapService.getMapItemLayer(date, false));
    this.featureGroup.addTo(this.map);
  }

  savePath() {
    this.activePath.pathTypeId = this.activePath.pathTypeId[0].id;
    this.activePath.polyline = this.mapService.convertLeafletPolyLinesToString(self.editPolyline.getLatLngs());
    this.activePath.polyline = JSON.stringify(this.activePath.polyline);
    this.refWid.saveReference().subscribe((value: ReferenceModel) => {
      this.activePath.referenceId = value.id;
      this.pathService.savePath(this.activePath).subscribe(
        (response: PathModel) => {
          this.activeModal.close(response);
        });
    });
  }

}
