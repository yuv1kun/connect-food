
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Logo from '@/components/Logo';
import AuthInput from '@/components/AuthInput';
import PasswordInput from '@/components/PasswordInput';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient'; // Import Supabase client
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth to check session

interface FormData {
  email: string;
  // verificationCode: string; // Verification code step is removed
  newPassword: string;
  confirmPassword: string;
}

interface FormErrors {
  email?: string;
  // verificationCode?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const PasswordRecoveryScreen: React.FC = () => {
  const navigate = useNavigate();
  const { session } = useAuth(); // Get session from AuthContext
  // Step state will now be 'email' or 'newPassword'
  // 'email': User is requesting a password reset link
  // 'newPassword': User has clicked the link in their email and is setting a new password
  const [step, setStep] = useState<'email' | 'newPassword'>('email');
  const [formData, setFormData] = useState<FormData>({
    email: '',
    // verificationCode: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false); // Add loading state
  const [errors, setErrors] = useState<FormErrors>({});

  // Check if the user landed on this page from a password reset link
  // Supabase handles this by setting a session when the user clicks the magic link.
  // The onAuthStateChange listener in AuthContext will pick this up.
  // If there's a session and the user is on the password recovery page,
  // it's likely they've come from a reset link.
  React.useEffect(() => {
    // This effect runs when the component mounts and when the session changes.
    // If there's an active session, it implies the user might have come from a reset link.
    // Supabase's password recovery flow creates a temporary session for the user
    // when they click the reset link in their email.
    // This session allows them to update their password.
    // The event type for this is 'PASSWORD_RECOVERY'.
    const subscription = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' && session) {
        setStep('newPassword');
        // Pre-fill email if available from session, though not strictly necessary
        // as Supabase handles user context for password update.
        if (session.user?.email) {
          setFormData(prev => ({ ...prev, email: session.user.email! }));
        }
      }
    });

    // Also check initial session state on mount, in case onAuthStateChange hasn't fired yet
    // or if the user navigates directly to a URL that should trigger the new password form.
    // This part might need adjustment based on how Supabase handles direct navigation to the redirect URL.
    if (session && window.location.hash.includes('type=recovery')) {
        setStep('newPassword');
        if (session.user?.email) {
            setFormData(prev => ({ ...prev, email: session.user.email! }));
        }
    }


    return () => {
      subscription.data.subscription.unsubscribe();
    };
  }, [session]); // Rerun when session changes

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

  // validateVerificationStep is removed

  const validateNewPasswordStep = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.newPassword) newErrors.newPassword = 'New password is required';
    else if (formData.newPassword.length < 8) newErrors.newPassword = 'Password must be at least 8 characters';
    
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };

  const handleSubmitEmail = async () => {
    const validationErrors = validateEmailStep();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    setErrors({});

    // Get the current URL without the hash fragment
    const redirectTo = `${window.location.origin}${window.location.pathname}`;


    const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
      redirectTo: redirectTo, // URL to redirect to after email link is clicked
    });
    setLoading(false);

    if (error) {
      toast({
        title: 'Error sending reset email',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Password reset email sent',
        description: `If an account exists for ${formData.email}, a password reset link has been sent. Please check your inbox (and spam folder).`,
      });
      // Don't change step here. User needs to click the link in their email.
      // The useEffect hook will handle setting the step to 'newPassword' when they return.
    }
  };

  // handleSubmitVerification is removed

  const handleSubmitNewPassword = async () => {
    const validationErrors = validateNewPasswordStep();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    setErrors({});

    const { error } = await supabase.auth.updateUser({
      password: formData.newPassword,
    });
    setLoading(false);

    if (error) {
      toast({
        title: 'Error resetting password',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Password reset successful',
        description: 'Your password has been updated. You can now log in with your new password.',
      });
      // Sign out the temporary session if any
      await supabase.auth.signOut();
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'email':
        return (
          <>
            <h1 className="text-2xl font-bold mb-2 text-center">Recover Password</h1>
            <p className="text-gray-600 text-center mb-8">Enter your email to receive a verification code</p>
            
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
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Password Reset Email'}
              </Button>
            </div>
          </>
        );

      // 'verification' case is removed

      case 'newPassword':
        return (
          <>
            <h1 className="text-2xl font-bold mb-2 text-center">Create New Password</h1>
            <p className="text-gray-600 text-center mb-8">Your identity has been verified. Set a new password.</p>
            
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
                disabled={loading}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
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
              // If they are on the new password screen, going back should take them to login
              // as the reset link process would need to be restarted.
              setStep('email'); // Or navigate('/login');
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
