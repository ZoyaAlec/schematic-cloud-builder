
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

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
  return Object.entries(obj).map(([key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      return (
        <div key={fullKey} className="ml-4 mt-2">
          <div className="text-xs font-medium mb-1">{key}:</div>
          <PropertyRenderer 
            obj={value} 
            prefix={fullKey} 
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
                  onPropertyChange={onPropertyChange} 
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
      return (
        <div key={fullKey} className="flex flex-col space-y-1 mt-1">
          <label htmlFor={`property-${fullKey}`} className="text-xs font-medium">{key}</label>
          <Input
            id={`property-${fullKey}`}
            value={String(value ?? '')}
            onChange={(e) => onPropertyChange(key, e.target.value)}
            className="text-xs"
          />
        </div>
      );
    }
  });
};

export default PropertyRenderer;
