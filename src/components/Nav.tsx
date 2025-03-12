
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { CalendarDays, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { currentUserId, mockUsers, switchUser } from "@/lib/mockData";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const Nav = () => {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(mockUsers.find(u => u.id === currentUserId));
  const [isScrolled, setIsScrolled] = useState(false);

  // Update user when currentUserId changes
  useEffect(() => {
    setCurrentUser(mockUsers.find(u => u.id === currentUserId));
  }, [currentUserId]);

  // Detect scroll for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle user switch for demo
  const handleSwitchUser = (userId: string) => {
    switchUser(userId);
    const newUser = mockUsers.find(u => u.id === userId);
    toast.success(`Switched to ${newUser?.name} (${newUser?.role})`);
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 transition-all duration-300",
      isScrolled 
        ? "bg-white/80 backdrop-blur-md border-b shadow-sm" 
        : "bg-background"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <CalendarDays className="h-6 w-6 text-primary" />
            <Link to="/" className="font-medium text-xl">
              TimeOff
            </Link>
          </div>

          <nav className="mx-6 flex items-center space-x-4 lg:space-x-6 hidden md:block">
            <Link
              to="/"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === "/" 
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              Home
            </Link>
            <Link
              to="/employee"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === "/employee" 
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              Employee Dashboard
            </Link>
            <Link
              to="/manager"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === "/manager" 
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              Manager Dashboard
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="rounded-full h-8 w-8 p-0 focus-visible:ring-offset-2"
                >
                  <User className="h-4 w-4" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{currentUser?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {currentUser?.email} ({currentUser?.role})
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Switch User (Demo)</DropdownMenuLabel>
                {mockUsers.map(user => (
                  <DropdownMenuItem 
                    key={user.id}
                    className="cursor-pointer"
                    onClick={() => handleSwitchUser(user.id)}
                  >
                    {user.name} ({user.role})
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Nav;
