// Inside your route file (e.g., routes.ts)
import { User } from "@prisma/client";
import express from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import SessionService from "../services/session.service";

const router = express.Router();

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res) => {
    const user: User = req.user as User;
    if (req.isAuthenticated()) {
      const session = await SessionService.create({
        User: {
          connect: {
            id: user.id,
          },
        },
      });
      const token = jwt.sign({ id: session.id }, process.env.SECRET as string);
      return res.json({ data: token, error: null });
    }
    return res.send({ data: "Unauthenticated", error: null });
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

router.get(
  "/user",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // The user is authenticated and available in req.user
    const authenticatedUser = req.user;
    res.json({ data: authenticatedUser, error: null });
  }
);

router.get("/", (req, res) => {
  res.send("Hello, Express with TypeScript!");
});

export default router;
