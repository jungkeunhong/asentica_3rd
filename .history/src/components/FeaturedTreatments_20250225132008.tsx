'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

const treatments = [
  {
    id: 'botox',
    title: 'Botox',
    image: 'https://plus.unsplash.com/premium_photo-1661769358914-1d33c22bd7ba?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Ym90b3h8ZW58MHx8MHx8fDA%3D',
    description: 'Natural wrinkle improvement and prevention...more',
    searchKeyword: 'botox'
  },
  {
    id: 'filler',
    title: 'Filler',
    image: 'https://plus.unsplash.com/premium_photo-1719617673012-4b121052cc8f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGZpbGxlcnxlbnwwfHwwfHx8MA%3D%3D',
    description: 'Natural volume and contour improvement...more',
    searchKeyword: 'filler'
  },
  {
    id: 'microneedling',
    title: 'Microneedling',
    image: 'https://media.istockphoto.com/id/1731969249/ko/%EC%82%AC%EC%A7%84/%EB%85%B8%ED%99%94-%EB%B0%A9%EC%A7%80-%ED%81%B4%EB%A6%AC%EB%8B%89%EC%97%90%EC%84%9C-%EC%A3%BC%EB%A6%84%EA%B3%BC-%ED%9D%89%ED%84%B0%EB%A5%BC-%EC%A4%84%EC%9D%B4%EA%B8%B0-%EC%9C%84%ED%95%B4-%EC%84%B1%EC%9D%B8-%EB%82%A8%EC%84%B1%EA%B3%BC-%ED%95%A8%EA%BB%98-%EB%A0%88%EC%9D%B4%EC%A0%80-%ED%91%9C%EB%A9%B4-%EC%B2%98%EB%A6%AC-%EC%96%BC%EA%B5%B4-%EC%8A%A4%ED%82%A8-%EC%BC%80%EC%96%B4-%EC%B9%98%EB%A3%8C-%EA%B8%B0%EC%88%A0%EC%9D%84-%EC%82%AC%EC%9A%A9%ED%95%98%EB%8A%94-%ED%94%BC%EB%B6%80-%EC%9D%98%EC%82%AC.webp?a=1&b=1&s=612x612&w=0&k=20&c=019vxc5s4SAycLCyiZC078IFtJvhqseZyHse_A9stbU=',
    description: 'Boost collagen, smooth texture, and reduce scars...more',
    searchKeyword: 'microneedling'
  },
];

const FeaturedTreatments = () => {
  const router = useRouter();

  const handleTreatmentClick = (treatmentId: string) => {
    router.push(`/treatment/${treatmentId}`);
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-left">    
          <p className="cormorant mt-2 text-2xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Learn more
          </p>
        </div>
        <div className="mt-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {treatments.map((treatment) => (
              <div
                key={treatment.id}
                className="cursor-pointer group"
                onClick={() => handleTreatmentClick(treatment.id)}
              >
                <div className="relative h-36 w-full overflow-hidden rounded-lg bg-white group-hover:opacity-75 sm:h-64">
                  <Image
                    src={treatment.image}
                    alt={treatment.title}
                    fill
                    className="object-cover object-center"
                  />
                </div>
                <h3 className="cormorant mt-4 text-xl font-extrabold text-gray-900">{treatment.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{treatment.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedTreatments;