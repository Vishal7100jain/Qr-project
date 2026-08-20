import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import corsConfig from "./config/cors.config";
import { connectDb } from "./config/db.config";
import { envConfig } from "./config/env.config";
import { limiter } from "./config/express-rate-limit.config";
import { PageNotFound, ServerisLive } from "./middleware/member/apiMiddleware";
import rootRouter from "./routes/root.route";

dotenv.config();
const app = express();
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"], // Allow only from same origin
      scriptSrc: ["'self'", "trusted.cdn.com"], // Allow scripts from self & trusted CDN
      styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles (if needed)
      imgSrc: ["'self'", "data:"], // Allow images from self & data URIs
      fontSrc: ["'self'"], // Allow fonts from same origin
      connectSrc: ["'self'", "api.example.com"], // Allow API calls to specified domains
    },
    reportOnly: true,
  })
);

app.use(cookieParser());
app.use(corsConfig);
app.use(morgan("dev"));
app.use(express.static("public"));

app.use(limiter);
app.disable("x-powered-by");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/v1", rootRouter);

app.get("/", ServerisLive);
app.use(PageNotFound);

app.listen(envConfig.PORT, () => {
  connectDb();
  // emailService.initialize();
  console.log(`server is live on http://localhost:${envConfig.PORT}`);
});
