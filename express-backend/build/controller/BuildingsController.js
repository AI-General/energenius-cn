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
exports.editBuildingData = exports.getAllUserBuildings = exports.createNewBuilding = void 0;
var data_source_1 = require("../data-source");
var Buildings_entity_1 = require("../entity/Buildings.entity");
var User_entity_1 = require("../entity/User.entity");
var buildingsRepository = data_source_1.AppDataSource.getRepository(Buildings_entity_1.Buildings);
var createNewBuilding = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, existingUser, building, newBuildings, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                userId = req.params.userId;
                return [4 /*yield*/, data_source_1.AppDataSource.getRepository(User_entity_1.User).findOneBy({ id: userId })];
            case 1:
                existingUser = _a.sent();
                if (!existingUser) {
                    return [2 /*return*/, res.status(404).json({ message: "User not found" })];
                }
                building = new Buildings_entity_1.Buildings();
                building.name = req.body.name;
                building.location = req.body.location;
                building.owner = existingUser;
                building.timeZone = req.body.timeZone;
                return [4 /*yield*/, buildingsRepository.save(building)];
            case 2:
                _a.sent();
                return [4 /*yield*/, data_source_1.AppDataSource.getRepository(User_entity_1.User).find({
                        where: {
                            id: userId,
                        },
                        relations: ["buildings"],
                    })];
            case 3:
                newBuildings = _a.sent();
                return [2 /*return*/, res.status(201).json({ message: "Building created successfully", buildings: newBuildings[0].buildings })];
            case 4:
                error_1 = _a.sent();
                console.error(error_1);
                res.status(500).json({ message: "Internal server error" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.createNewBuilding = createNewBuilding;
var getAllUserBuildings = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, existingUser, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.params.userId;
                return [4 /*yield*/, data_source_1.AppDataSource.getRepository(User_entity_1.User).find({
                        where: {
                            id: userId,
                        },
                        relations: ["buildings"],
                    })];
            case 1:
                existingUser = _a.sent();
                if (!existingUser) {
                    return [2 /*return*/, res.status(404).json({ message: "User not found" })];
                }
                res.status(200).json({ buildings: existingUser[0].buildings });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error(error_2);
                res.status(500).json({ message: "Internal server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllUserBuildings = getAllUserBuildings;
var editBuildingData = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, existingUser, buildingId, existingBuilding, error_3;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 4, , 5]);
                userId = req.params.userId;
                console.log("body", req.body);
                return [4 /*yield*/, data_source_1.AppDataSource.getRepository(User_entity_1.User).findOneBy({ id: userId })];
            case 1:
                existingUser = _c.sent();
                if (!existingUser) {
                    return [2 /*return*/, res.status(404).json({ message: "User not found" })];
                }
                buildingId = req.params.buildingId;
                return [4 /*yield*/, data_source_1.AppDataSource.getRepository(Buildings_entity_1.Buildings).findOneBy({ id: buildingId })];
            case 2:
                existingBuilding = _c.sent();
                if (!existingBuilding) {
                    return [2 /*return*/, res.status(404).json({ message: "Building not found" })];
                }
                existingBuilding.floorMap = ((_a = req.body) === null || _a === void 0 ? void 0 : _a.floorMap) ? req.body.floorMap : existingBuilding.floorMap;
                existingBuilding.buildingData = ((_b = req.body) === null || _b === void 0 ? void 0 : _b.buildingData) ? req.body.buildingData : existingBuilding.buildingData;
                return [4 /*yield*/, buildingsRepository.save(existingBuilding)];
            case 3:
                _c.sent();
                res.status(200).json({ message: "Building updated successfully", building: existingBuilding });
                return [3 /*break*/, 5];
            case 4:
                error_3 = _c.sent();
                console.error(error_3);
                res.status(500).json({ message: "Internal server error" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.editBuildingData = editBuildingData;
//# sourceMappingURL=BuildingsController.js.map