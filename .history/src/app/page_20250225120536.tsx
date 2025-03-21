import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import CategoryGrid from '@/components/CategoryGrid';
import FeaturedTreatments from '@/components/FeaturedTreatments';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white py-4">
            <SearchBar />
            <CategoryGrid />
          </div>
          <FeaturedTreatments />
        </div>
      </main>
    </>
  );
}
