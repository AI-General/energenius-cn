"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var typeorm_1 = require("typeorm");
var Buildings_entity_1 = require("./Buildings.entity");
var DataCenters_entity_1 = require("./DataCenters.entity");
var Locations_entity_1 = require("./Locations.entity");
var User = /** @class */ (function () {
    function User() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
        __metadata("design:type", String)
    ], User.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], User.prototype, "email", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], User.prototype, "password", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return Buildings_entity_1.Buildings; }, function (building) { return building.owner; }, { cascade: true }),
        __metadata("design:type", Array)
    ], User.prototype, "buildings", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return DataCenters_entity_1.DataCenters; }, function (datacenter) { return datacenter.owner; }, { cascade: true }),
        __metadata("design:type", Array)
    ], User.prototype, "dataCenters", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return Locations_entity_1.Locations; }, function (location) { return location.owner; }, { cascade: true }),
        __metadata("design:type", Array)
    ], User.prototype, "locations", void 0);
    __decorate([
        (0, typeorm_1.Column)({ default: "user" }),
        __metadata("design:type", String)
    ], User.prototype, "role", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)(),
        __metadata("design:type", Date)
    ], User.prototype, "createdAt", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)(),
        __metadata("design:type", Date)
    ], User.prototype, "updatedAt", void 0);
    User = __decorate([
        (0, typeorm_1.Entity)()
    ], User);
    return User;
}());
exports.User = User;
//# sourceMappingURL=User.entity.js.map