"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentification = void 0;
var jwt = require("jsonwebtoken");
var dotenv = require("dotenv");
var config_1 = require("../config/config");
dotenv.config();
var JWT_SECRET = config_1.default.jwtSecret;
var authentification = function (req, res, next) {
    var header = req.headers.authorization;
    if (!header) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    var token = header.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        var decode = jwt.verify(token, JWT_SECRET);
        if (!decode) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req["currentUser"] = decode;
        next();
    }
    catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({ message: "Authentication error Login Session Expired, Please Login Again" });
    }
};
exports.authentification = authentification;
//# sourceMappingURL=Authentification.js.map