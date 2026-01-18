import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center bg-bg">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-semibold">Page not found</h1>
        <p className="text-muted">The page you’re looking for doesn’t exist.</p>
        <Link href="/" className="inline-block px-4 py-2 rounded bg-accent text-bg">
          Go home
        </Link>
      </div>
    </div>
  );
}
