export class MapItemTypeModel {
  constructor(
    public id: number = 0,
    public name: string = '',
    public description: string = '',
    public icon: string = '',
    public createdAt: string = undefined,
    public updatedAt: string = undefined,
  ) {}
}
