import {
  Code,
  File,
  Image as ImageIcon,
  Link as LinkIcon,
  Sparkles,
  StickyNote,
  Terminal,
  type LucideIcon,
} from "lucide-react";

export const typeIcons: Record<string, LucideIcon> = {
  Code,
  Sparkles,
  StickyNote,
  Terminal,
  Link: LinkIcon,
  File,
  Image: ImageIcon,
};

export function TypeIcon({
  icon,
  className,
}: {
  icon: string | undefined;
  className?: string;
}) {
  const Icon = (icon ? typeIcons[icon] : undefined) ?? Code;
  return <Icon className={className} />;
}