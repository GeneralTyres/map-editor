export class AreaModel {
  constructor(
    public id: number = null,
    public polygon: string = '',
    public polygonType: number =  0,
    public colour: string = '',
    public reference: string = '',
    public createdAt: string = undefined,
    public updatedAt: string = undefined,
  ) {}
}
