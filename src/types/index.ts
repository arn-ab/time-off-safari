
export type UserRole = 'employee' | 'manager';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  managerId?: string;
};

export type TimeOffStatus = 'pending' | 'approved' | 'denied';

export type TimeOffRequest = {
  id: string;
  employeeId: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: TimeOffStatus;
  createdAt: string;
  updatedAt: string;
  managerId: string;
};

export type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};
