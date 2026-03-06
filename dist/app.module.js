"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const user_entity_1 = require("./users/entities/user.entity");
const property_entity_1 = require("./properties/entities/property.entity");
const lease_entity_1 = require("./lease/entities/lease.entity");
const payment_entity_1 = require("./payments/entities/payment.entity");
const complaint_entity_1 = require("./complaints/entities/complaint.entity");
const notification_entity_1 = require("./notifications/entities/notification.entity");
const notification_preferences_entity_1 = require("./notifications/entities/notification-preferences.entity");
const document_entity_1 = require("./files/entities/document.entity");
const mailer_1 = require("@nestjs-modules/mailer");
const files_module_1 = require("./files/files.module");
const properties_module_1 = require("./properties/properties.module");
const lease_module_1 = require("./lease/lease.module");
const complaints_module_1 = require("./complaints/complaints.module");
const notifications_module_1 = require("./notifications/notifications.module");
const payments_module_1 = require("./payments/payments.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: `.env.development.local`,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'postgres',
                    url: configService.get('DATABASE_URL'),
                    ssl: configService.get('NODE_ENV') === 'production'
                        ? { rejectUnauthorized: false }
                        : false,
                    entities: [
                        user_entity_1.User,
                        property_entity_1.Property,
                        lease_entity_1.Lease,
                        payment_entity_1.Payment,
                        complaint_entity_1.Complaint,
                        notification_entity_1.AppNotification,
                        notification_preferences_entity_1.NotificationPreference,
                        document_entity_1.Document,
                    ],
                    synchronize: configService.get('NODE_ENV') === 'development',
                    logging: configService.get('NODE_ENV') === 'development',
                }),
                inject: [config_1.ConfigService],
            }),
            mailer_1.MailerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    transport: {
                        host: configService.get('EMAIL_HOST'),
                        auth: {
                            user: configService.get('EMAIL_USERNAME'),
                            pass: configService.get('EMAIL_PASSWORD'),
                        },
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            mailer_1.MailerModule,
            files_module_1.FilesModule,
            properties_module_1.PropertiesModule,
            lease_module_1.LeaseModule,
            complaints_module_1.ComplaintsModule,
            notifications_module_1.NotificationsModule,
            payments_module_1.PaymentsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map