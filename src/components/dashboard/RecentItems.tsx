import { ItemRow } from "@/components/dashboard/ItemRow";
import { items } from "@/lib/mock-data";

export function RecentItems() {
  const recentItems = [...items]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 10);

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold">Recent Items</h2>
      <div className="flex flex-col gap-3">
        {recentItems.map((item) => (
          <ItemRow key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}