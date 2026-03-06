import { Controller } from '@nestjs/common';
import { LeaseService } from './lease.service';

@Controller('lease')
export class LeaseController {
  constructor(private readonly leaseService: LeaseService) {}
}
