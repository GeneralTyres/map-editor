import {Component, OnInit} from '@angular/core';
import {BaseService} from '../../../services/base.service';
import {DomSanitizer} from '@angular/platform-browser';
import {PathTypeModel} from '../../../models/pathType.model';
import {PathTypeService} from '../../../services/pathType.service';
import {antPath} from '../../../../../node_modules/leaflet-ant-path/dist/leaflet-ant-path';
import {PathTypeDefaultModel} from '../../../models/pathTypeDefault.model';
import 'leaflet';

let self;

@Component({
  selector: 'app-path-type-management',
  templateUrl: './path-type-management.component.html',
  styleUrls: ['./path-type-management.component.css']
})
export class PathTypeManagementComponent implements OnInit {

  pathTypes: PathTypeModel[];
  displayedPathTypes: PathTypeModel[];
  activePathType: PathTypeModel = new PathTypeModel();
  searchText = '';
  map: any;
  path: any;
  activeOptions = new PathTypeDefaultModel();

  constructor(
    private baseService: BaseService,
    private pathTypeService: PathTypeService) {

    self = this;
  }

  ngOnInit() {
    this.pathTypes = this.pathTypeService.getPathTypes();
    this.displayedPathTypes = this.pathTypes;
    // Make first pathType the active pathType
    if (this.displayedPathTypes.length > 0) {
      this.activePathType = this.displayedPathTypes[0];
    }
    this.loadPathMap();
    // setTimeout(function(){ }, 400);
  }

  search() {
    this.displayedPathTypes = this.pathTypes.filter(this.searchFilter);
  }

  searchFilter(pathType) {
    if (self.searchText === '') {
      // searchText is empty, display all
      return true;
    } else if (self.searchText !== undefined) {
      // searchText is not empty, filter on names and alternative names
      if (pathType.name.toLowerCase().indexOf(self.searchText.toLowerCase()) > -1) {
        // match found for flowMeter name
        return true;
      }
    }
    // no match found
    return false;
  }

  createNewPathType() {
    this.activePathType = new PathTypeModel();
    this.pathTypes.unshift(this.activePathType);
    this.activeOptions = new PathTypeDefaultModel();
    this.drawPath();
  }

  savePathType() {
    this.activePathType.options = JSON.stringify(this.activeOptions);
    // this.activePathType.icon = this.activePathType.icon.changingThisBreaksApplicationSecurity;
    this.pathTypeService.savePathType(this.activePathType).subscribe((value: PathTypeModel) => {
      this.activePathType = value;
    });
  }

  activatePathType(pathType) {
    this.activePathType = pathType;
    this.activeOptions = JSON.parse(this.activePathType.options);
    this.drawPath();
  }

  loadPathMap() {
    const terrain = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaXNhd255dSIsImEiOiJBWEh1dUZZIn0.SiiexWxHHESIegSmW8wedQ', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 10,
      id: 'isawnyu.map-knmctlkh',
      accessToken: 'pk.eyJ1IjoiaXNhd255dSIsImEiOiJBWEh1dUZZIn0.SiiexWxHHESIegSmW8wedQ'
    });
    // initialize the map on the "map" div with a given center and zoom
    this.map = L.map('map').setView([-8.916216, 25.709375], 4).addLayer(terrain);

    this.drawPath();
  }

  drawPath() {
    if (this.baseService.isNotEmpty(this.path)) {
      this.map.removeLayer(this.path);
    }
    this.path = antPath(
      [
        [34.358175, -3.869128],
        [36.837866, 8.954814],
        [37.955027, 13.962390],
        [39.426116, 16.673086],
        [42.413825, 13.006804],
        [45.141852, 19.068605],
      ],
      {
        "delay": this.activeOptions.delay,
        "dashArray": [this.activeOptions.dashArray1, this.activeOptions.dashArray2],
        "weight": this.activeOptions.weight,
        "color": this.activeOptions.colour,
        "pulseColor": this.activeOptions.pulseColour,
        "paused": this.activeOptions.paused,
        "reverse": this.activeOptions.reverse}
    );
    this.map.addLayer(this.path);
    this.map.fitBounds(this.path.getBounds());
  }

}
