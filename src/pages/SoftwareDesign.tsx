import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import DragDropDesigner from '@/components/DragDropDesigner';
import BudgetView from '@/components/BudgetView';
import ComplianceView from '@/components/ComplianceView';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ResourceItem, ArchitectureDesign, ResourceExport } from '@/types/resource';
import { 
  supabase, 
  getCurrentUser, 
  saveArchitecture as saveArchitectureToSupabase 
} from '@/lib/supabase';
import AuthModal from '@/components/Auth/AuthModal';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Server, Database, Network, Shield, LogIn, LogOut, User, Save } from 'lucide-react';

type Tab = 'design' | 'budget' | 'compliance';

const SoftwareDesign = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>('design');
  
  // Get provider and isAiGenerated from location state, if available
  const provider = location.state?.provider || null;
  const isAiGenerated = location.state?.isAiGenerated || false;
  
  // State for storing resources that will persist between tabs
  const [activeProvider, setActiveProvider] = useState<'aws' | 'azure'>(provider?.toLowerCase() || 'aws');
  const [placedResources, setPlacedResources] = useState<ResourceItem[]>(
    isAiGenerated ? getSampleArchitecture(activeProvider) : []
  );
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  
  // Architecture name for saving
  const [architectureName, setArchitectureName] = useState<string>('');
  const [architectureDescription, setArchitectureDescription] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState<boolean>(false);

  // Check for existing user session on component mount
  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUser();
      if (user) {
        setIsAuthenticated(true);
        setUserId(user.id);
      }
    };
    
    checkUser();
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setIsAuthenticated(true);
          setUserId(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
          setUserId(null);
        }
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
  };

  const handleProviderChange = (provider: 'aws' | 'azure') => {
    setActiveProvider(provider);
  };

  const handleSaveArchitecture = async () => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }
    
    setSaveDialogOpen(true);
  };
  
  const handleSaveConfirm = async () => {
    if (!architectureName.trim()) {
      toast({
        title: "Name Required",
        description: "Please provide a name for your architecture",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Determine resource type based on provider and architecture type
      const resourceType = `${activeProvider}_architecture`;
      
      // Convert resources to export format
      const processedResources = placedResources.map(resource => ({
        id: resource.id,
        type: resource.terraformType || resource.type
      }));
      
      // Create the properties object to save
      const properties = {
        provider: activeProvider,
        region: placedResources.length > 0 && placedResources[0].properties?.region 
          ? placedResources[0].properties.region 
          : activeProvider === 'aws' ? 'us-east-1' : 'eastus',
        resources: processedResources
      };

      // Create architecture object that matches the expected type
      const architecture: ArchitectureDesign = {
        provider: activeProvider,
        region: properties.region,
        resources: processedResources,
        name: architectureName,
        description: architectureDescription,
        variables: [],
        outputs: []
      };
      
      // Insert directly into Supabase using the saveArchitecture function
      const result = await saveArchitectureToSupabase(architecture);
      
      toast({
        title: "Architecture Saved",
        description: "Your cloud architecture has been saved successfully.",
      });
      
      setSaveDialogOpen(false);
      setArchitectureName('');
      setArchitectureDescription('');
    } catch (error: any) {
      toast({
        title: "Save Failed",
        description: error.message || "An error occurred while saving",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAuthSuccess = (newUserId: string) => {
    setIsAuthenticated(true);
    setUserId(newUserId);
  };
  
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setUserId(null);
      
      toast({
        title: "Signed Out",
        description: "You have been signed out successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred during sign out",
        variant: "destructive",
      });
    }
  };

  function getSampleArchitecture(provider: 'aws' | 'azure'): ResourceItem[] {
    if (provider === 'aws') {
      return [
        {
          id: 'aws-vpc-1',
          type: 'network',
          name: 'Main VPC',
          icon: Network,
          description: 'Primary network for the application',
          provider: 'aws',
          cost: 0,
          costDetails: 'No hourly charges for VPC',
          x: 150,
          y: 100,
          terraformType: 'aws_vpc',
          properties: {
            cidr_block: '10.0.0.0/16',
            tags: { Name: 'Main VPC' }
          }
        },
        {
          id: 'aws-sg-1',
          type: 'security',
          name: 'Web Security Group',
          icon: Shield,
          description: 'Security rules for web servers',
          provider: 'aws',
          cost: 0,
          costDetails: 'No charges for security groups',
          x: 150,
          y: 200,
          terraformType: 'aws_security_group',
          properties: {
            name: 'web-sg',
            description: 'Allow HTTP/HTTPS traffic',
            vpc_id: '${aws_vpc.main_vpc.id}',
            ingress: [
              {
                from_port: 80,
                to_port: 80,
                protocol: 'tcp',
                cidr_blocks: ['0.0.0.0/0']
              },
              {
                from_port: 443,
                to_port: 443,
                protocol: 'tcp',
                cidr_blocks: ['0.0.0.0/0']
              }
            ],
            egress: [
              {
                from_port: 0,
                to_port: 0,
                protocol: '-1',
                cidr_blocks: ['0.0.0.0/0']
              }
            ]
          },
          connections: [
            {
              sourceId: 'aws-sg-1',
              targetId: 'aws-vpc-1',
              type: 'belongs_to'
            }
          ]
        },
        {
          id: 'aws-ec2-1',
          type: 'compute',
          name: 'Web Servers',
          icon: Server,
          description: 'Web server instances',
          provider: 'aws',
          cost: 70.08,
          costDetails: '2 instances × $0.0416/hour × 730 hours',
          x: 300,
          y: 150,
          count: 2,
          terraformType: 'aws_instance',
          properties: {
            ami: 'ami-0c55b159cbfafe1f0',
            instance_type: 't2.micro',
            key_name: 'my-key',
            vpc_security_group_ids: ['${aws_security_group.web_sg.id}'],
            subnet_id: '${aws_subnet.public_subnet.id}',
            tags: { Name: 'WebServer' }
          },
          connections: [
            {
              sourceId: 'aws-ec2-1',
              targetId: 'aws-sg-1',
              type: 'reference'
            }
          ]
        },
        {
          id: 'aws-lb-1',
          type: 'network',
          name: 'Web Load Balancer',
          icon: Network,
          description: 'Load balancer for web servers',
          provider: 'aws',
          cost: 16.43,
          costDetails: '1 ALB × $0.0225/hour × 730 hours',
          x: 450,
          y: 150,
          terraformType: 'aws_lb',
          properties: {
            name: 'web-lb',
            internal: false,
            load_balancer_type: 'application',
            security_groups: ['${aws_security_group.web_sg.id}'],
            subnets: ['${aws_subnet.public_subnet.id}', '${aws_subnet.public_subnet2.id}']
          },
          connections: [
            {
              sourceId: 'aws-lb-1',
              targetId: 'aws-sg-1',
              type: 'reference'
            }
          ]
        },
        {
          id: 'aws-rds-1',
          type: 'database',
          name: 'User Database',
          icon: Database,
          description: 'MySQL database for user data',
          provider: 'aws',
          cost: 178.25,
          costDetails: 'db.t3.medium, Multi-AZ deployment',
          x: 400,
          y: 300,
          terraformType: 'aws_db_instance',
          properties: {
            allocated_storage: 20,
            engine: 'mysql',
            engine_version: '5.7',
            instance_class: 'db.t3.medium',
            name: 'mydb',
            username: 'admin',
            password: 'changeme',
            parameter_group_name: 'default.mysql5.7',
            skip_final_snapshot: true,
            vpc_security_group_ids: ['${aws_security_group.db_sg.id}'],
            db_subnet_group_name: '${aws_db_subnet_group.default.id}'
          }
        },
      ];
    } else {
      return [
        {
          id: 'azure-vnet-1',
          type: 'network',
          name: 'Main Virtual Network',
          icon: Network,
          description: 'Primary network for the application',
          provider: 'azure',
          cost: 0,
          costDetails: 'No charges for virtual networks',
          x: 150,
          y: 100,
          terraformType: 'azurerm_virtual_network',
          properties: {
            name: 'main-vnet',
            address_space: ['10.0.0.0/16'],
            location: 'East US',
            resource_group_name: 'app-resources'
          }
        },
        {
          id: 'azure-nsg-1',
          type: 'security',
          name: 'Web NSG',
          icon: Shield,
          description: 'Network security for web servers',
          provider: 'azure',
          cost: 0,
          costDetails: 'No charges for NSGs',
          x: 150,
          y: 200,
          terraformType: 'azurerm_network_security_group',
          properties: {
            name: 'web-nsg',
            location: 'East US',
            resource_group_name: 'app-resources',
            security_rule: [
              {
                name: 'allow-http',
                priority: 100,
                direction: 'Inbound',
                access: 'Allow',
                protocol: 'Tcp',
                source_port_range: '*',
                destination_port_range: '80',
                source_address_prefix: '*',
                destination_address_prefix: '*'
              },
              {
                name: 'allow-https',
                priority: 110,
                direction: 'Inbound',
                access: 'Allow',
                protocol: 'Tcp',
                source_port_range: '*',
                destination_port_range: '443',
                source_address_prefix: '*',
                destination_address_prefix: '*'
              }
            ]
          }
        },
        {
          id: 'azure-vm-1',
          type: 'compute',
          name: 'App Servers',
          icon: Server,
          description: 'Application server instances',
          provider: 'azure',
          cost: 73.00,
          costDetails: '2 instances × $36.50 each',
          x: 300,
          y: 150,
          count: 2,
          terraformType: 'azurerm_virtual_machine',
          properties: {
            name: 'app-vm',
            location: 'East US',
            resource_group_name: 'app-resources',
            vm_size: 'Standard_D2s_v3',
            network_interface_ids: ['${azurerm_network_interface.app_nic.id}'],
            storage_os_disk: {
              name: 'app-osdisk',
              caching: 'ReadWrite',
              create_option: 'FromImage',
              managed_disk_type: 'Premium_LRS'
            },
            os_profile: {
              computer_name: 'appvm',
              admin_username: 'adminuser'
            }
          }
        },
        {
          id: 'azure-lb-1',
          type: 'network',
          name: 'App Load Balancer',
          icon: Network,
          description: 'Load balancer for application servers',
          provider: 'azure',
          cost: 18.25,
          costDetails: '1 basic LB × $0.025/hour × 730 hours',
          x: 450,
          y: 150,
          terraformType: 'azurerm_lb',
          properties: {
            name: 'app-lb',
            location: 'East US',
            resource_group_name: 'app-resources',
            frontend_ip_configuration: {
              name: 'PublicIPAddress',
              public_ip_address_id: '${azurerm_public_ip.lb_ip.id}'
            }
          }
        },
        {
          id: 'azure-sql-1',
          type: 'database',
          name: 'User Database',
          icon: Database,
          description: 'SQL database for user data',
          provider: 'azure',
          cost: 149.16,
          costDetails: 'Standard tier, 10 DTUs',
          x: 400,
          y: 300,
          terraformType: 'azurerm_sql_server',
          properties: {
            name: 'app-sqlserver',
            location: 'East US',
            resource_group_name: 'app-resources',
            version: '12.0',
            administrator_login: 'sqladmin',
            administrator_login_password: 'changeme'
          }
        }
      ];
    }
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar showAuth={false} />
      
      <div className="container mx-auto py-6 px-4 flex-grow flex flex-col">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {provider ? `${provider} Cloud Architecture` : 'Cloud Architecture Design'}
            </h1>
            <p className="text-muted-foreground">
              {isAiGenerated 
                ? 'AI-generated architecture based on your requirements.' 
                : 'Design your cloud architecture by adding and configuring resources.'}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleSignOut} className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </Button>
                <Button className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>My Account</span>
                </Button>
              </div>
            ) : (
              <Button onClick={() => setAuthModalOpen(true)} className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Button>
            )}
          </div>
        </div>
        
        {/* Tabs */}
        <div className="mb-6 border-b border-border">
          <div className="flex space-x-8">
            <button
              onClick={() => handleTabChange('design')}
              className={`pb-2 px-1 ${
                activeTab === 'design'
                  ? 'border-b-2 border-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground transition-colors'
              }`}
            >
              Software Design Architecture
            </button>
            <button
              onClick={() => handleTabChange('budget')}
              className={`pb-2 px-1 ${
                activeTab === 'budget'
                  ? 'border-b-2 border-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground transition-colors'
              }`}
            >
              Budget
            </button>
            <button
              onClick={() => handleTabChange('compliance')}
              className={`pb-2 px-1 ${
                activeTab === 'compliance'
                  ? 'border-b-2 border-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground transition-colors'
              }`}
            >
              Compliance
            </button>
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="flex-grow border border-border rounded-lg overflow-hidden bg-white dark:bg-navy-light">
          {activeTab === 'design' && (
            <DragDropDesigner 
              provider={activeProvider} 
              isAiGenerated={isAiGenerated}
              placedResources={placedResources}
              setPlacedResources={setPlacedResources}
              onProviderChange={handleProviderChange}
            />
          )}
          
          {activeTab === 'budget' && (
            <BudgetView 
              provider={activeProvider} 
              isAiGenerated={isAiGenerated}
              placedResources={placedResources}
            />
          )}
          
          {activeTab === 'compliance' && (
            <ComplianceView provider={activeProvider} />
          )}
        </div>
        
        <div className="mt-6 flex justify-between">
          <Button
            variant="outline"
            onClick={() => navigate('/options')}
            className="text-muted-foreground hover:text-foreground"
          >
            Back to Options
          </Button>
          
          <Button 
            onClick={handleSaveArchitecture}
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Architecture
          </Button>
        </div>
      </div>
      
      <footer className="bg-navy text-white py-4 px-6">
        <div className="container mx-auto text-center text-sm">
          © 2025 DevCloud. All rights reserved.
        </div>
      </footer>
      
      {/* Authentication Modal */}
      <AuthModal 
        isOpen={authModalOpen}
        onOpenChange={setAuthModalOpen}
        onAuthSuccess={handleAuthSuccess}
      />
      
      {/* Save Architecture Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Architecture</DialogTitle>
            <DialogDescription>
              Provide details for your cloud architecture design.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Architecture Name</Label>
              <Input
                id="name"
                placeholder="My AWS Architecture"
                value={architectureName}
                onChange={(e) => setArchitectureName(e.target.value)}
                disabled={isSaving}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="A brief description of this architecture"
                value={architectureDescription}
                onChange={(e) => setArchitectureDescription(e.target.value)}
                disabled={isSaving}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSaveConfirm} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SoftwareDesign;
