
import { ReactNode } from "react";
import Nav from "./Nav";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

const Layout = ({ children, className }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Nav />
      <main className={cn("flex-1 container mx-auto px-4 py-8 animate-fade-in", className)}>
        {children}
      </main>
      <footer className="py-6 border-t border-border">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Time Off Approval System © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
