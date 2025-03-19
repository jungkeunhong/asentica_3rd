import CategoryGrid from '@/components/CategoryGrid';
import LandingContent from '@/app/landingpage/landingcontent';
import Footer from '@/app/landingpage/footer';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <>
      <Navbar />
      <LandingContent />
      <CategoryGrid />
      <Footer />
    </>
  );
} 