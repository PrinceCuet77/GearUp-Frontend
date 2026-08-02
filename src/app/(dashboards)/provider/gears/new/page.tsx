import { PageHeader } from '@/components/dashboard/PageHeader';
import { GearForm } from '@/components/dashboard/GearForm';

export default function NewGearPage() {
  return (
    <div>
      <PageHeader
        title='Add New Gear'
        description='List a new item in your rental inventory.'
      />
      <GearForm />
    </div>
  );
}
