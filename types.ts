
export enum VisaType {
  TOURIST = 'Tourist',
  BUSINESS = 'Business',
  STUDENT = 'Student'
}

export enum AlertStatus {
  ACTIVE = 'Active',
  BOOKED = 'Booked',
  EXPIRED = 'Expired'
}

export interface VisaAlert {
  id: string;
  country: string;
  city: string;
  visaType: VisaType;
  status: AlertStatus;
  createdAt: string;
}

export interface AlertFilters {
  country?: string;
  status?: AlertStatus;
}

export interface BackendResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
