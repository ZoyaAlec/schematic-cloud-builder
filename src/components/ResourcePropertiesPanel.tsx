import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResourceItem } from '@/types/resource';
import { useToast } from '@/hooks/use-toast';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import BasicPropertiesTab from './resource-panels/BasicPropertiesTab';
import AdvancedPropertiesTab from './resource-panels/AdvancedPropertiesTab';
import ConnectionsTab from './resource-panels/ConnectionsTab';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ResourcePropertiesPanelProps {
  resource: ResourceItem | null;
  onClose: () => void;
  onUpdate?: (updatedResource: ResourceItem) => void;
  allResources?: ResourceItem[];
  open: boolean;
}

const ResourcePropertiesPanel: React.FC<ResourcePropertiesPanelProps> = ({ 
  resource, 
  onClose,
  onUpdate,
  allResources = [],
  open
}) => {
  const { toast } = useToast();
  const [editedResource, setEditedResource] = useState<ResourceItem | null>(resource);
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced' | 'connections'>('basic');

  useEffect(() => {
    setEditedResource(resource);
  }, [resource]);

  if (!resource || !editedResource) return null;

  const getProviderDetails = () => {
    if (resource.provider === 'aws') {
      return {
        title: 'AWS Resource',
        colorClass: 'bg-aws'
      };
    }
    return {
      title: 'Azure Resource',
      colorClass: 'bg-azure'
    };
  };

  const { title } = getProviderDetails();

  // Initialize default properties if they don't exist
  if (!editedResource.properties) {
    const defaultProps: {[key: string]: any} = {};
    
    // Add default properties based on provider and type
    if (editedResource.provider === 'aws') {
      defaultProps['region'] = {
        type: 'string',
        required: true,
        options: ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1'],
        value: 'us-east-1'
      };
      
      if (editedResource.type === 'compute') {
        defaultProps['ami'] = {
          type: 'string',
          required: true,
          options: [],
          value: 'ami-0c55b159cbfafe1f0'
        };
        defaultProps['instance_type'] = {
          type: 'list',
          required: true,
          options: ['t2.micro', 't2.small', 't2.medium', 't3.micro', 't3.small'],
          value: 't2.micro'
        };
        defaultProps['key_name'] = {
          type: 'string',
          required: false,
          options: [],
          value: ''
        };
        defaultProps['subnet_id'] = {
          type: 'string',
          required: true,
          options: [],
          value: ''
        };
        defaultProps['availability_zone'] = {
          type: 'string',
          required: false,
          options: ['us-east-1a', 'us-east-1b', 'us-east-1c'],
          value: 'us-east-1a'
        };
        defaultProps['tags'] = { 
          'Name': {
            type: 'string',
            required: false,
            options: [],
            value: editedResource.name
          }
        };
        editedResource.terraformType = 'aws_instance';
      } else if (editedResource.type === 'storage') {
        defaultProps['bucket'] = {
          type: 'string',
          required: true,
          options: [],
          value: editedResource.name.toLowerCase().replace(/[^a-z0-9-]/g, '-')
        };
        defaultProps['acl'] = {
          type: 'list',
          required: false,
          options: ['private', 'public-read', 'public-read-write'],
          value: 'private'
        };
        defaultProps['versioning'] = { 
          'enabled': {
            type: 'boolean',
            required: false,
            options: [],
            value: true
          }
        };
        editedResource.terraformType = 'aws_s3_bucket';
      } else if (editedResource.type === 'database') {
        defaultProps['engine'] = {
          type: 'list',
          required: true,
          options: ['mysql', 'postgres', 'oracle', 'sqlserver'],
          value: 'mysql'
        };
        defaultProps['instance_class'] = {
          type: 'list',
          required: true,
          options: ['db.t3.micro', 'db.t3.small', 'db.t3.medium', 'db.r5.large'],
          value: 'db.t3.medium'
        };
        defaultProps['allocated_storage'] = {
          type: 'number',
          required: true,
          options: [],
          value: 20
        };
        defaultProps['storage_type'] = {
          type: 'list',
          required: false,
          options: ['gp2', 'io1', 'standard'],
          value: 'gp2'
        };
        defaultProps['multi_az'] = {
          type: 'boolean',
          required: false,
          options: [],
          value: true
        };
        editedResource.terraformType = 'aws_db_instance';
      } else if (editedResource.type === 'network') {
        defaultProps['name'] = {
          type: 'string',
          required: true,
          options: [],
          value: editedResource.name
        };
        defaultProps['cidr_block'] = {
          type: 'string',
          required: true,
          options: [],
          value: '10.0.0.0/16'
        };
        editedResource.terraformType = 'aws_vpc';
      } else if (editedResource.type === 'security') {
        defaultProps['name'] = {
          type: 'string',
          required: true,
          options: [],
          value: editedResource.name
        };
        defaultProps['description'] = {
          type: 'string',
          required: false,
          options: [],
          value: 'Security group for ' + editedResource.name
        };
        defaultProps['ingress'] = [
          {
            'from_port': {
              type: 'number',
              required: true,
              options: [],
              value: 80
            },
            'to_port': {
              type: 'number',
              required: true,
              options: [],
              value: 80
            },
            'protocol': {
              type: 'string',
              required: true,
              options: [],
              value: 'tcp'
            },
            'cidr_blocks': {
              type: 'list',
              required: true,
              options: [],
              value: ['0.0.0.0/0']
            }
          }
        ];
        editedResource.terraformType = 'aws_security_group';
      }
    } else {
      defaultProps['location'] = {
        type: 'list',
        required: true,
        options: ['East US', 'West US', 'Central US', 'North Europe'],
        value: 'East US'
      };
      defaultProps['resource_group_name'] = {
        type: 'string',
        required: true,
        options: [],
        value: 'default-rg'
      };
      
      if (editedResource.type === 'compute') {
        defaultProps['vm_size'] = {
          type: 'list',
          required: true,
          options: ['Standard_D2s_v3', 'Standard_D4s_v3', 'Standard_B2s', 'Standard_F2s_v2'],
          value: 'Standard_D2s_v3'
        };
        defaultProps['admin_username'] = {
          type: 'string',
          required: true,
          options: [],
          value: 'adminuser'
        };
        editedResource.terraformType = 'azurerm_virtual_machine';
      } else if (editedResource.type === 'storage') {
        defaultProps['account_tier'] = {
          type: 'list',
          required: true,
          options: ['Standard', 'Premium'],
          value: 'Standard'
        };
        defaultProps['account_replication_type'] = {
          type: 'list',
          required: true,
          options: ['LRS', 'GRS', 'RAGRS', 'ZRS'],
          value: 'GRS'
        };
        editedResource.terraformType = 'azurerm_storage_account';
      } else if (editedResource.type === 'database') {
        defaultProps['sku_name'] = {
          type: 'list',
          required: true,
          options: ['GP_Gen5_2', 'GP_Gen5_4', 'BC_Gen5_2'],
          value: 'GP_Gen5_2'
        };
        defaultProps['administrator_login'] = {
          type: 'string',
          required: true,
          options: [],
          value: 'sqladmin'
        };
        defaultProps['version'] = {
          type: 'list',
          required: true,
          options: ['12.0', '11.0', '10.0'],
          value: '12.0'
        };
        editedResource.terraformType = 'azurerm_sql_server';
      } else if (editedResource.type === 'network') {
        defaultProps['address_space'] = {
          type: 'list',
          required: true,
          options: [],
          value: ['10.0.0.0/16']
        };
        editedResource.terraformType = 'azurerm_virtual_network';
      }
    }
    
    setEditedResource({
      ...editedResource,
      properties: defaultProps,
      connections: editedResource.connections || []
    });
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedResource({
      ...editedResource,
      name: e.target.value
    });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedResource({
      ...editedResource,
      description: e.target.value
    });
  };

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value) || 1;
    setEditedResource({
      ...editedResource,
      count: count
    });
  };

  const handleTerraformTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedResource({
      ...editedResource,
      terraformType: e.target.value
    });
  };

  const handlePropertyChange = (key: string, value: any) => {
    setEditedResource({
      ...editedResource,
      properties: {
        ...editedResource.properties,
        [key]: value
      }
    });
  };

  const handleAddConnection = () => {
    const connections = editedResource.connections || [];
    connections.push({
      sourceId: editedResource.id,
      targetId: '',
      type: 'depends_on'
    });
    
    setEditedResource({
      ...editedResource,
      connections
    });
  };

  const handleUpdateConnection = (index: number, field: string, value: string) => {
    const connections = [...(editedResource.connections || [])];
    connections[index] = {
      ...connections[index],
      [field]: value
    };
    
    setEditedResource({
      ...editedResource,
      connections
    });
  };

  const handleRemoveConnection = (index: number) => {
    const connections = [...(editedResource.connections || [])];
    connections.splice(index, 1);
    
    setEditedResource({
      ...editedResource,
      connections
    });
  };

  const exportToJson = () => {
    if (editedResource) {
      const jsonData = JSON.stringify(editedResource, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${editedResource.name.toLowerCase().replace(/\s+/g, '_')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "JSON Exported",
        description: "Resource configuration exported as JSON.",
      });
    }
  };

  const handleSave = () => {
    if (onUpdate && editedResource) {
      // Update cost based on resource type
      const updatedResource = {...editedResource};
      
      if (updatedResource.type === 'compute') {
        // Calculate cost based on instance type for AWS
        if (updatedResource.provider === 'aws') {
          const instanceType = updatedResource.properties?.instance_type?.value || 't2.micro';
          const instanceCosts: {[key: string]: number} = {
            't2.micro': 0.0116,
            't2.small': 0.023,
            't2.medium': 0.0464,
            't3.micro': 0.0104,
            't3.small': 0.0208
          };
          const hourlyRate = instanceCosts[instanceType] || 0.0116;
          updatedResource.cost = Number((hourlyRate * 730 * (updatedResource.count || 1)).toFixed(2));
          updatedResource.costDetails = `${updatedResource.count || 1} instances × $${hourlyRate}/hour × 730 hours`;
        }
      }
      
      onUpdate(updatedResource);
      toast({
        title: "Resource Updated",
        description: "Your resource properties have been updated successfully.",
      });
    }
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={() => onClose()}>
      <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className={`${resource.provider === 'aws' ? 'text-black' : 'text-foreground'}`}>
            {title}: {resource.name}
          </SheetTitle>
          <SheetDescription>
            Edit the properties of this resource.
          </SheetDescription>
        </SheetHeader>
        
        {/* Tabs */}
        <div className="flex border-b mt-4">
          <button
            className={`px-3 py-2 ${activeTab === 'basic' ? 'border-b-2 border-primary' : ''}`}
            onClick={() => setActiveTab('basic')}
          >
            Basic
          </button>
          <button
            className={`px-3 py-2 ${activeTab === 'advanced' ? 'border-b-2 border-primary' : ''}`}
            onClick={() => setActiveTab('advanced')}
          >
            Advanced
          </button>
          <button
            className={`px-3 py-2 ${activeTab === 'connections' ? 'border-b-2 border-primary' : ''}`}
            onClick={() => setActiveTab('connections')}
          >
            Connections
          </button>
        </div>
        
        <ScrollArea className="h-[calc(100vh-200px)] mt-6 pr-4">
          <div className="space-y-6">
            {activeTab === 'basic' && (
              <BasicPropertiesTab 
                resource={editedResource}
                onPropertyChange={handlePropertyChange}
                onNameChange={handleNameChange}
                onDescriptionChange={handleDescriptionChange}
                onCountChange={handleCountChange}
              />
            )}
            
            {activeTab === 'advanced' && (
              <AdvancedPropertiesTab 
                resource={editedResource}
                onPropertyChange={handlePropertyChange}
                onTerraformTypeChange={handleTerraformTypeChange}
                onExportJson={exportToJson}
              />
            )}
            
            {activeTab === 'connections' && (
              <ConnectionsTab 
                resource={editedResource}
                allResources={allResources}
                onAddConnection={handleAddConnection}
                onUpdateConnection={handleUpdateConnection}
                onRemoveConnection={handleRemoveConnection}
              />
            )}
          </div>
        </ScrollArea>
        
        <div className="mt-8 flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ResourcePropertiesPanel;
