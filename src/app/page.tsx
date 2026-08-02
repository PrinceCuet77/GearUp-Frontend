import Link from 'next/link';
import Image from 'next/image';
import {
  Dumbbell,
  ArrowRight,
  Bike,
  Tent,
  Waves,
  Star,
  CheckCircle2,
  Package,
  Repeat2,
} from 'lucide-react';
import { getAllCategoriesAction } from './(public)/_actions/getAllCategories';
import { getAllGearsAction } from './(public)/_actions/getAllGears';
import { formatBDT, parseGearImages, calcAvgRating } from '@/lib/gear-utils';

const howItWorks = [
  {
    step: '01',
    title: 'Browse & Choose',
    description:
      'Explore hundreds of sports and outdoor gear items. Filter by category, price, and availability.',
    icon: Package,
    color: '#f97316',
  },
  {
    step: '02',
    title: 'Book & Pay',
    description:
      'Select your rental dates, add to cart, and complete secure payment via SSLCommerz.',
    icon: CheckCircle2,
    color: '#22c55e',
  },
  {
    step: '03',
    title: 'Use & Return',
    description:
      "Pick up your gear, enjoy your adventure, and return it when you're done.",
    icon: Repeat2,
    color: '#3b82f6',
  },
];

const features = [
  {
    icon: Bike,
    title: 'Bikes & Cycling',
    description: 'Mountain bikes, road bikes, and cycling gear.',
    color: '#f97316',
  },
  {
    icon: Tent,
    title: 'Camping & Outdoors',
    description: 'Tents, sleeping bags, and outdoor essentials.',
    color: '#22c55e',
  },
  {
    icon: Waves,
    title: 'Water Sports',
    description: 'Kayaks, surfboards, and aquatic equipment.',
    color: '#3b82f6',
  },
];

export default async function HomePage() {
  const [gearsResult, categoriesResult] = await Promise.all([
    getAllGearsAction({ limit: 6 }),
    getAllCategoriesAction(),
  ]);

  const featuredGears = gearsResult.success
    ? (gearsResult.data ?? []).slice(0, 6)
    : [];
  const categories = categoriesResult.success
    ? (categoriesResult.data ?? []).slice(0, 4)
    : [];

  return (
    <div style={{ backgroundColor: 'var(--background)' }}>
      {/* Hero */}
      <section className='relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8'>
        <div
          className='pointer-events-none absolute inset-0 -z-10'
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% -10%, color-mix(in srgb, var(--primary) 18%, transparent), transparent)',
          }}
        />

        <div className='mx-auto max-w-4xl text-center'>
          <div
            className='mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium'
            style={{
              borderColor:
                'color-mix(in srgb, var(--primary) 30%, transparent)',
              color: 'var(--primary)',
              backgroundColor:
                'color-mix(in srgb, var(--primary) 8%, transparent)',
            }}
          >
            <Dumbbell className='h-3.5 w-3.5' />
            Rent Sports & Outdoor Gear
          </div>

          <h1
            className='mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl'
            style={{ color: 'var(--foreground)' }}
          >
            Gear Up for Your
            <br />
            <span style={{ color: 'var(--primary)' }}>Next Adventure</span>
          </h1>

          <p
            className='mx-auto mb-10 max-w-2xl text-lg leading-relaxed'
            style={{ color: 'var(--muted-foreground)' }}
          >
            Browse premium sports and outdoor equipment available for rent. From
            mountain bikes to camping gear — everything you need, whenever you
            need it.
          </p>

          <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
            <Link
              href='/gears'
              className='inline-flex h-12 items-center gap-2 rounded-xl px-8 text-base font-bold text-white transition-colors'
              style={{ backgroundColor: 'var(--primary)' }}
            >
              Browse Gear
              <ArrowRight className='h-4 w-4' />
            </Link>
            <Link
              href='/register'
              className='inline-flex h-12 items-center rounded-xl border px-8 text-base font-semibold transition-colors'
              style={{
                borderColor: 'var(--border)',
                color: 'var(--foreground)',
              }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className='px-4 pb-16 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-5xl'>
          <h2
            className='mb-10 text-center text-2xl font-bold'
            style={{ color: 'var(--foreground)' }}
          >
            What&apos;s Available to Rent
          </h2>
          <div className='grid gap-6 sm:grid-cols-3'>
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className='rounded-2xl border p-6 transition-shadow hover:shadow-md'
                  style={{
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--border)',
                  }}
                >
                  <div
                    className='mb-4 flex h-12 w-12 items-center justify-center rounded-xl'
                    style={{
                      backgroundColor: `color-mix(in srgb, ${feature.color} 14%, transparent)`,
                    }}
                  >
                    <Icon
                      className='h-6 w-6'
                      style={{ color: feature.color }}
                    />
                  </div>
                  <h3
                    className='mb-2 text-base font-semibold'
                    style={{ color: 'var(--foreground)' }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className='text-sm'
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        className='px-4 py-16 sm:px-6 lg:px-8'
        style={{ backgroundColor: 'var(--card)' }}
      >
        <div className='mx-auto max-w-5xl'>
          <div className='mb-12 text-center'>
            <h2
              className='mb-3 text-2xl font-bold'
              style={{ color: 'var(--foreground)' }}
            >
              How It Works
            </h2>
            <p
              className='text-base'
              style={{ color: 'var(--muted-foreground)' }}
            >
              Rent premium gear in three simple steps
            </p>
          </div>
          <div className='grid gap-8 sm:grid-cols-3'>
            {howItWorks.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className='text-center'>
                  <div className='relative mb-5 inline-flex'>
                    <div
                      className='flex h-16 w-16 items-center justify-center rounded-2xl'
                      style={{
                        backgroundColor: `color-mix(in srgb, ${item.color} 14%, transparent)`,
                      }}
                    >
                      <Icon className='h-8 w-8' style={{ color: item.color }} />
                    </div>
                    <span
                      className='absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white'
                      style={{ backgroundColor: item.color }}
                    >
                      {item.step}
                    </span>
                  </div>
                  <h3
                    className='mb-2 text-base font-semibold'
                    style={{ color: 'var(--foreground)' }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className='text-sm leading-relaxed'
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Gear */}
      <section className='px-4 py-16 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-6xl'>
          <div className='mb-10 flex items-end justify-between'>
            <div>
              <h2
                className='mb-1 text-2xl font-bold'
                style={{ color: 'var(--foreground)' }}
              >
                Featured Gear
              </h2>
              <p
                className='text-sm'
                style={{ color: 'var(--muted-foreground)' }}
              >
                Handpicked top-rated equipment for your next adventure
              </p>
            </div>
            <Link
              href='/gear'
              className='hidden items-center gap-1 text-sm font-semibold transition-colors sm:flex'
              style={{ color: 'var(--primary)' }}
            >
              View all <ArrowRight className='h-3.5 w-3.5' />
            </Link>
          </div>

          <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
            {featuredGears.map((gear) => (
              <Link
                key={gear.id}
                href={`/gears/${gear.id}`}
                className='group rounded-2xl border overflow-hidden transition-shadow hover:shadow-lg'
                style={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                }}
              >
                <div className='relative h-48 w-full overflow-hidden'>
                  <Image
                    src={parseGearImages(gear.images)[0]}
                    alt={gear.name}
                    fill
                    sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                    className='object-cover transition-transform duration-300 group-hover:scale-105'
                  />
                  {!gear.isActive && (
                    <div
                      className='absolute inset-0 flex items-center justify-center'
                      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                    >
                      <span
                        className='rounded-full px-3 py-1 text-xs font-semibold text-white'
                        style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
                      >
                        Unavailable
                      </span>
                    </div>
                  )}
                  <div className='absolute left-3 top-3'>
                    <span
                      className='rounded-full px-2.5 py-1 text-xs font-semibold text-white'
                      style={{ backgroundColor: 'var(--primary)' }}
                    >
                      {gear.category?.name ?? 'Gear'}
                    </span>
                  </div>
                </div>

                <div className='p-4'>
                  <h3
                    className='mb-1 line-clamp-1 font-semibold transition-colors group-hover:text-orange-500'
                    style={{ color: 'var(--foreground)' }}
                  >
                    {gear.name}
                  </h3>
                  <p
                    className='mb-3 line-clamp-2 text-sm'
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    {gear.description}
                  </p>
                  <div className='flex items-center justify-between'>
                    <span
                      className='text-lg font-bold'
                      style={{ color: 'var(--primary)' }}
                    >
                      {formatBDT(gear.price)}
                      <span
                        className='ml-1 text-xs font-normal'
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        /day
                      </span>
                    </span>
                    <div className='flex items-center gap-1'>
                      <Star
                        className='h-3.5 w-3.5'
                        style={{ color: '#f59e0b', fill: '#f59e0b' }}
                      />
                      <span
                        className='text-xs font-medium'
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        {gear.reviews?.length
                          ? calcAvgRating(gear.reviews).toFixed(1)
                          : 'New'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className='mt-8 text-center sm:hidden'>
            <Link
              href='/gear'
              className='inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-colors'
              style={{ backgroundColor: 'var(--primary)' }}
            >
              Browse All Gear <ArrowRight className='h-4 w-4' />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section
        className='px-4 pb-16 sm:px-6 lg:px-8 lg:pt-10'
        style={{ backgroundColor: 'var(--card)' }}
      >
        <div className='mx-auto max-w-5xl'>
          <h2
            className='mb-8 text-center text-2xl font-bold'
            style={{ color: 'var(--foreground)' }}
          >
            Browse by Category
          </h2>
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/gear?category=${encodeURIComponent(cat.name)}`}
                className='group flex flex-col items-center gap-3 rounded-2xl border p-5 text-center transition-all hover:shadow-md'
                style={{
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                }}
              >
                <div
                  className='flex h-12 w-12 items-center justify-center rounded-xl transition-colors'
                  style={{
                    backgroundColor:
                      'color-mix(in srgb, var(--primary) 12%, transparent)',
                  }}
                >
                  <Package
                    className='h-6 w-6'
                    style={{ color: 'var(--primary)' }}
                  />
                </div>
                <div>
                  <p
                    className='text-sm font-semibold'
                    style={{ color: 'var(--foreground)' }}
                  >
                    {cat.name}
                  </p>
                  {cat.description && (
                    <p
                      className='mt-0.5 text-xs line-clamp-2'
                      style={{ color: 'var(--muted-foreground)' }}
                    >
                      {cat.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className='px-4 py-16 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-3xl'>
          <div
            className='rounded-3xl p-10 text-center'
            style={{
              background:
                'linear-gradient(135deg, color-mix(in srgb, var(--primary) 85%, #ea580c), color-mix(in srgb, var(--primary) 60%, #7c3aed))',
            }}
          >
            <h2 className='mb-3 text-2xl font-bold text-white sm:text-3xl'>
              Ready to Gear Up?
            </h2>
            <p className='mb-8 text-base text-white/80'>
              Join thousands of adventurers renting top gear. Sign up free and
              start exploring today.
            </p>
            <div className='flex flex-col items-center gap-3 sm:flex-row sm:justify-center'>
              <Link
                href='/register'
                className='w-full rounded-xl bg-white px-8 py-3 text-sm font-bold transition-colors sm:w-auto'
                style={{ color: 'var(--primary)' }}
              >
                Create Free Account
              </Link>
              <Link
                href='/gears'
                className='w-full rounded-xl border border-white/30 px-8 py-3 text-sm font-semibold text-white transition-colors sm:w-auto'
              >
                Browse Gear First
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
