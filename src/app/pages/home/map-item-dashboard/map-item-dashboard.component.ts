import {Component, Input, OnInit} from '@angular/core';
import {MapItemModel} from '../../../models/mapItem.model';

@Component({
  selector: 'app-map-item-dashboard',
  templateUrl: './map-item-dashboard.component.html',
  styleUrls: ['./map-item-dashboard.component.css']
})
export class MapItemDashboardComponent implements OnInit {
  @Input() activeMapItem: MapItemModel = new MapItemModel();

  constructor() { }

  ngOnInit() {
  }

}
