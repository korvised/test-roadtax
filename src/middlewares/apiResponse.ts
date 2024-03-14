import { Response } from "express"

export class ApiResponse {
  private readonly _response: Response
  private readonly _statusCode: number

  constructor(response: Response, statusCode: number = 400) {
    this._response = response
    this._statusCode = statusCode
  }

  success(data: any, message: string = "Success") {
    this._response.status(this._statusCode).json({
      success: true,
      message: message,
      data: data,
      error: null
    })
  }

  error(message: string = "Error", error?: string) {
    this._response.status(this._statusCode).json({
      success: false,
      message: message,
      data: null,
      error: error || null
    })
  }
}
