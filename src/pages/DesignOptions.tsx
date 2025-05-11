
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Cloud, FileText, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';

const DesignOptions = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showAuth={false} />
      
      <div className="flex-grow container mx-auto py-12 px-6 flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Create Your Cloud Architecture
        </h1>
        
        <p className="text-center text-muted-foreground max-w-2xl mb-12">
          Choose how you want to design your cloud architecture. Let our AI assist you or create your own design from scratch.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
          {/* AI Assisted Design */}
          <div 
            onClick={() => navigate('/ai-chat')}
            className="cloud-card p-8 flex flex-col items-center text-center cursor-pointer hover:shadow-2xl transition-all animate-fade-in"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Cloud className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">Create it for me</h2>
            <p className="text-muted-foreground mb-8">
              Our AI will ask you questions about your requirements and generate an optimal cloud architecture design.
            </p>
            <Button className="cloud-btn-primary mt-auto">
              Start AI Conversation
            </Button>
          </div>
          
          {/* Self Design */}
          <div 
            onClick={() => navigate('/software-design')}
            className="cloud-card p-8 flex flex-col items-center text-center cursor-pointer hover:shadow-2xl transition-all animate-fade-in"
            style={{animationDelay: '0.2s'}}
          >
            <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
              <FileText className="h-10 w-10 text-secondary" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">I will create it myself</h2>
            <p className="text-muted-foreground mb-8">
              Design your own cloud architecture by dragging and dropping resources in our intuitive design interface.
            </p>
            <Button className="cloud-btn-secondary mt-auto">
              Open Design Canvas
            </Button>
          </div>
        </div>
        
        <div className="mt-12">
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

export default DesignOptions;
