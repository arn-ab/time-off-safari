
import { TimeOffRequest, User } from "@/types";
import { toast } from "sonner";

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

// Mock API functions
let timeOffRequests = [...mockTimeOffRequests];

// Simulate delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get current user (simulated)
export async function getCurrentUser(): Promise<User> {
  await delay(500);
  // For demo purposes, default to the first employee
  return mockUsers[0];
}

// Get user by ID
export async function getUserById(userId: string): Promise<User | undefined> {
  await delay(300);
  return mockUsers.find(user => user.id === userId);
}

// Get requests for employee
export async function getEmployeeRequests(employeeId: string): Promise<TimeOffRequest[]> {
  await delay(800);
  return timeOffRequests.filter(request => request.employeeId === employeeId);
}

// Get requests for manager
export async function getManagerRequests(managerId: string): Promise<TimeOffRequest[]> {
  await delay(800);
  return timeOffRequests.filter(request => request.managerId === managerId);
}

// Create new time off request
export async function createTimeOffRequest(
  employeeId: string, 
  startDate: string, 
  endDate: string, 
  reason: string
): Promise<TimeOffRequest> {
  await delay(1000);
  
  const employee = mockUsers.find(user => user.id === employeeId);
  
  if (!employee) {
    throw new Error("Employee not found");
  }
  
  const managerId = employee.managerId || mockUsers.find(u => u.role === 'manager')?.id || '';
  
  const newRequest: TimeOffRequest = {
    id: `request-${Date.now()}`,
    employeeId,
    employeeName: employee.name,
    startDate,
    endDate,
    reason,
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    managerId
  };
  
  // Add to our "database"
  timeOffRequests = [...timeOffRequests, newRequest];
  
  // Mock email notification
  toast.info(`Email notification sent to ${managerId}`);
  
  return newRequest;
}

// Update time off request status
export async function updateRequestStatus(
  requestId: string, 
  status: "approved" | "denied"
): Promise<TimeOffRequest> {
  await delay(1000);
  
  const requestIndex = timeOffRequests.findIndex(req => req.id === requestId);
  
  if (requestIndex === -1) {
    throw new Error("Request not found");
  }
  
  const updatedRequest = {
    ...timeOffRequests[requestIndex],
    status,
    updatedAt: new Date().toISOString()
  };
  
  // Update in our "database"
  timeOffRequests = [
    ...timeOffRequests.slice(0, requestIndex),
    updatedRequest,
    ...timeOffRequests.slice(requestIndex + 1)
  ];
  
  // Mock email notification
  toast.info(`Email notification sent to ${updatedRequest.employeeId}`);
  
  return updatedRequest;
}

// Get request by ID
export async function getRequestById(requestId: string): Promise<TimeOffRequest | undefined> {
  await delay(500);
  return timeOffRequests.find(request => request.id === requestId);
}

// Get all users (for demo purposes)
export async function getAllUsers(): Promise<User[]> {
  await delay(500);
  return mockUsers;
}

// Switch user (for demo purposes)
export let currentUserId = "user-1";

export function switchUser(userId: string) {
  currentUserId = userId;
}
