export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: 'var(--card)',
        borderTop: '1px solid var(--border)',
      }}
    >
      {/* Bottom Bar */}
      <div
        style={{ borderTop: '1px solid var(--border)' }}
        className='mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8'
      >
        <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
          <p className='text-xs' style={{ color: 'var(--muted-foreground)' }}>
            &copy; {currentYear} GearUp. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
