import { ReactNode } from "react";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/20">
      {/* Main content */}
      <div className="pr-16"> {/* Space for collapsed sidebar */}
        {children}
      </div>
      
      {/* Sidebar */}
      <Sidebar />
    </div>
  );
};

export default Layout;