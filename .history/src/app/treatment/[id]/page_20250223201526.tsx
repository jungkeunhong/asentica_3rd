'use client';

import { useRouter } from 'next/navigation';
import BotoxTreatment from '@/components/treatments/BotoxTreatment';

export default function TreatmentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const treatmentId = params.id;

  const handleBackToMain = () => {
    router.push('/');
  };

  // 현재는 Botox만 구현되어 있습니다.
  // 추후 다른 treatment들이 추가되면 여기에 추가하면 됩니다.
  switch (treatmentId) {
    case 'botox':
      return <BotoxTreatment onBackToMain={handleBackToMain} />;
    default:
      return <div>Treatment not found</div>;
  }
}
