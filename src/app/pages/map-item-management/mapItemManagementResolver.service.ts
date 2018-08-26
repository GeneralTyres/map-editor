import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';

import {MapItemService} from '../../services/mapItem.service';
import {MapItemTypeService} from '../../services/mapItemType.service';

@Injectable()
export class MapItemManagementResolverService implements Resolve<any> {
  constructor(private mapItemService: MapItemService,
  private mapItemTypeService: MapItemTypeService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    const promises = [];
    promises.push(this.mapItemService.loadMapItems());
    promises.push(this.mapItemTypeService.loadMapItemTypes());
    return Promise.all(promises).then( value => {
    });
  }
}
