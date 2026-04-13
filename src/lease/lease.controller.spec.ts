import { Test, TestingModule } from '@nestjs/testing';
import { LeaseController } from './lease.controller';
import { LeaseService } from './lease.service';

describe('LeaseController', () => {
  let controller: LeaseController;

  const mockLeaseService = {
    create: jest.fn(),
    inviteTenant: jest.fn(),
    acceptInvite: jest.fn(),
    findAllForLandlord: jest.fn(),
    findAllForTenant: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    terminate: jest.fn(),
    findByInviteToken: jest.fn(),
    findPendingInvitationsByEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaseController],
      providers: [
        {
          provide: LeaseService,
          useValue: mockLeaseService,
        },
      ],
    }).compile();

    controller = module.get<LeaseController>(LeaseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
