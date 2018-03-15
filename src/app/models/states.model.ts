export class StateModel {
  constructor(
    public id: number,
    public countryId: number,
    public polygon: string,
    public fromDate: string,
    public toDate: string,
    public createdAt: number,
    public updatedAt: number
  ) {}
}
