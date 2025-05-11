
import React from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

interface NavbarProps {
  showAuth?: boolean;
}

const Navbar = ({ showAuth = true }: NavbarProps) => {
  return (
    <nav className="bg-white dark:bg-navy shadow-sm border-b border-border py-4 px-6">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <span className="text-primary-foreground font-bold">DC</span>
          </div>
          <span className="font-bold text-xl">DevCloud</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          {showAuth && (
            <>
              <Link 
                to="/options?auth=signin" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign In
              </Link>
              
              <Link 
                to="/options?auth=signup" 
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
