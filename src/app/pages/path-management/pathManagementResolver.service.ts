import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';

import {PathService} from '../../services/path.service';
import {PathTypeService} from '../../services/pathType.service';

@Injectable()
export class PathManagementResolverService implements Resolve<any> {
  constructor(private pathService: PathService,
  private pathTypeService: PathTypeService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    const promises = [];
    promises.push(this.pathService.loadPaths());
    promises.push(this.pathTypeService.loadPathTypes());
    return Promise.all(promises).then( value => {
    });
  }
}
