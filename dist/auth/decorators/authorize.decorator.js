"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantsOnly = exports.LandlordsOnly = exports.AllowSelfOrRoles = exports.RequireOwnership = exports.RequireRoles = exports.Authorize = exports.AUTHORIZATION_KEY = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../../users/entities/user.entity");
exports.AUTHORIZATION_KEY = 'authorization';
const Authorize = (rule) => (0, common_1.SetMetadata)(exports.AUTHORIZATION_KEY, rule);
exports.Authorize = Authorize;
const RequireRoles = (...roles) => (0, exports.Authorize)({ roles });
exports.RequireRoles = RequireRoles;
const RequireOwnership = () => (0, exports.Authorize)({ requireOwnership: true });
exports.RequireOwnership = RequireOwnership;
const AllowSelfOrRoles = (...roles) => (0, exports.Authorize)({ roles, allowSelf: true });
exports.AllowSelfOrRoles = AllowSelfOrRoles;
const LandlordsOnly = () => (0, exports.Authorize)({ roles: [user_entity_1.UserRole.LANDLORD] });
exports.LandlordsOnly = LandlordsOnly;
const TenantsOnly = () => (0, exports.Authorize)({ roles: [user_entity_1.UserRole.TENANT] });
exports.TenantsOnly = TenantsOnly;
//# sourceMappingURL=authorize.decorator.js.map