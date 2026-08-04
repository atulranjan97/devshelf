import { prisma } from "@/lib/prisma";

// TODO: replace with the authenticated user's id once Auth.js is wired up.
const DEMO_USER_EMAIL = "demo@devstash.io";

export interface CollectionItemType {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface CollectionWithStats {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  itemCount: number;
  /** Most-used item type in this collection, drives the card's border color. */
  dominantType: CollectionItemType | null;
  /** Every distinct item type present in this collection, most-used first. */
  types: CollectionItemType[];
}

export async function getRecentCollections(limit = 6): Promise<CollectionWithStats[]> {
  const user = await prisma.user.findUnique({ where: { email: DEMO_USER_EMAIL } });
  if (!user) return [];

  const collections = await prisma.collection.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: {
      defaultType: true,
      items: {
        include: { item: { include: { itemType: true } } },
      },
    },
  });

  return collections.map((collection) => {
    const typeCounts = new Map<string, { type: CollectionItemType; count: number }>();

    for (const { item } of collection.items) {
      const { itemType } = item;
      const entry = typeCounts.get(itemType.id);
      if (entry) {
        entry.count += 1;
      } else {
        typeCounts.set(itemType.id, {
          type: { id: itemType.id, name: itemType.name, icon: itemType.icon, color: itemType.color },
          count: 1,
        });
      }
    }

    const sortedTypes = [...typeCounts.values()].sort((a, b) => b.count - a.count);
    const defaultType = collection.defaultType;

    return {
      id: collection.id,
      name: collection.name,
      description: collection.description,
      isFavorite: collection.isFavorite,
      itemCount: collection.items.length,
      // Empty collections fall back to their defaultType so the card still gets a border color.
      dominantType:
        sortedTypes[0]?.type ??
        (defaultType
          ? { id: defaultType.id, name: defaultType.name, icon: defaultType.icon, color: defaultType.color }
          : null),
      types: sortedTypes.map(({ type }) => type),
    };
  });
}

export interface CollectionStats {
  total: number;
  favorites: number;
}

export async function getCollectionStats(): Promise<CollectionStats> {
  const user = await prisma.user.findUnique({ where: { email: DEMO_USER_EMAIL } });
  if (!user) return { total: 0, favorites: 0 };

  const [total, favorites] = await Promise.all([
    prisma.collection.count({ where: { userId: user.id } }),
    prisma.collection.count({ where: { userId: user.id, isFavorite: true } }),
  ]);

  return { total, favorites };
}