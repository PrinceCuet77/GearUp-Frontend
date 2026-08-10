import type { Metadata } from 'next';
import { ProfileContent } from '@/components/dashboard/ProfileContent';

export const metadata: Metadata = { title: 'My Profile · GearUp' };

export default async function CustomerProfilePage() {
  return <ProfileContent />;
}
