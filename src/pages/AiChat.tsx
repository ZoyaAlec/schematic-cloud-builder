
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Cpu, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  type: 'ai' | 'user';
  content: string;
}

const initialMessages: Message[] = [
  {
    id: '1',
    type: 'ai',
    content: "Hello! I'm your DevCloud assistant. I'll help you design the optimal cloud architecture for your needs. Let's start with some basic questions about your project."
  },
  {
    id: '2',
    type: 'ai',
    content: "What type of application are you building? (e.g., web app, mobile backend, data processing, etc.)"
  }
];

const AiChat = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [userInput, setUserInput] = useState('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isComplete, setIsComplete] = useState(false);
  
  const questions = [
    "What type of application are you building? (e.g., web app, mobile backend, data processing, etc.)",
    "What's your expected user traffic? (e.g., low, medium, high, or specific numbers if available)",
    "Do you have any specific compliance requirements? (e.g., GDPR, HIPAA, etc.)",
    "What's your budget range for cloud resources?",
    "Do you require high availability or disaster recovery features?",
    "What are your data storage needs? (e.g., relational database, blob storage, etc.)"
  ];
  
  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    
    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: userInput
    };
    setMessages([...messages, newUserMessage]);
    
    // Save answer to current question
    setAnswers({
      ...answers,
      [questions[questionIndex]]: userInput
    });
    
    // Clear input
    setUserInput('');
    
    // Simulate AI response delay
    setTimeout(() => {
      const nextQuestionIndex = questionIndex + 1;
      
      if (nextQuestionIndex < questions.length) {
        // Add next question
        const newAiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: questions[nextQuestionIndex]
        };
        setMessages(prev => [...prev, newAiMessage]);
        setQuestionIndex(nextQuestionIndex);
      } else {
        // All questions answered
        const completionMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: "Thank you for providing all the information! I'm now analyzing your requirements to create the optimal cloud architecture design. This will just take a moment..."
        };
        setMessages(prev => [...prev, completionMessage]);
        
        // Simulate analysis time
        setTimeout(() => {
          const analysisCompleteMessage: Message = {
            id: (Date.now() + 2).toString(),
            type: 'ai',
            content: "I've completed the analysis of your requirements and prepared two cloud architecture designs - one for AWS and one for Azure. You can now compare them side by side."
          };
          setMessages(prev => [...prev, analysisCompleteMessage]);
          setIsComplete(true);
        }, 3000);
      }
    }, 1000);
  };
  
  const handleCompare = () => {
    toast({
      title: "Analysis Complete",
      description: "Your cloud architectures have been designed and are ready for comparison.",
    });
    navigate('/comparison-view');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showAuth={false} />
      
      <div className="flex-grow container mx-auto py-6 px-4 flex flex-col">
        <div className="max-w-3xl mx-auto w-full flex-grow flex flex-col">
          <div className="bg-muted/40 rounded-t-lg p-4 flex items-center">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-4">
              <Cpu className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">DevCloud AI Assistant</h1>
              <p className="text-sm text-muted-foreground">Designing your optimal cloud architecture</p>
            </div>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-grow bg-white dark:bg-navy-light rounded-b-lg border border-border shadow-sm overflow-y-auto p-4 mb-4" style={{ maxHeight: 'calc(100vh - 300px)' }}>
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
          {!isComplete ? (
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
          ) : (
            <div className="flex justify-center">
              <Button onClick={handleCompare} className="cloud-btn-primary">
                Compare AWS and Azure Solutions
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
          
          <div className="mt-6 flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => navigate('/design-options')}
            >
              Back to Design Options
            </Button>
          </div>
        </div>
      </div>
      
      <footer className="bg-navy text-white py-4 px-6">
        <div className="container mx-auto text-center text-sm">
          © 2025 DevCloud. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default AiChat;
