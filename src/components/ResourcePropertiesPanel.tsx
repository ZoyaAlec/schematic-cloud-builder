
import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResourceItem } from '@/types/resource';
import { useToast } from '@/hooks/use-toast';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import BasicPropertiesTab from './resource-panels/BasicPropertiesTab';
import AdvancedPropertiesTab from './resource-panels/AdvancedPropertiesTab';
import ConnectionsTab from './resource-panels/ConnectionsTab';

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
      defaultProps['region'] = 'us-east-1';
      
      if (editedResource.type === 'compute') {
        defaultProps['ami'] = 'ami-0c55b159cbfafe1f0';
        defaultProps['instance_type'] = 't2.micro';
        defaultProps['tags'] = { 'Name': editedResource.name };
        editedResource.terraformType = 'aws_instance';
        defaultProps['key_name'] = '';
        defaultProps['subnet_id'] = '';
      } else if (editedResource.type === 'storage') {
        defaultProps['bucket'] = editedResource.name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
        defaultProps['acl'] = 'private';
        defaultProps['versioning'] = { 'enabled': true };
        editedResource.terraformType = 'aws_s3_bucket';
      } else if (editedResource.type === 'database') {
        defaultProps['engine'] = 'mysql';
        defaultProps['instance_class'] = 'db.t3.medium';
        defaultProps['allocated_storage'] = 20;
        defaultProps['storage_type'] = 'gp2';
        defaultProps['multi_az'] = true;
        editedResource.terraformType = 'aws_db_instance';
      } else if (editedResource.type === 'network') {
        defaultProps['name'] = editedResource.name;
        defaultProps['cidr_block'] = '10.0.0.0/16';
        editedResource.terraformType = 'aws_vpc';
      } else if (editedResource.type === 'security') {
        defaultProps['name'] = editedResource.name;
        defaultProps['description'] = 'Security group for ' + editedResource.name;
        defaultProps['ingress'] = [
          {
            'from_port': 80,
            'to_port': 80,
            'protocol': 'tcp',
            'cidr_blocks': ['0.0.0.0/0']
          }
        ];
        editedResource.terraformType = 'aws_security_group';
      }
    } else {
      defaultProps['location'] = 'East US';
      defaultProps['resource_group_name'] = 'default-rg';
      
      if (editedResource.type === 'compute') {
        defaultProps['vm_size'] = 'Standard_D2s_v3';
        defaultProps['admin_username'] = 'adminuser';
        editedResource.terraformType = 'azurerm_virtual_machine';
      } else if (editedResource.type === 'storage') {
        defaultProps['account_tier'] = 'Standard';
        defaultProps['account_replication_type'] = 'GRS';
        editedResource.terraformType = 'azurerm_storage_account';
      } else if (editedResource.type === 'database') {
        defaultProps['sku_name'] = 'GP_Gen5_2';
        defaultProps['administrator_login'] = 'sqladmin';
        defaultProps['version'] = '12.0';
        editedResource.terraformType = 'azurerm_sql_server';
      } else if (editedResource.type === 'network') {
        defaultProps['address_space'] = ['10.0.0.0/16'];
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
      onUpdate(editedResource);
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
        
        <div className="mt-6 space-y-6">
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
