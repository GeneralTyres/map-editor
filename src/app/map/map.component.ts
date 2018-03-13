import { Component, OnInit } from '@angular/core';
import 'leaflet';
import 'leaflet-editable';
import {HttpClient} from '@angular/common/http';
import {DataService} from '../services/data.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  map: any;
  poly: any;
  maps: any[];

  constructor(private http: HttpClient,
              private data: DataService) { }

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

    // this.poly = L.polygon([[43.1, 1.2], [43.2, 1.3], [43.3, 1.2]]).addTo(this.map);
    // this.poly.enableEdit();

    this.loadData();
  }

  loadData () {
    this.data.load('states').subscribe(
      data => {
        const polyline = L.polygon(JSON.parse(data[0].polygon)).addTo(this.map);
        const tri = L.polygon(JSON.parse(data[1].polygon)).addTo(this.map);
      }
    );
  }

  saveData() {

    console.log('this.poly ::', this.poly.getLatLngs());
    const pol = this.poly.getLatLngs()[0];
    const arr = [];
    console.log('pol ::', pol)
    for (let o = 0; o < pol.length; o++) {
      arr.push([pol[o].lat, pol[o].lng]);
    }
    const str = JSON.stringify(arr);
    this.http.post('http://192.168.0.109:1337/states', {polygon: str})
      .subscribe(value => {
        console.log('value ::', value)
      });
  }



}
