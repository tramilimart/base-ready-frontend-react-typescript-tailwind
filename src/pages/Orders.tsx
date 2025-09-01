import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { useSnackbarNotification } from '../hooks/use-snackbar';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../providers/AuthProvider';
import { apiGet, isUnauthorizedError } from '../utils/apiClient';

const Orders = () => {
  const { showSuccess, showError, showWarning, showInfo } = useSnackbarNotification();
  const { toast } = useToast();
  const { showUnauthorizedDialog } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleTestSnackbars = () => {
    showSuccess('Order created successfully!');
    setTimeout(() => showError('Failed to process payment!'), 1000);
    setTimeout(() => showWarning('Order is pending approval!'), 2000);
    setTimeout(() => showInfo('Order status updated!'), 3000);
  };

  const handleTestToasts = () => {
    toast({
      title: "Order Updated",
      description: "Order #1234 has been successfully updated.",
    });
    
    setTimeout(() => {
      toast({
        title: "Payment Failed",
        description: "There was an issue processing your payment.",
        variant: "destructive",
      });
    }, 1000);

    setTimeout(() => {
      toast({
        title: "Order Shipped",
        description: "Your order has been shipped and is on its way!",
      });
    }, 2000);
  };

  const handleTestMixedNotifications = () => {
    // Test Snackbar
    showSuccess('Order processed via Snackbar!');
    
    // Test Toast
    setTimeout(() => {
      toast({
        title: "Order Status",
        description: "Order status updated via Toast!",
      });
    }, 1000);

    // Test Error Snackbar
    setTimeout(() => {
      showError('Payment failed via Snackbar!');
    }, 2000);

    // Test Destructive Toast
    setTimeout(() => {
      toast({
        title: "Error",
        description: "Something went wrong via Toast!",
        variant: "destructive",
      });
    }, 3000);
  };

  const handleTestUnauthorized = () => {
    showUnauthorizedDialog();
  };

  const handleTestApiCall = async (shouldFail: boolean = false) => {
    setIsLoading(true);
    try {
      if (shouldFail) {
        // Make a real API call that will likely return 401 (unauthorized)
        // The apiClient will automatically trigger the unauthorized dialog
        await apiGet('/api/protected-endpoint');
        showSuccess('API Call Success (unexpected)');
      } else {
        // Make a regular API call
        const result = await apiGet('/api/public-endpoint');
        showSuccess(`API Call Success: ${JSON.stringify(result)}`);
      }
    } catch (error: any) {
      // The apiClient already handled 401 errors automatically
      // Just show other types of errors
      if (!isUnauthorizedError(error)) {
        showError(`API Call Failed: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground dark:text-gray-400">
              Manage your orders and track their status.
            </p>
          </div>
        </div>

        {/* Test Buttons Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Test Notifications & API Calls
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button 
              onClick={handleTestSnackbars}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Test Snackbars
            </Button>
            
            <Button 
              onClick={handleTestToasts}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Test Toasts
            </Button>
            
            <Button 
              onClick={handleTestMixedNotifications}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Test Mixed Notifications
            </Button>
            
            <Button 
              onClick={handleTestUnauthorized}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Test Unauthorized Dialog
            </Button>
            
            <Button 
              onClick={() => handleTestApiCall(false)}
              disabled={isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {isLoading ? 'Loading...' : 'Test API Success'}
            </Button>
            
            <Button 
              onClick={() => handleTestApiCall(true)}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? 'Loading...' : 'Test Real API 401'}
            </Button>
          </div>
        </div>

        {/* Orders Content */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Orders
          </h2>
          
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((order) => (
              <div 
                key={order} 
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-300 text-sm font-medium">
                      #{order}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Order #{1000 + order}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Customer {order} • ${(Math.random() * 1000).toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                    Completed
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {order} day{order !== 1 ? 's' : ''} ago
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Total Orders
            </h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">1,234</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              +12% from last month
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Pending Orders
            </h3>
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">23</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              -5% from last week
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Revenue
            </h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">$45,678</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              +8% from last month
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
