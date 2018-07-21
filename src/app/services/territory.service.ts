import { Injectable } from '@angular/core';
import {DataService} from './data.service';
import {BaseService} from './base.service';

@Injectable()
export class TerritoryService {

  constructor(private data: DataService,
              private base: BaseService) { }

  territories: any;

  /**
   * Laai die gebiede van die database
   * @return {Subscription}
   */
  loadTerritories () {
    return this.data.load('territories', 0).subscribe(
      value => {
        this.territories = this.base.sortByDate(value, 'desc');
        console.log('this.territories ::', this.territories)
      }
    );
  }

  /**
   * Kry al die huidigge gebied vir die lande gebasseer op die datum
   * @param {number[]} countryIds
   * @param {number} date
   * @return {any[]}
   */
  getTerritoriesByCountryIdAndDate(countryIds: number[], date: number) {
    const territoriesForDate = [];
    // Get all territories
    const allTerritories = this.getTerritories();
    const matchingTerritories = this.base.getObjectsWherePropertyHasValues(allTerritories, 'countryId', countryIds);
    // Filter countries by date
    const territoriesByDate = matchingTerritories.filter(territory => territory.date <= date);
    for (let i = 0; i < countryIds.length; i++) {
      const countryTerritories = this.base.getObjectsWhereKeysHaveValues(territoriesByDate, {countryId: countryIds[i]});
      // Kies die eerste een want die goed is gesort volgends datum. Nuutste een eerste. So the eerste index sal die een wees wat ons soek.
      if (countryTerritories.length > 0) {
        territoriesForDate.push(countryTerritories[0]);
      }
    }
    return territoriesForDate;
  }

  getTerritoryByAreaId(areaId: number) {
    const areas = this.base.getObjectsWhereKeysHaveValues(this.territories, {areaId: areaId});
    return areas[0];
  }

  getTerritoriesByCountryId(countryId) {
    const areas = this.base.getObjectsWhereKeysHaveValues(this.territories, {countryId: countryId});
    return areas;
  }

  getTerritories() {
    console.log('this.territories ::', this.territories)
    return this.territories.slice();
  }

  /**
   * Stoor die gebied
   * @param territory
   * @return {Observable<Object>}
   */
  saveTerritory(territory: any) {
    if (territory.id) {
      return this.data.update('territories', territory);
    } else {
      return this.data.create('territories', territory);
    }
  }

  /**
   * Verwyder die gebied
   * @param territory
   * @return {Observable<ArrayBuffer>}
   */
  deleteTerritory(territory) {
    return this.data.delete('territories', territory);
  }

}
