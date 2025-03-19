import { MainLayout as SidebarLayout } from '@/components/layouts/MainLayout';

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarLayout>
      <main className="flex-grow bg-white pt-16">
        {children}
      </main>
    </SidebarLayout>
  );
} 