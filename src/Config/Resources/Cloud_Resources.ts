
import { ResourceItem } from '@/types/resource';
import { AWS_Resources } from "./AWS_Resources";
import { Azure_Resources } from "./Azure_Resources";

// Create properly typed arrays, ensuring deep copies to avoid reference issues
const typedAwsResources: ResourceItem[] = JSON.parse(JSON.stringify(AWS_Resources)) as ResourceItem[];
const typedAzureResources: ResourceItem[] = JSON.parse(JSON.stringify(Azure_Resources)) as ResourceItem[];

// Export the combined array with proper typing
export const Cloud_Resources: ResourceItem[] = [...typedAwsResources, ...typedAzureResources];
