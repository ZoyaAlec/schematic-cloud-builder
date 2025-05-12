
import React, { useEffect } from 'react';
import { ResourceItem } from '@/types/resource';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface BasicPropertiesTabProps {
  resource: ResourceItem;
  onPropertyChange: (key: string, value: any) => void;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onCountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BasicPropertiesTab: React.FC<BasicPropertiesTabProps> = ({
  resource,
  onPropertyChange,
  onNameChange,
  onDescriptionChange,
  onCountChange,
}) => {
  // Initialize properties with options to their first value when the resource changes
  useEffect(() => {
    if (resource.properties) {
      // For each property that has metadata with options
      Object.entries(resource.properties).forEach(([key, value]) => {
        if (
          typeof value === 'object' && 
          value !== null && 
          !Array.isArray(value) && 
          'options' in value && 
          Array.isArray(value.options) && 
          value.options.length > 0 &&
          !value.value // Only set if value is not already set
        ) {
          // Set the property to the first option
          onPropertyChange(key, value.options[0]);
        }
      });
    }
  }, [resource.id, onPropertyChange]);

  return (
    <>
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">Name</label>
        <Input
          id="name"
          value={resource.name}
          onChange={onNameChange}
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">Description</label>
        <Textarea
          id="description"
          value={resource.description}
          onChange={onDescriptionChange}
          className="w-full"
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="count" className="text-sm font-medium">Count</label>
        <Input
          id="count"
          type="number"
          min="1"
          value={resource.count || 1}
          onChange={onCountChange}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">Number of instances to create</p>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-3">Resource Type</h4>
        <p className="text-muted-foreground capitalize">{resource.type}</p>
      </div>
    </>
  );
};

export default BasicPropertiesTab;
