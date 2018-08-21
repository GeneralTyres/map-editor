export class StateModel {
  constructor(
    public id: number = null,
    public countryId: number = 0,
    public areaId: number = 0,
    public date: string = '',
    public name: string = '',
    public description: string = '',
    public population: number = 0,
    public traits: string = '',
    public civilisation: number = 0,
    public referenceId: number = null,
    public createdAt: string = undefined,
    public updatedAt: string = undefined
  ) {}
}
