export interface AgentUser {
  id: string;
  email: string;
  full_name: string;
  locale: string;
  created_at: string;
  updated_at: string;
  timezone: string;
  profile: {
    avatar_url: string;
    bio: string;
    company: string;
    social: Record<string, string>;
  };
  preferences: Record<string, unknown>;
  status: "active" | "suspended";
}

export interface AgentOrder {
  id: string;
  reference: string;
  customer: {
    id: string;
    email: string;
    full_name: string;
  };
  status: OrderStatus;
  line_items: LineItem[];
  totals: OrderTotals;
  payment_method: string | null;
  shipping_address: Record<string, unknown> | null;
  metadata: Record<string, unknown>;
  created_at: string;
  shipped_at: string | null;
  delivered_at: string | null;
}

export type OrderStatus =
  | "pending"
  | "paid"
  | "shipped"
  | "delivered"
  | "refunded"
  | "cancelled";

export interface LineItem {
  id: string;
  product: {
    id: string;
    sku: string;
    name: string;
    price: Money;
    deleted_at: string | null;
  };
  quantity: number;
  unit_price: Money;
  subtotal: Money;
}

export interface OrderTotals {
  subtotal: Money;
  shipping: Money;
  tax: Money;
  total: Money;
}

export interface Money {
  amount: number;
  currency: string;
  formatted: string;
}

export interface AgentUserListResponse {
  data: AgentUser[];
  meta: PaginationMeta;
}

export interface AgentUserDetailResponse {
  data: AgentUser;
}

export interface AgentOrderListResponse {
  data: AgentOrder[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  limit: number;
  returned: number;
  next_cursor: string | null;
  prev_cursor: string | null;
  has_more: boolean;
  total_estimate: number;
}

export interface AgentErrorResponse {
  error: string;
  message: string;
  hint?: string;
  request_id?: string;
}
