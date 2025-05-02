
export enum ComponentType {
  SERVER = 'server',
  VIRTUAL_MACHINE = 'virtual-machine',
  DATABASE = 'database',
  CACHE = 'cache',
  NETWORK = 'network',
  LOAD_BALANCER = 'load-balancer',
  STORAGE = 'storage',
  BACKUP = 'backup',
  API_GATEWAY = 'api-gateway',
  QUEUE = 'queue',
}

export interface CloudComponent {
  id: string;
  type: ComponentType;
  position: {
    x: number;
    y: number;
  };
  data: {
    label: string;
    properties: Record<string, any>;
  };
}

export interface ConnectionLine {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
}
