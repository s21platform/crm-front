export interface Staff {
  id: string;
  login: string;
  role_id: number;
  role_name: string;
  permissions: {
    access?: string[];
  };
  created_at: number;
  updated_at: number;
}

export interface CreateStaffRequest {
  login: string;
  password: string;
  role_id: number;
  permissions: {
    access: string[];
  };
}

export interface StaffListResponse {
  staff: Staff[];
  total_count: number;
  page_count: number;
}

export interface StaffListParams {
  page?: number;
  page_size?: number;
  search_term?: string;
  role_id?: number;
} 