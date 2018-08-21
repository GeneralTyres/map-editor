export class ReferenceModel {
  constructor(
    public id: number = null,
    public youTubeURL: string = '',
    public wikipediaURL: string = '',
    public internetArchiveURL: string = '',
    public referenceText: string = '',
    public referenceObject: object = {},
    public createdAt: string = undefined,
    public updatedAt: string = undefined,
  ) {}
}
