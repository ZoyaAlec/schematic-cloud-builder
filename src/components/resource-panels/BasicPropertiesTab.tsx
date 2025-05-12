
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ResourceItem } from '@/types/resource';
import PropertyRenderer from './PropertyRenderer';

interface BasicPropertiesTabProps {
  resource: ResourceItem;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onCountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPropertyChange: (key: string, value: any) => void;
  resourceType?: string;
  provider?: 'aws' | 'azure';
}

const BasicPropertiesTab: React.FC<BasicPropertiesTabProps> = ({
  resource,
  onNameChange,
  onDescriptionChange,
  onCountChange,
  onPropertyChange,
  resourceType,
  provider
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Resource Name
          </label>
          <Input
            id="name"
            placeholder="My Resource"
            value={resource.name}
            onChange={onNameChange}
            className="w-full"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description
          </label>
          <Textarea
            id="description"
            placeholder="Resource description"
            value={resource.description}
            onChange={onDescriptionChange}
            className="w-full"
          />
        </div>
        
        <div>
          <label htmlFor="count" className="block text-sm font-medium mb-1">
            Count (number of instances)
          </label>
          <Input
            id="count"
            type="number"
            min="1"
            placeholder="1"
            value={resource.count || 1}
            onChange={onCountChange}
            className="w-full"
          />
        </div>
      </div>
      
      {resource.properties && Object.keys(resource.properties).length > 0 && (
        <>
          <h4 className="font-medium mt-4">Basic Properties</h4>
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
    </div>
  );
};

export default BasicPropertiesTab;
