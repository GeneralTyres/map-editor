export class CountryModel {
  constructor(public id: number = null,
              public name: string = '',
              public description: string = '',
              public fromDate: string = '',
              public toDate: string = '',
              public flag: string = '',
              public referenceId: number = null,
              public createdAt: string = undefined,
              public updatedAt: string = undefined,
  ) {}
}
