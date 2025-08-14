import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Button } from './ui/button';
import { Moon, Sun, Menu, PanelLeft, ChevronRight } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useLocation, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { NavUser } from './NavUser';

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const { theme, setTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    // Generate breadcrumbs based on current location
    const generateBreadcrumbs = () => {
        const pathSegments = location.pathname.split('/').filter(Boolean);
        const breadcrumbs = ['Home'];

        pathSegments.forEach((segment) => {
            const capitalized = segment.charAt(0).toUpperCase() + segment.slice(1);
            breadcrumbs.push(capitalized);
        });

        return breadcrumbs;
    };

    const breadcrumbs = generateBreadcrumbs();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className={`w-full lg:w-auto bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-6 fixed top-0 ${sidebarOpen ? 'md:left-64 sm:left-0' : 'left-0'} transition-all duration-300 ease-in-out right-0 z-40`}>
                {/* Left side - Sidebar toggle and breadcrumbs */}
                <div className="flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleSidebar}
                        className="p-2 hidden lg:block"
                    >
                        <PanelLeft className="h-4 w-4" />
                    </Button>

                    <Separator orientation="vertical" className="h-6 bg-foreground opacity-20" />

                    {/* Breadcrumbs */}
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        {breadcrumbs.map((crumb, index) => (
                            <React.Fragment key={index}>
                                {index > 0 && <ChevronRight className="h-4 w-4" />}
                                <span className={index === breadcrumbs.length - 1 ? 'text-gray-900 dark:text-white font-medium' : ''}>
                                    {crumb}
                                </span>
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Right side - User info and theme toggle */}
                <div className="flex items-center space-x-4 relative">

                    {/* Theme toggle */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleTheme}
                        className="p-2"
                        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                    >
                        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>

                    <Separator orientation="vertical" className="h-6 bg-foreground opacity-20" />

                    {/* Account Information */}
                    <NavUser />
                </div>
            </header>

            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} />

            {/* Main content area */}
            <div className={`pt-16 transition-all duration-300 ease-in-out ${sidebarOpen ? 'lg:pl-64' : 'lg:pl-0'}`}>
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
