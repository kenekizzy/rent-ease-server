import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('billing')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.LANDLORD)
export class BillingController {
  
  @Get('plan')
  async getPlan() {
    // Mock billing info for now
    return {
      name: 'Pro Plan',
      price: 15000,
      currency: 'NGN',
      interval: 'monthly',
      status: 'active',
      nextBilling: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
      features: [
        'Unlimited Properties',
        'Unlimited Tenants',
        'Priority Support',
        'Custom Documents',
      ],
      paymentMethod: {
        type: 'visa',
        last4: '4242',
      }
    };
  }
}
