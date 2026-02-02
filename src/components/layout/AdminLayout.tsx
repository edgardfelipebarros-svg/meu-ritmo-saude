import { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/20">
      <div className="pr-16">
        {children}
      </div>
      <AdminSidebar />
    </div>
  );
};

export default AdminLayout;
