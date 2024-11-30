export interface ApiError {
  message: string;
  status: number;
  errors?: {
    field: string;
    message: string;
  }[];
}
