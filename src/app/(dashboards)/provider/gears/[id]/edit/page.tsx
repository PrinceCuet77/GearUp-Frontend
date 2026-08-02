import { notFound } from 'next/navigation';
import { DUMMY_GEARS } from '@/lib/dummy-data';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { GearForm } from '@/components/dashboard/GearForm';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditGearPage({ params }: Props) {
  const { id } = await params;

  const gear = DUMMY_GEARS.find((g) => g.id === id) ?? null;

  if (!gear) notFound();

  return (
    <div>
      <PageHeader title='Edit Gear' description={`Updating "${gear.name}"`} />
      <GearForm gear={gear} />
    </div>
  );
}
