export type UserRole = 'fan' | 'creator' | 'admin';

export interface AppUser {
  id: string;                // Firebase UID
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  createdAt: string;
  onboardingComplete: boolean;
  bio?: string;
  introVideoUrl?: string;
  socialLinks?: string[];
}
// TODO: Import from packages/types/user when monorepo resolution is enabled
