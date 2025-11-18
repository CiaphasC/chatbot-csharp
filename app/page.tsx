'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login on initial load
    router.push('/auth/login');
  }, [router]);

  return null;
}
