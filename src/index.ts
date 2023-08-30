// @ts-ignore: Disable auto-import organization for the following lines
import * as dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express from "express";
import passport_init from "./passport_init";
import routes from "./routes/routes.route";

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(", ") ?? [];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

passport_init(app);

const port = process.env.PORT || 3000;

app.use("/api", routes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
