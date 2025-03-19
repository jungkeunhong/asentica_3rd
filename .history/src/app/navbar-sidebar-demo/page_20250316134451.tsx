'use client';

import { MainLayout } from '@/components/layouts/MainLayout';

export default function NavbarSidebarDemo() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-amber-900 mb-6">Navbar with Sidebar Integration</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <p className="mb-4">
            Click the menu icon in the top-right corner of the navbar to open the sidebar menu.
          </p>
          
          <h3 className="text-lg font-medium mb-2">Features:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Menu button integrated in the Navbar</li>
            <li>Responsive sidebar that slides in from the left</li>
            <li>Overlay that darkens the background when sidebar is open</li>
            <li>Click outside to close the sidebar</li>
            <li>Active menu item highlighting</li>
            <li>Mobile-responsive design</li>
          </ul>
        </div>
      </div>
    </MainLayout>
  );
} 