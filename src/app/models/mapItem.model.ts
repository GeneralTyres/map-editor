export class CountryModel {
  constructor(public id: number = null,
              public itemType: number = null,
              public name: string = '',
              public description: string = '',
              public image: string = '',
              public fromDate: string = '',
              public toDate: string = '',
              public referenceId: number = null,
              public createdAt: string = undefined,
              public updatedAt: string = undefined,
  ) {}
}
