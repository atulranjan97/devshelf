import Link from "next/link";
import { ChevronDown, Code, Folder, Settings, Star } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { getRecentCollections } from "@/lib/db/collections";
import { getItemTypesWithCounts } from "@/lib/db/items";
import { typeIcons } from "@/lib/item-type-icons";
import { currentUser } from "@/lib/mock-data";

export async function AppSidebar() {
  const [itemTypes, collections] = await Promise.all([
    getItemTypesWithCounts(),
    getRecentCollections(),
  ]);

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
                      <span className="truncate">{type.name}</span>
                      {type.isPro && (
                        <Badge
                          variant="outline"
                          className="h-4 px-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground group-data-[collapsible=icon]:hidden"
                        >
                          Pro
                        </Badge>
                      )}
                    </SidebarMenuButton>
                    <SidebarMenuBadge>{type.count}</SidebarMenuBadge>
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
                            {collection.itemCount}
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
                            <span
                              className="size-2.5 shrink-0 rounded-full"
                              style={{ backgroundColor: collection.dominantType?.color ?? "var(--muted-foreground)" }}
                            />
                            <span>{collection.name}</span>
                          </SidebarMenuButton>
                          <SidebarMenuBadge>{collection.itemCount}</SidebarMenuBadge>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </div>
                )}

                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      render={<Link href="/collections" />}
                      tooltip="View all collections"
                      className="text-sidebar-foreground/70"
                    >
                      <Folder />
                      <span>View all collections</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
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