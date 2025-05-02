
import React from 'react';
import { 
  Server, 
  Database, 
  Cloud, 
  HardDrive, 
  Network, 
  Globe, 
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ComponentType } from '../../types/componentTypes';

const componentCategories = [
  {
    name: 'Compute',
    components: [
      { type: ComponentType.SERVER, icon: Server, label: 'Server' },
      { type: ComponentType.VIRTUAL_MACHINE, icon: HardDrive, label: 'VM' },
    ]
  },
  {
    name: 'Database',
    components: [
      { type: ComponentType.DATABASE, icon: Database, label: 'Database' },
      { type: ComponentType.CACHE, icon: Database, label: 'Cache' },
    ]
  },
  {
    name: 'Network',
    components: [
      { type: ComponentType.NETWORK, icon: Network, label: 'Network' },
      { type: ComponentType.LOAD_BALANCER, icon: Globe, label: 'Load Balancer' },
    ]
  },
  {
    name: 'Storage',
    components: [
      { type: ComponentType.STORAGE, icon: HardDrive, label: 'Storage' },
      { type: ComponentType.BACKUP, icon: Cloud, label: 'Backup' },
    ]
  },
  {
    name: 'Services',
    components: [
      { type: ComponentType.API_GATEWAY, icon: Layers, label: 'API Gateway' },
      { type: ComponentType.QUEUE, icon: Layers, label: 'Queue' },
    ]
  },
];

const Sidebar = () => {
  const onDragStart = (event: React.DragEvent, nodeType: ComponentType) => {
    // Store the node type in the drag event
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 border-r bg-card shadow-sm flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Components</h2>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4">
          {componentCategories.map((category, i) => (
            <div key={i} className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {category.name}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {category.components.map((component, j) => (
                  <div
                    key={j}
                    draggable
                    onDragStart={(event) => onDragStart(event, component.type)}
                    className="flex flex-col items-center justify-center p-3 rounded-md border bg-background hover:bg-accent hover:text-accent-foreground cursor-grab transition-colors"
                  >
                    <component.icon className="h-6 w-6 mb-2" />
                    <span className="text-xs font-medium">{component.label}</span>
                  </div>
                ))}
              </div>
              {i < componentCategories.length - 1 && (
                <Separator className="my-4" />
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;
