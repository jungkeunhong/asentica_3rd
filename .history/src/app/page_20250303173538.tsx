import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import CategoryGrid from '@/components/CategoryGrid';
import LandingContent from './landingpage/landingcontent';


export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-5">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white py-8 mt-4">
            <div className="max-w-md mx-auto mt-4 px-4">
              <SearchBar />
            </div>
            <LandingContent />
            <CategoryGrid />
          </div>
        </div>
      </main>
    </>
  );
}
