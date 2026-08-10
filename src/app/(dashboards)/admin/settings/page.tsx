import type { Metadata } from 'next';
import { SettingsContent } from '@/components/dashboard/SettingsContent';

export const metadata: Metadata = { title: 'Account Settings · GearUp' };

export default async function AdminSettingsPage() {
  return <SettingsContent basePath='/admin' />;
}
