export * from './user';

export type UserRole = 'fan' | 'creator' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  profilePhotoUrl?: string;
}
