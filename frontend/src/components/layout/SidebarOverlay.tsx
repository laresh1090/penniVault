"use client";

import { useSidebar } from "@/contexts/sidebar-context";

export default function SidebarOverlay() {
  const { isOpen, close } = useSidebar();

  return (
    <div
      className={`sidebar-overlay${isOpen ? " open" : ""}`}
      onClick={close}
    />
  );
}
