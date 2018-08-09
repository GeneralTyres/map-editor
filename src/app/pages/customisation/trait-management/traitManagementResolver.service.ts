import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';

import {TraitService} from '../../../services/trait.service';

@Injectable()
export class TraitManagementResolverService implements Resolve<any> {
  constructor(private traitService: TraitService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    const promises = [];
    promises.push(this.traitService.loadTraits());
    return Promise.all(promises).then( value => {
    });
  }
}
