import React, { useState, useRef, useCallback } from 'react';
import { Database, Server, Cloud, Trash, Info, Network, Shield, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResourceItem, ArchitectureDesign, Connection, ResourceExport } from '@/types/resource';
import { useToast } from '@/hooks/use-toast';
import ResourcePropertiesPanel from './ResourcePropertiesPanel';
import { ResizablePanelGroup, ResizablePanel } from '@/components/ui/resizable';

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

  const awsResourceItems: ResourceItem[] = [
    {
      id: 'aws-ec2',
      type: 'compute',
      name: 'EC2 Instance',
      icon: Server,
      description: 'Scalable compute capacity in the cloud',
      provider: 'aws',
      cost: 35.04,
      costDetails: '1 instance × $0.0416/hour × 730 hours',
      terraformType: 'aws_instance'
    },
    {
      id: 'aws-s3',
      type: 'storage',
      name: 'S3 Bucket',
      icon: Database,
      description: 'Object storage built to retrieve any amount of data',
      provider: 'aws',
      cost: 23.00,
      costDetails: '500 GB × $0.023/GB',
      terraformType: 'aws_s3_bucket'
    },
    {
      id: 'aws-rds',
      type: 'database',
      name: 'RDS Database',
      icon: Database,
      description: 'Managed relational database service',
      provider: 'aws',
      cost: 178.25,
      costDetails: 'db.t3.medium, Multi-AZ deployment',
      terraformType: 'aws_db_instance'
    },
    {
      id: 'aws-vpc',
      type: 'network',
      name: 'VPC',
      icon: Network,
      description: 'Isolated cloud network with custom IP address range',
      provider: 'aws',
      cost: 0,
      costDetails: 'No hourly charges for VPC',
      terraformType: 'aws_vpc'
    },
    {
      id: 'aws-security-group',
      type: 'security',
      name: 'Security Group',
      icon: Shield,
      description: 'Virtual firewall to control inbound and outbound traffic',
      provider: 'aws',
      cost: 0,
      costDetails: 'No charges for security groups',
      terraformType: 'aws_security_group'
    },
    {
      id: 'aws-lb',
      type: 'network',
      name: 'Load Balancer',
      icon: Network,
      description: 'Distributes incoming traffic across targets',
      provider: 'aws',
      cost: 16.43,
      costDetails: '1 ALB × $0.0225/hour × 730 hours',
      terraformType: 'aws_lb'
    },
  ];
  
  const azureResourceItems: ResourceItem[] = [
    {
      id: 'azure-vm',
      type: 'compute',
      name: 'Virtual Machine',
      icon: Server,
      description: 'Highly available, scalable cloud compute resources',
      provider: 'azure',
      cost: 36.50,
      costDetails: '1 instance × $36.50 each',
      terraformType: 'azurerm_virtual_machine'
    },
    {
      id: 'azure-storage',
      type: 'storage',
      name: 'Blob Storage',
      icon: Database,
      description: 'Massively scalable object storage for unstructured data',
      provider: 'azure',
      cost: 18.40,
      costDetails: '500 GB × $0.0184/GB (Hot tier)',
      terraformType: 'azurerm_storage_account'
    },
    {
      id: 'azure-sql',
      type: 'database',
      name: 'Azure SQL',
      icon: Database,
      description: 'Intelligent, scalable, cloud database service',
      provider: 'azure',
      cost: 149.16,
      costDetails: 'Standard tier, 10 DTUs',
      terraformType: 'azurerm_sql_server'
    },
    {
      id: 'azure-vnet',
      type: 'network',
      name: 'Virtual Network',
      icon: Network,
      description: 'Isolated, private network in Azure',
      provider: 'azure',
      cost: 0,
      costDetails: 'No charges for virtual networks',
      terraformType: 'azurerm_virtual_network'
    },
    {
      id: 'azure-nsg',
      type: 'security',
      name: 'Network Security Group',
      icon: Shield,
      description: 'Filter network traffic to and from Azure resources',
      provider: 'azure',
      cost: 0,
      costDetails: 'No charges for NSGs',
      terraformType: 'azurerm_network_security_group'
    },
    {
      id: 'azure-lb',
      type: 'network',
      name: 'Load Balancer',
      icon: Network,
      description: 'Distribute network traffic across VMs',
      provider: 'azure',
      cost: 18.25,
      costDetails: '1 basic LB × $0.025/hour × 730 hours',
      terraformType: 'azurerm_lb'
    },
  ];
  
  const resourceItems = initialProvider === 'aws' ? awsResourceItems : azureResourceItems;
  
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
      
      const newItem = {...draggedItem, x, y};
      setPlacedResources([...placedResources, newItem]);
      setDraggedItem(null);
      
      toast({
        title: "Resource Added",
        description: `${draggedItem.name} has been added to your architecture.`,
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
    const architecture: ArchitectureDesign = {
      provider: initialProvider,
      region: placedResources.length > 0 && placedResources[0].properties?.region 
        ? placedResources[0].properties.region 
        : initialProvider === 'aws' ? 'us-east-1' : 'eastus',
      resources: placedResources.map(resource => ({
        id: resource.id,
        type: resource.terraformType || resource.type,
        name: resource.name,
        description: resource.description,
        provider: resource.provider,
        count: resource.count,
        properties: resource.properties || {},
        connections: resource.connections,
        cost: resource.cost,
        costDetails: resource.costDetails
      }))
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
              {resourceItems.map((item) => (
                <div
                  key={item.id}
                  className="drag-item p-3 bg-muted/50 dark:bg-navy/50 rounded-lg flex items-center cursor-move hover:bg-muted dark:hover:bg-navy transition-colors"
                  draggable
                  onDragStart={() => handleDragStart(item)}
                >
                  <div className={`w-8 h-8 ${getProviderColorClass(item.provider)} rounded-md flex items-center justify-center mr-3`}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="text-xs text-muted-foreground capitalize">{item.type}</div>
                  </div>
                </div>
              ))}
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
            
            {placedResources.map((item) => (
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
                    <item.icon className="h-3 w-3" />
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
            ))}
            
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
