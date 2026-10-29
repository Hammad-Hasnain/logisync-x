import { Injectable, ConflictException, ForbiddenException, UnauthorizedException, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession, Error } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Identity, IdentityDocument } from './schemas/identity.schema';
import { CreateIdentityDto } from './dto/create-identity.dto';
import { LoginDto } from './dto/login.dto';
import { LoginResponse, UnifiedUserProfile } from './interfaces/login-response.interface';
import { IdentityStatus } from 'src/shared/enums/identity-status.enum';
import { Role } from 'src/shared/enums/role.enum';
import { AdminsService } from '../admins/admins.service';
import { DriversService } from '../drivers/drivers.service';
import { Types } from 'mongoose';

@Injectable()
export class IdentityService {
    constructor(
        @InjectModel(Identity.name) private readonly identityModel: Model<IdentityDocument>,
        private readonly jwtService: JwtService,
        @Inject(forwardRef(() => AdminsService)) private readonly adminService: AdminsService,
        @Inject(forwardRef(() => DriversService)) private readonly driverService: DriversService,
    ) { }

    async createIdentity(
        createIdentityDto: CreateIdentityDto,
        session?: ClientSession,
    ): Promise<IdentityDocument> {
        const { email, password, phone, role, status } = createIdentityDto;

        const existing = await this.identityModel
            .findOne({ email })
            .session(session ?? null);

        if (existing) {
            throw new ConflictException('An authentication identity with this email address already exists.');
        }

        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const [identity] = await this.identityModel.create(
            [
                {
                    email,
                    passwordHash,
                    phone,
                    role,
                    ...(status && { status })
                },
            ],
            { session },
        );

        return identity;
    }

    async validateAndLogin(loginDto: LoginDto): Promise<LoginResponse> {
        const { email, password } = loginDto;

        // Fetch Identity & Validate
        const identity = await this.identityModel.findOne({ email }).select('+passwordHash');
        if (!identity) {
            throw new UnauthorizedException('Invalid operational credentials provided.');
        }

        // Status Check using Switch
        switch (identity.status) {
            case IdentityStatus.DEACTIVE:
                throw new ForbiddenException('This profile configuration has been deactivated by system administrative operations.');
            case IdentityStatus.PENDING:
                throw new ForbiddenException('This profile is under review. Please contact admin if not yet approved.');
        }

        // Password Verification
        const isPasswordMatch = await bcrypt.compare(password, identity.passwordHash);
        if (!isPasswordMatch) {
            throw new UnauthorizedException('Invalid operational credentials provided.');
        }

        // Generate JWT
        const payload = { sub: identity._id.toString(), email: identity.email, role: identity.role };
        const accessToken = await this.jwtService.signAsync(payload);

        try {
            // Dynamic Profile Fetching based on Role
            let profileService: any;
            if (identity.role === Role.ADMIN) profileService = this.adminService;
            else profileService = this.driverService;

            const profile = await profileService.getProfileByIdentity(identity._id);
            if (!profile) {
                throw new NotFoundException('Profile not found.');
            }

            const identityObj = identity.toObject();
            const { _id, __v, ...profileObj } = profile.toObject();

            const userProfile: UnifiedUserProfile = {
                email: identityObj.email,
                phone: identityObj.phone,
                status: identityObj.status,
                role: identityObj.role,

                // Profile fields
                ...profileObj,
                id: _id.toString(),
            };

            return { accessToken, user: userProfile };

        } catch (error) {
            throw new NotFoundException((error as Error).message || 'Profile linkage definitions data corrupted or entry omitted.');
        }
    }

    async updateIdentity(
        identityId: Types.ObjectId,
        updateFields: any,
        session?: ClientSession
    ): Promise<void> {
        await this.identityModel.updateOne(
            { _id: identityId },
            { $set: updateFields },
            { ...(session && { session }) }
        );
    }

    async deleteIdentity(identityId: Types.ObjectId, session?: ClientSession): Promise<void> {
        await this.identityModel.deleteOne(
            { _id: identityId },
            { ...(session && { session }) }
        );
    }

    async getIdentityAnalytics() {
        const [stats] = await this.identityModel.aggregate([
            {
                $match: { role: Role.DRIVER }
            },
            {
                $group: {
                    _id: null,
                    totalDrivers: { $sum: 1 },
                    activeDrivers: {
                        $sum: { $cond: [{ $eq: ["$status", IdentityStatus.ACTIVE] }, 1, 0] }
                    },
                    pendingDrivers: {
                        $sum: { $cond: [{ $eq: ["$status", IdentityStatus.PENDING] }, 1, 0] }
                    },
                    deactiveDrivers: {
                        $sum: { $cond: [{ $eq: ["$status", IdentityStatus.DEACTIVE] }, 1, 0] }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalDrivers: { $ifNull: ["$totalDrivers", 0] },
                    activeDrivers: { $ifNull: ["$activeDrivers", 0] },
                    pendingDrivers: { $ifNull: ["$pendingDrivers", 0] },
                    deactiveDrivers: { $ifNull: ["$deactiveDrivers", 0] }
                }
            }
        ]);

        return stats || { totalDrivers: 0, activeDrivers: 0, pendingDrivers: 0, deactiveDrivers: 0 };
    }


}
