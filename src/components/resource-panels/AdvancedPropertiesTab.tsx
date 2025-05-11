
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
