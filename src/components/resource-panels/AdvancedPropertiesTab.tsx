
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
  
  // Clean properties for export by removing metadata properties
  const cleanPropertiesForExport = (props: any) => {
    if (!props) return {};
    
    const cleaned: {[key: string]: any} = {};
    
    Object.entries(props).forEach(([key, value]) => {
      // Skip metadata properties
      if (key === 'type' || key === 'required' || key === 'options') {
        return;
      }
      
      // If value is an object with metadata properties, extract just the actual value
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        if ('options' in value && Array.isArray(value.options)) {
          // For properties with options, just take the selected value
          // Check if the property has a value field, otherwise use the first option if available
          const hasValueProperty = Object.prototype.hasOwnProperty.call(value, 'value');
          cleaned[key] = hasValueProperty ? (value as any).value : 
                         (Array.isArray(value.options) && value.options.length > 0 ? value.options[0] : null);
        } else {
          // For nested objects, recursively clean
          cleaned[key] = cleanPropertiesForExport(value);
        }
      } else {
        // Simple values just pass through
        cleaned[key] = value;
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
