import { atom } from 'jotai';
import { Role } from '@/enums/role.enum';

export interface AdminProfile {
    id: string;
    name: string;
    email: string;
    roles: Role[];
}

// base atom — compelete source of truth
export const adminAtom = atom<AdminProfile | null>(null);

// derived atom — subscribe if roles required
export const rolesAtom = atom((get) => get(adminAtom)?.roles ?? []);

// derived atom — to check login-status
export const isAuthenticatedAtom = atom((get) => get(adminAtom) !== null);

// loading state — to notify the UI during session restoration.
export const authLoadingAtom = atom<boolean>(true);