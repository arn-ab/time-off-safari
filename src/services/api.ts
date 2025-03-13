
import { ApiResponse, TimeOffRequest, User } from "@/types";
import { mockTimeOffRequests, mockUsers } from "./mockData";
import { toast } from "sonner";

/**
 * API Service for handling all data operations
 * This can be easily replaced with real API endpoints in the future
 */
class ApiService {
  private baseUrl: string = '';
  private delay: number = 500; // Simulated network delay in ms
  
  // Mock data (would be removed when connecting to real API)
  private timeOffRequests: TimeOffRequest[] = [...mockTimeOffRequests];
  private users: User[] = [...mockUsers];
  
  constructor(baseUrl?: string) {
    if (baseUrl) {
      this.baseUrl = baseUrl;
    }
  }
  
  // Helper method to simulate API delay
  private async simulateDelay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, this.delay));
  }

  // User-related API methods
  
  /**
   * Get the current logged-in user
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    await this.simulateDelay();
    
    try {
      // In a real implementation, this would fetch from an endpoint
      // GET /api/users/me
      const user = this.users[0]; // Default to first user for demo
      
      return {
        data: user,
        status: 200
      };
    } catch (error) {
      console.error("Error fetching current user:", error);
      return {
        error: "Failed to fetch current user",
        status: 500
      };
    }
  }
  
  /**
   * Get a user by ID
   */
  async getUserById(userId: string): Promise<ApiResponse<User>> {
    await this.simulateDelay();
    
    try {
      // In a real implementation, this would be:
      // GET /api/users/{userId}
      const user = this.users.find(u => u.id === userId);
      
      if (!user) {
        return {
          error: "User not found",
          status: 404
        };
      }
      
      return {
        data: user,
        status: 200
      };
    } catch (error) {
      console.error("Error fetching user:", error);
      return {
        error: "Failed to fetch user",
        status: 500
      };
    }
  }
  
  /**
   * Get all users (for demo/testing purposes)
   */
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    await this.simulateDelay();
    
    try {
      // In a real implementation, this would be:
      // GET /api/users
      return {
        data: this.users,
        status: 200
      };
    } catch (error) {
      console.error("Error fetching users:", error);
      return {
        error: "Failed to fetch users",
        status: 500
      };
    }
  }
  
  // Time Off Request API methods
  
  /**
   * Get time off requests for a specific employee
   */
  async getEmployeeRequests(employeeId: string): Promise<ApiResponse<TimeOffRequest[]>> {
    await this.simulateDelay();
    
    try {
      // In a real implementation, this would be:
      // GET /api/timeoff?employeeId={employeeId}
      const requests = this.timeOffRequests.filter(req => req.employeeId === employeeId);
      
      return {
        data: requests,
        status: 200
      };
    } catch (error) {
      console.error("Error fetching employee requests:", error);
      return {
        error: "Failed to fetch time off requests",
        status: 500
      };
    }
  }
  
  /**
   * Get time off requests for a specific manager to review
   */
  async getManagerRequests(managerId: string): Promise<ApiResponse<TimeOffRequest[]>> {
    await this.simulateDelay();
    
    try {
      // In a real implementation, this would be:
      // GET /api/timeoff?managerId={managerId}
      const requests = this.timeOffRequests.filter(req => req.managerId === managerId);
      
      return {
        data: requests,
        status: 200
      };
    } catch (error) {
      console.error("Error fetching manager requests:", error);
      return {
        error: "Failed to fetch time off requests",
        status: 500
      };
    }
  }
  
  /**
   * Get a specific time off request by ID
   */
  async getRequestById(requestId: string): Promise<ApiResponse<TimeOffRequest>> {
    await this.simulateDelay();
    
    try {
      // In a real implementation, this would be:
      // GET /api/timeoff/{requestId}
      const request = this.timeOffRequests.find(req => req.id === requestId);
      
      if (!request) {
        return {
          error: "Request not found",
          status: 404
        };
      }
      
      return {
        data: request,
        status: 200
      };
    } catch (error) {
      console.error("Error fetching request:", error);
      return {
        error: "Failed to fetch time off request",
        status: 500
      };
    }
  }
  
  /**
   * Create a new time off request
   */
  async createTimeOffRequest(
    employeeId: string,
    startDate: string,
    endDate: string,
    reason: string
  ): Promise<ApiResponse<TimeOffRequest>> {
    await this.simulateDelay();
    
    try {
      // In a real implementation, this would be:
      // POST /api/timeoff
      // with request body containing the data
      
      const employee = this.users.find(user => user.id === employeeId);
      
      if (!employee) {
        return {
          error: "Employee not found",
          status: 404
        };
      }
      
      const managerId = employee.managerId || this.users.find(u => u.role === 'manager')?.id || '';
      
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
      
      // Add to our mock database
      this.timeOffRequests = [...this.timeOffRequests, newRequest];
      
      // Simulate sending notification
      toast.info(`Email notification sent to manager`);
      
      return {
        data: newRequest,
        status: 201
      };
    } catch (error) {
      console.error("Error creating request:", error);
      return {
        error: "Failed to create time off request",
        status: 500
      };
    }
  }
  
  /**
   * Update the status of a time off request
   */
  async updateRequestStatus(
    requestId: string,
    status: "approved" | "denied"
  ): Promise<ApiResponse<TimeOffRequest>> {
    await this.simulateDelay();
    
    try {
      // In a real implementation, this would be:
      // PATCH /api/timeoff/{requestId}
      // with request body containing the updated status
      
      const requestIndex = this.timeOffRequests.findIndex(req => req.id === requestId);
      
      if (requestIndex === -1) {
        return {
          error: "Request not found",
          status: 404
        };
      }
      
      const updatedRequest = {
        ...this.timeOffRequests[requestIndex],
        status,
        updatedAt: new Date().toISOString()
      };
      
      // Update in our mock database
      this.timeOffRequests = [
        ...this.timeOffRequests.slice(0, requestIndex),
        updatedRequest,
        ...this.timeOffRequests.slice(requestIndex + 1)
      ];
      
      // Simulate sending notification
      toast.info(`Email notification sent to ${updatedRequest.employeeName}`);
      
      return {
        data: updatedRequest,
        status: 200
      };
    } catch (error) {
      console.error("Error updating request:", error);
      return {
        error: "Failed to update time off request",
        status: 500
      };
    }
  }
  
  // For demo purposes - let user switch between accounts
  private currentUserId: string = "user-1";
  
  /**
   * Switch the current user (for demo purposes)
   */
  switchUser(userId: string): void {
    this.currentUserId = userId;
  }
  
  /**
   * Get the current user ID (for demo purposes)
   */
  getCurrentUserId(): string {
    return this.currentUserId;
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();

// Export the class as well in case we need multiple instances
export default ApiService;
