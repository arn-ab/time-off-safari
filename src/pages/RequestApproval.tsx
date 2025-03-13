
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, Clock, X } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiService } from "@/services/api";
import { TimeOffRequest, User } from "@/types";
import { format, parseISO, differenceInCalendarDays } from "date-fns";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const RequestApproval = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState<TimeOffRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [manager, setManager] = useState<User | null>(null);

  useEffect(() => {
    const fetchRequest = async () => {
      setIsLoading(true);
      try {
        if (!requestId) {
          toast.error("Invalid request ID");
          navigate("/manager");
          return;
        }
        
        const response = await apiService.getRequestById(requestId);
        
        if (!response.data) {
          toast.error(response.error || "Request not found");
          navigate("/manager");
          return;
        }
        
        setRequest(response.data);
        
        // Fetch manager info
        const managerResponse = await apiService.getUserById(response.data.managerId);
        if (managerResponse.data) {
          setManager(managerResponse.data);
        }
      } catch (error) {
        console.error("Failed to fetch request:", error);
        toast.error("Failed to load request details");
        navigate("/manager");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequest();
  }, [requestId, navigate]);

  const handleUpdateStatus = async (status: "approved" | "denied") => {
    if (!request) return;
    
    setActionLoading(true);
    try {
      const response = await apiService.updateRequestStatus(request.id, status);
      if (response.data) {
        setRequest(response.data);
        toast.success(`Request ${status}`);
      } else if (response.error) {
        toast.error(response.error);
      }
    } catch (error) {
      console.error("Failed to update request:", error);
      toast.error("Failed to update request status");
    } finally {
      setActionLoading(false);
    }
  };

  // Get manager name
  const getManagerName = () => {
    return manager?.name || "Unknown";
  };

  // Get days count
  const getDaysCount = (startDate: string, endDate: string) => {
    return differenceInCalendarDays(parseISO(endDate), parseISO(startDate)) + 1;
  };

  // Status badge styling
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-warning text-warning-foreground";
      case "approved":
        return "bg-success text-success-foreground";
      case "denied":
        return "bg-destructive text-destructive-foreground";
      default:
        return "";
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="text-center space-y-4">
            <Clock className="h-10 w-10 text-muted-foreground animate-pulse mx-auto" />
            <p className="text-muted-foreground">Loading request details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!request) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="text-center space-y-4">
            <X className="h-10 w-10 text-destructive mx-auto" />
            <p className="text-muted-foreground">Request not found</p>
            <Button asChild>
              <Link to="/manager">Go to Dashboard</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="px-0 hover:bg-transparent" 
            asChild
          >
            <Link to="/manager" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Time Off Request</h1>
            <Badge 
              className={cn(
                "rounded-md px-3 py-1 text-sm uppercase font-medium self-start",
                getStatusBadgeClass(request.status)
              )}
            >
              {request.status}
            </Badge>
          </div>

          <Card className="border shadow-sm animate-scale-in">
            <CardHeader className="border-b bg-muted/50">
              <CardTitle>Request Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Employee</p>
                    <p className="font-medium">{request.employeeName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Manager</p>
                    <p className="font-medium">{getManagerName(request.managerId)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Date Range</p>
                    <p className="font-medium">
                      {format(parseISO(request.startDate), "MMMM d, yyyy")} - {format(parseISO(request.endDate), "MMMM d, yyyy")}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium">
                      {getDaysCount(request.startDate, request.endDate)} day{getDaysCount(request.startDate, request.endDate) !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Reason</p>
                  <p className="font-medium">{request.reason}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Request Date</p>
                    <p className="font-medium">{format(parseISO(request.createdAt), "MMMM d, yyyy")}</p>
                  </div>
                  {request.status !== "pending" && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Last Updated</p>
                      <p className="font-medium">{format(parseISO(request.updatedAt), "MMMM d, yyyy 'at' h:mm a")}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            {request.status === "pending" && (
              <CardFooter className="border-t p-6 flex flex-col sm:flex-row gap-3 bg-muted/50">
                <Button 
                  variant="outline" 
                  className="flex-1 sm:flex-initial sm:min-w-[120px]"
                  onClick={() => handleUpdateStatus("denied")}
                  disabled={actionLoading}
                >
                  <X className="mr-2 h-4 w-4" />
                  Deny Request
                </Button>
                <Button 
                  className="flex-1 sm:flex-initial sm:min-w-[120px] bg-success hover:bg-success/90"
                  onClick={() => handleUpdateStatus("approved")}
                  disabled={actionLoading}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Approve Request
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default RequestApproval;
