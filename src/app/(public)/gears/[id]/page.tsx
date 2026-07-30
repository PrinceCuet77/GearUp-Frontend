'use client';

import { useEffect, useState } from 'react';
import type { GearItem } from '@/lib/types';
import { GearDetailSkeleton } from '@/components/Skeleton';
import { getSingleGearAction } from '@/app/(public)/gears/[id]/_actions/getSingleGear';
import NotFound from '@/app/not-found';
import { SingleGearDetail } from './_components/SingleGearDetail';

export default function GearDetailPage() {
  const [gear, setGear] = useState<GearItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const id = window.location.pathname.split('/').pop();
    if (!id) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    getSingleGearAction(id).then((res) => {
      if (res?.data) {
        setGear(res.data);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <GearDetailSkeleton />;
  }

  if (notFound || !gear) {
    return <NotFound />;
  }

  return <SingleGearDetail gear={gear} />;
}
