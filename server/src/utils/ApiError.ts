export type FieldError = {
  field: string;
  message: string;
};

export default class ApiError extends Error {
  statusCode: number;
  fieldErrors?: FieldError[];

  constructor(statusCode: number, message: string, fieldErrors?: FieldError[]) {
    super(message);
    this.statusCode = statusCode;
    this.fieldErrors = fieldErrors;
    Error.captureStackTrace(this, this.constructor);
  }
}