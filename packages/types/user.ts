import { UserRole } from './index';

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
