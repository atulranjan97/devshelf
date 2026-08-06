import { prisma } from "@/lib/prisma";

// TODO: replace with the authenticated user's id once Auth.js is wired up.
const DEMO_USER_EMAIL = "demo@devstash.io";

export interface ItemTypeInfo {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface ItemWithType {
  id: string;
  title: string;
  description: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  updatedAt: Date;
  itemType: ItemTypeInfo;
  tags: string[];
}

function toItemWithType(item: {
  id: string;
  title: string;
  description: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  updatedAt: Date;
  itemType: { id: string; name: string; icon: string; color: string };
  tags: { tag: { name: string } }[];
}): ItemWithType {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    isFavorite: item.isFavorite,
    isPinned: item.isPinned,
    updatedAt: item.updatedAt,
    itemType: item.itemType,
    tags: item.tags.map(({ tag }) => tag.name),
  };
}

export async function getPinnedItems(): Promise<ItemWithType[]> {
  const user = await prisma.user.findUnique({ where: { email: DEMO_USER_EMAIL } });
  if (!user) return [];

  const items = await prisma.item.findMany({
    where: { userId: user.id, isPinned: true },
    orderBy: { updatedAt: "desc" },
    include: { itemType: true, tags: { include: { tag: true } } },
  });

  return items.map(toItemWithType);
}

export async function getRecentItems(limit = 10): Promise<ItemWithType[]> {
  const user = await prisma.user.findUnique({ where: { email: DEMO_USER_EMAIL } });
  if (!user) return [];

  const items = await prisma.item.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: { itemType: true, tags: { include: { tag: true } } },
  });

  return items.map(toItemWithType);
}

export interface ItemStats {
  total: number;
  favorites: number;
}

export async function getItemStats(): Promise<ItemStats> {
  const user = await prisma.user.findUnique({ where: { email: DEMO_USER_EMAIL } });
  if (!user) return { total: 0, favorites: 0 };

  const [total, favorites] = await Promise.all([
    prisma.item.count({ where: { userId: user.id } }),
    prisma.item.count({ where: { userId: user.id, isFavorite: true } }),
  ]);

  return { total, favorites };
}

export interface ItemTypeWithCount {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  isPro: boolean;
  count: number;
}

export async function getItemTypesWithCounts(): Promise<ItemTypeWithCount[]> {
  const types = await prisma.itemType.findMany({
    where: { isSystem: true },
    orderBy: { createdAt: "asc" },
  });

  const user = await prisma.user.findUnique({ where: { email: DEMO_USER_EMAIL } });
  if (!user) {
    return types.map((type) => ({ ...type, count: 0 }));
  }

  const counts = await prisma.item.groupBy({
    by: ["itemTypeId"],
    where: { userId: user.id },
    _count: true,
  });
  const countByTypeId = new Map(counts.map((c) => [c.itemTypeId, c._count]));

  return types.map((type) => ({
    id: type.id,
    name: type.name,
    slug: type.slug,
    icon: type.icon,
    color: type.color,
    isPro: type.isPro,
    count: countByTypeId.get(type.id) ?? 0,
  }));
}