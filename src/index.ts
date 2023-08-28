// @ts-ignore: Disable auto-import organization for the following lines
import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import passport_init from "./passport_init";
import routes from "./routes/routes.route";

const app = express();

passport_init(app);

const port = process.env.PORT || 3000;

app.use("/", routes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
