import React, { useState } from 'react';
import { Shield, AlertTriangle, Check, FileCheck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from '@/hooks/use-toast';

interface ComplianceViewProps {
  provider: 'aws' | 'azure';
}

const ComplianceView: React.FC<ComplianceViewProps> = ({ provider }) => {
  const { toast } = useToast();
  const [activeComplianceId, setActiveComplianceId] = useState<string | null>(null);
  
  const getComplianceData = () => {
    const baseCompliance = [
      {
        id: 'gdpr',
        name: 'GDPR',
        status: 'compliant',
        details: 'General Data Protection Regulation compliance for EU data subjects.'
      },
      {
        id: 'hipaa',
        name: 'HIPAA',
        status: 'warning',
        details: 'Health Insurance Portability and Accountability Act compliance for healthcare data.'
      },
      {
        id: 'pci',
        name: 'PCI DSS',
        status: 'non-compliant',
        details: 'Payment Card Industry Data Security Standard for organizations that handle credit cards.'
      },
      {
        id: 'iso',
        name: 'ISO 27001',
        status: 'compliant',
        details: 'International standard for information security management.'
      },
      {
        id: 'sox',
        name: 'SOX',
        status: 'warning',
        details: 'Sarbanes-Oxley Act compliance for financial reporting.'
      }
    ];
    
    const securityRisks = [
      {
        id: 'risk-1',
        name: 'Public S3 Bucket Access',
        severity: 'high',
        recommendation: 'Ensure all S3 buckets have proper access controls.',
        provider: 'aws'
      },
      {
        id: 'risk-2',
        name: 'Unencrypted Database',
        severity: 'high',
        recommendation: 'Enable encryption at rest for all database services.',
        provider: 'both'
      },
      {
        id: 'risk-3',
        name: 'Default Security Groups',
        severity: 'medium',
        recommendation: 'Review and restrict default security group rules.',
        provider: 'both'
      },
      {
        id: 'risk-4',
        name: 'Blob Storage Public Access',
        severity: 'high',
        recommendation: 'Restrict public access to blob storage containers.',
        provider: 'azure'
      },
      {
        id: 'risk-5',
        name: 'Insufficient Logging',
        severity: 'medium',
        recommendation: 'Enable comprehensive logging across all services.',
        provider: 'both'
      }
    ];
    
    return {
      compliance: baseCompliance,
      securityRisks: securityRisks.filter(risk => 
        risk.provider === 'both' || risk.provider === provider
      )
    };
  };
  
  const { compliance, securityRisks } = getComplianceData();
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'non-compliant':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-500 bg-red-50';
      case 'medium':
        return 'text-amber-500 bg-amber-50';
      case 'low':
        return 'text-green-500 bg-green-50';
      default:
        return 'text-gray-500 bg-gray-50';
    }
  };
  
  const getRecommendationsForCompliance = (id: string) => {
    const recommendations = {
      'hipaa': [
        'Encrypt all patient data at rest and in transit',
        'Implement access controls and audit logs',
        'Create data backup and disaster recovery plans',
        'Establish business associate agreements with vendors'
      ],
      'pci': [
        'Install and maintain firewall configuration',
        'Encrypt transmission of cardholder data',
        'Use and regularly update anti-virus software',
        'Restrict access to cardholder data',
        'Implement strong access control measures'
      ],
      'sox': [
        'Document all financial controls',
        'Implement segregation of duties',
        'Establish audit trails for financial data',
        'Regular testing of controls effectiveness'
      ]
    };
    
    return recommendations[id as keyof typeof recommendations] || [];
  };

  const handleViewRecommendations = (id: string) => {
    setActiveComplianceId(id);
  };

  const handleViewPenetrationTestReport = () => {
    toast({
      title: "Penetration Test Report",
      description: "The full penetration test report has been downloaded to your device.",
    });
  };
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Compliance & Security</h2>
        <p className="text-muted-foreground">
          Review compliance status and security recommendations for your cloud architecture
        </p>
      </div>
      
      {/* Compliance Standards */}
      <div className="cloud-card p-6 mb-8">
        <div className="flex items-center mb-6">
          <Shield className="h-6 w-6 text-primary mr-2" />
          <h3 className="text-xl font-semibold">Compliance Standards</h3>
        </div>
        
        <div className="space-y-6">
          {compliance.map((item) => (
            <div key={item.id} className="flex items-start">
              <div className="mr-4 mt-1">
                {getStatusIcon(item.status)}
              </div>
              <div>
                <div className="flex items-center mb-1">
                  <h4 className="font-semibold mr-2">{item.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.status === 'compliant' ? 'bg-green-100 text-green-800' : 
                    item.status === 'warning' ? 'bg-amber-100 text-amber-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {item.status === 'compliant' ? 'Compliant' : 
                     item.status === 'warning' ? 'Action Needed' : 
                     'Non-Compliant'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{item.details}</p>
                
                {item.status !== 'compliant' && (
                  <div className="mt-2">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          variant="ghost"
                          className="text-sm text-primary hover:underline p-0 h-auto font-normal"
                          onClick={() => handleViewRecommendations(item.id)}
                        >
                          View Recommendations
                        </Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Recommendations for {item.name}</SheetTitle>
                          <SheetDescription>
                            Follow these recommendations to improve your compliance status.
                          </SheetDescription>
                        </SheetHeader>
                        <div className="mt-6">
                          {getRecommendationsForCompliance(item.id).map((rec, index) => (
                            <div key={index} className="flex items-start mb-4">
                              <div className="mr-2 mt-0.5 text-green-500">
                                <FileCheck size={18} />
                              </div>
                              <p>{rec}</p>
                            </div>
                          ))}
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Security Risks */}
      <div className="cloud-card p-6 mb-8">
        <div className="flex items-center mb-6">
          <AlertTriangle className="h-6 w-6 text-amber-500 mr-2" />
          <h3 className="text-xl font-semibold">Security Risks</h3>
        </div>
        
        <div className="space-y-4">
          {securityRisks.map((risk) => (
            <div key={risk.id} className="rounded-lg border border-border p-4">
              <div className="flex justify-between items-start">
                <h4 className="font-semibold">{risk.name}</h4>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getSeverityColor(risk.severity)}`}>
                  {risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1)} Risk
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{risk.recommendation}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Penetration Test Results */}
      <div className="cloud-card p-6">
        <h3 className="text-xl font-semibold mb-4">Penetration Test Results</h3>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Security Score</span>
            <span className="text-sm font-bold">72/100</span>
          </div>
          <div className="w-full bg-muted h-2 rounded-full">
            <div className="bg-amber-500 h-2 rounded-full" style={{ width: '72%' }}></div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Last test: 7 days ago</p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              <span>Critical Vulnerabilities</span>
            </div>
            <span className="font-semibold">2</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
              <span>Medium Vulnerabilities</span>
            </div>
            <span className="font-semibold">5</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span>Low Vulnerabilities</span>
            </div>
            <span className="font-semibold">8</span>
          </div>
        </div>
        
        <div className="mt-6">
          <Button 
            variant="ghost" 
            className="text-sm text-primary hover:underline p-0 h-auto font-normal"
            onClick={handleViewPenetrationTestReport}
          >
            View Full Penetration Test Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ComplianceView;
