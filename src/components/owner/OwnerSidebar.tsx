import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Receipt,
  DollarSign,
  FileText,
  ClipboardList,
  Megaphone,
  Activity,
  MessageSquare,
  Settings,
  UserCog,
  type LucideIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

type Item = { title: string; section: string | null; icon: LucideIcon };

const items: Item[] = [
  { title: "Dashboard", section: null, icon: LayoutDashboard },
  { title: "Leads", section: "leads", icon: Users },
  { title: "Deals", section: "deals", icon: Briefcase },
  { title: "Clients", section: "clients", icon: Users },
  { title: "Invoices", section: "invoices", icon: Receipt },
  { title: "Commissions", section: "commissions", icon: DollarSign },
  { title: "Contracts", section: "contracts", icon: FileText },
  { title: "Fulfilment", section: "fulfilment", icon: ClipboardList },
  { title: "Team & HR", section: "team", icon: UserCog },
  { title: "Marketing", section: "marketing", icon: Megaphone },
  { title: "Activity", section: "activity", icon: Activity },
  { title: "Comms", section: "comms", icon: MessageSquare },
  { title: "Settings", section: "settings", icon: Settings },
];

export function OwnerSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Owner</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const url = item.section ? `/owner/${item.section}` : "/owner";
                const active = pathname === url;
                const isDashboard = item.section === null;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active}>
                      {isDashboard ? (
                        <Link to="/owner" className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <span className="flex-1">{item.title}</span>
                        </Link>
                      ) : (
                        <Link
                          to="/owner/$section"
                          params={{ section: item.section! }}
                          className="flex items-center gap-2"
                          title={`${item.title} (coming in slice 2)`}
                        >
                          <item.icon className="h-4 w-4" />
                          <span className="flex-1">{item.title}</span>
                          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                            soon
                          </span>
                        </Link>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
