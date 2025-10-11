export interface ErrorApi {
  message: string | string[];
  error: string;
  statusCode: number;
  timestamp: string;
  path: string;
}

export interface ErrorResponse {
  data: {
    details?: { code: string; meta: [Object] };
    message: string | string[];
    path: string;
    statusCode: number;
    timestamp: string;
  };
  status: number;
}
