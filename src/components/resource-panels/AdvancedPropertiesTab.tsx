
import React from 'react';
import { ResourceItem } from '@/types/resource';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import PropertyRenderer from './PropertyRenderer';
import { copyToClipboard } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface AdvancedPropertiesTabProps {
  resource: ResourceItem;
  onPropertyChange: (key: string, value: any) => void;
  onTerraformTypeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExportJson: () => void;
}

const AdvancedPropertiesTab: React.FC<AdvancedPropertiesTabProps> = ({
  resource,
  onPropertyChange,
  onTerraformTypeChange,
  onExportJson,
}) => {
  const { toast } = useToast();
  
  const resourceJson = {
    id: resource.id,
    type: resource.terraformType,
    name: resource.name,
    count: resource.count,
    properties: resource.properties,
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
    <>
      <div className="space-y-2">
        <label htmlFor="terraformType" className="text-sm font-medium">Terraform Resource Type</label>
        <Input
          id="terraformType"
          value={resource.terraformType || ''}
          onChange={onTerraformTypeChange}
          className="w-full"
          placeholder="e.g., aws_instance, azurerm_virtual_machine"
        />
        <p className="text-xs text-muted-foreground">The Terraform resource type (e.g., aws_instance)</p>
      </div>
      
      <div className="space-y-4 mt-4">
        <h4 className="text-sm font-medium">Properties</h4>
        <div className="space-y-3">
          {resource.properties && (
            <PropertyRenderer 
              obj={resource.properties} 
              onPropertyChange={onPropertyChange} 
            />
          )}
        </div>
      </div>
      
      <div className="space-y-2 mt-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Resource JSON</h4>
          <Button 
            variant="outline"
            size="sm"
            onClick={handleCopyJson}
          >
            Copy JSON
          </Button>
        </div>
        
        <Textarea
          value={JSON.stringify(resourceJson, null, 2)}
          readOnly
          className="font-mono text-xs h-[200px]"
        />
        
        <Button 
          variant="outline"
          className="w-full"
          onClick={onExportJson}
        >
          Export Full Architecture as JSON
        </Button>
      </div>
    </>
  );
};

export default AdvancedPropertiesTab;
