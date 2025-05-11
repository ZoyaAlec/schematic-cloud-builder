
import React, { useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  showAuth?: boolean;
}

const Navbar = ({ showAuth = true }: NavbarProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

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
    <nav className="bg-white dark:bg-navy shadow-sm border-b border-border py-4 px-6">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <span className="text-primary-foreground font-bold">DC</span>
          </div>
          <span className="font-bold text-xl">DevCloud</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          {showAuth && (
            <>
              <Link 
                to="/options?auth=signin" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign In
              </Link>
              
              <button
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-70"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                  <g transform="matrix(1, 0, 0, 1, 0, 0)">
                    <path d="M21.35,11.1H12v3.2h5.59c-0.25,1.45-1.52,4.2-5.59,4.2c-3.36,0-6.11-2.78-6.11-6.2s2.75-6.2,6.11-6.2 c1.93,0,3.2,0.82,3.93,1.53l2.54-2.45C16.46,3.42,14.39,2.5,12,2.5c-5.52,0-10,4.48-10,10s4.48,10,10,10c5.8,0,9.64-4.07,9.64-9.8 C21.64,12.14,21.52,11.6,21.35,11.1z" fill="#ffffff"></path>
                  </g>
                </svg>
                {isLoading ? "Signing in..." : "Sign Up with Google"}
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
