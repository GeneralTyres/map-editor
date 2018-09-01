import {Component, Input, OnInit} from '@angular/core';
import {MapItemModel} from '../../../models/mapItem.model';
import {MapItemTypeService} from '../../../services/mapItemType.service';
import {MapItemTypeModel} from '../../../models/mapItemType.model';
import {BaseService} from '../../../services/base.service';

@Component({
  selector: 'app-map-item-dashboard',
  templateUrl: './map-item-dashboard.component.html',
  styleUrls: ['./map-item-dashboard.component.css']
})
export class MapItemDashboardComponent implements OnInit {
  private _activeMapItem: MapItemModel;
  activeMapItemType: MapItemTypeModel;
  @Input() set activeMapItem(value: MapItemModel) {
    this._activeMapItem = value;
    this.displayItemType();
  }

  constructor(
    private baseService: BaseService,
    private mapItemTypeService: MapItemTypeService) { }

  ngOnInit() {

  }

  displayItemType() {
    if (this.baseService.isNotEmpty(this._activeMapItem)) {
      this.activeMapItemType = this.mapItemTypeService.getMapItemTypeByMapItemTypeId(this._activeMapItem.itemType);
    }
  }

}
