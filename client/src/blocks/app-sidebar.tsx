import { ChevronUp, HandHeart, LayoutDashboard, LogOut, NotebookPen, User2,
    QrCode, Settings, UserRound, } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
} from "@/components/ui/sidebar"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


// Menu items
const items = [
    {
        title: "Dashboard",
        url: "dashboard",
        icon: LayoutDashboard,
        sub: {
        }
    },
    {
        title: "Transactions",
        url: "transactions",
        icon: NotebookPen,
        sub: {
            title: "",
            url: "scan-receipt",
            icon: QrCode,
        }
    },
]

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Spendr</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />{item.title}
                                        </a>
                                    </SidebarMenuButton>
                                    <SidebarMenuSub>
                                        <SidebarMenuSubItem />
                                            <a href={item.sub.url}>
                                                {item.sub.title}
                                            </a>
                                    </SidebarMenuSub>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <User2/>Username
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className="w-[--radix-popper-anchor-width]"
                            >
                                <DropdownMenuItem>
                                    <UserRound/>
                                    <span><a href="/profile">Profile</a></span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <HandHeart/>
                                    <span><a href="/refer">Refer a friend</a></span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Settings />
                                    <span><a href="/settings">Settings</a></span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <LogOut/>
                                    <span><a href="/signout">Sign out</a></span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}