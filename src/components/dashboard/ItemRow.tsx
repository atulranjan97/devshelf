import { Pin, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { ItemWithType } from "@/lib/db/items";
import { TypeIcon } from "@/lib/item-type-icons";

export function ItemRow({ item }: { item: ItemWithType }) {
  const type = item.itemType;
  const date = item.updatedAt.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <Card
      className="border-l-2 py-3 transition-colors hover:ring-primary/30"
      style={{ borderLeftColor: type.color }}
    >
      <CardContent className="flex items-start gap-3">
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-md"
          style={{ backgroundColor: `${type.color}1a`, color: type.color }}
        >
          <TypeIcon icon={type.icon} className="size-4" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <h4 className="truncate font-medium">{item.title}</h4>
            {item.isPinned && (
              <Pin className="size-3.5 shrink-0 text-muted-foreground" />
            )}
            {item.isFavorite && (
              <Star className="size-3.5 shrink-0 fill-amber-400 text-amber-400" />
            )}
          </div>
          {item.description && (
            <p className="truncate text-sm text-muted-foreground">
              {item.description}
            </p>
          )}
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {item.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <span className="shrink-0 text-xs text-muted-foreground">{date}</span>
      </CardContent>
    </Card>
  );
}