export class StateModel {
  constructor(
    public id: number,
    public countryId: number,
    public areaId: number,
    public fromDate: string,
    public toDate: string,
    public createdAt: number,
    public updatedAt: number
  ) {}
}
