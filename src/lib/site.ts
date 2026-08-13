/**
 * Site-wide content and navigation configuration.
 *
 * Everything the marketing surface renders (nav, footer, FAQ, value props)
 * lives here so copy can be edited in one place without touching components.
 * Every `href` below resolves to a route that exists in this app.
 */

import {
  BadgeCheck,
  CalendarCheck2,
  CreditCard,
  Leaf,
  MessageSquareHeart,
  PackageSearch,
  ShieldCheck,
  Truck,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import {
  FacebookIcon,
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  XIcon,
  YouTubeIcon,
  type BrandIcon,
} from '@/components/ui/BrandIcons';

/* ── Brand ─────────────────────────────────────────────────────────────── */

export const SITE = {
  name: 'GearUp',
  tagline: 'Rent the gear. Keep the adventure.',
  description:
    'GearUp is a peer-to-peer rental marketplace for sports and outdoor equipment in Bangladesh. Rent premium gear by the day, or list your own and earn from what you already own.',
  /** Replace with your live contact details before going to production. */
  contact: {
    email: 'support@gearup.com.bd',
    phone: '+880 1711 000 000',
    phoneHref: 'tel:+8801711000000',
    address: 'Level 4, House 27, Road 11, Banani, Dhaka 1213, Bangladesh',
    hours: 'Sat–Thu, 9:00 AM – 8:00 PM (GMT+6)',
  },
} as const;

/* ── Navigation ────────────────────────────────────────────────────────── */

export interface NavLink {
  href: string;
  label: string;
}

/** Primary navigation, shown in the navbar for every visitor. */
export const PUBLIC_LINKS: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/gears', label: 'Browse Gear' },
  { href: '/about', label: 'About' },
];

export interface FooterColumn {
  title: string;
  links: NavLink[];
}

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: 'Explore',
    links: [
      { href: '/', label: 'Home' },
      { href: '/gears', label: 'Browse Gear' },
      { href: '/about', label: 'About GearUp' },
      { href: '/#how-it-works', label: 'How It Works' },
      { href: '/#faq', label: 'FAQ' },
    ],
  },
  {
    title: 'For Renters',
    links: [
      { href: '/register', label: 'Create an Account' },
      { href: '/login', label: 'Sign In' },
      { href: '/customer/rental-orders', label: 'My Rentals' },
      { href: '/customer/payments', label: 'Payments' },
      { href: '/customer/reviews', label: 'My Reviews' },
    ],
  },
  {
    title: 'For Providers',
    links: [
      { href: '/register', label: 'List Your Gear' },
      { href: '/provider', label: 'Provider Dashboard' },
      { href: '/provider/gears', label: 'Manage Listings' },
      { href: '/provider/rental-orders', label: 'Rental Orders' },
    ],
  },
];

export interface SocialLink {
  label: string;
  href: string;
  icon: BrandIcon;
}

/** Replace these handles with your real profiles before launch. */
export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'Facebook', href: 'https://www.facebook.com/', icon: FacebookIcon },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/',
    icon: InstagramIcon,
  },
  { label: 'X', href: 'https://x.com/', icon: XIcon },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/', icon: LinkedInIcon },
  { label: 'YouTube', href: 'https://www.youtube.com/', icon: YouTubeIcon },
  { label: 'GitHub', href: 'https://github.com/', icon: GitHubIcon },
];

/* ── How it works ──────────────────────────────────────────────────────── */

export interface HowItWorksStep {
  step: string;
  title: string;
  description: string;
  icon: LucideIcon;
  tone: 'primary' | 'secondary' | 'accent';
}

export const HOW_IT_WORKS: HowItWorksStep[] = [
  {
    step: '01',
    title: 'Find your gear',
    description:
      'Search the catalogue or filter by category, price and availability. Every listing shows live stock, daily rate and verified renter reviews.',
    icon: PackageSearch,
    tone: 'primary',
  },
  {
    step: '02',
    title: 'Pick your dates',
    description:
      'Choose a start and end date, set the quantity, and add it to your cart. Pricing is calculated per day, so you always see the exact total before you commit.',
    icon: CalendarCheck2,
    tone: 'accent',
  },
  {
    step: '03',
    title: 'Pay securely',
    description:
      'Once the provider confirms your order, pay online through SSLCommerz. Your booking moves to Paid and the gear is reserved in your name.',
    icon: CreditCard,
    tone: 'secondary',
  },
  {
    step: '04',
    title: 'Ride, then return',
    description:
      'Collect the gear, enjoy the trip, and mark it returned in your dashboard when you hand it back. Then leave a review to help the next adventurer.',
    icon: Truck,
    tone: 'primary',
  },
];

/* ── Why GearUp ────────────────────────────────────────────────────────── */

export interface ValueProp {
  title: string;
  description: string;
  icon: LucideIcon;
  tone: 'primary' | 'secondary' | 'accent';
}

export const VALUE_PROPS: ValueProp[] = [
  {
    title: 'Verified providers',
    description:
      'Every provider account is reviewed by our admin team before listings go live, and accounts can be suspended the moment standards slip.',
    icon: BadgeCheck,
    tone: 'primary',
  },
  {
    title: 'Protected payments',
    description:
      'Payments run through SSLCommerz and are only captured after a provider confirms your booking. Every transaction is receipted in your dashboard.',
    icon: ShieldCheck,
    tone: 'secondary',
  },
  {
    title: 'Honest reviews',
    description:
      'Only customers who actually completed a rental can review it, so the ratings you read come from people who genuinely used the gear.',
    icon: MessageSquareHeart,
    tone: 'accent',
  },
  {
    title: 'Transparent pricing',
    description:
      'Daily rates in Bangladeshi Taka, calculated across your exact rental window. No booking fees bolted on at the last step.',
    icon: Wallet,
    tone: 'secondary',
  },
  {
    title: 'Earn from idle kit',
    description:
      'List the bike, tent or kayak that spends most of the year in storage and turn it into recurring income with a provider account.',
    icon: Leaf,
    tone: 'primary',
  },
  {
    title: 'One dashboard, end to end',
    description:
      'Track orders through Placed, Confirmed, Paid, Picked Up and Returned - with every payment and review in the same place.',
    icon: CalendarCheck2,
    tone: 'accent',
  },
];

/* ── FAQ ───────────────────────────────────────────────────────────────── */

export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqEntry[] = [
  {
    id: 'booking',
    question: 'How does a GearUp rental actually work?',
    answer:
      'Pick your gear and rental dates, then place the order. It starts as Placed while the provider reviews it. Once they confirm, you pay online and the status moves to Paid. After you collect the gear it becomes Picked Up, and when you hand it back it is marked Returned - at which point you can leave a review.',
  },
  {
    id: 'pricing',
    question: 'How is the rental price calculated?',
    answer:
      'Every listing has a daily rate in Bangladeshi Taka. Your total is the daily rate multiplied by the quantity and by the number of days between your start and end date, with a one-day minimum. The full amount is shown in your cart before you check out.',
  },
  {
    id: 'payment',
    question: 'When and how do I pay?',
    answer:
      'You pay only after the provider confirms your booking. Payment is handled by SSLCommerz, which supports cards, mobile financial services and internet banking in Bangladesh. Every completed payment appears in the Payments section of your dashboard with its transaction ID.',
  },
  {
    id: 'cancel',
    question: 'Can I cancel an order?',
    answer:
      'Yes. You can cancel an order from its detail page while it is still Placed or Confirmed - that is, any time before the gear has been paid for and picked up. Once a rental is under way it can no longer be cancelled.',
  },
  {
    id: 'provider',
    question: 'How do I list my own gear?',
    answer:
      'Register with a provider account, then add listings from the Provider dashboard: name, description, category, daily price, stock and photos. Your listings appear in the public catalogue immediately and you manage every incoming order from the same place.',
  },
  {
    id: 'reviews',
    question: 'Who can leave a review?',
    answer:
      'Only the customer on a completed rental order can review the gear from that order. That rule is enforced on the server, which is why GearUp ratings reflect real rentals rather than drive-by opinions.',
  },
  {
    id: 'damage',
    question: 'What if the gear is damaged or missing parts?',
    answer:
      'Report it to the provider before you mark the order as returned, and contact us at ' +
      SITE.contact.email +
      '. Our admin team can review the order, contact both sides and suspend an account where a provider is repeatedly at fault.',
  },
];

/* ── About page content ────────────────────────────────────────────────── */

export interface AboutValue {
  title: string;
  description: string;
}

export const ABOUT_VALUES: AboutValue[] = [
  {
    title: 'Access over ownership',
    description:
      'A tent used four weekends a year is a wasted asset. GearUp exists so people can reach for good equipment without buying it outright - and so owners can put theirs to work.',
  },
  {
    title: 'Trust is a feature, not a promise',
    description:
      'Verified providers, review-gated ratings and an admin team that can suspend bad actors. Trust here is enforced in the product, not printed on a banner.',
  },
  {
    title: 'Local by design',
    description:
      'Prices in Taka, dates in Dhaka time, payments through SSLCommerz. GearUp is built for how renting actually works in Bangladesh rather than translated from somewhere else.',
  },
  {
    title: 'Lighter on the planet',
    description:
      'Every rental is one fewer item manufactured, shipped and eventually stored in a cupboard. Sharing gear is the most straightforward sustainability win in outdoor sport.',
  },
];
