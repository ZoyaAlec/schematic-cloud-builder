
import { ResourceItem } from '@/types/resource';
import { AWS_Resources } from "./AWS_Resources";
import { Azure_Resources } from "./Azure_Resources";

// Type assertion to ensure compatibility with ResourceItem interface
// Using double assertion to safely convert the types
export const Cloud_Resources = ([...AWS_Resources] as unknown as ResourceItem[])
  .concat([...Azure_Resources] as unknown as ResourceItem[]);
