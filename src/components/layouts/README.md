# Responsive Sidebar Menu for Next.js

This directory contains components for a responsive sidebar menu implementation for Next.js applications.

## Components

### MainLayout

The `MainLayout` component is the main wrapper that includes the sidebar menu and the main content area. It handles the state for opening and closing the sidebar.

```tsx
<MainLayout>
  {/* Your page content here */}
</MainLayout>
```

### Sidebar

The `Sidebar` component is the actual sidebar menu that slides in from the left. It includes the menu items and handles click-outside to close.

### MenuItem

The `MenuItem` component represents an individual menu item in the sidebar. It handles active state highlighting based on the current route.

### MenuToggle

The `MenuToggle` component is the button that toggles the sidebar open and closed.

## Features

- Responsive design that works on mobile and desktop
- Slide-in animation for the sidebar
- Overlay that darkens the background when the sidebar is open
- Click-outside to close the sidebar
- Escape key to close the sidebar
- Active menu item highlighting
- Focus management for accessibility
- Mobile-first approach
- Navbar integration with menu button

## Usage

To use the sidebar menu in your Next.js application:

1. Import the `MainLayout` component
2. Wrap your page content with the `MainLayout` component

```tsx
'use client';

import { MainLayout } from '@/components/layouts/MainLayout';

export default function YourPage() {
  return (
    <MainLayout>
      <div>
        {/* Your page content here */}
      </div>
    </MainLayout>
  );
}
```

## Navbar Integration

The sidebar menu can be integrated with the Navbar component:

1. Add the menu button to the Navbar component
2. Use a custom event to communicate between the Navbar and MainLayout

```tsx
// In Navbar.tsx
const toggleSidebar = () => {
  const event = new CustomEvent('toggle-sidebar');
  window.dispatchEvent(event);
};

// In MainLayout.tsx
useEffect(() => {
  const handleToggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };
  
  window.addEventListener('toggle-sidebar', handleToggleSidebar);
  
  return () => {
    window.removeEventListener('toggle-sidebar', handleToggleSidebar);
  };
}, []);
```

## Customization

You can customize the sidebar menu by:

- Modifying the menu items in the `Sidebar` component
- Changing the colors in the Tailwind CSS classes
- Adjusting the width of the sidebar
- Adding more features like nested menu items or user profile section 