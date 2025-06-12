
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Logo from '@/components/Logo';
import AuthInput from '@/components/AuthInput';
import PasswordInput from '@/components/PasswordInput';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';

interface FormData {
  email: string;
  newPassword: string;
  confirmPassword: string;
}

interface FormErrors {
  email?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const PasswordRecoveryScreen: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'newPassword'>('email');
  const [formData, setFormData] = useState<FormData>({
    email: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    // Clear error when user types
    if (errors[id as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [id]: undefined }));
    }
  };

  const validateEmailStep = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    return newErrors;
  };


  const validateNewPasswordStep = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.newPassword) newErrors.newPassword = 'New password is required';
    else if (formData.newPassword.length < 8) newErrors.newPassword = 'Password must be at least 8 characters';
    
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };

  const { resetPassword, updatePassword } = useAuth();

  const handleSubmitEmail = async () => {
    const validationErrors = validateEmailStep();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const { error } = await resetPassword(formData.email);
    if (error) {
      toast({ title: 'Failed to send reset link', description: error.message, variant: 'destructive' });
      return;
    }

    toast({
      title: 'Reset link sent',
      description: `We've sent a password reset link to ${formData.email}`,
    });

    setStep('newPassword');
  };


  const handleSubmitNewPassword = async () => {
    const validationErrors = validateNewPasswordStep();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const { error } = await updatePassword(formData.newPassword);
    if (error) {
      toast({ title: 'Password reset failed', description: error.message, variant: 'destructive' });
      return;
    }

    toast({
      title: 'Password reset successful',
      description: 'Your password has been reset. You can now log in with your new password.',
    });

    navigate('/login');
  };

  const renderStep = () => {
    switch (step) {
      case 'email':
        return (
          <>
            <h1 className="text-2xl font-bold mb-2 text-center">Recover Password</h1>
            <p className="text-gray-600 text-center mb-8">Enter your email to receive a password reset link</p>
            
            <div className="form-container">
              <AuthInput
                id="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                required
              />
              
              <Button
                type="button"
                className="w-full mt-6"
                onClick={handleSubmitEmail}
              >
                Send Reset Link
              </Button>
            </div>
          </>
        );
      
      
      case 'newPassword':
        return (
          <>
            <h1 className="text-2xl font-bold mb-2 text-center">Create New Password</h1>
            <p className="text-gray-600 text-center mb-8">Follow the link sent to your email, then set a new password.</p>
            
            <div className="form-container">
              <PasswordInput
                id="newPassword"
                label="New Password"
                value={formData.newPassword}
                onChange={handleInputChange}
                error={errors.newPassword}
                required
              />
              
              <PasswordInput
                id="confirmPassword"
                label="Confirm New Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={errors.confirmPassword}
                required
              />
              
              <Button 
                type="button" 
                className="w-full mt-6"
                onClick={handleSubmitNewPassword}
              >
                Reset Password
              </Button>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen p-6 screen-fade-in">
      <div className="flex items-center mb-8">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => {
            if (step === 'email') {
              navigate('/login');
            } else if (step === 'newPassword') {
              setStep('email');
            }
          }}
          className="mr-auto"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Logo size="sm" />
        <div className="ml-auto w-8"></div> {/* For balance */}
      </div>
      
      {renderStep()}
    </div>
  );
};

export default PasswordRecoveryScreen;
