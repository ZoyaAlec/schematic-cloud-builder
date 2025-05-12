
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ResourceProperty } from '@/types/resource';

interface PropertyDefinition {
  type?: 'string' | 'number' | 'boolean' | 'object';
  required?: boolean;
  options?: string[];
  description?: string;
}

interface PropertyMetadata {
  [key: string]: PropertyDefinition;
}

interface PropertyRendererProps {
  obj: any;
  prefix?: string;
  resourceType?: string;
  provider?: 'aws' | 'azure';
  onPropertyChange: (key: string, value: any) => void;
  metadata?: PropertyMetadata;
}

const PropertyRenderer: React.FC<PropertyRendererProps> = ({ 
  obj, 
  prefix = '', 
  onPropertyChange,
  metadata = {}
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
    // Skip rendering metadata properties that aren't meant for display
    if (key === 'type' || key === 'required') {
      return null;
    }

    const fullKey = prefix ? `${prefix}.${key}` : key;
    const propMetadata = metadata[key] || {};
    const isRequired = propMetadata.required === true;
    const propertyType = propMetadata.type || typeof value;
    const propertyOptions = propMetadata.options;
    
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      return (
        <div key={fullKey} className="ml-4 mt-3">
          <div className="text-sm font-medium mb-1">
            {key}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </div>
          <PropertyRenderer 
            obj={value} 
            prefix={fullKey} 
            onPropertyChange={onPropertyChange}
            metadata={metadata}
          />
        </div>
      );
    } else if (Array.isArray(value)) {
      return (
        <div key={fullKey} className="ml-4 mt-3">
          <div className="text-sm font-medium mb-1">
            {key} (array)
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </div>
          {value.map((item, index) => (
            <div key={`${fullKey}-${index}`} className="ml-4">
              {typeof item === 'object' && item !== null ? (
                <PropertyRenderer 
                  obj={item} 
                  prefix={`${fullKey}[${index}]`} 
                  onPropertyChange={onPropertyChange}
                  metadata={metadata}
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
      // Handle different property types with appropriate input controls
      return (
        <div key={fullKey} className="flex flex-col space-y-1 mt-3">
          <label htmlFor={`property-${fullKey}`} className="text-sm font-medium">
            {key}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
            {propMetadata.description && (
              <span className="text-xs text-muted-foreground ml-1">
                ({propMetadata.description})
              </span>
            )}
          </label>
          
          {/* Dropdown for properties with options */}
          {propertyOptions && propertyOptions.length > 0 ? (
            <Select
              value={value as string}
              onValueChange={(newValue) => onPropertyChange(key, newValue)}
            >
              <SelectTrigger className="text-xs">
                <SelectValue placeholder={propertyOptions[0]} />
              </SelectTrigger>
              <SelectContent>
                {propertyOptions.map((option) => (
                  <SelectItem key={option} value={option} className="text-xs">
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : propertyType === 'boolean' ? (
            <div className="flex items-center space-x-2">
              <Switch
                id={`property-switch-${fullKey}`}
                checked={Boolean(value)}
                onCheckedChange={(checked) => onPropertyChange(key, checked)}
              />
              <Label htmlFor={`property-switch-${fullKey}`} className="text-xs">
                {Boolean(value) ? 'Enabled' : 'Disabled'}
              </Label>
            </div>
          ) : (
            <Input
              id={`property-${fullKey}`}
              value={String(value ?? '')}
              type={propertyType === 'number' ? 'number' : 'text'}
              onChange={(e) => {
                const newValue = propertyType === 'number' ? 
                  Number(e.target.value) : e.target.value;
                onPropertyChange(key, newValue);
              }}
              className="text-xs"
            />
          )}
        </div>
      );
    }
  }).filter(Boolean); // Filter out null entries (like type and required)
};

export default PropertyRenderer;
