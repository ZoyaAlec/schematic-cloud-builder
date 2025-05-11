
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Cloud, Server, Database, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuthAction = (action: string) => {
    navigate(`/options?auth=${action}`);
  };

  const handleGoogleAuth = async () => {
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
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative flex-grow flex flex-col md:flex-row py-12 px-6 md:py-20 md:px-12">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          {/* Hero Content */}
          <div className="md:w-1/2 mb-10 md:mb-0 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Design and Manage Cloud Resources with <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">DevCloud</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Your all-in-one platform for designing, comparing, and managing AWS and Azure cloud architectures with AI assistance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={handleGoogleAuth}
                className="cloud-btn-primary flex items-center gap-2"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                  <g transform="matrix(1, 0, 0, 1, 0, 0)">
                    <path d="M21.35,11.1H12v3.2h5.59c-0.25,1.45-1.52,4.2-5.59,4.2c-3.36,0-6.11-2.78-6.11-6.2s2.75-6.2,6.11-6.2 c1.93,0,3.2,0.82,3.93,1.53l2.54-2.45C16.46,3.42,14.39,2.5,12,2.5c-5.52,0-10,4.48-10,10s4.48,10,10,10c5.8,0,9.64-4.07,9.64-9.8 C21.64,12.14,21.52,11.6,21.35,11.1z" fill="#ffffff"></path>
                  </g>
                </svg>
                Sign Up with Google
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => handleAuthAction('signin')}
                className="cloud-btn-outline"
              >
                Sign In
              </Button>
              <Button 
                size="lg" 
                variant="ghost" 
                onClick={() => handleAuthAction('guest')} 
                className="text-muted-foreground hover:text-foreground"
              >
                Continue as Guest
              </Button>
            </div>
          </div>
          
          {/* Hero Image/Illustration */}
          <div className="md:w-1/2 flex justify-center animate-fade-in">
            <div className="relative">
              {/* AWS Card */}
              <div className="absolute -top-10 -left-10 w-48 h-48 cloud-card-aws p-4 rotate-6">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-aws rounded-md flex items-center justify-center">
                    <Server className="h-4 w-4 text-black" />
                  </div>
                  <span className="ml-2 font-semibold">AWS EC2</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Scalable compute capacity
                </div>
              </div>
              
              {/* Azure Card */}
              <div className="absolute -bottom-10 -right-10 w-48 h-48 cloud-card-azure p-4 -rotate-6">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-azure rounded-md flex items-center justify-center">
                    <Database className="h-4 w-4 text-white" />
                  </div>
                  <span className="ml-2 font-semibold">Azure Storage</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Secure cloud storage solution
                </div>
              </div>
              
              {/* Main Card */}
              <div className="cloud-card w-64 h-64 md:w-80 md:h-80 p-6 z-10 flex flex-col justify-center items-center">
                <Cloud className="h-16 w-16 text-secondary mb-4" />
                <h3 className="text-xl font-semibold text-center mb-3">Cloud Architecture</h3>
                <p className="text-sm text-center text-muted-foreground">
                  Design, compare, and manage your cloud infrastructure efficiently
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="bg-muted py-16 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="cloud-card p-6 animate-fade-in" style={{animationDelay: '0.1s'}}>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Server className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Design</h3>
              <p className="text-muted-foreground">
                Let our AI assistant recommend the optimal cloud architecture based on your requirements.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="cloud-card p-6 animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="w-12 h-12 bg-azure/10 rounded-lg flex items-center justify-center mb-4">
                <Database className="h-6 w-6 text-azure" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Compare Cloud Providers</h3>
              <p className="text-muted-foreground">
                Side-by-side comparison of AWS and Azure resources with detailed budget analysis.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="cloud-card p-6 animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="w-12 h-12 bg-aws/10 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-aws" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Compliance Checks</h3>
              <p className="text-muted-foreground">
                Ensure your architecture meets security and regulatory requirements like GDPR.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Cloud Providers Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Supported Cloud Providers</h2>
          
          <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
            {/* AWS Card */}
            <div className="cloud-card-aws flex-1 max-w-md p-8 animate-fade-in">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-aws rounded-lg flex items-center justify-center">
                  <Server className="h-6 w-6 text-black" />
                </div>
                <span className="ml-3 text-2xl font-bold">Amazon Web Services</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-aws rounded-full mr-2"></div>
                  <span>EC2 Compute Instances</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-aws rounded-full mr-2"></div>
                  <span>S3 Storage Solutions</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-aws rounded-full mr-2"></div>
                  <span>RDS Database Services</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-aws rounded-full mr-2"></div>
                  <span>Lambda Serverless Computing</span>
                </li>
              </ul>
              <Button className="cloud-btn-aws w-full">Explore AWS Resources</Button>
            </div>
            
            {/* Azure Card */}
            <div className="cloud-card-azure flex-1 max-w-md p-8 animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-azure rounded-lg flex items-center justify-center">
                  <Database className="h-6 w-6 text-white" />
                </div>
                <span className="ml-3 text-2xl font-bold">Microsoft Azure</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-azure rounded-full mr-2"></div>
                  <span>Virtual Machines</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-azure rounded-full mr-2"></div>
                  <span>Blob Storage</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-azure rounded-full mr-2"></div>
                  <span>SQL Database</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-azure rounded-full mr-2"></div>
                  <span>Azure Functions</span>
                </li>
              </ul>
              <Button className="cloud-btn-azure w-full">Explore Azure Resources</Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-navy text-white py-8 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Cloud className="h-8 w-8 text-white mr-2" />
              <span className="text-xl font-bold">DevCloud</span>
            </div>
            <div className="text-sm text-gray-400">
              © 2025 DevCloud. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
