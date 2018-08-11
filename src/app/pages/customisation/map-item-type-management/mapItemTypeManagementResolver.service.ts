import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';

import {MapItemTypeService} from '../../../services/mapItemType.service';

@Injectable()
export class MapItemTypeManagementResolverService implements Resolve<any> {
  constructor(private mapItemTypeService: MapItemTypeService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    const promises = [];
    promises.push(this.mapItemTypeService.loadMapItemTypes());
    return Promise.all(promises).then( value => {
    });
  }
}
