import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { useSnackbarNotification } from '../hooks/use-snackbar';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../providers/AuthProvider';
import { apiGet, isUnauthorizedError } from '../utils/apiClient';

export function Orders() {
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
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-muted-foreground dark:text-gray-400">
            Manage your customer orders and track their status.
          </span>
        </div>
      </div>
      
      {/* Test Buttons Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Test Notifications</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Snackbar Notifications</h3>
            <Button 
              onClick={handleTestSnackbars} 
              variant="outline" 
              className="w-full"
            >
              Test Snackbars
            </Button>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Tests success, error, warning, and info snackbars
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Toast Notifications</h3>
            <Button 
              onClick={handleTestToasts} 
              variant="outline" 
              className="w-full"
            >
              Test Toasts
            </Button>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Tests default and destructive toast variants
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Mixed Notifications</h3>
            <Button 
              onClick={handleTestMixedNotifications} 
              variant="default" 
              className="w-full"
            >
              Test Both
            </Button>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Tests both Snackbar and Toast simultaneously
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Auth Provider Test</h3>
            <Button 
              onClick={handleTestUnauthorized} 
              variant="destructive" 
              className="w-full"
            >
              Test 401 Dialog
            </Button>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Simulates unauthorized access dialog
            </p>
          </div>
        </div>
      </div>

      {/* Sample Orders Content */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Recent Orders</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Order #{1000 + i}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Customer {i} • ${(50 + i * 25).toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  i === 1 ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' : 
                  i === 2 ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300' : 
                  'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300'
                }`}>
                  {i === 1 ? 'Completed' : i === 2 ? 'Pending' : 'Processing'}
                </span>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
