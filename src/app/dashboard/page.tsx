import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardPage() {
  return (
    <SidebarProvider className="flex h-dvh min-h-0 w-full flex-col">
      <TopBar />
      <div className="flex min-h-0 flex-1">
        <AppSidebar />
        <SidebarInset>
          <main className="flex-1 overflow-y-auto p-6">
            <h2>Main</h2>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}