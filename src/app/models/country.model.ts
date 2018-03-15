export class CountryModel {
  constructor(public id: number,
              public name: string,
              public description: string,
              public beginDate: string,
              public endDate: string,
              public createdAt: number,
              public updatedAt: number) {}
}
