export class StateModel {
  constructor(
    public id: number,
    public countryId: number,
    public areaId: number,
    public date: string,
    public name: string,
    public description: string,
    public population: number,
    public economy: number,
    public civilisation: number,
    public reference: string,
    public createdAt: number,
    public updatedAt: number
  ) {}
}
