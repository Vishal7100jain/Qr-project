"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cors_config_1 = __importDefault(require("./config/cors.config"));
const db_config_1 = require("./config/db.config");
const env_config_1 = require("./config/env.config");
const express_rate_limit_config_1 = require("./config/express-rate-limit.config");
const apiMiddleware_1 = require("./middleware/member/apiMiddleware");
const root_route_1 = __importDefault(require("./routes/root.route"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(helmet_1.default.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"], // Allow only from same origin
        scriptSrc: ["'self'", "trusted.cdn.com"], // Allow scripts from self & trusted CDN
        styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles (if needed)
        imgSrc: ["'self'", "data:"], // Allow images from self & data URIs
        fontSrc: ["'self'"], // Allow fonts from same origin
        connectSrc: ["'self'", "api.example.com"], // Allow API calls to specified domains
    },
    reportOnly: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(cors_config_1.default);
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.static("public"));
app.use(express_rate_limit_config_1.limiter);
app.disable("x-powered-by");
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use("/api/v1", root_route_1.default);
app.get("/", apiMiddleware_1.ServerisLive);
app.use(apiMiddleware_1.PageNotFound);
app.listen(env_config_1.envConfig.PORT, () => {
    (0, db_config_1.connectDb)();
    // emailService.initialize();
    console.log(`server is live on http://localhost:${env_config_1.envConfig.PORT}`);
});
