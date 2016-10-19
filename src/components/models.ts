export class InfoModel {
  public testString: string;

  constructor(inputA: string, inputB: string) {
    this.testString = inputA + " " + inputB;
  }

  saySomething(): string {
    console.log(this.testString);
    return this.testString;
  }
}
