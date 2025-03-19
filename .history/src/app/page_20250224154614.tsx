import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import CategoryGrid from '@/components/CategoryGrid';
import FeaturedTreatments from '@/components/FeaturedTreatments';

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Supabase에서 treatments 데이터 가져오기
  const { data: treatments, error } = await supabase.from('treatments').select('*');

  if (error) {
    console.error('Error fetching treatments:', error);
    return <p>Failed to load treatments.</p>;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white py-8">
            <SearchBar />
            <CategoryGrid />
          </div>
          <FeaturedTreatments treatments={treatments} />
        </div>
      </main>
    </>
  );
}