
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ResourceItem } from '@/types/resource';
import ConnectionItem from './ConnectionItem';

interface ConnectionsTabProps {
  resource: ResourceItem;
  allResources: ResourceItem[];
  onAddConnection: () => void;
  onUpdateConnection: (index: number, field: string, value: string) => void;
  onRemoveConnection: (index: number) => void;
}

const ConnectionsTab: React.FC<ConnectionsTabProps> = ({
  resource,
  allResources,
  onAddConnection,
  onUpdateConnection,
  onRemoveConnection,
}) => {
  const connections = resource.connections || [];
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium">Connections</h4>
        <Button 
          onClick={onAddConnection}
          variant="outline"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Connection
        </Button>
      </div>
      
      {connections.length > 0 ? (
        <div className="space-y-4">
          {connections.map((connection, index) => (
            <ConnectionItem
              key={index}
              connection={connection}
              index={index}
              allResources={allResources}
              sourceResourceId={resource.id}
              onUpdateConnection={onUpdateConnection}
              onRemoveConnection={onRemoveConnection}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-6 border rounded-md">
          <p className="text-muted-foreground">No connections defined</p>
          <Button 
            variant="link" 
            onClick={onAddConnection}
            className="text-sm"
          >
            Add a connection
          </Button>
        </div>
      )}
    </div>
  );
};

export default ConnectionsTab;
