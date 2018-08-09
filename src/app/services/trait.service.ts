import { Injectable } from '@angular/core';
import {DataService} from './data.service';
import {BaseService} from './base.service';
import {CountryModel} from '../models/country.model';
import {TraitModel} from '../models/trait.model';

const tableName = 'traits';

@Injectable()
export class TraitService {

  constructor(private data: DataService,
              private base: BaseService) { }

  traits: TraitModel[];

  loadTraits() {
    return new Promise((resolve, reject) =>
      this.data.load(tableName, 0).subscribe(
        ( value: TraitModel[] ) => {
          this.traits = value;
          resolve();
        }
      ));
  }

  saveTrait(trait) {
    if (trait.id) {
      return this.data.update(tableName, trait);
    } else {
      return this.data.create(tableName, trait);
    }
  }

  getTraits() {
    return this.traits.slice();
  }

  getTraitByTraitId(traitId: number) {
    const traits = this.base.getObjectsWhereKeysHaveValues(this.traits, {id: traitId});
    return traits[0];
  }

  getTraitsByIds(traitIds: number[]) {
    return this.base.getObjectsWherePropertyHasValues(this.traits, 'id', traitIds);
  }

}
