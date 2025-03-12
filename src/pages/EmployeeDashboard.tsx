
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DateRangePicker from "@/components/DateRangePicker";
import { DateRange, TimeOffRequest } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import { createTimeOffRequest, currentUserId, getEmployeeRequests } from "@/lib/mockData";
import { toast } from "sonner";
import TimeOffCard from "@/components/TimeOffCard";
import { format } from "date-fns";
import { PlusCircle } from "lucide-react";

const EmployeeDashboard = () => {
  const [currentTab, setCurrentTab] = useState("create");
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeOffRequests, setTimeOffRequests] = useState<TimeOffRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch time off requests
  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      try {
        const requests = await getEmployeeRequests(currentUserId);
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dateRange.from || !dateRange.to) {
      toast.error("Please select a date range");
      return;
    }
    
    if (!reason.trim()) {
      toast.error("Please provide a reason for your time off");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newRequest = await createTimeOffRequest(
        currentUserId,
        format(dateRange.from, "yyyy-MM-dd"),
        format(dateRange.to, "yyyy-MM-dd"),
        reason
      );
      
      setTimeOffRequests(prev => [...prev, newRequest]);
      setDateRange({ from: undefined, to: undefined });
      setReason("");
      setCurrentTab("pending");
      toast.success("Time off request submitted successfully");
    } catch (error) {
      console.error("Failed to submit request:", error);
      toast.error("Failed to submit time off request");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter requests by status
  const pendingRequests = timeOffRequests.filter(req => req.status === "pending");
  const approvedRequests = timeOffRequests.filter(req => req.status === "approved");
  const deniedRequests = timeOffRequests.filter(req => req.status === "denied");

  return (
    <Layout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold tracking-tight">Employee Dashboard</h1>
          <p className="text-muted-foreground">
            Request time off and view your requests.
          </p>
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="create" className="animate-fade-in">
              <div className="flex items-center">
                <PlusCircle className="mr-2 h-4 w-4" />
                <span>New Request</span>
              </div>
            </TabsTrigger>
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
          
          <TabsContent value="create" className="mt-6 animate-fade-in">
            <Card className="border-t-4 border-t-primary animate-scale-in">
              <CardHeader>
                <CardTitle>Request Time Off</CardTitle>
                <CardDescription>
                  Fill out the form below to submit a new time off request.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form id="request-form" onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Date Range <span className="text-destructive">*</span>
                    </label>
                    <DateRangePicker 
                      dateRange={dateRange}
                      onDateRangeChange={setDateRange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Reason <span className="text-destructive">*</span>
                    </label>
                    <Textarea
                      placeholder="Please provide details about your time off request"
                      className="resize-none min-h-[120px]"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      required
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  type="submit" 
                  form="request-form" 
                  disabled={isSubmitting}
                  className="w-full md:w-auto"
                >
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="pending" className="mt-6">
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-xl font-semibold">Pending Requests</h2>
              {isLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : pendingRequests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingRequests.map((request) => (
                    <TimeOffCard key={request.id} request={request} />
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {approvedRequests.map((request) => (
                    <TimeOffCard key={request.id} request={request} />
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {deniedRequests.map((request) => (
                    <TimeOffCard key={request.id} request={request} />
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

export default EmployeeDashboard;
