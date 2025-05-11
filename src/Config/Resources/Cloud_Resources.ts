
import { AWS_Resources } from "./AWS_Resources";
import { Azure_Resources } from "./Azure_Resources";

// Merge both resource lists into one array
export const Cloud_Resources = ([].concat(Azure_Resources)).concat(AWS_Resources);

// Helper functions
export const getResourceProperties = (type: string, provider: 'aws' | 'azure') => {
  const resource = Cloud_Resources.find(r => 
    r.type === type && r.provider === provider
  );
  
  return resource?.properties || [];
};

export const getResourcePropertyOptions = (
  type: string, 
  provider: 'aws' | 'azure', 
  propertyName: string
) => {
  const resource = Cloud_Resources.find(r => 
    r.type === type && r.provider === provider
  );
  
  const property = resource?.properties?.find(p => p.name === propertyName);
  return property?.options || [];
};
