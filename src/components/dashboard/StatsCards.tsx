import { Folder, LayoutGrid, Star, type LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { collections, items } from "@/lib/mock-data";

const stats: { label: string; value: number; icon: LucideIcon }[] = [
  { label: "Items", value: items.length, icon: LayoutGrid },
  { label: "Collections", value: collections.length, icon: Folder },
  {
    label: "Favorite Items",
    value: items.filter((item) => item.isFavorite).length,
    icon: Star,
  },
  {
    label: "Favorite Collections",
    value: collections.filter((collection) => collection.isFavorite).length,
    icon: Star,
  },
];

export function StatsCards() {
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