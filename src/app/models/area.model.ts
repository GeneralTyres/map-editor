export class AreaModel {
  constructor(
    public id: number = null,
    public polygon: string = '',
    public polygonType: number =  0,
    public colour: string = '',
    public reference: string = '',
    public createdAt: number = 0,
    public updatedAt: number = 0
  ) {}
}
