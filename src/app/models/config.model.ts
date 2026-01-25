export interface Configuration {
  id?: number;
  name?: string;
  description?: string;
  value?: string;
}

export interface RequestConfiguration {
  id?: number;
  name: string;
  description?: string;
  value: string;
}

export interface ConfigurationQueryParams {
  name?: string;
  page?: number;
  limit?: number;
}

export interface ConfigurationListResponse {
  data: Configuration[];
  meta: {
    code: string;
    message: string;
    total: number;
    page: number;
    limit: number;
  };
}
