import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Server, 
  Database, 
  Cloud, 
  FileText, 
  ArrowRight, 
  Check, 
  Clock,
  DollarSign 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { useToast } from '@/hooks/use-toast';

const ComparisonView = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  
  const handleSelectArchitecture = (provider: string) => {
    setSelectedProvider(provider);
    setTimeout(() => {
      toast({
        title: "Architecture Selected",
        description: `You've selected the ${provider} architecture. Taking you to the design view.`,
      });
      navigate('/software-design', { state: { provider, isAiGenerated: true } });
    }, 500);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showAuth={false} />
      
      <div className="flex-grow container mx-auto py-8 px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center">
          Compare Cloud Architecture Solutions
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Based on your requirements, here are the recommended architectures for AWS and Azure.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* AWS Architecture */}
          <div className={`cloud-card-aws p-6 ${selectedProvider === 'AWS' ? 'ring-2 ring-aws' : ''}`}>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-aws rounded-lg flex items-center justify-center mr-4">
                <Cloud className="h-6 w-6 text-black" />
              </div>
              <h2 className="text-2xl font-bold">AWS Architecture</h2>
            </div>
            
            <div className="mb-6 rounded-lg overflow-hidden border border-border bg-muted/20 p-4 h-60 flex items-center justify-center">
              <div className="text-center">
                <Server className="h-16 w-16 mx-auto text-aws mb-4" />
                <p className="text-muted-foreground">
                  AWS Cloud Architecture Visualization
                  <br />
                  (Preview will be shown here)
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Recommended Resources</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-aws mr-2 mt-0.5" />
                  <div>
                    <span className="font-medium">EC2 (t3.medium)</span>
                    <p className="text-sm text-muted-foreground">Scalable compute capacity</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-aws mr-2 mt-0.5" />
                  <div>
                    <span className="font-medium">S3 Storage (Standard)</span>
                    <p className="text-sm text-muted-foreground">Object storage for files and static content</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-aws mr-2 mt-0.5" />
                  <div>
                    <span className="font-medium">RDS (MySQL)</span>
                    <p className="text-sm text-muted-foreground">Managed relational database service</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Budget Estimate</h3>
              <div className="flex items-center text-2xl font-bold">
                <DollarSign className="h-6 w-6 text-aws" />
                <span>320</span>
                <span className="text-sm font-normal text-muted-foreground ml-2">/month</span>
              </div>
            </div>
            
            <Button 
              onClick={() => handleSelectArchitecture('AWS')} 
              className="w-full cloud-btn-aws"
            >
              Select AWS Architecture
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
          
          {/* Azure Architecture */}
          <div className={`cloud-card-azure p-6 ${selectedProvider === 'Azure' ? 'ring-2 ring-azure' : ''}`}>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-azure rounded-lg flex items-center justify-center mr-4">
                <Cloud className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Azure Architecture</h2>
            </div>
            
            <div className="mb-6 rounded-lg overflow-hidden border border-border bg-muted/20 p-4 h-60 flex items-center justify-center">
              <div className="text-center">
                <Database className="h-16 w-16 mx-auto text-azure mb-4" />
                <p className="text-muted-foreground">
                  Azure Cloud Architecture Visualization
                  <br />
                  (Preview will be shown here)
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Recommended Resources</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-azure mr-2 mt-0.5" />
                  <div>
                    <span className="font-medium">App Service (Standard S1)</span>
                    <p className="text-sm text-muted-foreground">Fully managed platform for web apps</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-azure mr-2 mt-0.5" />
                  <div>
                    <span className="font-medium">Blob Storage (Hot tier)</span>
                    <p className="text-sm text-muted-foreground">Cloud storage for unstructured data</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-azure mr-2 mt-0.5" />
                  <div>
                    <span className="font-medium">Azure SQL Database (Basic)</span>
                    <p className="text-sm text-muted-foreground">Managed SQL database service</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Budget Estimate</h3>
              <div className="flex items-center text-2xl font-bold">
                <DollarSign className="h-6 w-6 text-azure" />
                <span>295</span>
                <span className="text-sm font-normal text-muted-foreground ml-2">/month</span>
              </div>
            </div>
            
            <Button 
              onClick={() => handleSelectArchitecture('Azure')} 
              className="w-full cloud-btn-azure"
            >
              Select Azure Architecture
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
        
        <div className="cloud-card p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Comparison Summary</h3>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1 font-medium">Feature</div>
            <div className="col-span-1 font-medium text-aws">AWS</div>
            <div className="col-span-1 font-medium text-azure">Azure</div>
            
            {/* Cost */}
            <div className="col-span-1 flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Monthly Cost</span>
            </div>
            <div className="col-span-1">$320</div>
            <div className="col-span-1">$295</div>
            
            {/* Setup Time */}
            <div className="col-span-1 flex items-center">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Setup Time</span>
            </div>
            <div className="col-span-1">~2 hours</div>
            <div className="col-span-1">~1.5 hours</div>
            
            {/* Scalability */}
            <div className="col-span-1 flex items-center">
              <ArrowRight className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Scalability</span>
            </div>
            <div className="col-span-1">High</div>
            <div className="col-span-1">Very High</div>
            
            {/* Compliance */}
            <div className="col-span-1 flex items-center">
              <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>GDPR Compliance</span>
            </div>
            <div className="col-span-1">Yes</div>
            <div className="col-span-1">Yes</div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            onClick={() => navigate('/ai-chat')}
            className="mr-4"
          >
            Back to AI Chat
          </Button>
          
          <Button 
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

export default ComparisonView;
