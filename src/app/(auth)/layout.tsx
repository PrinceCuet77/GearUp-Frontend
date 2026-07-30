export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className='flex flex-1 items-center justify-center px-4 py-6 sm:px-6 sm:py-8 min-h-0'
      style={{ backgroundColor: 'var(--background)' }}
    >
      {/* Subtle radial gradient background */}
      <div
        className='pointer-events-none fixed inset-0 -z-10'
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -20%, color-mix(in srgb, var(--primary) 15%, transparent), transparent)',
        }}
      />
      {children}
    </div>
  );
}
