import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';

import {CountryService} from '../../services/country.service';
import {StateService} from '../../services/state.service';
import {AreaService} from '../../services/area.service';
import {TerritoryService} from '../../services/territory.service';

@Injectable()
export class HomeResolverService implements Resolve<any> {
  constructor(private countryService: CountryService,
              private stateService: StateService,
              private areaService: AreaService,
              private territoryService: TerritoryService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    const promises = [];
    promises.push(this.countryService.loadCountries());
    promises.push(this.stateService.loadStates());
    promises.push(this.areaService.loadAreas());
    promises.push(this.territoryService.loadTerritories());
    return Promise.all(promises).then( value => {

    });
  }
}
