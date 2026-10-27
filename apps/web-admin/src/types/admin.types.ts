import { IdentityStatus } from "@/enums/identity-status.enum";
import { Role } from "@/enums/role.enum";

export interface AdminProfile {
    id: string;
    identityId: string;
    name: string;
    email: string;
    role: Role;
    status: IdentityStatus;
    phone: string;
    createdAt: string;
    updatedAt: string;
}

export interface AdminLoginResponse {
    accessToken: string;
    user: AdminProfile;
}