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

const ChangePassword: React.FC = () => {
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
        },
        onError: () => {
            toast({
              title: 'Error',
              description: 'Network error occurred. Please try again later.',
              variant: "destructive",
            });
        },
        onSettled: () => {
            setIsValidatingPassword(false);
        }
    });

    const isValidPassword = (text: string) => {
        const hasUpperCase = /[A-Z]/.test(text);
        const hasLowerCase = /[a-z]/.test(text);
        const hasSpecialChar = /[^A-Za-z0-9]/.test(text);

        return hasUpperCase && hasLowerCase && hasSpecialChar;
    }

    return (
        <div className="flex gap-4 p-4 pt-0">
            <div className="rounded-xl bg-muted/50 px-7 py-6 my-box-shadow max-w-xl w-full">
                <h1 className='mb-4 text-lg font-semibold'>Change Password</h1>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="old_pword" className="text-sm font-medium">Old Password</Label>
                        <div className="relative w-full">
                            <Input
                                id="old_pword"
                                name="old_pword"
                                type={isViewOldPassword ? "text" : "password"}
                                value={passwords.oldPassword}
                                placeholder="Enter old password"
                                required
                                onChange={(e) => {
                                    setPasswords({ ...passwords, oldPassword: e.target.value });
                                }}
                                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                            />
                            <div className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-foreground/70">
                                {isViewOldPassword ? (
                                    <EyeOff
                                        onClick={() => setIsViewOldPassword(false)}
                                    />
                                ) : (
                                    <Eye
                                        onClick={() => setIsViewOldPassword(true)}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="new_pword" className="text-sm font-medium">New Password</Label>
                        <div className="relative w-full">
                            <Input
                                id="new_pword"
                                name="new_pword"
                                type={isViewNewPassword ? "text" : "password"}
                                value={passwords.newPassword}
                                placeholder="Enter new password"
                                required
                                onChange={(e) => {
                                    setPasswords({ ...passwords, newPassword: e.target.value });
                                }}
                                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                            />
                            <div className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-foreground/70">
                                {isViewNewPassword ? (
                                    <EyeOff
                                        onClick={() => setIsViewNewPassword(false)}
                                    />
                                ) : (
                                    <Eye
                                        onClick={() => setIsViewNewPassword(true)}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="retype_pword" className="text-sm font-medium">Re-type Password</Label>
                        <div className="relative w-full">
                            <Input
                                id="retype_pword"
                                name="retype_pword"
                                type={isViewRetypePassword ? "text" : "password"}
                                value={passwords.retypePassword}
                                placeholder="Re-type new password"
                                required
                                onChange={(e) => {
                                    setPasswords({ ...passwords, retypePassword: e.target.value });
                                }}
                                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                            />
                            <div className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-foreground/70">
                                {isViewRetypePassword ? (
                                    <EyeOff
                                        onClick={() => setIsViewRetypePassword(false)}
                                    />
                                ) : (
                                    <Eye
                                        onClick={() => setIsViewRetypePassword(true)}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 w-full justify-end mt-8">
                    <Button
                        type="button"
                        className='w-32'
                        variant={"outline"}
                        onClick={() =>
                            setPasswords({
                                oldPassword: '',
                                newPassword: '',
                                retypePassword: ''
                            })
                        }
                    >
                        <Eraser />Clear
                    </Button>
                    <Button
                        type="button"
                        className='w-32'
                        onClick={() => validatePassword()}
                        disabled={passwords.oldPassword === '' || passwords.newPassword === '' || passwords.retypePassword === '' || isValidatingPassword}
                    >
                        {isValidatingPassword ? (
                            <>
                                <Loader2 className="animate-spin" /> Updating...
                            </>
                        ) : (
                            <>
                                <Send />Submit
                            </>
                        )}
                    </Button>
                </div>

            </div>
        </div>
    )
}

export default ChangePassword;
