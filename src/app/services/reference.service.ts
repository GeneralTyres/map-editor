import { Injectable } from '@angular/core';
import {DataService} from './data.service';
import {BaseService} from './base.service';
import {ReferenceModel} from '../models/reference.model';

const tableName = 'references';

@Injectable()
export class ReferenceService {

  constructor(private data: DataService,
              private base: BaseService) { }

  references: ReferenceModel[];

  loadReferences() {
    return new Promise((resolve, reject) =>
      this.data.load(tableName, 0, null).subscribe(
        ( value: ReferenceModel[] ) => {
          this.references = value;
          resolve();
        }
      ));
  }

  loadReferenceById(id: number) {
    return new Promise((resolve, reject) => {
      const whereClause = {id: id};
      this.data.load(tableName, 0, whereClause).subscribe(
        ( value: ReferenceModel[] ) => {
          resolve(value);
        }
        );
      });
    }

  saveReference(reference) {
    if (reference.id) {
      return this.data.update(tableName, reference);
    } else {
      return this.data.create(tableName, reference);
    }
  }

  getReferences() {
    return this.references.slice();
  }

  getReferenceByReferenceId(referenceId: number) {
    const references = this.base.getObjectsWhereKeysHaveValues(this.references, {id: referenceId});
    return references[0];
  }

  getReferencesByIds(referenceIds: number[]) {
    return this.base.getObjectsWherePropertyHasValues(this.references, 'id', referenceIds);
  }

}
