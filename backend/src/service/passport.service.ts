import { KoaPassport } from "koa-passport";
import { Strategy as LocalStrategy } from "passport-local";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import { IocConainerTypes } from "../common/inversify-containers/types";
import { inject, injectable } from "inversify";
import UserRepository from "../repositories/user.repository";
import { compareSync, genSaltSync, hashSync } from "bcrypt-nodejs";
import { ObjectId } from "mongodb";
import { signupRequestValidator } from "../domain/validators/user.validator";
import { EnvVars } from "../Env";
import { sign } from "jsonwebtoken";
import { isValidObjectId } from "mongoose";

@injectable()
export default class PassportService {
  private readonly _passport;

  constructor(
    @inject(IocConainerTypes.UserRepository)
    private readonly _userRepository: UserRepository,
    @inject(IocConainerTypes.Env)
    private readonly _env: EnvVars
  ) {
    this._passport = new KoaPassport();

    this._passport.use(
      "signup",
      new LocalStrategy(
        {
          usernameField: "username",
          passwordField: "password",
          passReqToCallback: true,
        },
        async (req, username, password, done) => {
          const user = await this._userRepository.getByUsername(username);
          if (user) {
            return done(
              {
                message: "Username is already taken",
              },
              false
            );
          } else {
            try {
              signupRequestValidator().validateSync(req.body);

              const userPassword = hashSync(
                password,
                genSaltSync(this._env.saltLen)
              );

              const newUser = await this._userRepository.create({
                _id: new ObjectId(),
                username,
                password: userPassword,
                first_name: req.body.first_name,
                department: req.body.department || null,
                address: req.body.address || "",
                job_title: req.body.job_title || "",
              });

              if (!newUser) return done(null, false);

              delete newUser.password;

              const token = sign({ user: newUser }, this._env.jwtSecret);

              if (newUser) return done(null, token);
            } catch (e: any) {
              return done(
                {
                  message: e?.errors ? e.errors.join(",") : e.message,
                },
                false
              );
            }
          }
        }
      )
    );

    this._passport.use(
      "login",
      new LocalStrategy(
        {
          usernameField: "username",
          passwordField: "password",
          passReqToCallback: true,
        },
        async (_, username, password, done) => {
          try {
            const user = await this._userRepository.getByUsername(username);

            if (!user?.password)
              return done(
                {
                  message: "User not found",
                },
                false
              );

            const validate = compareSync(password, user.password);

            if (!validate)
              return done({ message: "Incorrect Password" }, false);

            delete user.password;

            const token = sign({ user }, this._env.jwtSecret);

            return done(null, token);
          } catch (error) {
            return done({ message: error });
          }
        }
      )
    );

    this._passport.use(
      new JWTStrategy(
        {
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: this._env.jwtSecret,
          passReqToCallback: true,
        },
        async (req: any, token: any, done: any) => {
          try {
            if (!token?.user?._id || !isValidObjectId(token?.user?._id)) {
              return done({ message: "Invalid token" }, false);
            }
            const user = await this._userRepository.getById(
              new ObjectId(token.user._id)
            );
            if (!user) {
              return done({ message: "User not found" }, false);
            }
            req.state = user;
            return done(null, user);
          } catch (error) {
            done(error);
          }
        }
      )
    );
  }

  initialize() {
    return this._passport.initialize();
  }

  getPassportInstance() {
    return this._passport;
  }
}
