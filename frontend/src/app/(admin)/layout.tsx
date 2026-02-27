"use client";

import { Suspense } from "react";
import "@/styles/template/style.css";
import "@/styles/template/dashboard.css";
import { SidebarProvider } from "@/contexts/sidebar-context";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import DashboardTopbar from "@/components/layout/DashboardTopbar";
import SidebarOverlay from "@/components/layout/SidebarOverlay";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <SidebarProvider>
        <div className="sidebar-overlay"></div>
        <div className="dashboard-wrapper">
          <DashboardSidebar />
          <div className="dashboard-main">
            <DashboardTopbar />
            <div className="dashboard-content">{children}</div>
          </div>
        </div>
      </SidebarProvider>
    </Suspense>
  );
}
