"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var data_source_1 = require("./data-source");
var auth_1 = require("./routes/auth");
var cors = require("cors");
var buildings_routes_1 = require("./routes/buildings.routes");
var locations_routes_1 = require("./routes/locations.routes");
var nodemailer = require("nodemailer");
var path = require("path");
var crypto = require("crypto");
var mongoose = require("mongoose");
var multer = require("multer");
var GridFsStorage = require("multer-gridfs-storage").GridFsStorage;
var Grid = require("gridfs-stream");
var methodOverride = require("method-override");
var mongoURI = process.env.MONGODB_URI;
data_source_1.AppDataSource.initialize()
    .then(function () { return __awaiter(void 0, void 0, void 0, function () {
    var app, PORT, conn, gfs, gridfsBucket, storage, upload, sendUserConfirmationEmail;
    return __generator(this, function (_a) {
        app = express();
        PORT = 5001;
        require("dotenv").config({ path: ".env.local" });
        app.use(function (req, res, next) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
            res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
            res.setHeader("Access-Control-Allow-Credentials", "true");
            next();
        });
        app.use(cors({ origin: "*" }));
        app.use(bodyParser.json());
        app.use(methodOverride("_method"));
        app.use(auth_1.default);
        app.use(buildings_routes_1.default);
        app.use(locations_routes_1.default);
        app.get("/health-check", function (req, res) { return res.send("OK"); });
        conn = mongoose.createConnection(mongoURI);
        conn.once("open", function () {
            gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
                bucketName: "files",
            });
            gfs = Grid(conn.db, mongoose.mongo);
            gfs.collection("files");
        });
        storage = new GridFsStorage({
            url: mongoURI,
            file: function (req, file) {
                var _a = req.params, userId = _a.userId, locationName = _a.locationName;
                return new Promise(function (resolve, reject) {
                    crypto.randomBytes(16, function (err, buf) {
                        if (err) {
                            return reject(err);
                        }
                        if (file.mimetype.split("/")[0] === "image") {
                            var filename = "".concat(userId, "/").concat(locationName, "/floormap.png");
                            var fileInfo = {
                                filename: filename,
                                bucketName: "files",
                                metadata: { userId: userId, locationName: locationName },
                            };
                            resolve(fileInfo);
                        }
                        else {
                            var filename = "".concat(userId, "/").concat(locationName, "/dataFile.csv");
                            var fileInfo = {
                                filename: filename,
                                bucketName: "files",
                                metadata: { userId: userId, locationName: locationName },
                            };
                            resolve(fileInfo);
                        }
                    });
                });
            },
        });
        upload = multer({ storage: storage });
        app.post("/upload/file/:userId/:locationName", upload.single("file"), function (req, res) {
            try {
                res.status(200).json({ message: "File uploaded successfully" });
            }
            catch (error) {
                res.status(500).json({ message: "Internal server error" });
            }
        });
        app.get("/file/:type/:userId/:locationName", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
            var type, _a, userId, locationName, file, readStream, err_1, _b, userId, locationName, file, readStream, err_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        type = req.params.type;
                        if (!(type === "floorMap")) return [3 /*break*/, 5];
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        _a = req.params, userId = _a.userId, locationName = _a.locationName;
                        return [4 /*yield*/, gfs.files.findOne({ filename: "".concat(userId, "/").concat(locationName, "/floormap.png") })];
                    case 2:
                        file = _c.sent();
                        readStream = gridfsBucket.openDownloadStream(file._id);
                        readStream.pipe(res);
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _c.sent();
                        res.json({ err: err_1 });
                        return [3 /*break*/, 4];
                    case 4: return [3 /*break*/, 8];
                    case 5:
                        _c.trys.push([5, 7, , 8]);
                        _b = req.params, userId = _b.userId, locationName = _b.locationName;
                        return [4 /*yield*/, gfs.files.findOne({ filename: "".concat(userId, "/").concat(locationName, "/dataFile.csv") })];
                    case 6:
                        file = _c.sent();
                        if (!file) {
                            return [2 /*return*/, res.status(404).json({ err: "No file exists" })];
                        }
                        // Set the appropriate content type for CSV
                        res.set("Content-Type", "text/csv");
                        res.set("Content-Disposition", "attachment; filename=\"".concat(userId, "/").concat(locationName, "/dataFile.csv\""));
                        readStream = gridfsBucket.openDownloadStream(file._id);
                        readStream.pipe(res);
                        return [3 /*break*/, 8];
                    case 7:
                        err_2 = _c.sent();
                        res.status(500).json({ err: err_2 });
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        }); });
        app.get("/files", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
            var files, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, gfs.files.find().toArray()];
                    case 1:
                        files = _a.sent();
                        res.json({ files: files });
                        return [3 /*break*/, 3];
                    case 2:
                        err_3 = _a.sent();
                        res.json({ err: err_3 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        sendUserConfirmationEmail = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
            var userEmail, transporter, mailOptions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userEmail = req.query.email;
                        transporter = nodemailer.createTransport({
                            service: "gmail",
                            host: "smtp.gmail.com",
                            port: "587",
                            secure: false,
                            auth: {
                                user: "titusjay68@gmail.com",
                                pass: "zliiziljmlymirzo",
                            },
                        });
                        mailOptions = {
                            from: "info@energenius.com",
                            to: String(userEmail),
                            subject: "ENERGENIUS - DEMO REQUEST",
                            html: "<p>Thank you for submitting a demo request.</p><br /> <p>Click <a href='https://energenius-delta.vercel.app/en-US/sign-up?email=".concat(userEmail, "' target='_blank' rel='noopener noreferrer'>here</a> to set up an account and try out energenius.</p>"),
                        };
                        return [4 /*yield*/, transporter.sendMail(mailOptions)];
                    case 1:
                        _a.sent();
                        res.send("Email sent");
                        return [2 /*return*/];
                }
            });
        }); };
        app.get("/book-demo", sendUserConfirmationEmail);
        app.listen(PORT);
        console.log("Express server has started on port ".concat(PORT, ". Open http://localhost:").concat(PORT, " to see results"));
        return [2 /*return*/];
    });
}); })
    .catch(function (error) { return console.log(error); });
//# sourceMappingURL=index.js.map