import { BaseContext } from "koa";

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 202,

  BAD_REQUEST = 400,
  UNAUTHORISED = 401,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,

  INTERNAL_SERVER_ERROR = 405,
}

export abstract class BaseError extends Error {
  protected _errorCode: number = HttpStatus.BAD_REQUEST;
  protected _defaultMessage: string = "";
  constructor(message: string) {
    super(message);
  }
  get error() {
    return {
      code: this._errorCode,
      message: this.message ? this.message : this._defaultMessage,
    };
  }
}

export class BadRequest extends BaseError {
  constructor(message = "") {
    super(message);
    this._errorCode = HttpStatus.BAD_REQUEST;
    this._defaultMessage = "Bad Request";
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message = "") {
    super(message);
    this._errorCode = HttpStatus.UNAUTHORISED;
    this._defaultMessage = "Unauthorized";
  }
}

export class NotFoundError extends BaseError {
  constructor(message = "") {
    super(message);
    this._errorCode = HttpStatus.NOT_FOUND;
    this._defaultMessage = "Not found";
  }
}

export class MethodNotAllowedError extends BaseError {
  constructor(message = "") {
    super(message);
    this._errorCode = HttpStatus.METHOD_NOT_ALLOWED;
    this._defaultMessage = "Method Not Allowed";
  }
}

export class InternalServerError extends BaseError {
  constructor(message = "") {
    super(message);
    this._errorCode = HttpStatus.INTERNAL_SERVER_ERROR;
    this._defaultMessage = "Internal Server Error";
  }
}

export const errorHandler = () => async (ctx: BaseContext, next: () => void) => {
  try {
    await next();
  } catch (err: any) {
    if (
      [
        HttpStatus.BAD_REQUEST,
        HttpStatus.UNAUTHORISED,
        HttpStatus.NOT_FOUND,
        HttpStatus.METHOD_NOT_ALLOWED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      ].includes(err._errorCode)
    ) {
      ctx.body = err.message || err._defaultMessage;
      ctx.status = err._errorCode;
    }
    ctx.body = err.message || "Server Error";
    ctx.status = 503;
  }
};
