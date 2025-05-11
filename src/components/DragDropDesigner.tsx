import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDrag, useDrop } from 'react-dnd';
import { ItemTypes } from '@/types/itemTypes';
import { AWS_Resources } from '@/Config/Resources/AWS_Resources';
import { Azure_Resources } from '@/Config/Resources/Azure_Resources';
import { ResourceItem } from '@/types/resource';
import { Cloud_Resources } from '@/Config/Resources/Cloud_Resources';
import ResourcePropertiesPanel from '@/components/ResourcePropertiesPanel';
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DragItem {
  id: string;
  type: string;
  name: string;
  icon: any;
  description: string;
  provider: 'aws' | 'azure';
  cost: number;
  costDetails?: string;
}

interface DropCollectedProps {
  isOver: boolean;
}

interface DragDropDesignerProps {
  provider: 'aws' | 'azure';
  isAiGenerated: boolean;
  placedResources: ResourceItem[];
  setPlacedResources: (resources: ResourceItem[]) => void;
  onProviderChange: (provider: 'aws' | 'azure') => void;
}

const DragDropDesigner: React.FC<DragDropDesignerProps> = ({ 
  provider, 
  isAiGenerated,
  placedResources,
  setPlacedResources,
  onProviderChange
}) => {
  const location = useLocation();
  const { toast } = useToast();
  const [resources, setResources] = useState(provider === 'aws' ? AWS_Resources : Azure_Resources);
  const [resourcePanelOpen, setResourcePanelOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);
  const [isDraggingFromSidebar, setIsDraggingFromSidebar] = useState(false);
  const [isTrashHovering, setIsTrashHovering] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setResources(provider === 'aws' ? AWS_Resources : Azure_Resources);
    onProviderChange(provider);
  }, [provider, onProviderChange]);

  const handleProviderChange = (newProvider: 'aws' | 'azure') => {
    onProviderChange(newProvider);
    setResources(newProvider === 'aws' ? AWS_Resources : Azure_Resources);
  };

  const [, drop] = useDrop<DragItem, any, DropCollectedProps>({
    accept: ItemTypes.RESOURCE,
    drop: (item: DragItem, monitor) => {
      if (isDraggingFromSidebar) {
        // Add new resource
        addResource(item);
      } else {
        // Update existing resource position
        updateResourcePosition(item.id, monitor.getClientOffset() || { x: 0, y: 0 });
      }
      setIsDraggingFromSidebar(false);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const addResource = (item: DragItem) => {
    const newResource: ResourceItem = {
      ...item,
      id: `${item.type}-${Date.now()}`,
      x: 100,
      y: 100,
      count: 1,
      properties: {}
    };
    setPlacedResources([...placedResources, newResource]);
  };

  const updateResourcePosition = (id: string, clientOffset: { x: number, y: number }) => {
    setPlacedResources(prevResources =>
      prevResources.map(resource =>
        resource.id === id ? { ...resource, x: clientOffset.x, y: clientOffset.y } : resource
      )
    );
  };

  const removeResource = (id: string) => {
    setPlacedResources(prevResources => prevResources.filter(resource => resource.id !== id));
    toast({
      title: "Resource Removed",
      description: "The resource has been removed from the design.",
    });
  };

  const onDragStart = () => {
    setIsDraggingFromSidebar(true);
  };

  const onDragEnd = (event: any) => {
    const { active, over } = event;

    if (over && over.id === 'trash') {
      removeResource(active.id);
    }
  };

  const Resource = ({ resource }: { resource: ResourceItem }) => {
    const [{ isDragging }, drag] = useDrag({
      type: ItemTypes.RESOURCE,
      item: resource,
      end: (item, monitor) => {
        if (!monitor.didDrop()) {
          updateResourcePosition(item.id, monitor.getClientOffset() || { x: 0, y: 0 });
        }
        onDragEnd({ active: item, over: monitor.getDropResult() });
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const handleResourceClick = (resourceId: string) => {
      const clickedResource = placedResources.find(r => r.id === resourceId);
      if (clickedResource) {
        setSelectedResource(clickedResource);
        setResourcePanelOpen(true);
      }
    };

    return (
      <div
        ref={drag}
        style={{
          position: 'absolute',
          left: resource.x,
          top: resource.y,
          opacity: isDragging ? 0.5 : 1,
          cursor: 'move',
          zIndex: isDragging ? 1000 : 'auto',
        }}
        className="resource-item"
        onClick={() => handleResourceClick(resource.id)}
      >
        <div className="flex flex-col items-center justify-center p-2 rounded-md shadow-md bg-white dark:bg-gray-800">
          {resource.icon ? <resource.icon size={24} /> : <div>{resource.type}</div>}
          <div className="text-xs font-semibold mt-1">{resource.name}</div>
        </div>
      </div>
    );
  };

  const Trash = () => {
    const [{ isOver }, drop] = useDrop(() => ({
      accept: ItemTypes.RESOURCE,
      drop: () => ({ name: 'Trash' }),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
      hover: (item, monitor) => {
        setIsTrashHovering(monitor.isOver({ shallow: true }));
      },
    }));

    return (
      <div ref={drop} className="absolute bottom-4 right-4">
        <div className={`p-3 rounded-full ${isTrashHovering ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
          <Trash2 size={20} />
        </div>
      </div>
    );
  };

  const handleZoomIn = () => {
    setZoomLevel(prevZoom => Math.min(prevZoom + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prevZoom => Math.max(prevZoom - 0.1, 0.5));
  };

  const handleZoomReset = () => {
    setZoomLevel(1);
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 dark:bg-gray-900 border-r border-border p-4 flex flex-col">
        <h2 className="text-lg font-semibold mb-4">Resources</h2>

        <div className="mb-4">
          <Select value={provider} onValueChange={(value) => handleProviderChange(value as 'aws' | 'azure')}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select cloud provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aws">AWS</SelectItem>
              <SelectItem value="azure">Azure</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-grow overflow-y-auto">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="bg-white dark:bg-gray-800 rounded-md shadow-sm p-3 mb-2 cursor-grab"
              draggable
              onDragStart={() => onDragStart()}
            >
              <DragItemComponent resource={resource} />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow relative" ref={containerRef}>
        <div
          ref={drop}
          className="w-full h-full relative"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}
        >
          {placedResources.map((resource) => (
            <Resource key={resource.id} resource={resource} />
          ))}
          <Trash />
        </div>

        {/* Zoom Controls */}
        <div className="absolute top-4 left-4 bg-white dark:bg-gray-700 rounded-md shadow-md p-2 flex flex-col">
          <Button size="icon" onClick={handleZoomIn}><span className="text-xl">+</span></Button>
          <Button size="icon" onClick={handleZoomOut}><span className="text-xl">-</span></Button>
          <Button size="icon" onClick={handleZoomReset}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-cw"><path d="M21 12a9 9 0 0 0-9-9L3 3"/><path d="M3 8v4h4"/><path d="M3 12a9 9 0 0 0 9 9l9 0"/><path d="M21 16v-4h-4"/></svg>
          </Button>
        </div>
      </div>

      {/* Resource Properties Panel */}
      {selectedResource && (
        <ResourcePropertiesPanel
          resource={selectedResource}
          onClose={() => {
            setResourcePanelOpen(false);
            setSelectedResource(null);
          }}
          onUpdate={(updatedResource) => {
            setPlacedResources(prevResources =>
              prevResources.map(resource =>
                resource.id === updatedResource.id ? updatedResource : resource
              )
            );
          }}
          allResources={placedResources}
          open={resourcePanelOpen}
        />
      )}
    </div>
  );
};

interface DragItemComponentProps {
  resource: DragItem;
}

const DragItemComponent: React.FC<DragItemComponentProps> = ({ resource }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.RESOURCE,
    item: resource,
    begin: () => {
      return resource;
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
      }}
      className="flex items-center space-x-2"
    >
      {resource.icon && <resource.icon size={20} />}
      <span>{resource.name}</span>
    </div>
  );
};

export default DragDropDesigner;
