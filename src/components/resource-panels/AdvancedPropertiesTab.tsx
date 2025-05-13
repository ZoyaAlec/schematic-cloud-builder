
import React from 'react';
import { ResourceItem, ResourceProperty } from '@/types/resource';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import PropertyRenderer from './PropertyRenderer';
import { copyToClipboard } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

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
      // If value is a ResourceProperty object
      if (
        value !== null && 
        typeof value === 'object' && 
        !Array.isArray(value) && 
        'type' in value && 
        'required' in value && 
        'options' in value
      ) {
        // Extract just the value property if it exists
        if ('value' in value) {
          cleaned[key] = (value as any).value;
        } 
        // Use first option if no value is set but options exist
        else if ((value as ResourceProperty).options.length > 0) {
          cleaned[key] = (value as ResourceProperty).options[0];
        }
        // Otherwise use null
        else {
          cleaned[key] = null;
        }
      }
      // For nested objects that are not ResourceProperty objects
      else if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        // Recursively clean nested objects
        cleaned[key] = cleanPropertiesForExport(value);
      }
      // For arrays of objects
      else if (Array.isArray(value)) {
        cleaned[key] = value.map(item => {
          if (item && typeof item === 'object') {
            return cleanPropertiesForExport(item);
          }
          return item;
        });
      }
      // For arrays and primitive values
      else {
        cleaned[key] = value;
      }
    });
    
    return cleaned;
  };
  
  // Function to recursively clean connections by removing metadata
  const cleanConnectionsForExport = (connections: any[]) => {
    if (!connections || !connections.length) return [];
    
    return connections.map(conn => ({
      sourceId: conn.sourceId,
      targetId: conn.targetId,
      type: conn.type
    }));
  };
  
  const resourceJson = {
    id: resource.id,
    type: resource.terraformType || resource.type,
    name: resource.name,
    count: resource.count || 1,
    properties: cleanPropertiesForExport(resource.properties),
    connections: cleanConnectionsForExport(resource.connections)
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
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-3">
            {resource.properties && (
              <PropertyRenderer 
                obj={resource.properties} 
                onPropertyChange={onPropertyChange} 
              />
            )}
          </div>
        </ScrollArea>
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
