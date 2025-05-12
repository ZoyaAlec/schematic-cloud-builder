
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ResourceItem } from '@/types/resource';
import PropertyRenderer from './PropertyRenderer';
import { Download } from 'lucide-react';

interface AdvancedPropertiesTabProps {
  resource: ResourceItem;
  onPropertyChange: (key: string, value: any) => void;
  onTerraformTypeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExportJson: () => void;
  resourceType?: string;
  provider?: 'aws' | 'azure';
}

const AdvancedPropertiesTab: React.FC<AdvancedPropertiesTabProps> = ({
  resource,
  onPropertyChange,
  onTerraformTypeChange,
  onExportJson,
  resourceType,
  provider
}) => {
  const { toast } = useToast();
  
  // Clean properties for export by removing metadata properties
  const cleanPropertiesForExport = (props: any) => {
    if (!props) return {};
    
    const cleaned: {[key: string]: any} = {};
    
    Object.entries(props).forEach(([key, value]) => {
      // Skip metadata properties
      if (key !== 'type' && key !== 'required') {
        // If value is an object, recursively clean it
        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
          cleaned[key] = cleanPropertiesForExport(value);
        } else {
          cleaned[key] = value;
        }
      }
    });
    
    return cleaned;
  };
  
  const resourceJson = {
    id: resource.id,
    type: resource.terraformType,
    name: resource.name,
    count: resource.count,
    properties: cleanPropertiesForExport(resource.properties),
    connections: resource.connections
  };
  
  const handleCopyJson = () => {
    const jsonStr = JSON.stringify(resourceJson, null, 2);
    copyToClipboard(jsonStr);
    toast({
      title: "JSON Copied",
      description: "Resource JSON has been copied to clipboard"
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="terraformType" className="block text-sm font-medium mb-1">
          Terraform Resource Type
        </label>
        <Input
          id="terraformType"
          placeholder="e.g. aws_instance"
          value={resource.terraformType || ''}
          onChange={onTerraformTypeChange}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground mt-1">
          This is the Terraform resource type that will be used to create this resource.
        </p>
      </div>
      
      {resource.properties && Object.keys(resource.properties).length > 0 && (
        <>
          <h4 className="font-medium mt-4">Advanced Properties</h4>
          <div className="border rounded-md p-3 bg-background">
            <PropertyRenderer 
              obj={resource.properties} 
              onPropertyChange={onPropertyChange}
              resourceType={resourceType}
              provider={provider}
            />
          </div>
        </>
      )}
      
      <div className="mt-4">
        <Button 
          variant="outline" 
          onClick={onExportJson}
          className="flex items-center"
        >
          <Download className="h-4 w-4 mr-2" />
          Export as JSON
        </Button>
        <p className="text-xs text-muted-foreground mt-1">
          Download the resource configuration as a JSON file.
        </p>
      </div>
    </div>
  );
};

export default AdvancedPropertiesTab;
