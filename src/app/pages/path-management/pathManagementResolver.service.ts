import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';

import {PathService} from '../../services/path.service';
import {PathTypeService} from '../../services/pathType.service';
import {MapItemService} from '../../services/mapItem.service';
import {MapItemTypeService} from '../../services/mapItemType.service';

@Injectable()
export class PathManagementResolverService implements Resolve<any> {
  constructor(private pathService: PathService,
  private pathTypeService: PathTypeService,
  private mapItemService: MapItemService,
  private mapItemTypeService: MapItemTypeService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    const promises = [];
    promises.push(this.pathService.loadPaths());
    promises.push(this.pathTypeService.loadPathTypes());
    promises.push(this.mapItemService.loadMapItems());
    promises.push(this.mapItemTypeService.loadMapItemTypes());
    return Promise.all(promises).then( value => {
    });
  }
}
