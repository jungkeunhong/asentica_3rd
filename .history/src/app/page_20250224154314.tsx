import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import CategoryGrid from '@/components/CategoryGrid';
import FeaturedTreatments from '@/components/FeaturedTreatments';

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: todos } = await supabase.from('todos').select()

  return (
    <ul>
      {todos?.map((todo) => (
        <li>{todo}</li>
      ))}
    </ul>
  )
}

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-16">
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
