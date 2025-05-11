
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { ResourceItem, Connection } from '@/types/resource';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ConnectionItemProps {
  connection: Connection;
  index: number;
  allResources: ResourceItem[];
  sourceResourceId: string;
  onUpdateConnection: (index: number, field: string, value: string) => void;
  onRemoveConnection: (index: number) => void;
}

const ConnectionItem: React.FC<ConnectionItemProps> = ({
  connection,
  index,
  allResources,
  sourceResourceId,
  onUpdateConnection,
  onRemoveConnection,
}) => {
  return (
    <div className="p-3 border rounded-md space-y-3">
      <div className="flex justify-between items-center">
        <h5 className="text-sm font-medium">Connection {index + 1}</h5>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemoveConnection(index)}
          className="h-7 w-7 text-destructive"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-2">
        <label className="text-xs font-medium">Type</label>
        <Select
          value={connection.type}
          onValueChange={(value) => onUpdateConnection(index, 'type', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select connection type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="depends_on">Depends On</SelectItem>
            <SelectItem value="reference">Reference</SelectItem>
            <SelectItem value="attached_to">Attached To</SelectItem>
            <SelectItem value="belongs_to">Belongs To</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label className="text-xs font-medium">Target Resource</label>
        <Select
          value={connection.targetId}
          onValueChange={(value) => onUpdateConnection(index, 'targetId', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select target resource" />
          </SelectTrigger>
          <SelectContent>
            {allResources
              .filter(res => res.id !== sourceResourceId)
              .map(res => (
                <SelectItem key={res.id} value={res.id}>{res.name}</SelectItem>
              ))
            }
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ConnectionItem;
