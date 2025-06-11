// Product Types
export interface Product {
  id: string;
  name: string;
  code: string;
  category_id: string | null;
  supplier_id: string | null;
  purchase_price: number;
  sale_price: number;
  stock: number;
  min_stock_level: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  // Computed fields from joins
  category_name?: string;
  supplier_name?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

// Supplier Types
export interface Supplier {
  id: string;
  name: string;
  contact_name: string;
  email: string;
  phone: string;
  address: string;
  rating: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

// Inventory Types
export interface InventoryTransaction {
  id: string;
  product_id: string | null;
  type: 'entry' | 'exit';
  quantity: number;
  previous_stock: number;
  new_stock: number;
  notes: string;
  user_id: string | null;
  created_at: string;
  // Computed fields
  product_name?: string;
  user_name?: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'low_stock' | 'restock_alert' | 'inventory_movement' | 'system';
  message: string;
  read: boolean;
  date: string;
  link?: string;
  productId?: string;
}

// Dashboard Types
export interface DashboardSummary {
  totalProducts: number;
  lowStockProducts: number;
  totalSuppliers: number;
  inventoryValue: number;
  recentTransactions: InventoryTransaction[];
  topSellingProducts: {
    productId: string;
    productName: string;
    quantitySold: number;
  }[];
  stockDistribution: {
    category: string;
    value: number;
  }[];
}

// Report Types
export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  productId?: string;
  category?: string;
  supplierId?: string;
  transactionType?: 'entry' | 'exit' | 'all';
}

export interface ChartData {
  name: string;
  value: number;
}