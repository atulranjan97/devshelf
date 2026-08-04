import { ItemRow } from "@/components/dashboard/ItemRow";
import { getRecentItems } from "@/lib/db/items";

export async function RecentItems() {
  const recentItems = await getRecentItems();

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