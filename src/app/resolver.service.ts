import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';

import {CountryService} from './services/country.service';

@Injectable()
export class ResolverService implements Resolve<any> {
  constructor(private countryService: CountryService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    const promises = [];
    promises.push(this.countryService.loadCountries());
    return Promise.all(promises).then( value => {
    });
  }
}
