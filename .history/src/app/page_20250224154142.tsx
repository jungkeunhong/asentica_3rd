import { supabase } from "@/utils/supabase/client";  // Supabase 클라이언트 가져오기
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import CategoryGrid from '@/components/CategoryGrid';
import FeaturedTreatments from '@/components/FeaturedTreatments';
import { useEffect, useState } from "react";

export default function Home() {
  const [treatments, setTreatments] = useState([]);

  useEffect(() => {
    const fetchTreatments = async () => {
      const { data, error } = await supabase.from("treatments").select("*");
      if (error) console.error("Error fetching treatments:", error);
      else setTreatments(data);
    };

    fetchTreatments();
  }, []);

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