'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { AlertCircle, BellRing, CheckCircle2, Mail, Send } from 'lucide-react';

import { Container } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { SITE } from '@/lib/site';
import {
  gearAlertSchema,
  type GearAlertValues,
} from '@/lib/validations/newsletter';
import type { CategoryHighlight } from '@/lib/home-data';

/**
 * "Gear alerts" sign-up.
 *
 * GearUp has no mailing-list endpoint yet, so rather than fake a subscription
 * this composes a real, pre-filled email to the support inbox. The form still
 * demonstrates the full lifecycle the design system expects: validation,
 * inline errors, a loading state and a success state.
 */
export function GearAlertsSection({
  categories,
}: {
  categories: CategoryHighlight[];
}) {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GearAlertValues>({
    resolver: zodResolver(gearAlertSchema),
    defaultValues: { email: '', interest: '' },
  });

  const onSubmit = async (values: GearAlertValues) => {
    const interest = values.interest?.trim()
      ? values.interest.trim()
      : 'all categories';

    const subject = encodeURIComponent('Gear alerts sign-up');
    const body = encodeURIComponent(
      [
        `Please add ${values.email} to GearUp gear alerts.`,
        `Interested in: ${interest}.`,
      ].join('\n'),
    );

    // Give the button a beat of loading so the state change is perceptible.
    await new Promise((resolve) => setTimeout(resolve, 350));
    window.location.assign(
      `mailto:${SITE.contact.email}?subject=${subject}&body=${body}`,
    );

    setSubmittedEmail(values.email);
    reset();
  };

  return (
    <section className='section-y bg-background'>
      <Container>
        <Reveal>
          <div className='surface-card grid gap-10 overflow-hidden p-8 sm:p-12 lg:grid-cols-2 lg:items-center lg:gap-14'>
            <div>
              <span className='eyebrow border-secondary/25 bg-secondary-soft text-secondary-soft-foreground'>
                <BellRing className='h-3.5 w-3.5' aria-hidden='true' />
                Gear alerts
              </span>
              <h2 className='mt-5 text-3xl font-extrabold tracking-tight text-balance text-foreground sm:text-4xl'>
                Know the moment new gear lands
              </h2>
              <p className='mt-4 max-w-lg text-base leading-relaxed text-muted-foreground'>
                Tell us what you are hunting for and we will let you know when a
                matching listing goes live — no weekly digest, no noise.
              </p>
            </div>

            <div>
              {submittedEmail ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  role='status'
                  className='flex flex-col items-start gap-4 rounded-card border border-secondary/30 bg-secondary-soft p-6'
                >
                  <span className='flex h-11 w-11 items-center justify-center rounded-xl bg-secondary'>
                    <CheckCircle2 className='h-6 w-6 text-secondary-foreground' />
                  </span>
                  <div>
                    <p className='text-base font-bold text-foreground'>
                      Your request is ready to send
                    </p>
                    <p className='mt-1.5 text-sm leading-relaxed text-muted-foreground'>
                      We opened a pre-filled email from{' '}
                      <span className='font-semibold text-foreground'>
                        {submittedEmail}
                      </span>{' '}
                      to {SITE.contact.email}. Hit send in your mail app and we
                      will add you to the alert list.
                    </p>
                  </div>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setSubmittedEmail(null)}
                  >
                    Sign up another address
                  </Button>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                  className='space-y-4'
                >
                  <div>
                    <label htmlFor='alert-email' className='field-label'>
                      Email address
                    </label>
                    <div className='relative'>
                      <Mail
                        className='pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground'
                        aria-hidden='true'
                      />
                      <input
                        id='alert-email'
                        type='email'
                        autoComplete='email'
                        placeholder='you@example.com'
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={
                          errors.email ? 'alert-email-error' : undefined
                        }
                        className='field-input h-12 pl-10'
                        {...register('email')}
                      />
                    </div>
                    {errors.email && (
                      <p id='alert-email-error' className='field-error'>
                        <AlertCircle className='h-3.5 w-3.5 shrink-0' />
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor='alert-interest' className='field-label'>
                      What are you after?
                    </label>
                    <select
                      id='alert-interest'
                      className='field-input h-12'
                      {...register('interest')}
                    >
                      <option value=''>Any category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <p className='field-hint'>
                      Optional — pick a category to narrow the alerts.
                    </p>
                  </div>

                  <Button
                    type='submit'
                    size='lg'
                    fullWidth
                    loading={isSubmitting}
                    loadingText='Preparing your request…'
                    leadingIcon={<Send className='h-4 w-4' />}
                  >
                    Get gear alerts
                  </Button>

                  <p className='text-xs text-muted-foreground'>
                    We only use your address for the alerts you asked for.
                  </p>
                </form>
              )}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
