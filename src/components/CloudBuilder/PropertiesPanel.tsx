
import React, { useState, useEffect } from 'react';
import { useReactFlow, Node } from '@xyflow/react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ComponentType } from '../../types/componentTypes';

interface PropertiesPanelProps {
  componentId: string;
  onClose: () => void;
}

// Default properties based on component type
const getDefaultProperties = (type: ComponentType) => {
  switch (type) {
    case ComponentType.SERVER:
    case ComponentType.VIRTUAL_MACHINE:
      return {
        cpu: '',
        memory: '',
        os: '',
        region: ''
      };
    case ComponentType.DATABASE:
    case ComponentType.CACHE:
      return {
        engine: '',
        version: '',
        storage: '',
        region: ''
      };
    case ComponentType.NETWORK:
    case ComponentType.LOAD_BALANCER:
      return {
        protocol: '',
        port: '',
        region: ''
      };
    case ComponentType.STORAGE:
    case ComponentType.BACKUP:
      return {
        type: '',
        size: '',
        region: ''
      };
    case ComponentType.API_GATEWAY:
    case ComponentType.QUEUE:
      return {
        throughput: '',
        region: ''
      };
    default:
      return {};
  }
};

const PropertiesPanel = ({ componentId, onClose }: PropertiesPanelProps) => {
  const { getNode, setNodes } = useReactFlow();
  const [label, setLabel] = useState('');
  const [properties, setProperties] = useState<Record<string, string>>({});
  const [newPropertyName, setNewPropertyName] = useState('');
  const [newPropertyValue, setNewPropertyValue] = useState('');
  
  const node = getNode(componentId);
  
  useEffect(() => {
    if (node) {
      setLabel(node.data.label || '');
      // Add type assertion to handle the unknown type
      setProperties(node.data.properties as Record<string, string> || {});
    }
  }, [node]);

  const updateNodeData = (newData: any) => {
    setNodes(nodes => 
      nodes.map(n => {
        if (n.id === componentId) {
          return {
            ...n,
            data: {
              ...n.data,
              ...newData
            }
          };
        }
        return n;
      })
    );
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value);
    updateNodeData({ label: e.target.value });
  };

  const handlePropertyChange = (key: string, value: string) => {
    const updatedProperties = { ...properties, [key]: value };
    setProperties(updatedProperties);
    updateNodeData({ properties: updatedProperties });
  };

  const handleAddProperty = () => {
    if (!newPropertyName.trim()) return;
    
    const updatedProperties = { 
      ...properties, 
      [newPropertyName]: newPropertyValue 
    };
    
    setProperties(updatedProperties);
    updateNodeData({ properties: updatedProperties });
    setNewPropertyName('');
    setNewPropertyValue('');
  };

  const handleRemoveProperty = (key: string) => {
    const { [key]: _, ...rest } = properties;
    setProperties(rest);
    updateNodeData({ properties: rest });
  };

  // If no node is selected or node doesn't exist
  if (!node) {
    return null;
  }

  return (
    <div className="w-72 border-l bg-card shadow-sm flex flex-col properties-panel animate-slide-in">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-medium">Properties</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="component-label">Label</Label>
            <Input
              id="component-label"
              value={label}
              onChange={handleLabelChange}
              className="mt-1"
            />
          </div>

          <Separator />
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Properties</h4>
            
            {Object.keys(properties).length > 0 ? (
              Object.entries(properties).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <div className="flex-1">
                    <Label htmlFor={`property-${key}`} className="text-xs text-muted-foreground">
                      {key}
                    </Label>
                    <Input
                      id={`property-${key}`}
                      value={value}
                      onChange={(e) => handlePropertyChange(key, e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveProperty(key)}
                    className="mt-5"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No properties set</p>
            )}
          </div>

          <Separator />
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Add Property</h4>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Name"
                  value={newPropertyName}
                  onChange={(e) => setNewPropertyName(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Input
                  placeholder="Value"
                  value={newPropertyValue}
                  onChange={(e) => setNewPropertyValue(e.target.value)}
                />
              </div>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleAddProperty}
              disabled={!newPropertyName.trim()}
              className="w-full"
            >
              Add
            </Button>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Suggested Properties</h4>
            <div className="flex flex-wrap gap-1">
              {Object.keys(getDefaultProperties(node.data.type as ComponentType)).map(prop => (
                !properties[prop] && (
                  <Button
                    key={prop}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setNewPropertyName(prop);
                    }}
                    className="text-xs"
                  >
                    {prop}
                  </Button>
                )
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default PropertiesPanel;
