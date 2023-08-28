import { Express } from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passportJwt from "passport-jwt";
import config from "./config";
import GoogleUser from "./interfaces/user.interface";
import SessionService from "./services/session.service";
import UserService from "./services/user.service";

export default async function passport_init(app: Express) {
  const JwtStrategy = passportJwt.Strategy;
  const ExtractJwt = passportJwt.ExtractJwt;

  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET as string,
  };

  app.use(
    session({
      secret: process.env.SECRET as string,
      resave: true,
      saveUninitialized: true,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new JwtStrategy(jwtOptions, async (payload, done) => {
      try {
        const session = await SessionService.findById(payload.id);
        if (!session) {
          return done(null, false);
        }

        const user = await UserService.findById(session?.userId as string);

        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, false);
      }
    })
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: config.google.clientID,
        clientSecret: config.google.clientSecret,
        callbackURL: config.google.callbackURL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await UserService.findByGoogleId(profile.id);

          if (!user) {
            user = await UserService.create({
              googleId: profile.id,
              email: profile._json.email as string,
              name: profile._json.name as string,
            });
          }

          done(null, user);
        } catch (err: any) {
          done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser(async (googleUser: GoogleUser, done) => {
    try {
      const user = await UserService.findById(googleUser.id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}
