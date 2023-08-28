// Inside your route file (e.g., routes.ts)
import express from "express";
import auth from "./auth.route";
import profile from "./profile.route";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello, Express with TypeScript!");
});

router.use("/auth", auth);
router.use("/profile", profile);

export default router;
