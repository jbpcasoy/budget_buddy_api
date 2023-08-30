// Inside your route file (e.g., routes.ts)
import { User } from "@prisma/client";
import express from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import SessionService from "../services/session.service";

// Declare a custom property for session data
declare module "express-session" {
  interface SessionData {
    redirect_url?: string;
  }
}

const router = express.Router();

router.get("/google", (req, res, next) => {
  req.session.redirect_url = req.query.redirect_url as string;

  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: req.query.redirect_url as string,
  })(req, res, next);
});

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res) => {
    const user: User = req.user as User;
    const redirectUrl = req.query.state as string;
    console.log({ redirectUrl, req: JSON.stringify(req.session) });
    if (req.isAuthenticated()) {
      const session = await SessionService.create({
        User: {
          connect: {
            id: user.id,
          },
        },
      });
      const token = jwt.sign({ id: session.id }, process.env.SECRET as string);

      if (redirectUrl) {
        return res.redirect(redirectUrl);
      }
      return res.json({ data: token, error: null });
    }
    return res.json({ data: "Unauthenticated", error: null });
  }
);

router.get(
  "/user",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // The user is authenticated and available in req.user
    const authenticatedUser = req.user;
    res.json({ data: authenticatedUser, error: null });
  }
);

router.get(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (req.isAuthenticated()) {
      // The user is authenticated and available in req.user
      const user: User = req.user as User;
      const session = await SessionService.findByUserId(user.id);
      await SessionService.remove(session?.id as string);

      return res.json({ data: "Logged out successfully", error: null });
    }
    return res.json({ data: "Unauthenticated user", error: null });
  }
);

export default router;
