// Inside your route file (e.g., routes.ts)
import express from "express";
import auth from "./auth.route";

const router = express.Router();

router.use("/auth", auth);

router.get("/", (req, res) => {
  res.send("Hello, Express with TypeScript!");
});

export default router;
