export class StateModel {
  constructor(
    public id: number,
    public countryId: number,
    public areaId: number,
    public date: string,
    public name: string,
    public description: string,
    public reference: string,
    public createdAt: number,
    public updatedAt: number
  ) {}
}
