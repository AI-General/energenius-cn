"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var AuthController_1 = require("../controller/AuthController");
var authRouter = (0, express_1.Router)();
authRouter.post("/auth/signup", AuthController_1.SignUp);
authRouter.post("/auth/signin", AuthController_1.SignIn);
exports.default = authRouter;
//# sourceMappingURL=auth.js.map