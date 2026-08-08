import type { Metadata } from 'next';

import { getHomePageData } from '@/lib/home-data';
import { SITE } from '@/lib/site';

import { HeroSection } from '@/components/home/HeroSection';
import { CatalogueMarquee } from '@/components/home/CatalogueMarquee';
import { StatsSection } from '@/components/home/StatsSection';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { FeaturedGearSection } from '@/components/home/FeaturedGearSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { WhyGearUpSection } from '@/components/home/WhyGearUpSection';
import { NewArrivalsSection } from '@/components/home/NewArrivalsSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { ProviderCtaSection } from '@/components/home/ProviderCtaSection';
import { FaqSection } from '@/components/home/FaqSection';
import { GearAlertsSection } from '@/components/home/GearAlertsSection';
import { FinalCtaSection } from '@/components/home/FinalCtaSection';

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
};

export default async function HomePage() {
  const { featured, newest, categories, testimonials, stats } =
    await getHomePageData();

  return (
    <>
      <HeroSection
        slides={featured}
        categories={categories}
        totalListings={stats.totalListings}
      />
      <CatalogueMarquee categories={categories} />
      <StatsSection stats={stats} />
      <CategoriesSection categories={categories} />
      <FeaturedGearSection gears={featured} />
      <HowItWorksSection />
      <WhyGearUpSection />
      <NewArrivalsSection gears={newest} />
      <TestimonialsSection testimonials={testimonials} />
      <ProviderCtaSection />
      <FaqSection />
      <GearAlertsSection categories={categories} />
      <FinalCtaSection totalListings={stats.totalListings} />
    </>
  );
}
