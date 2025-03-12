
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { currentUserId, getManagerRequests } from "@/lib/mockData";
import { TimeOffRequest } from "@/types";
import { toast } from "sonner";
import TimeOffCard from "@/components/TimeOffCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const ManagerDashboard = () => {
  const [currentTab, setCurrentTab] = useState("pending");
  const [timeOffRequests, setTimeOffRequests] = useState<TimeOffRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  // Fetch time off requests
  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      try {
        const requests = await getManagerRequests(currentUserId);
        setTimeOffRequests(requests);
      } catch (error) {
        console.error("Failed to fetch requests:", error);
        toast.error("Failed to load time off requests");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, [currentUserId]);

  // Handle request status change
  const handleStatusChange = (updatedRequest: TimeOffRequest) => {
    setTimeOffRequests(prevRequests =>
      prevRequests.map(req => 
        req.id === updatedRequest.id ? updatedRequest : req
      )
    );
  };

  // Filter requests by status and search term
  const filterRequests = (status: string) => {
    return timeOffRequests
      .filter(req => req.status === status)
      .filter(req => 
        req.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.reason.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (sortOption === "newest") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else if (sortOption === "oldest") {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        } else if (sortOption === "startDate") {
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        }
        return 0;
      });
  };

  const pendingRequests = filterRequests("pending");
  const approvedRequests = filterRequests("approved");
  const deniedRequests = filterRequests("denied");

  return (
    <Layout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold tracking-tight">Manager Dashboard</h1>
          <p className="text-muted-foreground">
            Review and manage time off requests.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between animate-fade-in">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search requests..."
              className="pl-10 pr-4 w-full md:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="startDate">By Start Date</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="pending" className="animate-fade-in" data-count={pendingRequests.length}>
              <div className="flex items-center">
                <span>Pending</span>
                {pendingRequests.length > 0 && (
                  <span className="ml-2 rounded-full bg-warning/20 px-2 py-0.5 text-xs text-warning-foreground">
                    {pendingRequests.length}
                  </span>
                )}
              </div>
            </TabsTrigger>
            <TabsTrigger value="approved" className="animate-fade-in">Approved</TabsTrigger>
            <TabsTrigger value="denied" className="animate-fade-in">Denied</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="mt-6">
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-xl font-semibold">Pending Requests</h2>
              {isLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : pendingRequests.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {pendingRequests.map((request) => (
                    <TimeOffCard 
                      key={request.id} 
                      request={request} 
                      isManager={true}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No pending requests found.
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="approved" className="mt-6">
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-xl font-semibold">Approved Requests</h2>
              {isLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : approvedRequests.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {approvedRequests.map((request) => (
                    <TimeOffCard key={request.id} request={request} isManager={true} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No approved requests found.
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="denied" className="mt-6">
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-xl font-semibold">Denied Requests</h2>
              {isLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : deniedRequests.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {deniedRequests.map((request) => (
                    <TimeOffCard key={request.id} request={request} isManager={true} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No denied requests found.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ManagerDashboard;
