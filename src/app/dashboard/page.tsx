import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { CollectionsSection } from "@/components/dashboard/CollectionsSection";
import { PinnedItems } from "@/components/dashboard/PinnedItems";
import { RecentItems } from "@/components/dashboard/RecentItems";
import { StatsCards } from "@/components/dashboard/StatsCards";
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
            <div className="mx-auto flex max-w-5xl flex-col gap-8">
              <div>
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                <p className="text-muted-foreground">Your developer knowledge hub</p>
              </div>
              <StatsCards />
              <CollectionsSection />
              <PinnedItems />
              <RecentItems />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}