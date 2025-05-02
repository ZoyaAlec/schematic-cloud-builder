
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { 
  Server, 
  Database, 
  Cloud, 
  HardDrive, 
  Network, 
  Globe, 
  Layers,
  Box
} from 'lucide-react';
import { ComponentType } from '../../../types/componentTypes';

interface CloudComponentProps {
  id: string;
  data: {
    type: ComponentType;
    label: string;
    properties: Record<string, any>;
  }
  selected: boolean;
}

const getIcon = (type: ComponentType) => {
  switch (type) {
    case ComponentType.SERVER:
      return Server;
    case ComponentType.DATABASE:
      return Database;
    case ComponentType.NETWORK:
      return Network;
    case ComponentType.VIRTUAL_MACHINE:
      return HardDrive;
    case ComponentType.STORAGE:
      return HardDrive;
    case ComponentType.LOAD_BALANCER:
      return Globe;
    case ComponentType.API_GATEWAY:
      return Layers;
    case ComponentType.QUEUE:
      return Layers;
    case ComponentType.CACHE:
      return Database;
    case ComponentType.BACKUP:
      return Cloud;
    default:
      return Box;
  }
};

const getIconColor = (type: ComponentType) => {
  switch (type) {
    case ComponentType.SERVER:
    case ComponentType.VIRTUAL_MACHINE:
      return '#3b82f6'; // Blue
    case ComponentType.DATABASE:
    case ComponentType.CACHE:
      return '#0ea5e9'; // Teal
    case ComponentType.NETWORK:
    case ComponentType.LOAD_BALANCER:
      return '#818cf8'; // Indigo
    case ComponentType.STORAGE:
    case ComponentType.BACKUP:
      return '#22c55e'; // Green
    case ComponentType.API_GATEWAY:
    case ComponentType.QUEUE:
      return '#f97316'; // Orange
    default:
      return '#64748b'; // Gray
  }
};

const CloudComponent: React.FC<CloudComponentProps> = ({ data, selected }) => {
  const Icon = getIcon(data.type);
  const iconColor = getIconColor(data.type);

  return (
    <div 
      className={`component flex flex-col items-center p-4 rounded-lg border-2 ${
        selected ? 'border-cloud-blue bg-blue-50' : 'border-gray-200 bg-white'
      }`}
      style={{ width: 120, height: 120 }}
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-3 rounded-full border-2 border-white bg-cloud-blue" 
      />
      
      <Icon style={{ color: iconColor }} className="w-10 h-10 mb-2" />
      <div className="text-center">
        <div className="font-medium text-sm truncate w-full mb-1">{data.label}</div>
        {Object.keys(data.properties).length > 0 && (
          <div className="text-xs text-muted-foreground truncate w-full">
            {Object.keys(data.properties).length} properties
          </div>
        )}
      </div>
      
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-3 h-3 rounded-full border-2 border-white bg-cloud-blue" 
      />
    </div>
  );
};

export default memo(CloudComponent);
