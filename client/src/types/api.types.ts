export interface ApiError {
  message: string;
  status: number;
  errors?: {
    field: string;
    message: string;
  }[];
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
