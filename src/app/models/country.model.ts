export class CountryModel {
  constructor(public id: number,
              public name: string,
              public description: string,
              public fromDate: string,
              public toDate: string,
              public flag: string,
              // public updatedAt: number
  ) {}
}
