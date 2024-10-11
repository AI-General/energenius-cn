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
exports.Buildings = void 0;
var typeorm_1 = require("typeorm");
var User_entity_1 = require("./User.entity");
var Buildings = /** @class */ (function () {
    function Buildings() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
        __metadata("design:type", String)
    ], Buildings.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Buildings.prototype, "name", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return User_entity_1.User; }, function (user) { return user.buildings; }),
        (0, typeorm_1.JoinColumn)(),
        __metadata("design:type", User_entity_1.User)
    ], Buildings.prototype, "owner", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Buildings.prototype, "cityName", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Buildings.prototype, "timeZone", void 0);
    __decorate([
        (0, typeorm_1.Column)("simple-array"),
        __metadata("design:type", Array)
    ], Buildings.prototype, "location", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Buildings.prototype, "floorMap", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Buildings.prototype, "buildingData", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)(),
        __metadata("design:type", Date)
    ], Buildings.prototype, "createdAt", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)(),
        __metadata("design:type", Date)
    ], Buildings.prototype, "updatedAt", void 0);
    Buildings = __decorate([
        (0, typeorm_1.Entity)()
    ], Buildings);
    return Buildings;
}());
exports.Buildings = Buildings;
//# sourceMappingURL=Buildings.entity.js.map