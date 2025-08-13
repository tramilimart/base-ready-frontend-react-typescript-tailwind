import { useEffect, useState } from 'react'
import axios from 'axios'
import {
    ChevronsUpDown,
    House,
    SquareUser,
    MapPin
} from "lucide-react"
import EmptyUser from "../assets/empty_user.svg"
import {
    Avatar,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuLabel
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSelector } from "react-redux";
import { UserDtls } from "@/interfaces/baseInterface";

interface RootState {
    user: UserDtls;
}

export function NavUser() {
    const userSlice = useSelector((state: RootState) => state.user);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchAvatar = async () => {
            if (!userSlice.name) return;

            // Format the name for URL
            const formattedName = userSlice.name.replace(/\s+/g, "+");

            // Generate API URL
            const apiUrl = `https://ui-avatars.com/api/?name=${formattedName}&background=random`;

            try {
                // Fetch image
                const response = await axios.get(apiUrl, { responseType: "blob" });

                // Convert Blob to image URL
                const imageUrl = URL.createObjectURL(response.data);
                setAvatarUrl(imageUrl);
            } catch (error) {
                console.error("Error fetching avatar:", error);
            }
        };
        fetchAvatar();
    }, []);

    const handleLogout = async () => {
        try {
            localStorage.removeItem("token");
            localStorage.removeItem("ecommerseUser");
            window.location.href = '/';
        } catch (error) {
            console.error("Error logging out:", error);
        }
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                {avatarUrl ? (
                                    <AvatarImage src={avatarUrl} alt={userSlice?.email} />
                                ) : (
                                    <AvatarImage src={EmptyUser} alt={userSlice?.email} />
                                )}
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight mr-4">
                                <span className="truncate font-semibold">{userSlice?.name}</span>
                                <span className="truncate text-xs">{userSlice?.email}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={"bottom"}
                        align="end"
                        sideOffset={4}
                    >

                        <DropdownMenuItem onClick={() => handleLogout()}>
                            <House />
                            Home Page
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )

}