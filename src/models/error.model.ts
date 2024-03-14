export interface IApiError {
  message: string;
  errorCode?: string;
  statusCode?: number;
}

export class ApiError {
  message: string
  errorCode?: string
  statusCode?: number

  constructor({ message, errorCode, statusCode }: IApiError) {
    this.message = message
    this.errorCode = errorCode
    this.statusCode = statusCode
  }
}

export class ApiException extends Error {
  errorCode?: string
  statusCode: number

  constructor(error: string, statusCode: number = 500, errorCode?: string) {
    super(error)
    this.statusCode = statusCode
    this.errorCode = errorCode
  }
}
