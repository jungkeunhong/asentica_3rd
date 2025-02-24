'use client';

import { useRouter } from 'next/navigation';
import BotoxTreatment from '@/components/treatments/BotoxTreatment';

export default function TreatmentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const treatmentId = params.id;

  const handleBackToMain = () => {
    router.push('/');
  };

  switch (treatmentId) {
    case 'botox':
      return <BotoxTreatment onBackToMain={handleBackToMain} />;
    default:
      return <div>Treatment not found</div>;
  }
}
