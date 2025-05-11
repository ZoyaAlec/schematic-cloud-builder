
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Cloud_Resources } from '@/Config/Resources/Cloud_Resources';

interface PropertyRendererProps {
  obj: any;
  prefix?: string;
  resourceType?: string;
  provider?: 'aws' | 'azure';
  onPropertyChange: (key: string, value: any) => void;
}

const PropertyRenderer: React.FC<PropertyRendererProps> = ({ 
  obj, 
  prefix = '', 
  resourceType,
  provider,
  onPropertyChange 
}) => {
  // Get resource properties definition from config
  const getPropertyDefinition = (key: string) => {
    if (!resourceType || !provider) return null;
    
    const resource = Cloud_Resources.find(r => 
      r.type === resourceType && r.provider === provider
    );
    
    if (resource && resource.properties) {
      return resource.properties.find(p => p.name === key);
    }
    return null;
  };

  return Object.entries(obj).map(([key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const propertyDef = getPropertyDefinition(key);
    
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      return (
        <div key={fullKey} className="ml-4 mt-2">
          <div className="text-xs font-medium mb-1">{key}:</div>
          <PropertyRenderer 
            obj={value} 
            prefix={fullKey}
            resourceType={resourceType}
            provider={provider} 
            onPropertyChange={onPropertyChange} 
          />
        </div>
      );
    } else if (Array.isArray(value)) {
      return (
        <div key={fullKey} className="ml-4 mt-2">
          <div className="text-xs font-medium mb-1">{key} (array):</div>
          {value.map((item, index) => (
            <div key={`${fullKey}-${index}`} className="ml-4">
              {typeof item === 'object' && item !== null ? (
                <PropertyRenderer 
                  obj={item} 
                  prefix={`${fullKey}[${index}]`}
                  resourceType={resourceType}
                  provider={provider}
                  onPropertyChange={onPropertyChange} 
                />
              ) : (
                <Input
                  value={String(item ?? '')}
                  onChange={(e) => {
                    const newArr = [...value];
                    newArr[index] = e.target.value;
                    onPropertyChange(fullKey, newArr);
                  }}
                  className="mt-1 text-xs"
                />
              )}
            </div>
          ))}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              const newArr = [...value, ''];
              onPropertyChange(fullKey, newArr);
            }}
            className="mt-1 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" /> Add Item
          </Button>
        </div>
      );
    } else {
      // Render different input types based on value type and property definition
      if (propertyDef && propertyDef.options) {
        // Render a select dropdown for properties with options
        return (
          <div key={fullKey} className="flex flex-col space-y-1 mt-1">
            <Label htmlFor={`property-${fullKey}`} className="text-xs font-medium">
              {propertyDef.description || key}
            </Label>
            <Select
              value={String(value ?? '')}
              onValueChange={(newValue) => onPropertyChange(fullKey, newValue)}
            >
              <SelectTrigger id={`property-${fullKey}`} className="text-xs">
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                {propertyDef.options.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      } else if (typeof value === 'boolean') {
        // Render a toggle for boolean values
        return (
          <div key={fullKey} className="flex items-center justify-between mt-1">
            <Label htmlFor={`property-${fullKey}`} className="text-xs font-medium">
              {propertyDef?.description || key}
            </Label>
            <Switch
              id={`property-${fullKey}`}
              checked={!!value}
              onCheckedChange={(checked) => onPropertyChange(fullKey, checked)}
            />
          </div>
        );
      } else {
        // Render a text input for strings and numbers
        return (
          <div key={fullKey} className="flex flex-col space-y-1 mt-1">
            <Label htmlFor={`property-${fullKey}`} className="text-xs font-medium">
              {propertyDef?.description || key}
            </Label>
            <Input
              id={`property-${fullKey}`}
              type={typeof value === 'number' ? 'number' : 'text'}
              value={String(value ?? '')}
              onChange={(e) => {
                const newValue = typeof value === 'number' ? 
                  parseFloat(e.target.value) : 
                  e.target.value;
                onPropertyChange(fullKey, newValue);
              }}
              className="text-xs"
            />
          </div>
        );
      }
    }
  });
};

export default PropertyRenderer;
