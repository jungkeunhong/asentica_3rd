import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import CategoryGrid from '@/components/CategoryGrid';


export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-5">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white py-8">
            <div className="max-w-md mx-auto mt-4 px-4">
              <SearchBar />
            </div>
            <CategoryGrid />
          </div>
        </div>
      </main>
    </>
  );
}
