export class StateModel {
  constructor(
    public id: number = null,
    public countryId: number = 0,
    public areaId: number = 0,
    public date: string = '',
    public name: string = '',
    public description: string = '',
    public population: number = 0,
    public economy: number = 0,
    public civilisation: number = 0,
    public reference: string = '',
    public createdAt: number = 0,
    public updatedAt: number = 0
  ) {}
}
