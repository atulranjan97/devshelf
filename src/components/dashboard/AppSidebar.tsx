import Link from "next/link";
import {
  ChevronDown,
  Code,
  File,
  Folder,
  Image as ImageIcon,
  Link as LinkIcon,
  Settings,
  Sparkles,
  Star,
  StickyNote,
  Terminal,
  type LucideIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  collections,
  currentUser,
  items,
  itemTypes,
  mockItemTypeCounts,
} from "@/lib/mock-data";

const typeIcons: Record<string, LucideIcon> = {
  Code,
  Sparkles,
  StickyNote,
  Terminal,
  Link: LinkIcon,
  File,
  Image: ImageIcon,
};

function getCollectionItemCount(collectionId: string) {
  return items.filter((item) => item.collectionIds.includes(collectionId)).length;
}

export function AppSidebar() {
  const favoriteCollections = collections.filter((c) => c.isFavorite);
  const recentCollections = collections.filter((c) => !c.isFavorite);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <span className="px-2 text-sm font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
          Navigation
        </span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Types</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {itemTypes.map((type) => {
                const Icon = typeIcons[type.icon] ?? Code;
                return (
                  <SidebarMenuItem key={type.id}>
                    <SidebarMenuButton
                      render={<Link href={`/items/${type.slug}`} />}
                      tooltip={type.name}
                    >
                      <Icon style={{ color: type.color }} />
                      <span>{type.name}</span>
                    </SidebarMenuButton>
                    <SidebarMenuBadge>
                      {mockItemTypeCounts[type.id] ?? 0}
                    </SidebarMenuBadge>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <Collapsible defaultOpen>
          <SidebarGroup>
            <CollapsibleTrigger className="group/collapsible flex h-8 w-full shrink-0 cursor-pointer items-center justify-between rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-hidden ring-sidebar-ring transition-[margin,opacity] duration-200 ease-linear hover:bg-sidebar-accent focus-visible:ring-2 group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0">
              Collections
              <ChevronDown className="size-4 transition-transform group-data-closed/collapsible:-rotate-90" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent className="flex flex-col gap-3">
                {favoriteCollections.length > 0 && (
                  <div>
                    <p className="px-2 pb-1 text-xs text-sidebar-foreground/50 group-data-[collapsible=icon]:hidden">
                      Favorites
                    </p>
                    <SidebarMenu>
                      {favoriteCollections.map((collection) => (
                        <SidebarMenuItem key={collection.id}>
                          <SidebarMenuButton tooltip={collection.name}>
                            <Folder />
                            <span>{collection.name}</span>
                          </SidebarMenuButton>
                          <SidebarMenuBadge className="flex items-center gap-1">
                            <Star className="size-3.5 fill-amber-400 text-amber-400" />
                            {getCollectionItemCount(collection.id)}
                          </SidebarMenuBadge>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </div>
                )}

                {recentCollections.length > 0 && (
                  <div>
                    <p className="px-2 pb-1 text-xs text-sidebar-foreground/50 group-data-[collapsible=icon]:hidden">
                      Recent
                    </p>
                    <SidebarMenu>
                      {recentCollections.map((collection) => (
                        <SidebarMenuItem key={collection.id}>
                          <SidebarMenuButton tooltip={collection.name}>
                            <Folder />
                            <span>{collection.name}</span>
                          </SidebarMenuButton>
                          <SidebarMenuBadge>
                            {getCollectionItemCount(collection.id)}
                          </SidebarMenuBadge>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </div>
                )}
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-2 p-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0">
          <Avatar className="size-8 shrink-0">
            <AvatarImage src={currentUser.image ?? undefined} alt={currentUser.name} />
            <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-medium">{currentUser.name}</span>
            <span className="truncate text-xs text-sidebar-foreground/60">
              {currentUser.email}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            className="shrink-0 group-data-[collapsible=icon]:hidden"
          >
            <Settings />
          </Button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}