
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Save, 
  Download, 
  Upload, 
  Trash2,
  ZoomIn, 
  ZoomOut, 
  Download as DownloadIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { useReactFlow } from '@xyflow/react';

interface ToolbarProps {
  designName: string;
  onDesignNameChange: (name: string) => void;
  onSaveDesign: (nodes: any, edges: any) => void;
}

const Toolbar = ({ designName, onDesignNameChange, onSaveDesign }: ToolbarProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { getNodes, getEdges, zoomIn: reactFlowZoomIn, zoomOut: reactFlowZoomOut, fitView } = useReactFlow();

  const handleSave = () => {
    const nodes = getNodes();
    const edges = getEdges();
    onSaveDesign(nodes, edges);
  };

  const handleExport = () => {
    try {
      const nodes = getNodes();
      const edges = getEdges();
      
      const exportData = {
        nodes,
        edges,
        metadata: {
          name: designName,
          exportedAt: new Date().toISOString()
        }
      };
      
      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${designName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.json`;
      a.click();
      
      URL.revokeObjectURL(url);
      toast.success('Design exported successfully');
    } catch (error) {
      toast.error('Failed to export design');
      console.error('Export error:', error);
    }
  };

  const handleNameClick = () => {
    setIsEditing(true);
  };

  const handleNameBlur = () => {
    setIsEditing(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
    }
  };

  // Fixed the zoom functions by wrapping them
  const handleZoomIn = () => {
    reactFlowZoomIn();
  };

  const handleZoomOut = () => {
    reactFlowZoomOut();
  };

  return (
    <div className="h-14 border-b bg-card flex items-center justify-between px-4">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-primary mr-4">Cloud Builder</h1>
        
        {isEditing ? (
          <Input
            value={designName}
            onChange={(e) => onDesignNameChange(e.target.value)}
            onBlur={handleNameBlur}
            onKeyDown={handleNameKeyDown}
            className="w-64 h-8"
            autoFocus
          />
        ) : (
          <div 
            className="text-sm font-medium hover:bg-accent hover:text-accent-foreground px-2 py-1 rounded cursor-pointer"
            onClick={handleNameClick}
          >
            {designName}
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={handleZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="outline" onClick={handleZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="outline" onClick={() => fitView()}>
          Fit
        </Button>
        
        <Button size="sm" variant="outline" onClick={handleExport}>
          <DownloadIcon className="h-4 w-4 mr-1" /> Export
        </Button>
        
        <Button size="sm" onClick={handleSave}>
          <Save className="h-4 w-4 mr-1" /> Save
        </Button>
      </div>
    </div>
  );
};

export default Toolbar;
