import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div style={{ textAlign: 'center', marginTop: '10vh' }}>
      <h1>🚫 Unauthorized</h1>
      <p>You do not have permission to access this page.</p>
      <Link href={'/dashboard'}>Go To Dashboard </Link>
    </div>
  );
}
