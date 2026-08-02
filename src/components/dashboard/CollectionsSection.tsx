import { Code, Star } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { typeIcons } from "@/lib/item-type-icons";
import { collections, items, itemTypes, type MockCollection } from "@/lib/mock-data";

function CollectionCard({ collection }: { collection: MockCollection }) {
  const defaultType = itemTypes.find((t) => t.id === collection.defaultTypeId);
  const collectionItems = items.filter((item) =>
    item.collectionIds.includes(collection.id)
  );
  const typesInCollection = itemTypes.filter((type) =>
    collectionItems.some((item) => item.itemTypeId === type.id)
  );

  return (
    <Card
      className="border-l-4 py-4 transition-colors hover:ring-primary/20"
      style={{ borderLeftColor: defaultType?.color }}
    >
      <CardContent className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <h3 className="font-medium">{collection.name}</h3>
          {collection.isFavorite && (
            <Star className="size-3.5 shrink-0 fill-amber-400 text-amber-400" />
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {collectionItems.length} {collectionItems.length === 1 ? "item" : "items"}
        </p>
        <p className="text-sm text-muted-foreground">{collection.description}</p>
        {typesInCollection.length > 0 && (
          <div className="flex items-center gap-1.5 pt-1">
            {typesInCollection.map((type) => {
              const Icon = typeIcons[type.icon] ?? Code;
              return (
                <Icon key={type.id} className="size-4" style={{ color: type.color }} />
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function CollectionsSection() {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold">Recent Collections</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </section>
  );
}