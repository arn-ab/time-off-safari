
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { currentUserId, mockUsers } from "@/lib/mockData";
import { useEffect, useState } from "react";

const Index = () => {
  const [currentUser, setCurrentUser] = useState(mockUsers.find(u => u.id === currentUserId));
  
  // Update current user when currentUserId changes
  useEffect(() => {
    setCurrentUser(mockUsers.find(u => u.id === currentUserId));
  }, [currentUserId]);

  const isManager = currentUser?.role === 'manager';

  return (
    <Layout className="py-16 md:py-24">
      <div className="max-w-4xl mx-auto text-center space-y-12">
        <div className="space-y-6 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Time Off Management
            <span className="text-primary block mt-2">Made Simple</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            An elegant solution for requesting, approving, and tracking employee time off.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 animate-fade-in" style={{ animationDelay: "150ms" }}>
          <Button asChild size="lg" className="text-md h-12">
            <Link to={isManager ? "/manager" : "/employee"}>
              Go to {isManager ? "Manager" : "Employee"} Dashboard
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-md h-12">
            <Link to={isManager ? "/employee" : "/manager"}>
              View {isManager ? "Employee" : "Manager"} View
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 animate-fade-in" style={{ animationDelay: "300ms" }}>
          <div className="flex flex-col items-center text-center p-6 rounded-lg">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-primary"
              >
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
                <path d="M8 14h.01" />
                <path d="M12 14h.01" />
                <path d="M16 14h.01" />
                <path d="M8 18h.01" />
                <path d="M12 18h.01" />
                <path d="M16 18h.01" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Easy Scheduling</h3>
            <p className="text-muted-foreground">
              Select date ranges with our intuitive calendar interface.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-lg">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-primary"
              >
                <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Email Notifications</h3>
            <p className="text-muted-foreground">
              Automatic notifications keep everyone informed.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-lg">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-primary"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
                <path d="M16 13H8" />
                <path d="M16 17H8" />
                <path d="M10 9H8" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Simple Approvals</h3>
            <p className="text-muted-foreground">
              Managers can quickly approve or deny requests.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
