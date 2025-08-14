//import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {
    ChevronsUpDown,
    House,
    KeyRound
} from "lucide-react"
import EmptyUser from "../assets/empty_user.svg"
import {
    Avatar,
    AvatarImage,
    AvatarFallback
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"


export function NavUser() {
    const navigate = useNavigate();
    //const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    // Get user info for display
    const getUserInfo = () => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch {
                return null;
            }
        }
        return null;
    };
    const user = getUserInfo();

    /*useEffect(() => {
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
    }, []);*/

    const handleLogout = async () => {
        try {
            localStorage.removeItem("token");
            localStorage.removeItem("ecommerseUser");
            window.location.href = '/';
        } catch (error) {
            console.error("Error logging out:", error);
        }
    }

    const gotoChangePassword = () => {
        navigate('/change-password');
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex sm:w-[260px] px-2 py-1 rounded-md min-w-0 gap-3 items-center data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={EmptyUser} alt="User" />
                        <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-sm font-medium">
                            {user?.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block text-left w-full">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user?.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user?.email || 'user@example.com'}
                        </p>
                    </div>
                    <ChevronsUpDown className="ml-6 size-7 hidden sm:block" />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side={"bottom"}
                align="end"
                sideOffset={4}
            >

                <DropdownMenuItem onClick={() => gotoChangePassword()}>
                    <KeyRound />
                    Change Password
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLogout()}>
                    <House />
                    Home Page
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )

}