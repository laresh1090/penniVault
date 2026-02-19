"use client";

import { SidebarProvider } from "@/contexts/sidebar-context";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import DashboardTopbar from "@/components/layout/DashboardTopbar";
import SidebarOverlay from "@/components/layout/SidebarOverlay";

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="dashboard-wrapper">
        <DashboardSidebar />
        <SidebarOverlay />
        <div style={{ flex: 1 }}>
          <DashboardTopbar />
          <main className="dashboard-content">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
