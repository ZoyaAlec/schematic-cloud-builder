
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FileText, 
  Database, 
  Server, 
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Options = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const queryParams = new URLSearchParams(location.search);
  const authParam = queryParams.get('auth');
  
  useEffect(() => {
    // Check for auth param
    if (authParam) {
      console.log(`Authentication param: ${authParam}`);
    }
    
    // Check for OAuth callback from Google
    const handleAuthCallback = async () => {
      // Get the URL hash if there is one (for OAuth callbacks)
      const hash = window.location.hash;
      
      if (hash && (hash.includes('access_token') || hash.includes('error'))) {
        const { data, error } = await supabase.auth.getSession();
        
        if (data?.session) {
          // Successfully signed in
          toast({
            title: "Signed In Successfully",
            description: "Welcome to DevCloud!",
          });
          
          // Redirect to a protected page or home
          navigate('/');
        } else if (error) {
          toast({
            title: "Authentication Failed",
            description: error.message,
            variant: "destructive",
          });
        }
      }
    };
    
    handleAuthCallback();
    
    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        toast({
          title: "Signed In Successfully",
          description: "Welcome to DevCloud!",
        });
        
        // Redirect to a protected page or home
        navigate('/');
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, authParam, toast]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showAuth={false} />
      
      <div className="flex-grow container mx-auto py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Welcome to <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">DevCloud</span>
          </h1>
          
          <p className="text-center text-muted-foreground mb-12">
            Select an option to get started with your cloud infrastructure journey.
          </p>
          
          <div className="grid gap-6">
            {/* Create new architecture */}
            <div 
              onClick={() => navigate('/design-options')}
              className="cloud-card p-6 flex items-center cursor-pointer hover:translate-y-[-4px] transition-all"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-6">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-grow">
                <h2 className="text-xl font-semibold mb-1">Create a New Design Architecture</h2>
                <p className="text-muted-foreground">Design a new cloud architecture from scratch or with AI assistance.</p>
              </div>
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
            </div>
            
            {/* Use existing architecture */}
            <div 
              className="cloud-card p-6 flex items-center cursor-pointer hover:translate-y-[-4px] transition-all"
            >
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mr-6">
                <Server className="h-6 w-6 text-secondary" />
              </div>
              <div className="flex-grow">
                <h2 className="text-xl font-semibold mb-1">Use Existing Architecture</h2>
                <p className="text-muted-foreground">Load and modify one of your previously created architectures.</p>
              </div>
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
            </div>
            
            {/* Manage cloud resources */}
            <div 
              onClick={() => navigate('/resource-management')}
              className="cloud-card p-6 flex items-center cursor-pointer hover:translate-y-[-4px] transition-all"
            >
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mr-6">
                <Database className="h-6 w-6 text-accent" />
              </div>
              <div className="flex-grow">
                <h2 className="text-xl font-semibold mb-1">Manage Cloud Resources</h2>
                <p className="text-muted-foreground">Configure and manage your existing cloud resources with AI guidance.</p>
              </div>
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-muted-foreground hover:text-foreground"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
      
      <footer className="bg-navy text-white py-4 px-6">
        <div className="container mx-auto text-center text-sm">
          © 2025 DevCloud. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Options;
