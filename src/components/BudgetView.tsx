
import React from 'react';
import { DollarSign } from 'lucide-react';
import { ResourceItem } from '@/types/resource';

interface BudgetViewProps {
  provider: 'aws' | 'azure';
  isAiGenerated?: boolean;
  placedResources: ResourceItem[];
}

const BudgetView: React.FC<BudgetViewProps> = ({ provider, isAiGenerated = false, placedResources }) => {
  // Filter resources by provider
  const filteredResources = placedResources.filter(resource => resource.provider === provider);
  const totalCost = filteredResources.reduce((sum, item) => sum + item.cost, 0);
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Budget Estimate</h2>
        <p className="text-muted-foreground">
          Monthly cost breakdown for your cloud architecture
        </p>
      </div>
      
      <div className="cloud-card p-6 mb-8">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
          <div>
            <h3 className="text-xl font-semibold">Total Monthly Cost</h3>
            <p className="text-muted-foreground">Estimated cost for all resources</p>
          </div>
          <div className="text-3xl font-bold flex items-center">
            <DollarSign className={`h-7 w-7 ${provider === 'aws' ? 'text-aws' : 'text-azure'}`} />
            <span>{totalCost.toFixed(2)}</span>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4">Detailed Breakdown</h4>
          
          <div className="space-y-4">
            {filteredResources.length > 0 ? (
              filteredResources.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">{item.costDetails}</div>
                  </div>
                  <div className="text-lg font-semibold flex items-center">
                    <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{item.cost.toFixed(2)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <p>No resources added yet. Add resources in the Design tab to see cost estimates.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="cloud-card p-6">
        <h3 className="text-xl font-semibold mb-4">Cost Optimization Tips</h3>
        
        <ul className="space-y-3">
          <li className="flex items-start">
            <div className="w-6 h-6 bg-secondary/10 rounded-full flex items-center justify-center mr-3 mt-0.5">
              <span className="text-secondary font-medium">1</span>
            </div>
            <div>
              <p>Consider reserved instances for stable workloads to reduce costs by up to 72%.</p>
            </div>
          </li>
          <li className="flex items-start">
            <div className="w-6 h-6 bg-secondary/10 rounded-full flex items-center justify-center mr-3 mt-0.5">
              <span className="text-secondary font-medium">2</span>
            </div>
            <div>
              <p>Implement auto-scaling to match capacity with demand and avoid over-provisioning.</p>
            </div>
          </li>
          <li className="flex items-start">
            <div className="w-6 h-6 bg-secondary/10 rounded-full flex items-center justify-center mr-3 mt-0.5">
              <span className="text-secondary font-medium">3</span>
            </div>
            <div>
              <p>Use lower-cost storage tiers for infrequently accessed data.</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BudgetView;
