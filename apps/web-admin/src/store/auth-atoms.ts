import { atom } from 'jotai';
import { AdminProfile } from '@/types/admin.types';


// base atom — compelete source of truth
export const adminAtom = atom<AdminProfile | null>(null);

// derived atom — to check login-status
export const isAuthenticatedAtom = atom((get) => get(adminAtom) !== null);

// loading state — to notify the UI during session restoration.
export const authLoadingAtom = atom<boolean>(true);