import { Test, TestingModule } from '@nestjs/testing';
import { LeaseService } from './lease.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Lease } from './entities/lease.entity';
import { UsersService } from '../users/users.service';
import { PropertiesService } from '../properties/properties.service';
import { NotificationsService } from '../notifications/notifications.service';
import { EmailService } from '../mailer/mailer.service';

describe('LeaseService', () => {
  let service: LeaseService;

  const mockLeaseRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockUsersService = {
    findOne: jest.fn(),
  };

  const mockPropertiesService = {
    findById: jest.fn(),
    recomputeStatus: jest.fn(),
  };

  const mockNotificationsService = {
    send: jest.fn(),
  };

  const mockEmailService = {
    sendInviteEmail: jest.fn(),
    sendPasswordReset: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeaseService,
        {
          provide: getRepositoryToken(Lease),
          useValue: mockLeaseRepository,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: PropertiesService,
          useValue: mockPropertiesService,
        },
        {
          provide: NotificationsService,
          useValue: mockNotificationsService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    service = module.get<LeaseService>(LeaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
