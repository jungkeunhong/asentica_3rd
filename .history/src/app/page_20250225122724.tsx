import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import CategoryGrid from '@/components/CategoryGrid';
import FeaturedTreatments from '@/components/FeaturedTreatments';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white py-8">
            <SearchBar />
            <CategoryGrid />
          </div>
          <FeaturedTreatments />
        </div>
      </main>
    </>
  );
}
