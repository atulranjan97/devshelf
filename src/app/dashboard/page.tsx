import { TopBar } from "@/components/dashboard/TopBar";

export default function DashboardPage() {
  return (
    <div className="flex h-dvh flex-col">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 shrink-0 border-r border-border p-4">
          <h2>Sidebar</h2>
        </aside>
        <main className="flex-1 overflow-y-auto p-6">
          <h2>Main</h2>
        </main>
      </div>
    </div>
  );
}