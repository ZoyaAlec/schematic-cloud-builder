
import React, { useState } from 'react';
import { Send, Database, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  type: 'ai' | 'user';
  content: string;
}

const ResourceManagement = () => {
  const [resourceName, setResourceName] = useState('');
  const [isNameSubmitted, setIsNameSubmitted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'll help you configure your cloud resources. Please enter the name of the resource you'd like to manage."
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  
  const questions = [
    "What type of resource is this? (e.g., compute instance, database, storage, etc.)",
    "What is the primary purpose of this resource?",
    "What performance tier do you need? (e.g., basic, standard, premium)",
    "Do you need high availability for this resource?",
    "What region should this resource be deployed in?",
    "Are there any specific security requirements for this resource?"
  ];
  
  const handleResourceNameSubmit = () => {
    if (!resourceName.trim()) return;
    
    // Add user message with resource name
    const newUserMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: resourceName
    };
    
    setMessages([...messages, newUserMessage]);
    
    // Add AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `Great! Let's configure "${resourceName}". ${questions[0]}`
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsNameSubmitted(true);
    }, 500);
  };
  
  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    
    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: userInput
    };
    setMessages([...messages, newUserMessage]);
    
    // Clear input
    setUserInput('');
    
    // Simulate AI response delay
    setTimeout(() => {
      const nextQuestionIndex = currentQuestion + 1;
      
      if (nextQuestionIndex < questions.length) {
        // Add next question
        const newAiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: questions[nextQuestionIndex]
        };
        setMessages(prev => [...prev, newAiMessage]);
        setCurrentQuestion(nextQuestionIndex);
      } else {
        // All questions answered
        const completionMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: `Thank you for providing the information about "${resourceName}". I'm now configuring this resource with the optimal settings based on your requirements. This will just take a moment...`
        };
        setMessages(prev => [...prev, completionMessage]);
        
        // Simulate configuration time
        setTimeout(() => {
          const configCompleteMessage: Message = {
            id: (Date.now() + 2).toString(),
            type: 'ai',
            content: `The "${resourceName}" has been successfully configured with the following settings:
              
• Type: ${userInput.includes('database') ? 'Database' : userInput.includes('storage') ? 'Storage' : 'Compute'}
• Region: US East
• Performance Tier: ${userInput.includes('premium') ? 'Premium' : userInput.includes('standard') ? 'Standard' : 'Basic'}
• High Availability: ${userInput.includes('high') || userInput.includes('availab') ? 'Enabled' : 'Disabled'}
• Auto-scaling: Enabled
• Encryption: Enabled

You can view and manage this resource in your cloud dashboard. Would you like me to help you configure another resource?`
          };
          setMessages(prev => [...prev, configCompleteMessage]);
          
          // Reset state for new resource configuration
          setCurrentQuestion(0);
          setIsNameSubmitted(false);
          setResourceName('');
        }, 2000);
      }
    }, 1000);
  };
  
  const getIconForResourceType = () => {
    if (resourceName.toLowerCase().includes('database') || resourceName.toLowerCase().includes('db')) {
      return <Database className="h-12 w-12 text-primary" />;
    } else {
      return <Server className="h-12 w-12 text-primary" />;
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      {!isNameSubmitted ? (
        <div className="cloud-card p-8 mb-8">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Database className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Manage Cloud Resources</h2>
            <p className="text-muted-foreground max-w-md">
              Enter the name of the cloud resource you want to configure, and our AI will guide you through the process.
            </p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-full max-w-md">
              <label htmlFor="resourceName" className="block text-sm font-medium mb-2">
                Resource Name
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="resourceName"
                  value={resourceName}
                  onChange={(e) => setResourceName(e.target.value)}
                  placeholder="e.g., Production Database, Web Server, etc."
                  className="flex-grow border border-border rounded-lg py-2 px-4 focus:outline-none focus:ring-1 focus:ring-primary"
                  onKeyPress={(e) => e.key === 'Enter' && handleResourceNameSubmit()}
                />
                <Button onClick={handleResourceNameSubmit}>
                  Continue
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Be as specific as possible to get the best configuration recommendations.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="cloud-card p-6 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
              {getIconForResourceType()}
            </div>
            <div>
              <h2 className="text-xl font-bold">{resourceName}</h2>
              <p className="text-sm text-muted-foreground">Resource Configuration</p>
            </div>
          </div>
          
          {/* Chat Messages */}
          <div className="bg-muted/30 rounded-lg mb-4 p-4 h-80 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'user' 
                        ? 'bg-primary text-white' 
                        : 'bg-muted'
                    } animate-slide-in`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Input Area */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your answer here..."
              className="flex-grow border border-border rounded-lg py-2 px-4 focus:outline-none focus:ring-1 focus:ring-primary"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button onClick={handleSendMessage}>
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      )}
      
      <div className="cloud-card p-6">
        <h3 className="text-xl font-semibold mb-4">Recent Resources</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-aws/20 rounded-md flex items-center justify-center mr-3">
                <Server className="h-4 w-4 text-aws" />
              </div>
              <div>
                <div className="font-medium">Production API Server</div>
                <div className="text-xs text-muted-foreground">EC2 • t3.medium • US East</div>
              </div>
            </div>
            <Button variant="outline" size="sm">Manage</Button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-azure/20 rounded-md flex items-center justify-center mr-3">
                <Database className="h-4 w-4 text-azure" />
              </div>
              <div>
                <div className="font-medium">User Database</div>
                <div className="text-xs text-muted-foreground">Azure SQL • Standard • US West</div>
              </div>
            </div>
            <Button variant="outline" size="sm">Manage</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceManagement;
