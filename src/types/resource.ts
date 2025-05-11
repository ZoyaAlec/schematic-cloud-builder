
import { LucideIcon } from 'lucide-react';

export interface ResourceProperty {
  name: string;
  value: string;
  description?: string;
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
  icon: LucideIcon;
  description: string;
  provider: 'aws' | 'azure';
  cost: number;
  costDetails?: string;
  x?: number;
  y?: number;
  count?: number;
  terraformType?: string;
  properties?: {
    [key: string]: any;
  };
  connections?: Connection[];
}

// For architecture export without UI-specific properties
export interface ResourceExport {
  id: string;
  type: string;
  name: string;
  description: string;
  provider: 'aws' | 'azure';
  count?: number;
  properties: {
    [key: string]: any;
  };
  connections?: Connection[];
  cost?: number;
  costDetails?: string;
}

export interface ArchitectureDesign {
  id?: string;
  name?: string;
  description?: string;
  provider: 'aws' | 'azure';
  region: string;
  resources: ResourceExport[];
  connections?: Connection[];
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

