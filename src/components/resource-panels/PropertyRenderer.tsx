
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
import { ScrollArea } from '@/components/ui/scroll-area';

interface PropertyRendererProps {
  obj: any;
  prefix?: string;
  onPropertyChange: (key: string, value: any) => void;
}

const PropertyRenderer: React.FC<PropertyRendererProps> = ({ 
  obj, 
  prefix = '', 
  onPropertyChange
}) => {
  return Object.entries(obj).map(([key, propValue]) => {
    // Skip rendering metadata properties that aren't meant for display
    if (key === 'type' || key === 'required' || key === 'options') {
      return null;
    }

    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    // Extract metadata properties if they exist
    let isRequired = false;
    let propertyType = 'string';
    let propertyOptions: string[] = [];
    
    // Handle the case where value is a ResourceProperty object with type, required, options
    if (propValue !== null && typeof propValue === 'object' && !Array.isArray(propValue)) {
      // Type guard to check if the property has the required fields
      if (Object.prototype.hasOwnProperty.call(propValue, 'required')) {
        isRequired = Boolean((propValue as ResourceProperty).required);
      }
      
      if (Object.prototype.hasOwnProperty.call(propValue, 'type')) {
        propertyType = String((propValue as ResourceProperty).type);
      }
      
      if (Object.prototype.hasOwnProperty.call(propValue, 'options') && 
          Array.isArray((propValue as ResourceProperty).options)) {
        propertyOptions = (propValue as ResourceProperty).options;
      }
      
      // Check if this is a metadata object or a nested object
      if ((Object.prototype.hasOwnProperty.call(propValue, 'type') || 
           Object.prototype.hasOwnProperty.call(propValue, 'required') || 
           Object.prototype.hasOwnProperty.call(propValue, 'options'))) {
        
        // If this object has value property or additional properties that aren't metadata
        if (Object.prototype.hasOwnProperty.call(propValue, 'value') || 
            Object.keys(propValue).some(k => 
              k !== 'type' && 
              k !== 'required' && 
              k !== 'options' && 
              k !== 'value')) {
          
          // Check if this is a nested object (not just a ResourceProperty with value)
          if (Object.keys(propValue).some(k => 
              k !== 'type' && 
              k !== 'required' && 
              k !== 'options' && 
              k !== 'value' && 
              typeof (propValue as any)[k] === 'object')) {
            
            // This is a nested object with properties, render recursively
            return (
              <div key={fullKey} className="ml-4 mt-3">
                <div className="text-sm font-medium mb-1">
                  {key}
                  {isRequired && <Asterisk className="h-3 w-3 inline ml-1 text-red-500" />}
                </div>
                <PropertyRenderer 
                  obj={propValue} 
                  prefix={fullKey} 
                  onPropertyChange={onPropertyChange}
                />
              </div>
            );
          }
        }
        
        // For objects with a "value" property or objects that should render a control
        const actualValue = Object.prototype.hasOwnProperty.call(propValue, 'value') 
          ? (propValue as any).value 
          : propValue;
        
        const selectedValue = actualValue !== undefined ? actualValue : 
                          (propertyOptions && propertyOptions.length > 0 ? propertyOptions[0] : '');
        
        // Render the appropriate input control
        return (
          <div key={fullKey} className="flex flex-col space-y-1 mt-3">
            <label htmlFor={`property-${fullKey}`} className="text-sm font-medium">
              {key}
              {isRequired && <Asterisk className="h-3 w-3 inline ml-1 text-red-500" />}
            </label>
            
            {propertyType === 'list' && propertyOptions && propertyOptions.length > 0 ? (
              <Select
                value={String(selectedValue)}
                onValueChange={(newValue) => {
                  const updatedValue = {...propValue, value: newValue};
                  onPropertyChange(key, updatedValue);
                }}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder={`Select ${key}`} />
                </SelectTrigger>
                <SelectContent className="bg-background">
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
                    const updatedValue = {...propValue, value: checked};
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
                value={String(selectedValue || '')}
                placeholder={`Fill in the ${key}`}
                type={propertyType === 'number' ? 'number' : 'text'}
                onChange={(e) => {
                  const newValue = propertyType === 'number' ? 
                    Number(e.target.value) : e.target.value;
                  const updatedValue = {...propValue, value: newValue};
                  onPropertyChange(key, updatedValue);
                }}
                className="text-xs placeholder:text-muted-foreground"
              />
            )}
          </div>
        );
      }
    }
    
    // Handle nested objects (without metadata)
    if (propValue !== null && typeof propValue === 'object' && !Array.isArray(propValue)) {
      return (
        <div key={fullKey} className="ml-4 mt-3">
          <div className="text-sm font-medium mb-1">
            {key}
            {isRequired && <Asterisk className="h-3 w-3 inline ml-1 text-red-500" />}
          </div>
          <PropertyRenderer 
            obj={propValue} 
            prefix={fullKey} 
            onPropertyChange={onPropertyChange}
          />
        </div>
      );
    } else if (Array.isArray(propValue)) {
      // Handle arrays
      return (
        <div key={fullKey} className="ml-4 mt-3">
          <div className="text-sm font-medium mb-1">
            {key} (array)
            {isRequired && <Asterisk className="h-3 w-3 inline ml-1 text-red-500" />}
          </div>
          {propValue.map((item, index) => (
            <div key={`${fullKey}-${index}`} className="ml-4">
              {typeof item === 'object' && item !== null ? (
                <PropertyRenderer 
                  obj={item} 
                  prefix={`${fullKey}[${index}]`} 
                  onPropertyChange={onPropertyChange}
                />
              ) : (
                <Input
                  value={String(item ?? '')}
                  placeholder={`Fill in ${key} item ${index+1}`}
                  onChange={(e) => {
                    const newArr = [...propValue];
                    newArr[index] = e.target.value;
                    onPropertyChange(key, newArr);
                  }}
                  className="mt-1 text-xs placeholder:text-muted-foreground"
                />
              )}
            </div>
          ))}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              const newArr = [...propValue, ''];
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
      const valueType = typeof propValue;
      
      return (
        <div key={fullKey} className="flex flex-col space-y-1 mt-3">
          <label htmlFor={`property-${fullKey}`} className="text-sm font-medium">
            {key}
            {isRequired && <Asterisk className="h-3 w-3 inline ml-1 text-red-500" />}
          </label>
          
          {propertyOptions && propertyOptions.length > 0 ? (
            <Select
              value={String(propValue)}
              onValueChange={(newValue) => onPropertyChange(key, newValue)}
            >
              <SelectTrigger className="text-xs">
                <SelectValue placeholder={`Select ${key}`} />
              </SelectTrigger>
              <SelectContent className="bg-background">
                {propertyOptions.map((option) => (
                  <SelectItem key={option} value={option} className="text-xs">
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : valueType === 'boolean' ? (
            <div className="flex items-center space-x-2">
              <Switch
                id={`property-switch-${fullKey}`}
                checked={Boolean(propValue)}
                onCheckedChange={(checked) => onPropertyChange(key, checked)}
              />
              <Label htmlFor={`property-switch-${fullKey}`} className="text-xs">
                {Boolean(propValue) ? 'Enabled' : 'Disabled'}
              </Label>
            </div>
          ) : (
            <Input
              id={`property-${fullKey}`}
              value={String(propValue ?? '')}
              placeholder={`Fill in the ${key}`}
              type={valueType === 'number' ? 'number' : 'text'}
              onChange={(e) => {
                const newValue = valueType === 'number' ? 
                  Number(e.target.value) : e.target.value;
                onPropertyChange(key, newValue);
              }}
              className="text-xs placeholder:text-muted-foreground"
            />
          )}
        </div>
      );
    }
  }).filter(Boolean); // Filter out null entries (like type, required and options)
};

export default PropertyRenderer;
