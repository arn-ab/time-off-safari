
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeOffRequest } from "@/types";
import { Badge } from "@/components/ui/badge";
import { format, parseISO, differenceInCalendarDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { updateRequestStatus } from "@/lib/mockData";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface TimeOffCardProps {
  request: TimeOffRequest;
  isManager?: boolean;
  onStatusChange?: (request: TimeOffRequest) => void;
  className?: string;
}

const TimeOffCard = ({ 
  request, 
  isManager = false,
  onStatusChange,
  className 
}: TimeOffCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const daysCount = differenceInCalendarDays(
    parseISO(request.endDate),
    parseISO(request.startDate)
  ) + 1;

  const handleUpdateStatus = async (status: "approved" | "denied") => {
    setIsLoading(true);
    try {
      const updatedRequest = await updateRequestStatus(request.id, status);
      toast.success(`Request ${status}`);
      if (onStatusChange) {
        onStatusChange(updatedRequest);
      }
    } catch (error) {
      toast.error("Failed to update request");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const statusColors = {
    pending: "bg-warning text-warning-foreground",
    approved: "bg-success text-success-foreground",
    denied: "bg-destructive text-destructive-foreground"
  };

  const handleCardClick = () => {
    navigate(`/request/${request.id}`);
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-md",
        request.status === "pending" && "ring-1 ring-warning/20",
        className
      )}
    >
      <CardHeader className="p-5 pb-3 flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="text-lg font-medium">{request.employeeName}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Created on {format(parseISO(request.createdAt), "MMM d, yyyy")}
          </p>
        </div>
        <Badge 
          className={cn(
            "rounded-md font-medium uppercase text-xs",
            statusColors[request.status]
          )}
        >
          {request.status}
        </Badge>
      </CardHeader>
      <CardContent 
        className="p-5 pt-2 cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Date Range</span>
            <span className="text-sm">
              {format(parseISO(request.startDate), "MMM d")} - {format(parseISO(request.endDate), "MMM d, yyyy")}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Duration</span>
            <span className="text-sm">{daysCount} day{daysCount !== 1 ? 's' : ''}</span>
          </div>
          <div>
            <span className="text-sm font-medium">Reason</span>
            <p className="text-sm text-muted-foreground mt-1">{request.reason}</p>
          </div>
        </div>
      </CardContent>
      {isManager && request.status === "pending" && (
        <CardFooter className="p-5 pt-0 flex justify-end space-x-2">
          <Button
            size="sm"
            variant="outline"
            className="flex items-center"
            onClick={() => handleUpdateStatus("denied")}
            disabled={isLoading}
          >
            <X className="mr-1 h-4 w-4" />
            Deny
          </Button>
          <Button
            size="sm"
            className="flex items-center bg-success hover:bg-success/90"
            onClick={() => handleUpdateStatus("approved")}
            disabled={isLoading}
          >
            <Check className="mr-1 h-4 w-4" />
            Approve
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default TimeOffCard;
