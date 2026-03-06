"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaseModule = void 0;
const common_1 = require("@nestjs/common");
const lease_service_1 = require("./lease.service");
const lease_controller_1 = require("./lease.controller");
const typeorm_1 = require("@nestjs/typeorm");
const lease_entity_1 = require("./entities/lease.entity");
const auth_1 = require("../auth");
const properties_module_1 = require("../properties/properties.module");
const notifications_module_1 = require("../notifications/notifications.module");
const users_module_1 = require("../users/users.module");
let LeaseModule = class LeaseModule {
};
exports.LeaseModule = LeaseModule;
exports.LeaseModule = LeaseModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([lease_entity_1.Lease]), auth_1.AuthModule, properties_module_1.PropertiesModule, notifications_module_1.NotificationsModule, users_module_1.UsersModule],
        controllers: [lease_controller_1.LeaseController],
        providers: [lease_service_1.LeaseService],
        exports: [lease_service_1.LeaseService],
    })
], LeaseModule);
//# sourceMappingURL=lease.module.js.map