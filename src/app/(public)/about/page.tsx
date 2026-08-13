import type { Metadata } from 'next';

import { getHomePageData } from '@/lib/home-data';
import { SITE } from '@/lib/site';

import { StatsSection } from '@/components/home/StatsSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { FaqSection } from '@/components/home/FaqSection';
import { FinalCtaSection } from '@/components/home/FinalCtaSection';

import { AboutHero } from './_components/AboutHero';
import { AboutMission } from './_components/AboutMission';
import { AboutAudience } from './_components/AboutAudience';
import { AboutValues } from './_components/AboutValues';
import { AboutContact } from './_components/AboutContact';

export const metadata: Metadata = {
  title: `About - ${SITE.name}`,
  description: `${SITE.description} Learn how GearUp verifies providers, protects payments and keeps reviews honest.`,
};

export default async function AboutPage() {
  const { featured, stats } = await getHomePageData();

  return (
    <>
      <AboutHero totalListings={stats.totalListings} />
      <StatsSection stats={stats} />
      <AboutMission showcase={featured[0] ?? null} />
      <AboutAudience />
      <AboutValues />
      <HowItWorksSection />
      <FaqSection />
      <AboutContact />
      <FinalCtaSection totalListings={stats.totalListings} />
    </>
  );
}
