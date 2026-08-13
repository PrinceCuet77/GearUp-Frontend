import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getSingleGearAction } from './_actions/getSingleGear';
import { getAllGearsAction } from '@/app/(public)/_actions/getAllGears';
import { SingleGearDetail } from './_components/SingleGearDetail';
import { SITE } from '@/lib/site';
import type { GearItem } from '@/lib/types';

interface GearDetailPageProps {
  params: Promise<{ id: string }>;
}

/** How many "related gear" cards to show - one full 3-up row on desktop. */
const RELATED_LIMIT = 3;

export async function generateMetadata({
  params,
}: GearDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await getSingleGearAction(id);
  const gear = result?.data;

  if (!gear) return { title: `Gear not found - ${SITE.name}` };

  return {
    title: `${gear.name} - ${SITE.name}`,
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

  const gear = result.data;

  // Related gear: same category, current item excluded. Over-fetch by one so a
  // full row still renders once this gear is filtered out.
  let related: GearItem[] = [];
  if (gear.category?.name) {
    const relatedResult = await getAllGearsAction({
      category: gear.category.name,
      limit: RELATED_LIMIT + 1,
    });
    related = (relatedResult.data ?? [])
      .filter((item) => item.id !== gear.id)
      .slice(0, RELATED_LIMIT);
  }

  return <SingleGearDetail gear={gear} related={related} />;
}
