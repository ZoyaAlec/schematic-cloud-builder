import React, { useState, useRef, useCallback } from 'react';
import { Database, Server, Cloud, Trash, Info, Network, Shield, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResourceItem, ArchitectureDesign, Connection, ResourceExport } from '@/types/resource';
import { useToast } from '@/hooks/use-toast';
import ResourcePropertiesPanel from './ResourcePropertiesPanel';
import { ResizablePanelGroup, ResizablePanel } from '@/components/ui/resizable';
import { AWS_Resources } from '../Config/Resources/AWS_Resources';
import { Azure_Resources } from '../Config/Resources/Azure_Resources';

interface DragDropDesignerProps {
  provider: 'aws' | 'azure';
  isAiGenerated?: boolean;
  placedResources: ResourceItem[];
  setPlacedResources: React.Dispatch<React.SetStateAction<ResourceItem[]>>;
  onProviderChange: (provider: 'aws' | 'azure') => void;
}

const DragDropDesigner: React.FC<DragDropDesignerProps> = ({ 
  provider: initialProvider, 
  isAiGenerated = false,
  placedResources,
  setPlacedResources,
  onProviderChange
}) => {
  const [draggedItem, setDraggedItem] = useState<ResourceItem | null>(null);
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);
  const [propertiesOpen, setPropertiesOpen] = useState(false);
  const [draggingResource, setDraggingResource] = useState<string | null>(null);
  const [draggingPosition, setDraggingPosition] = useState({ x: 0, y: 0 });
  const [isCreatingConnection, setIsCreatingConnection] = useState(false);
  const [connectionStart, setConnectionStart] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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

  const handleProviderChange = (provider: 'aws' | 'azure') => {
    onProviderChange(provider);
    setSelectedResource(null);
    setPropertiesOpen(false);
  };

  const handleResourceClick = (resource: ResourceItem, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isCreatingConnection) {
      if (connectionStart && connectionStart !== resource.id) {
        // Create a new connection between resources
        const newConnection: Connection = {
          sourceId: connectionStart,
          targetId: resource.id,
          type: 'depends_on'
        };
        
        // Add connection to source resource
        const sourceResource = placedResources.find(r => r.id === connectionStart);
        if (sourceResource) {
          const updatedResource = { 
            ...sourceResource, 
            connections: [...(sourceResource.connections || []), newConnection] 
          };
          
          const updatedResources = placedResources.map(item => 
            item.id === connectionStart ? updatedResource : item
          );
          
          setPlacedResources(updatedResources);
          setSelectedResource(updatedResource);
          
          toast({
            title: "Connection Created",
            description: `Connected ${sourceResource.name} to ${resource.name}`,
          });
        }
        
        setIsCreatingConnection(false);
        setConnectionStart(null);
      } else {
        setConnectionStart(resource.id);
      }
    } else {
      setSelectedResource(resource);
      setPropertiesOpen(true);
    }
  };

  const handleStartConnection = (resourceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCreatingConnection(true);
    setConnectionStart(resourceId);
    
    toast({
      title: "Creating Connection",
      description: "Click on another resource to create a connection",
    });
  };

  const handleMouseDown = (resourceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isCreatingConnection) {
      setDraggingResource(resourceId);
      setDraggingPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (draggingResource) {
      const dx = e.clientX - draggingPosition.x;
      const dy = e.clientY - draggingPosition.y;
      
      setPlacedResources(resources => resources.map(resource => {
        if (resource.id === draggingResource) {
          return {
            ...resource,
            x: (resource.x || 0) + dx,
            y: (resource.y || 0) + dy
          };
        }
        return resource;
      }));
      
      setDraggingPosition({ x: e.clientX, y: e.clientY });
    }
  }, [draggingResource, draggingPosition]);

  const handleMouseUp = () => {
    setDraggingResource(null);
  };

  const handleCancelConnection = (e: React.MouseEvent) => {
    if (isCreatingConnection) {
      e.stopPropagation();
      setIsCreatingConnection(false);
      setConnectionStart(null);
      
      toast({
        title: "Connection Canceled",
        description: "Connection creation canceled",
      });
    }
  };

  const handleCloseProperties = () => {
    setPropertiesOpen(false);
    setSelectedResource(null);
  };

  const handleUpdateResource = (updatedResource: ResourceItem) => {
    const updatedResources = placedResources.map(item => 
      item.id === updatedResource.id ? updatedResource : item
    );
    setPlacedResources(updatedResources);
  };

  const handleDeleteResource = (resourceId: string) => {
    // First check if this resource is referenced by others
    const referencingResources = placedResources.filter(resource => 
      resource.connections?.some(conn => conn.targetId === resourceId)
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
  
  const getProviderColorClass = (providerType: 'aws' | 'azure') => {
    return providerType === 'aws' ? 'bg-aws text-black' : 'bg-azure text-white';
  };

  // Calculate connection lines between resources
  const renderConnections = () => {
    const connectionElements: JSX.Element[] = [];
    
    placedResources.forEach(resource => {
      const connections = resource.connections || [];
      
      connections.forEach((connection, index) => {
        const sourceResource = resource;
        const targetResource = placedResources.find(r => r.id === connection.targetId);
        
        if (sourceResource && targetResource) {
          const sourceX = (sourceResource.x || 0) + 20;
          const sourceY = (sourceResource.y || 0) + 20;
          const targetX = (targetResource.x || 0) + 20;
          const targetY = (targetResource.y || 0) + 20;
          
          // Calculate the angle for the arrow marker
          const angle = Math.atan2(targetY - sourceY, targetX - sourceX) * 180 / Math.PI;
          
          connectionElements.push(
            <g key={`${sourceResource.id}-${targetResource.id}-${index}`}>
              <line
                x1={sourceX}
                y1={sourceY}
                x2={targetX}
                y2={targetY}
                stroke={connection.type === 'depends_on' ? '#6366f1' : '#22c55e'}
                strokeWidth={2}
                strokeDasharray={connection.type === 'reference' ? '5,5' : 'none'}
                markerEnd="url(#arrowhead)"
              />
              {/* Connection type label */}
              <text
                x={(sourceX + targetX) / 2}
                y={(sourceY + targetY) / 2 - 5}
                textAnchor="middle"
                fontSize="10"
                fill="currentColor"
                className="bg-white dark:bg-navy-light px-1 rounded"
              >
                {connection.type}
              </text>
            </g>
          );
        }
      });
    });
    
    return (
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
          </marker>
        </defs>
        {connectionElements}
      </svg>
    );
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
      <ResourcePropertiesPanel 
        resource={selectedResource} 
        onClose={handleCloseProperties}
        onUpdate={handleUpdateResource}
        allResources={placedResources}
        open={propertiesOpen}
      />
    </div>
  );
};

export default DragDropDesigner;
