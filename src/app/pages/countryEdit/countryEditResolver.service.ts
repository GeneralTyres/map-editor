import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';

import {CountryService} from '../../services/country.service';
import {StateService} from '../../services/state.service';
import {AreaService} from '../../services/area.service';
import {TerritoryService} from '../../services/territory.service';
import {TraitService} from '../../services/trait.service';

@Injectable()
export class CountryEditResolverService implements Resolve<any> {
  constructor(private countryService: CountryService,
              private stateService: StateService,
              private areaService: AreaService,
              private territoryService: TerritoryService,
              private traitService: TraitService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    const promises = [];
    promises.push(this.countryService.loadCountries());
    promises.push(this.stateService.loadStates());
    promises.push(this.areaService.loadAreas());
    promises.push(this.territoryService.loadTerritories());
    promises.push(this.traitService.loadTraits());
    return Promise.all(promises).then( value => {
    });
  }
}
