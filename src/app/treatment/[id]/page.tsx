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
      // params.id가 배열인 경우 첫 번째 값을 사용하고, 문자열인 경우 그대로 사용
      const id = Array.isArray(params.id) ? params.id[0] : params.id;
      setTreatmentId(id);
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