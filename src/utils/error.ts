import { STATUS_CODE } from "../constant/status.code.ts";
class ApiError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode: number, code: string) {
    super(message);

    this.statusCode = statusCode;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends ApiError {
  constructor(message: string, code: string = "BAD REQUEST") {
    super(message, STATUS_CODE.BAD_REQUEST, code);
  }
}

class UnAuthorizedError extends ApiError {
  constructor(message: string, code: string = "UNAUTHORIZED") {
    super(message, STATUS_CODE.UNAUTHORIZED, code);
  }
}

class ForBiddenError extends ApiError {
  constructor(message: string, code: string = "FORBIDDEN") {
    super(message, STATUS_CODE.FORBIDDEN, code);
  }
}

class NotFoundError extends ApiError {
  constructor(message: string, code: string = "NOT FOUND") {
    super(message, STATUS_CODE.NOT_FOUND, code);
  }
}

class ConflictError extends ApiError {
  constructor(message: string, code: string = "CONFLICT") {
    super(message, STATUS_CODE.CONFLICT, code);
  }
}

class TooManyRequestError extends ApiError {
  constructor(message: string, code: string = "TOO MANY REQUEST") {
    super(message, STATUS_CODE.TOO_MANY_REQUESTS, code);
  }
}

export {
  ApiError,
  BadRequestError,
  UnAuthorizedError,
  ForBiddenError,
  NotFoundError,
  ConflictError,
  TooManyRequestError,
};
