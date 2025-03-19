'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import BotoxTreatment from '@/components/treatments/BotoxTreatment';

export default function TreatmentPage() {
  const router = useRouter();
  const params = useParams();
  const [treatmentId, setTreatmentId] = useState<string | null>(null);

  useEffect(() => {
    if (params?.id) {
      setTreatmentId(params.id);
    }
  }, [params]);

  const handleBackToMain = () => {
    router.push('/');
  };

  if (!treatmentId) return <p>Loading...</p>;

  return (
    <>
      {treatmentId === 'botox' ? (
        <BotoxTreatment onBackToMain={handleBackToMain} />
      ) : (
        <div>Treatment not found</div>
      )}
    </>
  );
}