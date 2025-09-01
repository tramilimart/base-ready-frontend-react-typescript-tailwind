import { useState, } from 'react'
import { useMutation } from '@tanstack/react-query';
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import {
    Loader2,
    Send,
    EyeOff,
    Eye,
    Eraser
} from 'lucide-react';
import { UpdatePasswordDtls, ApiResponse } from '../interfaces/baseInterface';
import { apiPost } from '../utils/apiClient';
import { useToast } from '../hooks/use-toast';


const ChangePassword = () => {
    const [isViewOldPassword, setIsViewOldPassword] = useState<boolean>(false);
    const [isViewNewPassword, setIsViewNewPassword] = useState<boolean>(false);
    const [isViewRetypePassword, setIsViewRetypePassword] = useState<boolean>(false);
    const [isValidatingPassword, setIsValidatingPassword] = useState<boolean>(false);
    const [passwords, setPasswords] = useState<UpdatePasswordDtls>({
        oldPassword: '',
        newPassword: '',
        retypePassword: ''
    });
    const { toast } = useToast();

    const validatePassword = async () => {
        setIsValidatingPassword(true);
        if (passwords.oldPassword === '' && passwords.newPassword === '' && passwords.retypePassword === '') {
            toast({
              title: "Complete the form",
              description: "Fill in all fields before submitting.",
              variant: "destructive",
            });
            setIsValidatingPassword(false);
            return
        }

        if (passwords.oldPassword === passwords.newPassword) {
            toast({
              title: "Change Password",
              description: "New Password must be different from Old Password.",
              variant: "destructive",
            });
            setIsValidatingPassword(false);
            return;
        }
        if (passwords.newPassword !== passwords.retypePassword) {
            toast({
              title: "Password Mismatch",
              description: "New Password and Re-type Password do not match.",
              variant: "destructive",
            });
            setIsValidatingPassword(false);
            return;
        }
        if (passwords.newPassword.length < 8) {
            toast({
              title: "Password Length",
              description: "New Password must be at least 8 characters long.",
              variant: "destructive",
            });
            setIsValidatingPassword(false);
            return;
        }
        if (!isValidPassword(passwords.newPassword)) {
            toast({
              title: "Password Strength",
              description: "New Password must contain at least one uppercase, one lowercase, and one special character.",
              variant: "destructive",
            });
            setIsValidatingPassword(false);
            return;
        }
        // Proceed to update the password
        updatePasswordMutation.mutate();
    }

    const updatePasswordMutation = useMutation({
        mutationFn: async (): Promise<ApiResponse> => {
            return await apiPost(`/api/user/change-password?oldPassword=${passwords.oldPassword}&newPassword=${passwords.newPassword}`);
        },
        onSuccess: async (response: ApiResponse) => {
            if (response.success) {
                toast({
                  title: "Success",
                  description: "User password updated successfully.",
                  variant: "default",
                });
                setPasswords({
                    oldPassword: '',
                    newPassword: '',
                    retypePassword: ''
                });
            } else {
                toast({
                  title: response.responseCode ?? 'Error',
                  description: response.message ?? "Failed to update user password.",
                  variant: "destructive",
                });
            }
            setIsValidatingPassword(false);
        },
        onError: (error: any) => {
            toast({
              title: "Error",
              description: error.message ?? "Failed to update user password.",
              variant: "destructive",
            });
            setIsValidatingPassword(false);
        }
    });

    const isValidPassword = (password: string): boolean => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        return hasUpperCase && hasLowerCase && hasSpecialChar;
    };

    const clearForm = () => {
        setPasswords({
            oldPassword: '',
            newPassword: '',
            retypePassword: ''
        });
    };

    return (
        <div>
            <div className='space-y-2'>
                <div>
                    <p className='text-muted-foreground'>
                        Change your account password to keep your account secure.
                    </p>
                </div>

                <div className='bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700'>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Current Password
                            </label>
                            <div className="relative">
                                <input
                                    id="oldPassword"
                                    type={isViewOldPassword ? "text" : "password"}
                                    value={passwords.oldPassword}
                                    onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                                    placeholder="Enter your current password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsViewOldPassword(!isViewOldPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {isViewOldPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    id="newPassword"
                                    type={isViewNewPassword ? "text" : "password"}
                                    value={passwords.newPassword}
                                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                                    placeholder="Enter your new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsViewNewPassword(!isViewNewPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {isViewNewPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="retypePassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    id="retypePassword"
                                    type={isViewRetypePassword ? "text" : "password"}
                                    value={passwords.retypePassword}
                                    onChange={(e) => setPasswords({ ...passwords, retypePassword: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                                    placeholder="Confirm your new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsViewRetypePassword(!isViewRetypePassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {isViewRetypePassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex space-x-3">
                            <Button
                                onClick={validatePassword}
                                disabled={isValidatingPassword}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                {isValidatingPassword ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" />
                                        Update Password
                                    </>
                                )}
                            </Button>
                            <Button
                                onClick={clearForm}
                                variant="outline"
                                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                <Eraser className="mr-2 h-4 w-4" />
                                Clear
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
