export class TerritoryModel {
  constructor(
    public id: number = null,
    public countryId: number = 0,
    public areaId: number = 0,
    public date: number = 0,
    public name: string = '',
    public reference: string = '',
    public createdAt: number = 0,
    public updatedAt: number = 0
  ) {}
}
