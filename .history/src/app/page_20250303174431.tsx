import Navbar from '@/components/Navbar';
import CategoryGrid from '@/components/CategoryGrid';
import LandingContent from './landingpage/landingcontent';


export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-5">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white py-8">
            <LandingContent />
            <CategoryGrid />
          </div>
        </div>
      </main>
    </>
  );
}
