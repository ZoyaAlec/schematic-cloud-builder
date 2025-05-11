
import { supabase as supabaseClient } from '@/integrations/supabase/client';
import { ArchitectureDesign } from '@/types/resource';

// Authentication functions
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabaseClient.auth.getUser();
    if (error) {
      console.error('Error getting user:', error);
      return null;
    }
    return data.user;
  } catch (err) {
    console.error('Error in getCurrentUser:', err);
    return null;
  }
};

export const signOut = async () => {
  const { error } = await supabaseClient.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
};

// Architecture design functions
export const saveArchitecture = async (architecture: ArchitectureDesign) => {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('You must be logged in to save an architecture');
  }
  
  // Determine resource type based on provider
  const resourceType = `${architecture.provider}_architecture`;
  
  // Create the properties object
  const properties = {
    provider: architecture.provider,
    region: architecture.region,
    resources: architecture.resources
  };
  
  // Insert using the new table schema
  const { data, error } = await supabaseClient
    .from('architectures')
    .insert({
      user_id: user.id,
      name: architecture.name || 'Untitled Architecture',
      description: architecture.description || '',
      resource_type: resourceType,
      properties: properties
    })
    .select();

  if (error) {
    throw new Error(error.message);
  }
  
  return data[0];
};

export const getUserArchitectures = async () => {
  const user = await getCurrentUser();
  
  if (!user) {
    return [];
  }
  
  const { data, error } = await supabaseClient
    .from('architectures')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching architectures:', error);
    return [];
  }
  
  return data;
};

export const getArchitectureById = async (id: string) => {
  const { data, error } = await supabaseClient
    .from('architectures')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

export const updateArchitecture = async (id: string, architecture: Partial<ArchitectureDesign>) => {
  // Create an update object based on the new schema
  const updateObject: any = {};
  
  if (architecture.name) {
    updateObject.name = architecture.name;
  }
  
  if (architecture.description) {
    updateObject.description = architecture.description;
  }
  
  // If resources or other properties are updated, update the properties JSONB field
  if (architecture.resources || architecture.region || architecture.provider) {
    // First get the current record
    const { data: currentData } = await supabaseClient
      .from('architectures')
      .select('properties')
      .eq('id', id)
      .single();
      
    if (currentData) {
      const updatedProperties = { ...currentData.properties };
      
      if (architecture.provider) {
        updatedProperties.provider = architecture.provider;
      }
      
      if (architecture.region) {
        updatedProperties.region = architecture.region;
      }
      
      if (architecture.resources) {
        updatedProperties.resources = architecture.resources;
      }
      
      updateObject.properties = updatedProperties;
    }
  }
  
  updateObject.updated_at = new Date().toISOString();
  
  const { data, error } = await supabaseClient
    .from('architectures')
    .update(updateObject)
    .eq('id', id)
    .select();

  if (error) {
    throw new Error(error.message);
  }
  
  return data[0];
};

export const deleteArchitecture = async (id: string) => {
  const { error } = await supabaseClient
    .from('architectures')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
  
  return true;
};

// Export the supabase client directly
export const supabase = supabaseClient;
