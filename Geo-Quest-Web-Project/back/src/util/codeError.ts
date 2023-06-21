export class CodeError extends Error {
  public code: number;

  constructor(message: string, code: number) {
    super(message)
    this.code = code
  }
}

export enum CustomErrors {
  WRONG_ARGUMENTS = "You must specify the correct arguments",
}