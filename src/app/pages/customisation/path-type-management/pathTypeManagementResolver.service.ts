import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';

import {PathTypeService} from '../../../services/pathType.service';

@Injectable()
export class PathTypeManagementResolverService implements Resolve<any> {
  constructor(private pathTypeService: PathTypeService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    const promises = [];
    promises.push(this.pathTypeService.loadPathTypes());
    return Promise.all(promises).then( value => {
    });
  }
}
