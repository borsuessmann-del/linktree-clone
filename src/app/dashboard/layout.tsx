import type { Metadata } from "next";

import { DashboardHeader } from "@/components/dashboard/header";

export const metadata: Metadata = {
  title: "Dashboard · Linktree-Clone",
};

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return (
    <div className="flex flex-1 flex-col">
      <DashboardHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
