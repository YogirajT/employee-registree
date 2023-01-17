import { injectable, inject } from "inversify";
import { RouterContext } from "koa-router";
import { BadRequest, HttpStatus, InternalServerError, UnauthorizedError } from "../errors";
import { IocConainerTypes } from "../../common/inversify-containers/types";
import PassportService from "../../service/passport.service";
import { Next } from "koa";

@injectable()
export default class AuthController {
  constructor(
    @inject(IocConainerTypes.PassportService)
    private readonly _passportService: PassportService
  ) {}

  async login(context: RouterContext<any, {}>, next: Next): Promise<void> {
    return this._passportService
      .getPassportInstance()
      .authenticate("login", async (err, token) => {
        if (err || !token) {
          throw new UnauthorizedError(err.message);
        }
        context.body = { jwt: token };
        context.status = HttpStatus.OK;
      })(context, next);
  }

  async signup(context: RouterContext<any, {}>, next: Next): Promise<void> {
    return this._passportService
      .getPassportInstance()
      .authenticate(
        "signup",
        { session: false, failWithError: true },
        (error, token) => {
          if (error || !token) {
            throw new BadRequest(error.message);
          }
          context.body = { jwt: token };
          context.status = HttpStatus.OK;
        }
      )(context, next);
  }
}
