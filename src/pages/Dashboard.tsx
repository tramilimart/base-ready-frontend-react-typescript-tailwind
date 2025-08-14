import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { BarChart3, Users, Package, DollarSign } from 'lucide-react';
import { useSnackbarNotification } from '../hooks/use-snackbar';

export function Dashboard() {
    const { showSuccess, showError, showWarning, showInfo } = useSnackbarNotification();

    const handleTestNotifications = () => {
        showSuccess('This is a success message!');
        setTimeout(() => showError('This is an error message!'), 1000);
        setTimeout(() => showWarning('This is a warning message!'), 2000);
        setTimeout(() => showInfo('This is an info message!'), 3000);
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <div>
                    <span className="text-muted-foreground dark:text-gray-400">
                        Welcome to your MFI dashboard. Here's an overview of your business.
                    </span>
                </div>
            </div>

            {/* Stats cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$45,231.89</div>
                        <p className="text-xs text-muted-foreground">
                            +20.1% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Customers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+2,350</div>
                        <p className="text-xs text-muted-foreground">
                            +180.1% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Products</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+12,234</div>
                        <p className="text-xs text-muted-foreground">
                            +19% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+573</div>
                        <p className="text-xs text-muted-foreground">
                            +201 since last hour
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent activity */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 !mt-4">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                        <CardDescription>
                            You have 265 orders this month.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center space-x-4">
                                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                        <span className="text-blue-600 text-sm font-medium">{i}</span>
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            Order #{1000 + i}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Customer {i} • ${(100 + i * 50).toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {i} hour{i !== 1 ? 's' : ''} ago
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Sales</CardTitle>
                        <CardDescription>
                            You made 265 sales this month.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center space-x-4">
                                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                        <span className="text-green-600 text-sm font-medium">${(50 + i * 25).toFixed(0)}</span>
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            Sale #{2000 + i}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Product {i} • Customer {i}
                                        </p>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {i} hour{i !== 1 ? 's' : ''} ago
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
