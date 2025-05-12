
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDrag, useDrop } from 'react-dnd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
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
import { ResourceItem, ArchitectureDesign, Connection, ResourceExport } from '@/types/resource';
import { useToast } from '@/hooks/use-toast';
import ResourcePropertiesPanel from './ResourcePropertiesPanel';
import { ResizablePanelGroup, ResizablePanel } from '@/components/ui/resizable';
import { AWS_Resources } from '../Config/Resources/AWS_Resources';
import { Azure_Resources } from '../Config/Resources/Azure_Resources';

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

const DragDropDesignerContent: React.FC<DragDropDesignerProps> = ({ 
  provider, 
  isAiGenerated,
  placedResources,
  setPlacedResources,
  onProviderChange
}) => {
  const location = useLocation();
  const { toast } = useToast();
  const [resources, setResources] = useState<ResourceItem[]>(provider === 'aws' ? AWS_Resources : Azure_Resources);
  const [resourcePanelOpen, setResourcePanelOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);
  const [isDraggingFromSidebar, setIsDraggingFromSidebar] = useState(false);
  const [isTrashHovering, setIsTrashHovering] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Log resources to debug
  useEffect(() => {
    console.log("Current provider:", provider);
    console.log("Available resources:", provider === 'aws' ? AWS_Resources : Azure_Resources);
  }, [provider]);

  // Use type assertion to ensure TypeScript recognizes these as ResourceItem arrays
  const awsResourceItems = AWS_Resources as unknown as ResourceItem[];
  const azureResourceItems = Azure_Resources as unknown as ResourceItem[];
  
  const resourceItems = initialProvider === 'aws' ? awsResourceItems : azureResourceItems;
  
  // Generate a unique ID for new resource based on type and existing resources
  const generateResourceId = (resourceType: string) => {
    const typeResources = placedResources.filter(r => 
      r.id.startsWith(`${initialProvider}-${resourceType}`)
    );
    
    const nextNumber = typeResources.length + 1;
    return `${initialProvider}-${resourceType}-${nextNumber}`;
  };
  
  // Generate a name for the resource based on type and existing resources
  const generateResourceName = (resourceType: string) => {
    const typeResources = placedResources.filter(r => 
      r.name.toLowerCase().includes(resourceType.toLowerCase())
    );
    
    const nextNumber = typeResources.length + 1;
    return `${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}_${nextNumber}`;
  };
  
  const handleDragStart = (item: ResourceItem) => {
    setDraggedItem({...item, id: `${item.id}-${Date.now()}`});
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (draggedItem) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Generate a proper ID and name for the resource
      const resourceType = draggedItem.type;
      const resourceId = generateResourceId(resourceType);
      const resourceName = generateResourceName(resourceType);
      
      const newItem = {
        ...draggedItem, 
        id: resourceId,
        name: resourceName,
        x, 
        y
      };
      
      // Make sure newItem.icon exists before adding the resource
      if (!newItem.icon) {
        // Use a default icon based on the resource type
        newItem.icon = newItem.type === 'database' ? Database :
                      newItem.type === 'compute' ? Server :
                      newItem.type === 'network' ? Network : 
                      newItem.type === 'security' ? Shield : 
                      Cloud;
      }
      
      setPlacedResources([...placedResources, newItem]);
      setDraggedItem(null);
      
      toast({
        title: "Resource Added",
        description: `${resourceName} has been added to your architecture.`,
      });
    }
  };

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
    const newResources = placedResources.map(resource =>
      resource.id === id ? { ...resource, x: clientOffset.x, y: clientOffset.y } : resource
    );
    setPlacedResources(newResources);
  };

  const removeResource = (id: string) => {
    const newResources = placedResources.filter(resource => resource.id !== id);
    setPlacedResources(newResources);
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
    const [{ isDragging }, drag] = useDrag<ResourceItem, unknown, { isDragging: boolean }>({
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
    
    if (referencingResources.length > 0) {
      // Remove connections that reference this resource
      const updatedResources = placedResources.map(resource => {
        if (resource.connections?.some(conn => conn.targetId === resourceId)) {
          return {
            ...resource,
            connections: resource.connections.filter(conn => conn.targetId !== resourceId)
          };
        }
        return resource;
      });
      
      // Then remove the resource itself
      setPlacedResources(updatedResources.filter(item => item.id !== resourceId));
    } else {
      // No references, just remove the resource
      setPlacedResources(placedResources.filter(item => item.id !== resourceId));
    }
    
    if (selectedResource && selectedResource.id === resourceId) {
      setSelectedResource(null);
      setPropertiesOpen(false);
    }
    
    toast({
      title: "Resource Deleted",
      description: "The resource has been removed from your architecture.",
    });
  };

  const exportArchitecture = () => {
    // Create clean export by filtering out metadata properties
    const cleanResources = placedResources.map(resource => {
      // Clean up properties to remove type and required metadata
      const cleanProperties: {[key: string]: any} = {};
      
      if (resource.properties) {
        Object.entries(resource.properties).forEach(([key, value]) => {
          // Skip metadata properties
          if (key !== 'type' && key !== 'required') {
            // If value is an object, recursively clean it
            if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
              const cleanSubProperties: {[key: string]: any} = {};
              
              Object.entries(value).forEach(([subKey, subValue]) => {
                if (subKey !== 'type' && subKey !== 'required') {
                  cleanSubProperties[subKey] = subValue;
                }
              });
              
              cleanProperties[key] = cleanSubProperties;
            } else {
              cleanProperties[key] = value;
            }
          }
        });
      }
      
      return {
        id: resource.id,
        type: resource.terraformType || resource.type,
        properties: cleanProperties
      };
    });
    
    const architecture: ArchitectureDesign = {
      provider: initialProvider,
      region: placedResources.length > 0 && placedResources[0].properties?.region 
        ? placedResources[0].properties.region 
        : initialProvider === 'aws' ? 'us-east-1' : 'eastus',
      resources: cleanResources,
      variables: [],
      outputs: []
    };
    
    const jsonData = JSON.stringify(architecture, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${initialProvider}_architecture.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Architecture Exported",
      description: "Your architecture has been exported as JSON.",
    });
  };

  const handleZoomOut = () => {
    setZoomLevel(prevZoom => Math.max(prevZoom - 0.1, 0.5));
  };

  const handleZoomReset = () => {
    setZoomLevel(1);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Provider Selection */}
      <div className="flex justify-between bg-muted/50 dark:bg-navy-light border-b border-border p-2">
        <div className="flex space-x-2">
          <Button
            onClick={() => handleProviderChange('aws')}
            variant={initialProvider === 'aws' ? 'default' : 'outline'}
            className={initialProvider === 'aws' ? 'bg-aws text-black hover:bg-aws/90' : ''}
          >
            AWS
          </Button>
          <Button
            onClick={() => handleProviderChange('azure')}
            variant={initialProvider === 'azure' ? 'default' : 'outline'}
            className={initialProvider === 'azure' ? 'bg-azure text-white hover:bg-azure/90' : ''}
          >
            Azure
          </Button>
        </div>
        
        <div className="flex space-x-2">
          {isCreatingConnection && (
            <Button
              onClick={handleCancelConnection}
              variant="outline"
              className="text-destructive border-destructive"
            >
              Cancel Connection
            </Button>
          )}
          <Button
            onClick={exportArchitecture}
            variant="outline"
            disabled={placedResources.length === 0}
          >
            Export Architecture
          </Button>
        </div>
      </div>
      
      <ResizablePanelGroup direction="horizontal" className="flex-grow">
        {/* Resource Panel */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <div className="bg-white dark:bg-navy-light border-r border-border overflow-y-auto p-4 h-full">
            <h3 className="font-semibold mb-4">Resources</h3>
            
            <div className="space-y-3">
              {resourceItems.map((item) => {
                // Make sure item.icon exists before rendering
                if (!item.icon) {
                  // Use a default icon based on the resource type
                  item.icon = item.type === 'database' ? Database :
                              item.type === 'compute' ? Server :
                              item.type === 'network' ? Network : 
                              item.type === 'security' ? Shield : 
                              Cloud;
                }

                return (
                  <div
                    key={item.id}
                    className="drag-item p-3 bg-muted/50 dark:bg-navy/50 rounded-lg flex items-center cursor-move hover:bg-muted dark:hover:bg-navy transition-colors"
                    draggable
                    onDragStart={() => handleDragStart(item)}
                  >
                    <div className={`w-8 h-8 ${getProviderColorClass(item.provider)} rounded-md flex items-center justify-center mr-3`}>
                      {React.createElement(item.icon, { className: "h-4 w-4" })}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs text-muted-foreground capitalize">{item.type}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 pt-4 border-t border-border">
              <h3 className="font-semibold mb-2">Instructions</h3>
              <p className="text-xs text-muted-foreground mb-2">
                Drag resources from the panel and drop them onto the canvas to create your architecture.
              </p>
              <p className="text-xs text-muted-foreground mb-2">
                Click and drag to move resources around the canvas.
              </p>
              <p className="text-xs text-muted-foreground">
                Use the link icon on each resource to create connections between resources.
              </p>
            </div>
          </div>
        </ResizablePanel>
        
        {/* Design Canvas */}
        <ResizablePanel defaultSize={80}>
          <div 
            className="canvas-area relative h-full overflow-auto"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleCancelConnection}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            ref={canvasRef}
          >
            {/* Connection lines between resources */}
            {renderConnections()}
            
            {placedResources.map((item) => {
              // Make sure item.icon exists before rendering
              if (!item.icon) {
                // Use a default icon based on the resource type
                item.icon = item.type === 'database' ? Database :
                            item.type === 'compute' ? Server :
                            item.type === 'network' ? Network : 
                            item.type === 'security' ? Shield : 
                            Cloud;
              }

              return (
                <div
                  key={item.id}
                  className={`absolute shadow-md bg-white dark:bg-navy-light rounded-lg border ${
                    selectedResource?.id === item.id ? 'border-2 border-primary' : 'border-border'
                  } ${connectionStart === item.id ? 'ring-2 ring-blue-400' : ''} 
                  p-3 w-40 cursor-move hover:shadow-lg transition-shadow`}
                  style={{ 
                    left: `${item.x}px`, 
                    top: `${item.y}px`,
                    zIndex: draggingResource === item.id || selectedResource?.id === item.id ? 10 : 1
                  }}
                  onClick={(e) => handleResourceClick(item, e)}
                  onMouseDown={(e) => handleMouseDown(item.id, e)}
                >
                  <div className="flex items-center mb-1">
                    <div className={`w-6 h-6 ${getProviderColorClass(item.provider)} rounded-md flex items-center justify-center mr-2`}>
                      {React.createElement(item.icon, { className: "h-3 w-3" })}
                    </div>
                    <div className="font-medium text-sm truncate">{item.name}</div>
                  </div>
                  <div className="text-xs text-muted-foreground mb-1 truncate">{item.description}</div>
                  {item.count && item.count > 1 && (
                    <div className="text-xs font-semibold mb-1">Count: {item.count}</div>
                  )}
                  {item.terraformType && (
                    <div className="text-xs text-muted-foreground mb-1 truncate">{item.terraformType}</div>
                  )}
                  
                  <div className="flex justify-end space-x-1 mt-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => handleStartConnection(item.id, e)}
                      title="Create connection"
                    >
                      <Link className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleResourceClick(item, e);
                      }}
                      title="View details"
                    >
                      <Info className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteResource(item.id);
                      }}
                      title="Delete resource"
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
            
            {placedResources.length === 0 && (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Cloud className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <p>Drag and drop cloud resources here to build your architecture</p>
                </div>
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Resource Properties Panel */}
      {selectedResource && (
        <ResourcePropertiesPanel
          resource={selectedResource}
          onClose={() => {
            setResourcePanelOpen(false);
            setSelectedResource(null);
          }}
          onUpdate={(updatedResource) => {
            const updatedResources = placedResources.map(resource =>
              resource.id === updatedResource.id ? updatedResource : resource
            );
            setPlacedResources(updatedResources);
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
  const [{ isDragging }, drag] = useDrag<DragItem, unknown, { isDragging: boolean }>({
    type: ItemTypes.RESOURCE,
    item: resource,
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

// Wrap with DndProvider
const DragDropDesigner: React.FC<DragDropDesignerProps> = (props) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <DragDropDesignerContent {...props} />
    </DndProvider>
  );
};

export default DragDropDesigner;
