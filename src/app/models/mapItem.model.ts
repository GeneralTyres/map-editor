import {MapItemTypeModel} from './mapItemType.model';

export class MapItemModel {
  constructor(public id: number = null,
              public itemType: number = 0,
              public name: string = '',
              public description: string = '',
              public latitude: number = 0,
              public longitude: number = 0,
              public image: string = '',
              public fromDate: number = 0,
              public toDate: number = 0,
              public referenceId: number = null,
              public mapItemType: MapItemTypeModel = null,
              public createdAt: string = undefined,
              public updatedAt: string = undefined,
  ) {}
}
