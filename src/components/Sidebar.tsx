import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import {
    Home,
    Package,
    ShoppingCart,
    Users,
    BarChart3,
    FileText,
    Settings,
    HelpCircle,
    LogOut,
    PanelLeft,
    X
} from 'lucide-react';

const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Orders', href: '/orders', icon: ShoppingCart },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Customers', href: '/customers', icon: Users },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
    { name: 'Documents', href: '/documents', icon: FileText },
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Help', href: '/help', icon: HelpCircle },
];

interface SidebarProps {
    isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear authentication data
        localStorage.removeItem('jwt');
        localStorage.removeItem('user');

        // Redirect to login page
        navigate('/login');
    };

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

    return (
        <>
            {/* Mobile sidebar toggle */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMobileSidebarOpen(true)}
                    className="p-2 bg-white dark:bg-gray-800 lg:shadow-md"
                >
                    <PanelLeft className="h-6 w-6" />
                </Button>
            </div>

            {/* Desktop sidebar */}
            <div className={cn(
                "hidden lg:flex lg:flex-col lg:fixed lg:inset-0 lg:z-30 lg:bg-white lg:dark:bg-gray-800 lg:border-r lg:border-gray-200 lg:dark:border-gray-700 transition-all duration-300",
                isOpen ? "lg:w-64" : "lg:w-0 lg:overflow-hidden"
            )}>
                <div className="flex-1 flex flex-col min-h-0 w-64">
                    {/* Sidebar Header with MFI Dashboard title */}
                    <div className="flex items-center h-16 flex-shrink-0 px-4">
                        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">MFI Dashboard</h1>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-2 py-4 space-y-1">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={cn(
                                        'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                                        isActive
                                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                                    )}
                                >
                                    <item.icon
                                        className={cn(
                                            'mr-3 h-5 w-5 transition-colors',
                                            isActive ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'
                                        )}
                                    />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout button at bottom */}
                    <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 p-4">
                        <Button
                            variant="ghost"
                            onClick={handleLogout}
                            className="w-full justify-start text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            <LogOut className="mr-3 h-4 w-4" />
                            Sign out
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile sidebar overlay */}
            {mobileSidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setMobileSidebarOpen(false)} />

                    <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white dark:bg-gray-800">
                        <div className="flex items-center justify-between h-16 px-4 bg-gray-50 dark:bg-gray-900">
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">MFI Dashboard</h1>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setMobileSidebarOpen(false)}
                                className="p-2"
                            >
                                <X className="h-6 w-6" />
                            </Button>
                        </div>

                        <nav className="flex-1 px-2 py-4 space-y-1">
                            {navigation.map((item) => {
                                const isActive = location.pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        onClick={() => setMobileSidebarOpen(false)}
                                        className={cn(
                                            'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                                            isActive
                                                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                                        )}
                                    >
                                        <item.icon
                                            className={cn(
                                                'mr-3 h-5 w-5 transition-colors',
                                                isActive ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'
                                            )}
                                        />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 p-4">
                            <Button
                                variant="ghost"
                                onClick={handleLogout}
                                className="w-full justify-start text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                <LogOut className="mr-3 h-4 w-4" />
                                Sign out
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
