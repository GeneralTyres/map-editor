export class UserModel {
  constructor(
    public id: number = 0,
    public userName: string = '',
    public password: string = '',
    public rank: number = 0,
  ) {}
}
