// Product Types
export interface Product {
  id: string;
  name: string;
  code: string;
  category: string;
  supplier: string;
  supplierID: string;
  purchasePrice: number;
  salePrice: number;
  stock: number;
  minStockLevel: number;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
}

// Supplier Types
export interface Supplier {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  rating: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// Inventory Types
export interface InventoryTransaction {
  id: string;
  productId: string;
  productName: string;
  type: 'entry' | 'exit';
  quantity: number;
  previousStock: number;
  newStock: number;
  date: string;
  userId: string;
  userName: string;
  notes: string;
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