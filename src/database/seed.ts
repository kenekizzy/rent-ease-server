import * as dotenv from 'dotenv';
import * as path from 'path';
import { AppDataSource } from './data-source';
import { User, UserRole } from '../users/entities/user.entity';
import { Property } from '../properties/entities/property.entity';
import { PropertyUnit, UnitType } from '../properties/entities/property-unit.entity';
import { PropertyType, PropertyStatus } from '../properties/entities/property.enum';
import { Lease, LeaseStatus } from '../lease/entities/lease.entity';
import { Complaint, ComplaintPriority, ComplaintStatus } from '../complaints/entities/complaint.entity';
import { NotificationPreference } from '../notifications/entities/notification-preferences.entity';
import * as bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';

// Load environment variables from .env.development.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.development.local') });

async function seed() {
    try {
        await AppDataSource.initialize();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }

    const userRepository = AppDataSource.getRepository(User);
    const propertyRepository = AppDataSource.getRepository(Property);
    const unitRepository = AppDataSource.getRepository(PropertyUnit);
    const leaseRepository = AppDataSource.getRepository(Lease);
    const complaintRepository = AppDataSource.getRepository(Complaint);
    const preferenceRepository = AppDataSource.getRepository(NotificationPreference);

    // Clear existing data using QueryBuilder to bypass TypeORM 0.3 empty criteria protection
    await complaintRepository.createQueryBuilder().delete().execute();
    await leaseRepository.createQueryBuilder().delete().execute();
    await unitRepository.createQueryBuilder().delete().execute();
    await propertyRepository.createQueryBuilder().delete().execute();
    await preferenceRepository.createQueryBuilder().delete().execute();
    await userRepository.createQueryBuilder().delete().execute();

    const hashedPassword = await bcrypt.hash('Password123!', 10);

    // 1. Seed Users (Landlords and Tenants)
    const usersData = [
        { id: uuid(), firstName: 'Emeka', lastName: 'Okoro', email: 'emeka@yopmail.com', role: UserRole.LANDLORD },
        { id: uuid(), firstName: 'Chinelo', lastName: 'Adebayo', email: 'chinelo@yopmail.com', role: UserRole.LANDLORD },
        { id: uuid(), firstName: 'Yusuf', lastName: 'Ibrahim', email: 'yusuf@yopmail.com', role: UserRole.TENANT },
        { id: uuid(), firstName: 'Amina', lastName: 'Bello', email: 'amina@yopmail.com', role: UserRole.TENANT },
        { id: uuid(), firstName: 'Olumide', lastName: 'Johnson', email: 'olumide@yopmail.com', role: UserRole.TENANT },
    ];

    const users: User[] = [];
    for (const data of usersData) {
        let user = await userRepository.findOne({ where: { email: data.email } });
        if (!user) {
            user = userRepository.create({
                ...data,
                password: hashedPassword,
                emailVerified: true,
            });
            user = await userRepository.save(user);

            // Create notification preferences
            const prefs = preferenceRepository.create({
                userId: user.id,
                emailEnabled: true,
                inAppEnabled: true,
            });
            await preferenceRepository.save(prefs);
        }
        users.push(user);
    }

    const landlord1 = users.find(u => u.email === 'emeka@yopmail.com')!;
    const landlord2 = users.find(u => u.email === 'chinelo@yopmail.com')!;
    const tenant1 = users.find(u => u.email === 'yusuf@yopmail.com')!;
    const tenant2 = users.find(u => u.email === 'amina@yopmail.com')!;

    // 2. Seed Properties and Units
    const propertiesData = [
        {
            addressLine1: '12 Lekki Phase 1',
            addressLine2: 'Block B',
            name: 'Lekki Apartments',
            propertyType: PropertyType.APARTMENT,
            bedrooms: 3,
            bathrooms: 2,
            status: PropertyStatus.AVAILABLE,
            landlordId: landlord1.id,
            city: 'Lagos',
            state: 'Lagos',
            country: 'Nigeria',
            zipCode: '101001',
            unitsData: [
              { name: 'Apt 1', rentAmount: 5000000, unitType: UnitType.TWO_BEDROOM },
              { name: 'Apt 2', rentAmount: 5200000, unitType: UnitType.TWO_BEDROOM },
              { name: 'Apt 3', rentAmount: 6000000, unitType: UnitType.THREE_BEDROOM },
              { name: 'Apt 4', rentAmount: 6500000, unitType: UnitType.THREE_BEDROOM }
            ],
        },
        {
            addressLine1: '45 Garki Area 11',
            addressLine2: 'Suite 201',
            name: 'Garki Mall',
            propertyType: PropertyType.SHOP,
            bedrooms: 0,
            bathrooms: 1,
            status: PropertyStatus.AVAILABLE,
            landlordId: landlord1.id,
            city: 'Abuja',
            state: 'Abuja',
            country: 'Nigeria',
            zipCode: '101021',
            unitsData: [
              { name: 'Suite A', rentAmount: 2500000, unitType: UnitType.SELF_CONTAIN },
              { name: 'Suite B', rentAmount: 3000000, unitType: UnitType.SELF_CONTAIN },
              { name: 'Suite C', rentAmount: 3500000, unitType: UnitType.MINI_FLAT }
            ],
        },
        {
            addressLine1: '8 Maitama District',
            addressLine2: 'Amina Way',
            name: 'Maitama Villa',
            propertyType: PropertyType.HOUSE,
            bedrooms: 5,
            bathrooms: 4,
            rentAmount: 12000000,
            status: PropertyStatus.AVAILABLE,
            landlordId: landlord2.id,
            city: 'Abuja',
            state: 'Abuja',
            country: 'Nigeria',
            zipCode: '101021',
        },
    ];

    const properties: Property[] = [];
    const units: PropertyUnit[] = [];

    for (const data of propertiesData) {
        const { unitsData, ...propertyFields } = data;
        let property = await propertyRepository.findOne({ where: { addressLine1: propertyFields.addressLine1 } });
        if (!property) {
            property = propertyRepository.create(propertyFields);
            property = await propertyRepository.save(property);
            
            if (unitsData) {
                for (const uData of unitsData) {
                    const unit = unitRepository.create({
                        ...uData,
                        propertyId: property.id,
                    });
                    const savedUnit = await unitRepository.save(unit);
                    units.push(savedUnit);
                }
            }
        }
        properties.push(property);
    }

    // 3. Seed Leases
    const apt1 = units.find(u => u.name === 'Apt 1')!;
    const villa = properties.find(p => p.name === 'Maitama Villa')!;

    const leaseData = [
        {
            propertyId: apt1.propertyId,
            unitId: apt1.id,
            tenantId: tenant1.id,
            landlordId: landlord1.id,
            startDate: new Date('2026-01-01'),
            endDate: new Date('2026-12-31'),
            annualRent: 5000000,
            securityDeposit: 500000,
            annualDueDate: new Date('2026-12-15'),
            status: LeaseStatus.ACTIVE,
        },
        {
            propertyId: villa.id,
            tenantId: tenant2.id,
            landlordId: landlord2.id,
            startDate: new Date('2026-02-01'),
            endDate: new Date('2027-01-31'),
            annualRent: 12000000,
            securityDeposit: 1000000,
            annualDueDate: new Date('2027-01-10'),
            status: LeaseStatus.ACTIVE,
        },
    ];

    const leases: Lease[] = [];
    for (const data of leaseData) {
        let lease = await leaseRepository.findOne({ where: { propertyId: data.propertyId, tenantId: data.tenantId } });
        if (!lease) {
            lease = leaseRepository.create(data);
            lease = await leaseRepository.save(lease);

            // Update property/unit status
            if (data.unitId) {
                await unitRepository.update(data.unitId, { 
                    status: PropertyStatus.OCCUPIED,
                    leaseId: lease.id,
                    tenantId: data.tenantId
                });
                
                await propertyRepository.update(data.propertyId, { status: PropertyStatus.PARTIALLY_OCCUPIED });
            } else {
                await propertyRepository.update(data.propertyId, { status: PropertyStatus.OCCUPIED });
            }
        }
        leases.push(lease);
    }

    // 4. Seed Complaints
    const complaintsData = [
        {
            tenantId: tenant1.id,
            landlordId: landlord1.id,
            propertyId: leases[0].propertyId,
            leaseId: leases[0].id,
            title: 'Broken AC in Living Room',
            description: 'The air conditioner in the main living room has stopped working since yesterday.',
            priority: ComplaintPriority.HIGH,
            status: ComplaintStatus.IN_PROGRESS,
        },
        {
            tenantId: tenant2.id,
            landlordId: landlord2.id,
            propertyId: leases[1].propertyId,
            leaseId: leases[1].id,
            title: 'Water Leakage in Kitchen',
            description: 'There is a small leak under the kitchen sink that needs attention.',
            priority: ComplaintPriority.MEDIUM,
            status: ComplaintStatus.IN_PROGRESS,
        },
    ];

    for (const data of complaintsData) {
        let complaint = await complaintRepository.findOne({ where: { title: data.title, tenantId: data.tenantId } });
        if (!complaint) {
            complaint = complaintRepository.create(data);
            await complaintRepository.save(complaint);
        }
    }

    await AppDataSource.destroy();
}

seed().catch((error) => {
    console.error('Error during seeding:', error);
    process.exit(1);
});
