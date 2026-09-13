import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarDesktop, SidebarDrawer } from './Sidebar';
import { Topbar } from './Topbar';

export function AppShell() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f6f5f2]">
      <SidebarDesktop />
      <SidebarDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar onOpenMenu={() => setDrawerOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
