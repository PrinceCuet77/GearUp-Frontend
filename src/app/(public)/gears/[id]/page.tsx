import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getSingleGearAction } from './_actions/getSingleGear';
import { SingleGearDetail } from './_components/SingleGearDetail';
import { SITE } from '@/lib/site';

interface GearDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: GearDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await getSingleGearAction(id);
  const gear = result?.data;

  if (!gear) return { title: `Gear not found — ${SITE.name}` };

  return {
    title: `${gear.name} — ${SITE.name}`,
    description: gear.description,
  };
}

/**
 * Rendered on the server so the listing is crawlable and the user never waits
 * on a client-side fetch waterfall. `loading.tsx` covers the fetch itself.
 */
export default async function GearDetailPage({ params }: GearDetailPageProps) {
  const { id } = await params;
  const result = await getSingleGearAction(id);

  if (!result?.data) notFound();

  return <SingleGearDetail gear={result.data} />;
}
