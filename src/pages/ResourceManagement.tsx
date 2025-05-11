
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import ResourceManagementComponent from '@/components/ResourceManagement';

const ResourceManagement = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showAuth={false} />
      
      <div className="flex-grow container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2 text-center">
          Manage Cloud Resources
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Configure and manage your existing cloud resources with AI guidance
        </p>
        
        <ResourceManagementComponent />
        
        <div className="mt-8 text-center">
          <Button 
            variant="outline" 
            onClick={() => navigate('/options')}
          >
            Back to Options
          </Button>
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

export default ResourceManagement;
