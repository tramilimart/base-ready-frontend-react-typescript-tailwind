import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { setUnauthorizedCallback } from '../utils/apiClient';

interface AuthContextType {
  showUnauthorizedDialog: () => void;
  hideUnauthorizedDialog: () => void;
  isUnauthorizedDialogOpen: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isUnauthorizedDialogOpen, setIsUnauthorizedDialogOpen] = useState(false);
  const navigate = useNavigate();

  const showUnauthorizedDialog = () => {
    setIsUnauthorizedDialogOpen(true);
  };

  const hideUnauthorizedDialog = () => {
    setIsUnauthorizedDialogOpen(false);
  };

  // Register the callback with apiClient when component mounts
  useEffect(() => {
    setUnauthorizedCallback(showUnauthorizedDialog);
    
    // Also listen for custom unauthorized events as fallback
    const handleUnauthorized = () => {
      showUnauthorizedDialog();
    };
    
    window.addEventListener('unauthorized-access', handleUnauthorized);
    
    // Cleanup
    return () => {
      setUnauthorizedCallback(null);
      window.removeEventListener('unauthorized-access', handleUnauthorized);
    };
  }, []);

  const handleRefresh = () => {
    hideUnauthorizedDialog();
    // You can add logic here to refresh the page or redirect to login
    window.location.reload();
  };

  const handleLogin = () => {
    hideUnauthorizedDialog();
    // Redirect to login page
    navigate('/login');
  };

  const value: AuthContextType = {
    showUnauthorizedDialog,
    hideUnauthorizedDialog,
    isUnauthorizedDialogOpen,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      
      {/* Unauthorized Dialog */}
      <Dialog open={isUnauthorizedDialogOpen} onOpenChange={setIsUnauthorizedDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <DialogTitle>Unauthorized Access</DialogTitle>
            </div>
            <DialogDescription>
              Your session has expired or you don't have permission to access this resource. 
              Please log in again to continue.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col space-y-3">
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-700 font-medium">
                  Error 401: Unauthorized
                </span>
              </div>
              <p className="text-sm text-red-600 mt-1">
                The server rejected your request due to invalid or missing authentication.
              </p>
            </div>
          </div>

          <DialogFooter className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              className="w-full sm:w-auto"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Page
            </Button>
            <Button
              onClick={handleLogin}
              className="w-full sm:w-auto"
            >
              Log In Again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthContext.Provider>
  );
};
