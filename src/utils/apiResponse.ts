class ApiResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: {};
  constructor(
    statusCode: number,
    messgae: string,
    data = {},
    success: boolean
  ) {
    this.statusCode = statusCode;
    this.message = messgae;
    this.data = data;
    this.success = success;
  }
}

export { ApiResponse };
