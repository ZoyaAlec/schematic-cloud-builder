
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthSuccess: (userId: string) => void;
}

type AuthView = 'signIn' | 'signUp';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onOpenChange, onAuthSuccess }) => {
  const [view, setView] = useState<AuthView>('signIn');
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if Supabase is connected
  const isSupabaseConnected = true; // We're now using the integrated Supabase client

  const handleSignIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.user) {
        toast({
          title: "Sign In Successful",
          description: "Welcome back!",
        });
        onOpenChange(false);
        onAuthSuccess(data.user.id);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.user) {
        toast({
          title: "Account Created",
          description: "Your account has been created successfully!",
        });
        onOpenChange(false);
        onAuthSuccess(data.user.id);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        }
      });

      if (error) {
        throw new Error(error.message);
      }
      
      // No toast here as user will be redirected
    } catch (error: any) {
      toast({
        title: "Authentication Failed",
        description: error.message || "Could not sign in with Google",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {view === 'signIn' ? 'Sign In to DevCloud' : 'Create a DevCloud Account'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {view === 'signIn' 
              ? 'Access your cloud architecture designs'
              : 'Start creating and saving your cloud architectures'
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4">
          {/* Google Auth Button */}
          <Button 
            variant="outline" 
            className="w-full flex items-center gap-2 justify-center"
            onClick={handleGoogleAuth}
            disabled={isLoading}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 0, 0)">
                <path d="M21.35,11.1H12v3.2h5.59c-0.25,1.45-1.52,4.2-5.59,4.2c-3.36,0-6.11-2.78-6.11-6.2s2.75-6.2,6.11-6.2 c1.93,0,3.2,0.82,3.93,1.53l2.54-2.45C16.46,3.42,14.39,2.5,12,2.5c-5.52,0-10,4.48-10,10s4.48,10,10,10c5.8,0,9.64-4.07,9.64-9.8 C21.64,12.14,21.52,11.6,21.35,11.1z" fill="#4285F4"></path>
              </g>
            </svg>
            {isLoading ? "Signing In..." : "Continue with Google"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
        </div>
        
        {view === 'signIn' ? (
          <SignInForm 
            onSignIn={handleSignIn} 
            onSwitchToSignUp={() => setView('signUp')} 
          />
        ) : (
          <SignUpForm 
            onSignUp={handleSignUp} 
            onSwitchToSignIn={() => setView('signIn')} 
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
