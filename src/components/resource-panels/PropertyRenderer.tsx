
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Asterisk } from 'lucide-react';
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
  onPropertyChange: (key: string, value: any) => void;
  metadata?: PropertyMetadata;
}

const PropertyRenderer: React.FC<PropertyRendererProps> = ({ 
  obj, 
  prefix = '', 
  onPropertyChange,
  metadata = {}
}) => {
  return Object.entries(obj).map(([key, value]) => {
    // Skip rendering metadata properties that aren't meant for display
    if (key === 'type' || key === 'required' || key === 'options') {
      return null;
    }

    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    // Extract metadata properties if they exist
    let isRequired = false;
    let propertyType: 'string' | 'number' | 'boolean' | 'object' = 'string';
    let propertyOptions: string[] | undefined;
    
    // Handle the case where value is a metadata object with type, required, options
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      if ('required' in value) {
        isRequired = Boolean(value.required);
      }
      
      if ('type' in value) {
        // Convert the type string to our allowed types
        const typeValue = String(value.type);
        if (typeValue === 'string' || typeValue === 'number' || typeValue === 'boolean' || typeValue === 'object') {
          propertyType = typeValue as 'string' | 'number' | 'boolean' | 'object';
        }
      }
      
      if ('options' in value && Array.isArray(value.options)) {
        propertyOptions = value.options as string[];
      }
      
      // Check if this is a metadata object or a nested object
      if (('type' in value || 'required' in value || 'options' in value) && 
          !('value' in value) && Object.keys(value).some(k => k !== 'type' && k !== 'required' && k !== 'options')) {
        // This is a nested object with properties, render recursively
        return (
          <div key={fullKey} className="ml-4 mt-3">
            <div className="text-sm font-medium mb-1">
              {key}
              {isRequired && <Asterisk className="h-3 w-3 inline ml-1 text-red-500" />}
            </div>
            <PropertyRenderer 
              obj={value} 
              prefix={fullKey} 
              onPropertyChange={onPropertyChange}
              metadata={metadata}
            />
          </div>
        );
      }
      
      // For objects with a "value" property, access that value
      if ('value' in value) {
        const actualValue = (value as any).value;
        const selectedValue = actualValue !== undefined ? actualValue : 
                            (propertyOptions && propertyOptions.length > 0 ? propertyOptions[0] : '');
        
        // Render the appropriate input control
        return (
          <div key={fullKey} className="flex flex-col space-y-1 mt-3">
            <label htmlFor={`property-${fullKey}`} className="text-sm font-medium">
              {key}
              {isRequired && <Asterisk className="h-3 w-3 inline ml-1 text-red-500" />}
            </label>
            
            {propertyOptions && propertyOptions.length > 0 ? (
              <Select
                value={String(selectedValue)}
                onValueChange={(newValue) => {
                  const updatedValue = {...value, value: newValue};
                  onPropertyChange(key, updatedValue);
                }}
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
                  checked={Boolean(selectedValue)}
                  onCheckedChange={(checked) => {
                    const updatedValue = {...value, value: checked};
                    onPropertyChange(key, updatedValue);
                  }}
                />
                <Label htmlFor={`property-switch-${fullKey}`} className="text-xs">
                  {Boolean(selectedValue) ? 'Enabled' : 'Disabled'}
                </Label>
              </div>
            ) : (
              <Input
                id={`property-${fullKey}`}
                value={String(selectedValue ?? '')}
                type={propertyType === 'number' ? 'number' : 'text'}
                onChange={(e) => {
                  const newValue = propertyType === 'number' ? 
                    Number(e.target.value) : e.target.value;
                  const updatedValue = {...value, value: newValue};
                  onPropertyChange(key, updatedValue);
                }}
                className="text-xs"
              />
            )}
          </div>
        );
      }
    }
    
    // Handle nested objects (without metadata)
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      return (
        <div key={fullKey} className="ml-4 mt-3">
          <div className="text-sm font-medium mb-1">
            {key}
            {isRequired && <Asterisk className="h-3 w-3 inline ml-1 text-red-500" />}
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
      // Handle arrays
      return (
        <div key={fullKey} className="ml-4 mt-3">
          <div className="text-sm font-medium mb-1">
            {key} (array)
            {isRequired && <Asterisk className="h-3 w-3 inline ml-1 text-red-500" />}
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
                    onPropertyChange(key, newArr);
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
              onPropertyChange(key, newArr);
            }}
            className="mt-1 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" /> Add Item
          </Button>
        </div>
      );
    } else {
      // Handle basic values (string, number, boolean)
      // Determine the property type based on the actual value
      const valueType = typeof value;
      const displayType: 'boolean' | 'number' | 'string' = 
        valueType === 'boolean' ? 'boolean' : 
        valueType === 'number' ? 'number' : 'string';
      
      return (
        <div key={fullKey} className="flex flex-col space-y-1 mt-3">
          <label htmlFor={`property-${fullKey}`} className="text-sm font-medium">
            {key}
            {isRequired && <Asterisk className="h-3 w-3 inline ml-1 text-red-500" />}
          </label>
          
          {propertyOptions && propertyOptions.length > 0 ? (
            <Select
              value={String(value)}
              onValueChange={(newValue) => onPropertyChange(key, newValue)}
              defaultValue={propertyOptions[0]}
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
          ) : displayType === 'boolean' ? (
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
              type={displayType === 'number' ? 'number' : 'text'}
              onChange={(e) => {
                const newValue = displayType === 'number' ? 
                  Number(e.target.value) : e.target.value;
                onPropertyChange(key, newValue);
              }}
              className="text-xs"
            />
          )}
        </div>
      );
    }
  }).filter(Boolean); // Filter out null entries (like type, required and options)
};

export default PropertyRenderer;
