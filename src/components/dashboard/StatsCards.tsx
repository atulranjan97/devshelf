import { Folder, LayoutGrid, Star, type LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { getCollectionStats } from "@/lib/db/collections";
import { getItemStats } from "@/lib/db/items";

export async function StatsCards() {
  const [itemStats, collectionStats] = await Promise.all([
    getItemStats(),
    getCollectionStats(),
  ]);

  const stats: { label: string; value: number; icon: LucideIcon }[] = [
    { label: "Items", value: itemStats.total, icon: LayoutGrid },
    { label: "Collections", value: collectionStats.total, icon: Folder },
    { label: "Favorite Items", value: itemStats.favorites, icon: Star },
    { label: "Favorite Collections", value: collectionStats.favorites, icon: Star },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="transition-colors hover:ring-primary/20">
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-semibold">{stat.value}</p>
            </div>
            <stat.icon className="size-8 text-muted-foreground/30" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}