# AuthProvider Documentation

## Overview
The `AuthProvider` is a React context provider that handles 401/unauthorized connections by displaying a user-friendly dialog warning. It's designed to automatically catch authentication errors and provide users with clear options to resolve the issue.

## Features

### 🔐 **Authentication Error Handling**
- Automatically detects 401/unauthorized responses
- Displays a professional dialog with clear error information
- Provides actionable solutions for users

### 🎨 **User Experience**
- Clean, accessible dialog design
- Clear error messaging with visual indicators
- Multiple resolution options (Refresh Page, Log In Again)

### 🚀 **Easy Integration**
- Simple hook-based API (`useAuth`)
- Automatic error detection and handling
- Customizable error handling logic

## Usage

### 1. **Provider Setup**
The `AuthProvider` is already configured in `App.tsx` and wraps your entire application:

```tsx
import { AuthProvider } from './providers';

function App() {
  return (
    <AuthProvider>
      {/* Your app components */}
    </AuthProvider>
  );
}
```

### 2. **Using the Hook**
Import and use the `useAuth` hook in any component:

```tsx
import { useAuth } from '../providers/AuthProvider';

function MyComponent() {
  const { showUnauthorizedDialog, hideUnauthorizedDialog } = useAuth();

  const handleError = () => {
    showUnauthorizedDialog();
  };

  return (
    <button onClick={handleError}>
      Show Unauthorized Dialog
    </button>
  );
}
```

### 3. **API Error Handling**
Use the `useApiErrorHandler` hook for automatic 401 detection:

```tsx
import { useApiErrorHandler } from '../utils/api';

function MyComponent() {
  const { handleApiError } = useApiErrorHandler();

  const makeApiCall = async () => {
    try {
      const response = await fetch('/api/protected');
      // Handle success
    } catch (error) {
      handleApiError(error); // Automatically shows dialog for 401 errors
    }
  };
}
```

## API Reference

### `useAuth()` Hook
Returns an object with the following methods:

| Method | Description |
|--------|-------------|
| `showUnauthorizedDialog()` | Shows the unauthorized access dialog |
| `hideUnauthorizedDialog()` | Hides the unauthorized access dialog |
| `isUnauthorizedDialogOpen` | Boolean indicating if dialog is open |

### `useApiErrorHandler()` Hook
Returns an object with error handling methods:

| Method | Description |
|--------|-------------|
| `handleApiError(error)` | Automatically handles API errors, showing 401 dialog when needed |

## Dialog Features

### 📱 **Responsive Design**
- Mobile-first approach
- Adapts to different screen sizes
- Touch-friendly interface

### 🎯 **Clear Messaging**
- **Title**: "Unauthorized Access"
- **Description**: Clear explanation of the issue
- **Error Details**: Technical information (Error 401: Unauthorized)
- **Action Buttons**: Refresh Page, Log In Again

### 🔄 **Action Options**
1. **Refresh Page**: Reloads the current page
2. **Log In Again**: Currently refreshes the page (customizable for redirect logic)

## Customization

### **Modifying Dialog Content**
Edit the `AuthProvider.tsx` file to customize:
- Dialog title and description
- Error message styling
- Button actions and labels
- Visual indicators and icons

### **Adding Custom Logic**
Extend the provider to include:
- Redirect to login page
- Token refresh logic
- Custom error handling
- Analytics tracking

## Testing

### **Manual Testing**
Use the test buttons in the Orders module:
1. **Test 401 Dialog**: Directly shows the unauthorized dialog
2. **Test API 401**: Simulates an API call that returns a 401 error

### **Integration Testing**
The provider automatically handles:
- 401 HTTP status codes
- Unauthorized API responses
- Authentication failures

## Error Scenarios Handled

- ✅ **Session Expired**: User's authentication token has expired
- ✅ **Invalid Credentials**: User provided incorrect login information
- ✅ **Missing Authentication**: Request made without proper authentication headers
- ✅ **Insufficient Permissions**: User lacks required permissions for the resource

## Best Practices

1. **Wrap Early**: Place `AuthProvider` high in your component tree
2. **Use Consistently**: Apply the same error handling across all API calls
3. **User Feedback**: Always provide clear feedback when authentication fails
4. **Graceful Degradation**: Ensure the app remains functional even when auth fails

## Troubleshooting

### **Dialog Not Showing**
- Ensure `AuthProvider` wraps your component
- Check that `useAuth()` is called within the provider context
- Verify the hook is imported correctly

### **Custom Actions Not Working**
- Modify the `handleRefresh` and `handleLogin` functions in `AuthProvider`
- Add your custom redirect logic
- Implement token refresh mechanisms as needed

## Future Enhancements

- [ ] **Token Refresh**: Automatic token refresh on 401 errors
- [ ] **Redirect Logic**: Configurable redirect paths
- [ ] **Error Logging**: Integration with error tracking services
- [ ] **Custom Styling**: Theme-aware dialog styling
- [ ] **Internationalization**: Multi-language support
