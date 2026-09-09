export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface UserListResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: User[];
  support: {
    url: string;
    text: string;
  };
}

export interface UserResponse {
  data: User;
  support: {
    url: string;
    text: string;
  };
}

export interface CreateUserRequest {
  name: string;
  job: string;
}

export interface UpdateUserRequest {
  name: string;
  job: string;
}

export interface UserMutationResponse {
  name: string;
  job: string;
  id: string;
  createdAt: string;
  updatedAt?: string;
}

export interface UnknownResource {
  id: number;
  name: string;
  year: number;
  color: string;
  pantone_value: string;
}

export interface UnknownListResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: UnknownResource[];
  support: {
    url: string;
    text: string;
  };
}

export interface UnknownResourceResponse {
  data: UnknownResource;
  support: {
    url: string;
    text: string;
  };
}
