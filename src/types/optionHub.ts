export interface OptionRequest {
  id: number;
  attribute_id: number;
  attribute_value: string;
  value: string;
  user_uuid: string;
  created_at: string;
}

export interface OptionRequestsResponse {
  option_requests_list: OptionRequest[];
}

export interface OptionRequestDetails extends OptionRequest {
  status: 'success' | 'error' | 'pending';
  updated_at: string;
}

export interface Option {
  id: number;
  value: string;
  type: 'flat' | 'tree';
  level?: number;
  parent_id?: number | null;
  has_children?: boolean;
}

export interface OptionResponse {
  attribute_id: number;
  attribute_type: string;
  options: Option[];
} 