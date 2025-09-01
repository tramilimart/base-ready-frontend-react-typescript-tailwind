import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { useSnackbarNotification } from '../hooks/use-snackbar';
import { useAuth } from '../providers/AuthProvider';
import { apiPost } from '@/utils/apiClient';
import {
    Loader2,
    Eye,
    EyeOff
} from 'lucide-react';
import { alphabet, key } from '../utils/appUtils';
import { Checkbox } from '../components/ui/checkbox';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const passwordRef = React.useRef<HTMLInputElement>(null);
    const focusPassword = () => passwordRef?.current?.focus();

    const [isViewPassword, setIsViewPassword] = useState<boolean>(false);
    const [isRememberMe, setIsRememberMe] = useState<boolean>(localStorage.getItem('remember') === 'true');

    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { showSuccess, showError } = useSnackbarNotification();
    const { hideUnauthorizedDialog } = useAuth();

    // Get the intended destination from location state, or default to dashboard
    const from = location.state?.from?.pathname || '/';

    const handleLogin = async () => {
        try {
            if (!username || !password) {
                showError('Please enter both username and password');
                return;
            }

            setIsLoading(true);
            const requestBody = {
                username: username || '',
                password: password || ''
            };
            const response = await apiPost('/api/auth/login', requestBody);
            if (!response.success) {
                showError('Login failed. Please try again.');
                return;
            }

            const userData = response.data ? response.data()[0] : null;
            if (!userData) {
                showError('Invalid response from server. Please try again.');
                return;
            }

            // Store auth token in localStorage
            localStorage.setItem('jwt', 'token-' + Date.now());
            localStorage.setItem('user', JSON.stringify({ email: username, name: 'Demo User' }));

            showSuccess('Login successful!');
            if (isRememberMe) {
                setRememberMeCookie(username, password);
            } else {
                setRememberMeCookie('', '');
            }

            // Close any open unauthorized dialog
            hideUnauthorizedDialog();

            // Navigate to intended destination or dashboard
            navigate(from, { replace: true });

        } catch (e: any) {
            showError('Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    const setRememberMeCookie = (username: string, password: string) => {
        localStorage.setItem('username', username);
        localStorage.setItem('password', encryptText(password));
    }

    const getRememberMeToken = () => {
        const name = localStorage.getItem('username');
        const pword = decryptText(localStorage.getItem('password') || '' );
        if (name) {
            setIsRememberMe(true);
            setUsername(name);
            setPassword(pword);
        }
    }

    useEffect(() => {
        getRememberMeToken();
    }, []);

    const encryptText = (plainText: string) => {
        let encryptedText = '';
        if (plainText) {
            for (let char of plainText) {
                const index = alphabet.indexOf(char);
                if (index !== -1) {
                    encryptedText += key[index];
                } else {
                    encryptedText += char;
                }
            }
        }
        return encryptedText;
    }
    const decryptText = (encryptedInput: string) => {
        let decryptedText = '';
        if (encryptedInput) {
            for (let char of encryptedInput) {
                const index = key.indexOf(char);
                if (index !== -1) {
                    decryptedText += alphabet[index];
                } else {
                    decryptedText += char;
                }
            }
        }
        return decryptedText;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">MFI Billing & Claims System</h1>
                </div>

                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-gray-900 dark:text-white">Welcome Back!</CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                            Enter your credentials to access the dashboard
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-5">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Username
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="username"
                                    autoComplete="username"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') focusPassword(); }}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                                    placeholder="Enter your Username"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Password
                                </label>
                                <div className="relative w-full">
                                    <input
                                        ref={passwordRef}
                                        id="password"
                                        name="password"
                                        type={isViewPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') handleLogin(); }}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                                        placeholder="Enter your password"
                                    />
                                    <div className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-foreground/70">
                                        {isViewPassword ? (
                                            <EyeOff
                                                onClick={() => setIsViewPassword(false)}
                                            />
                                        ) : (
                                            <Eye
                                                onClick={() => setIsViewPassword(true)}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Checkbox
                                        id="remember"
                                        checked={isRememberMe}
                                        onCheckedChange={() => {
                                            setIsRememberMe(!isRememberMe)
                                        }}
                                    />
                                    <label htmlFor="remember" className="ml-2 block text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                                        Remember me
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                                        Forgot your password?
                                    </a>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            onClick={handleLogin}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {isLoading ? <><Loader2 className="animate-spin mr-2" />Signing in...</> : 'Sign in'}
                        </Button>
                    </CardFooter>
                </Card>

                <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        All Rights Reserved. &copy; {new Date().getFullYear()}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
