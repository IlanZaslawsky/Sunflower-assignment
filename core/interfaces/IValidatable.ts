export interface IValidatable {
  validate(): Promise<boolean>;
  getValidationError(): string | null;
}
