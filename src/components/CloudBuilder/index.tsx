
import React from 'react';
import Sidebar from './Sidebar';
import Canvas from './Canvas';
import PropertiesPanel from './PropertiesPanel';
import Toolbar from './Toolbar';
import { useState } from 'react';
import { ComponentType } from '../../types/componentTypes';
import { ReactFlowProvider } from '@xyflow/react';

const CloudBuilder = () => {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [savedDesigns, setSavedDesigns] = useState<Record<string, any>[]>([]);
  const [currentDesignName, setCurrentDesignName] = useState<string>('Untitled Design');

  const handleComponentSelect = (id: string | null) => {
    setSelectedComponent(id);
  };

  const handleSaveDesign = (nodes: any, edges: any) => {
    const newDesign = {
      id: Date.now().toString(),
      name: currentDesignName,
      nodes,
      edges,
      updatedAt: new Date().toISOString()
    };
    
    setSavedDesigns(prev => [...prev, newDesign]);
    // Show toast notification
    console.log('Design saved:', newDesign);
  };

  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-screen overflow-hidden bg-background">
        <Toolbar 
          designName={currentDesignName} 
          onDesignNameChange={setCurrentDesignName}
          onSaveDesign={handleSaveDesign}
        />
        
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          
          <div className="flex-1 relative">
            <Canvas 
              onComponentSelect={handleComponentSelect}
              onSaveRequest={handleSaveDesign}
            />
          </div>
          
          {selectedComponent && (
            <PropertiesPanel 
              componentId={selectedComponent}
              onClose={() => setSelectedComponent(null)}
            />
          )}
        </div>
      </div>
    </ReactFlowProvider>
  );
};

export default CloudBuilder;
