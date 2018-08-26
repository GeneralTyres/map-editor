export class TerritoryModel {
  constructor(
    public id: number = null,
    public countryId: number = 0,
    public areaId: number = 0,
    public date: number = 0,
    public name: string = '',
    public referenceId: number = 0,
    public inExile: number = 0,
    public createdAt: string = undefined,
    public updatedAt: string = undefined,
  ) {}
}
