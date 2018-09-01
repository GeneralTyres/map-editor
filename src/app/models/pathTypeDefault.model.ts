export class PathTypeDefaultModel {
  constructor(
    public paused: boolean = false,
    public reverse: boolean = false,
    public delay: number = 200,
    public weight: number = 3,
    public dashArray1: number = 20,
    public dashArray2: number = 30,
    public colour: string = '#fff',
    public pulseColour: string = '#000'
  ) {}
}
