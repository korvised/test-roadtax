interface HttpException {
  statusCode: number;
  message: string;
}

export const httpException = (ex: unknown): HttpException => {
  // Define default error message
  const defaultException: HttpException = {
    statusCode: 500,
    message: "Internal Server Error"
  }

  if (typeof ex === "string") {
    return {
      statusCode: 400,
      message: ex
    }
  }

  if (typeof ex !== "object") return defaultException

  const err = ex as Partial<HttpException>

  return {
    statusCode: err.statusCode || defaultException.statusCode,
    message: err.message || defaultException.message
  }
}
