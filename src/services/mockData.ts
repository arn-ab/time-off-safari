
import { TimeOffRequest, User } from "@/types";

// Mock users
export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "John Smith",
    email: "john@example.com",
    role: "employee",
    managerId: "user-3"
  },
  {
    id: "user-2",
    name: "Emily Johnson",
    email: "emily@example.com",
    role: "employee",
    managerId: "user-3"
  },
  {
    id: "user-3",
    name: "Michael Davis",
    email: "michael@example.com",
    role: "manager"
  },
  {
    id: "user-4",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    role: "manager"
  }
];

// Mock time off requests
export const mockTimeOffRequests: TimeOffRequest[] = [
  {
    id: "request-1",
    employeeId: "user-1",
    employeeName: "John Smith",
    startDate: "2024-07-15",
    endDate: "2024-07-20",
    reason: "Annual vacation",
    status: "pending",
    createdAt: "2024-06-15T10:30:00Z",
    updatedAt: "2024-06-15T10:30:00Z",
    managerId: "user-3"
  },
  {
    id: "request-2",
    employeeId: "user-2",
    employeeName: "Emily Johnson",
    startDate: "2024-07-05",
    endDate: "2024-07-10",
    reason: "Family event",
    status: "approved",
    createdAt: "2024-06-10T08:45:00Z",
    updatedAt: "2024-06-12T14:20:00Z",
    managerId: "user-3"
  },
  {
    id: "request-3",
    employeeId: "user-1",
    employeeName: "John Smith",
    startDate: "2024-08-01",
    endDate: "2024-08-05",
    reason: "Personal time",
    status: "denied",
    createdAt: "2024-06-05T16:10:00Z",
    updatedAt: "2024-06-07T09:30:00Z",
    managerId: "user-3"
  }
];
