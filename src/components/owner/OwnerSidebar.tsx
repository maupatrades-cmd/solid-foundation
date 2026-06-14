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

const items = [
  { title: "Dashboard", url: "/owner", icon: LayoutDashboard, live: true },
  { title: "Leads", url: "/owner/leads", icon: Users, live: false },
  { title: "Deals", url: "/owner/deals", icon: Briefcase, live: false },
  { title: "Clients", url: "/owner/clients", icon: Users, live: false },
  { title: "Invoices", url: "/owner/invoices", icon: Receipt, live: false },
  { title: "Commissions", url: "/owner/commissions", icon: DollarSign, live: false },
  { title: "Contracts", url: "/owner/contracts", icon: FileText, live: false },
  { title: "Fulfilment", url: "/owner/fulfilment", icon: ClipboardList, live: false },
  { title: "Team & HR", url: "/owner/team", icon: UserCog, live: false },
  { title: "Marketing", url: "/owner/marketing", icon: Megaphone, live: false },
  { title: "Activity", url: "/owner/activity", icon: Activity, live: false },
  { title: "Comms", url: "/owner/comms", icon: MessageSquare, live: false },
  { title: "Settings", url: "/owner/settings", icon: Settings, live: false },
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
                const active = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link
                        to={item.url}
                        className="flex items-center gap-2"
                        title={item.live ? item.title : `${item.title} (coming in slice 2)`}
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="flex-1">{item.title}</span>
                        {!item.live && (
                          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                            soon
                          </span>
                        )}
                      </Link>
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
