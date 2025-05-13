
import { LucideIcon } from 'lucide-react';

export interface Connection {
  sourceId: string;
  targetId: string;
  type: string;
}

export interface ResourceProperty {
  type: string;
  required: boolean;
  options: string[];
  value?: any; // Adding value property to store the actual value
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
    [key: string]: ResourceProperty | {[key: string]: any};
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
