export class PathModel {
  constructor(
    public id: number = null,
    public name: string = '',
    public description: string = '',
    public polyline: string = '',
    public pathTypeId: number =  0,
    public dateFrom: number =  0,
    public dateTo: number =  0,
    public referenceId: number = 0,
    public createdAt: string = undefined,
    public updatedAt: string = undefined,
  ) {}
}
