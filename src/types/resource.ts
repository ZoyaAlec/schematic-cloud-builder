
import { LucideIcon } from 'lucide-react';

export interface ResourceProperty {
  name: string;
  value: string;
  description?: string;
  type?: 'string' | 'number' | 'boolean' | 'object';
  required?: boolean;
  options?: string[];
}

export interface Connection {
  sourceId: string;
  targetId: string;
  type: string;
}

export interface ResourceItem {
  id: string;
  type: string;
  name: string;
  description?: string;
  provider: 'aws' | 'azure';
  cost: number;
  costDetails?: string;
  terraformType?: string;
  icon?: LucideIcon;
  x?: number;
  y?: number;
  count?: number;
  connections?: Connection[];
  properties?: {
    [key: string]: any;
  };
}

// For architecture export without UI-specific properties
export interface ResourceExport {
  id: string;
  type: string;
  properties?: {
    [key: string]: any;
  };
}

export interface ArchitectureDesign {
  provider: 'aws' | 'azure';
  region: string;
  resources: ResourceExport[];
  name?: string;
  description?: string;
  variables: any[];
  outputs: any[];
}
