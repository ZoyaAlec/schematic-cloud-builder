
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import Index from "./pages/Index";
import Options from "./pages/Options";
import DesignOptions from "./pages/DesignOptions";
import AiChat from "./pages/AiChat";
import ComparisonView from "./pages/ComparisonView";
import SoftwareDesign from "./pages/SoftwareDesign";
import ResourceManagement from "./pages/ResourceManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/options" element={<Options />} />
            <Route path="/design-options" element={<DesignOptions />} />
            <Route path="/ai-chat" element={<AiChat />} />
            <Route path="/comparison-view" element={<ComparisonView />} />
            <Route path="/software-design" element={<SoftwareDesign />} />
            <Route path="/resource-management" element={<ResourceManagement />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
