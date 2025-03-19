import Navbar from '@/components/Navbar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow bg-white pt-16">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white py-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
} 