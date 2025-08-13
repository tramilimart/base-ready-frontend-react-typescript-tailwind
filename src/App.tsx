import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';
import { SnackbarProvider } from 'notistack';
import { Toaster } from './components/ui/toaster';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute';
import { AuthProvider } from './providers';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Orders } from './pages/Orders';
import { Products } from './pages/Products';
import { Customers } from './pages/Customers';
import { Reports } from './pages/Reports';
import { Documents } from './pages/Documents';
import { Settings } from './pages/Settings';
import { Help } from './pages/Help';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-4">
              We're sorry, but something unexpected happened.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SnackbarProvider
            maxSnack={3}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            autoHideDuration={3000}
          >
            <Router>
              <AuthProvider>
                <Suspense fallback={<LoadingFallback />}>
                  <div className="App">
                    <Routes>
                      {/* Public Routes (Login) */}
                      <Route 
                        path="/login" 
                        element={
                          <PublicRoute>
                            <Login />
                          </PublicRoute>
                        } 
                      />

                      {/* Protected Routes (Dashboard and other pages) */}
                      <Route 
                        path="/" 
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <Dashboard />
                            </Layout>
                          </ProtectedRoute>
                        } 
                      />
                      
                      <Route 
                        path="/orders" 
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <Orders />
                            </Layout>
                          </ProtectedRoute>
                        } 
                      />
                      
                      <Route 
                        path="/products" 
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <Products />
                            </Layout>
                          </ProtectedRoute>
                        } 
                      />
                      
                      <Route 
                        path="/customers" 
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <Customers />
                            </Layout>
                          </ProtectedRoute>
                        } 
                      />
                      
                      <Route 
                        path="/reports" 
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <Reports />
                            </Layout>
                          </ProtectedRoute>
                        } 
                      />
                      
                      <Route 
                        path="/documents" 
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <Documents />
                            </Layout>
                          </ProtectedRoute>
                        } 
                      />
                      
                      <Route 
                        path="/settings" 
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <Settings />
                            </Layout>
                          </ProtectedRoute>
                        } 
                      />
                      
                      <Route 
                        path="/help" 
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <Help />
                            </Layout>
                          </ProtectedRoute>
                        } 
                      />

                      {/* Catch all route - redirect to dashboard if authenticated, login if not */}
                      <Route 
                        path="*" 
                        element={<Navigate to="/" replace />} 
                      />
                    </Routes>
                    <Toaster />
                  </div>
                </Suspense>
              </AuthProvider>
              <ReactQueryDevtools initialIsOpen={false} />
            </Router>
          </SnackbarProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
