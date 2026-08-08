import { getAllCategoriesAction } from '@/app/(public)/_actions/getAllCategories';
import { getAllGearsAction } from '@/app/(public)/_actions/getAllGears';
import { calcAvgRating } from '@/lib/gear-utils';
import type { Category, GearItem } from '@/lib/types';

/**
 * How much of the catalogue we pull to derive landing-page aggregates.
 * `meta.total` still gives the exact listing count regardless of this cap; the
 * provider/review figures are computed from this sample.
 */
const CATALOGUE_SAMPLE_SIZE = 100;

export interface PlatformStats {
  totalListings: number;
  totalCategories: number;
  totalProviders: number;
  averageRating: number;
}

export interface Testimonial {
  id: string;
  rating: number;
  comment: string;
  authorName: string;
  authorAvatar: string | null;
  gearName: string;
  gearId: string;
  createdAt: string;
}

export interface CategoryHighlight extends Category {
  /** Listings in this category within the sampled catalogue. */
  listingCount: number;
  /** Cheapest daily rate found in the sample, or null when none. */
  fromPrice: number | null;
  /** Representative image pulled from a listing in the category. */
  image: string | null;
}

export interface HomePageData {
  featured: GearItem[];
  newest: GearItem[];
  categories: CategoryHighlight[];
  testimonials: Testimonial[];
  stats: PlatformStats;
  /** True when neither the catalogue nor the categories could be loaded. */
  degraded: boolean;
}

function scoreForFeature(gear: GearItem) {
  const reviewCount = gear.reviews?.length ?? 0;
  const avg = calcAvgRating(gear.reviews);
  // Bayesian-ish nudge: a 5.0 from one review should not outrank a 4.8 from ten.
  return avg * Math.log10(reviewCount + 1) * 10 + avg;
}

function buildStats(
  gears: GearItem[],
  totalListings: number,
  categories: Category[],
): PlatformStats {
  const providerIds = new Set(
    gears.map((gear) => gear.providerId).filter(Boolean),
  );
  const ratings = gears.flatMap((gear) => gear.reviews ?? []).map((r) => r.rating);
  const averageRating = ratings.length
    ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
    : 0;

  return {
    totalListings,
    totalCategories: categories.length,
    totalProviders: providerIds.size,
    averageRating: Number(averageRating.toFixed(1)),
  };
}

function buildTestimonials(gears: GearItem[], limit = 6): Testimonial[] {
  const seenAuthors = new Set<string>();

  return gears
    .flatMap((gear) =>
      (gear.reviews ?? [])
        .filter((review) => review.comment?.trim().length > 20)
        .map<Testimonial>((review) => ({
          id: review.id,
          rating: review.rating,
          comment: review.comment.trim(),
          authorName: review.customer?.name ?? 'Verified renter',
          authorAvatar: review.customer?.avatarUrl ?? null,
          gearName: gear.name,
          gearId: gear.id,
          createdAt: review.createdAt,
        })),
    )
    .sort(
      (a, b) =>
        b.rating - a.rating ||
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .filter((testimonial) => {
      // One quote per person keeps the wall of reviews feeling varied.
      if (seenAuthors.has(testimonial.authorName)) return false;
      seenAuthors.add(testimonial.authorName);
      return true;
    })
    .slice(0, limit);
}

function buildCategoryHighlights(
  categories: Category[],
  gears: GearItem[],
): CategoryHighlight[] {
  return categories
    .map((category) => {
      const inCategory = gears.filter((gear) => gear.categoryId === category.id);
      const prices = inCategory
        .map((gear) => Number(gear.price))
        .filter((price) => Number.isFinite(price) && price > 0);
      const withImage = inCategory.find((gear) => gear.images);

      return {
        ...category,
        listingCount: inCategory.length,
        fromPrice: prices.length ? Math.min(...prices) : null,
        image: withImage?.images ?? null,
      };
    })
    .sort((a, b) => b.listingCount - a.listingCount);
}

/**
 * Single server-side fetch for everything the landing and about pages render.
 * Both public endpoints fail soft, so a backend outage degrades the page to
 * its static sections instead of throwing.
 */
export async function getHomePageData(): Promise<HomePageData> {
  const [gearsResult, categoriesResult] = await Promise.all([
    getAllGearsAction({
      limit: CATALOGUE_SAMPLE_SIZE,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    }),
    getAllCategoriesAction(),
  ]);

  const gears = gearsResult.success ? (gearsResult.data ?? []) : [];
  const categories = categoriesResult.success
    ? (categoriesResult.data ?? [])
    : [];
  const totalListings = gearsResult.meta?.total ?? gears.length;

  const rentable = gears.filter((gear) => gear.isActive && gear.stock > 0);
  const featured = [...rentable]
    .sort((a, b) => scoreForFeature(b) - scoreForFeature(a))
    .slice(0, 6);

  // `gears` already arrives newest-first; drop anything already featured so the
  // two grids never show the same listing twice.
  const featuredIds = new Set(featured.map((gear) => gear.id));
  const newest = rentable.filter((gear) => !featuredIds.has(gear.id)).slice(0, 6);

  return {
    featured,
    newest,
    categories: buildCategoryHighlights(categories, gears),
    testimonials: buildTestimonials(gears),
    stats: buildStats(gears, totalListings, categories),
    degraded: !gearsResult.success && !categoriesResult.success,
  };
}
