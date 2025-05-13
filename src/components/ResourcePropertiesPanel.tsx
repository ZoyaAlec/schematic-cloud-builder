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
import { Cloud_Resources } from '@/Config/Resources/Cloud_Resources';

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
    // Find matching resource template from Cloud_Resources
    const resourceTemplate = Cloud_Resources.find(
      r => r.provider === editedResource.provider && r.type === editedResource.type
    );

    // Use template properties or create empty object if not found
    const defaultProps = resourceTemplate && resourceTemplate.properties 
      ? JSON.parse(JSON.stringify(resourceTemplate.properties))  // Deep clone
      : {};
    
    // Set terraform type from template if available
    if (resourceTemplate && resourceTemplate.terraformType) {
      editedResource.terraformType = resourceTemplate.terraformType;
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
          const instanceTypeProperty = updatedResource.properties?.instance_type;
          const instanceType = 
            instanceTypeProperty && 
            typeof instanceTypeProperty === 'object' &&
            'value' in instanceTypeProperty 
              ? instanceTypeProperty.value 
              : 't2.micro';
          
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
