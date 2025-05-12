
import { ResourceItem } from '@/types/resource';
import { AWS_Resources } from "./AWS_Resources";
import { Azure_Resources } from "./Azure_Resources";

// Create properly typed arrays
const typedAwsResources: ResourceItem[] = AWS_Resources as unknown as ResourceItem[];
const typedAzureResources: ResourceItem[] = Azure_Resources as unknown as ResourceItem[];

// Export the combined array with proper typing
export const Cloud_Resources: ResourceItem[] = [...typedAwsResources, ...typedAzureResources];
