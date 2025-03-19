import CategoryGrid from '@/components/CategoryGrid';
import LandingContent from '@/app/landingpage/landingcontent';
import Footer from '@/app/landingpage/footer';
import Navbar from '@/components/Navbar';
import { MainLayout } from '@/components/layouts/MainLayout';

export default function Home() {
  return (
    <MainLayout>
      <Navbar />
      <LandingContent />
      <CategoryGrid />
      <Footer />
    </MainLayout>
  );
} 