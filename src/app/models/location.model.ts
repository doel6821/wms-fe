export interface Location {
  id?: number;
  name?: string;
  code?: string;
}

export interface RequestLocation {
  id?: number;
  name: string;
  code: string;
}

export interface LocationQueryParams {
  code?: string;
  name?: string;
  page?: number;
  limit?: number;
}

export interface LocationListResponse {
  data: Location[];
  meta: {
    code: string;
    message: string;
    total: number;
    page: number;
    limit: number;
  };
}
