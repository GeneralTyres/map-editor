import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';

import {CountryService} from '../../services/country.service';
import {StateService} from '../../services/state.service';
import {AreaService} from '../../services/area.service';
import {TerritoryService} from '../../services/territory.service';
import {TraitService} from '../../services/trait.service';
import {MapItemService} from '../../services/mapItem.service';
import {MapItemTypeService} from '../../services/mapItemType.service';
import {PathService} from '../../services/path.service';
import {PathTypeService} from '../../services/pathType.service';

@Injectable()
export class HomeResolverService implements Resolve<any> {
  constructor(private countryService: CountryService,
              private stateService: StateService,
              private areaService: AreaService,
              private territoryService: TerritoryService,
              private traitsService: TraitService,
              private mapItemTypeService: MapItemTypeService,
              private mapItemService: MapItemService,
              private pathService: PathService,
              private pathTypeService: PathTypeService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    const promises = [];
    promises.push(this.countryService.loadCountries());
    promises.push(this.stateService.loadStates());
    promises.push(this.areaService.loadAreas());
    promises.push(this.territoryService.loadTerritories());
    promises.push(this.traitsService.loadTraits());
    promises.push(this.mapItemTypeService.loadMapItemTypes());
    promises.push(this.mapItemService.loadMapItems());
    promises.push(this.pathService.loadPaths());
    promises.push(this.pathTypeService.loadPathTypes());
    return Promise.all(promises);
  }
}
