import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

// Updated types to match database structure
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

export interface Category {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

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
}

interface AppContextType {
  // Data
  products: Product[];
  suppliers: Supplier[];
  categories: Category[];
  transactions: InventoryTransaction[];
  loading: boolean;
  
  // Product functions
  addProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  
  // Supplier functions
  addSupplier: (supplier: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateSupplier: (supplier: Supplier) => Promise<void>;
  deleteSupplier: (id: string) => Promise<void>;
  getSupplierById: (id: string) => Supplier | undefined;
  
  // Category functions
  addCategory: (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  
  // Inventory functions
  addInventoryTransaction: (transaction: Omit<InventoryTransaction, 'id' | 'created_at' | 'user_id'>) => Promise<void>;
  
  // Refresh functions
  refreshData: () => Promise<void>;
}

interface AppProviderProps {
  children: ReactNode;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data
  const fetchData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (categoriesError) throw categoriesError;
      setCategories(categoriesData || []);

      // Fetch suppliers
      const { data: suppliersData, error: suppliersError } = await supabase
        .from('suppliers')
        .select('*')
        .order('name');
      
      if (suppliersError) throw suppliersError;
      setSuppliers(suppliersData || []);

      // Fetch products with category and supplier names
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          categories(name),
          suppliers(name)
        `)
        .order('name');
      
      if (productsError) throw productsError;
      
      // Transform products data to include category and supplier names
      const transformedProducts = (productsData || []).map(product => ({
        ...product,
        category_name: product.categories?.name || '',
        supplier_name: product.suppliers?.name || '',
      }));
      
      setProducts(transformedProducts);

      // Fetch transactions with product names
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('inventory_transactions')
        .select(`
          *,
          products(name)
        `)
        .order('created_at', { ascending: false });
      
      if (transactionsError) throw transactionsError;
      
      // Transform transactions data
      const transformedTransactions = (transactionsData || []).map(transaction => ({
        ...transaction,
        product_name: transaction.products?.name || 'Producto eliminado',
      }));
      
      setTransactions(transformedTransactions);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  // Load data when user changes
  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setProducts([]);
      setSuppliers([]);
      setCategories([]);
      setTransactions([]);
      setLoading(false);
    }
  }, [user]);

  // Product functions
  const addProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('Producto creado exitosamente');
      await fetchData(); // Refresh data
    } catch (error: any) {
      console.error('Error adding product:', error);
      toast.error(error.message || 'Error al crear el producto');
    }
  };

  const updateProduct = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: product.name,
          code: product.code,
          category_id: product.category_id,
          supplier_id: product.supplier_id,
          purchase_price: product.purchase_price,
          sale_price: product.sale_price,
          stock: product.stock,
          min_stock_level: product.min_stock_level,
          image_url: product.image_url,
        })
        .eq('id', product.id);
      
      if (error) throw error;
      
      toast.success('Producto actualizado exitosamente');
      await fetchData(); // Refresh data
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast.error(error.message || 'Error al actualizar el producto');
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Producto eliminado exitosamente');
      await fetchData(); // Refresh data
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast.error(error.message || 'Error al eliminar el producto');
    }
  };

  const getProductById = (id: string) => {
    return products.find(product => product.id === id);
  };

  // Supplier functions
  const addSupplier = async (supplierData: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .insert([supplierData])
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('Proveedor creado exitosamente');
      await fetchData(); // Refresh data
    } catch (error: any) {
      console.error('Error adding supplier:', error);
      toast.error(error.message || 'Error al crear el proveedor');
    }
  };

  const updateSupplier = async (supplier: Supplier) => {
    try {
      const { error } = await supabase
        .from('suppliers')
        .update({
          name: supplier.name,
          contact_name: supplier.contact_name,
          email: supplier.email,
          phone: supplier.phone,
          address: supplier.address,
          rating: supplier.rating,
          notes: supplier.notes,
        })
        .eq('id', supplier.id);
      
      if (error) throw error;
      
      toast.success('Proveedor actualizado exitosamente');
      await fetchData(); // Refresh data
    } catch (error: any) {
      console.error('Error updating supplier:', error);
      toast.error(error.message || 'Error al actualizar el proveedor');
    }
  };

  const deleteSupplier = async (id: string) => {
    try {
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Proveedor eliminado exitosamente');
      await fetchData(); // Refresh data
    } catch (error: any) {
      console.error('Error deleting supplier:', error);
      toast.error(error.message || 'Error al eliminar el proveedor');
    }
  };

  const getSupplierById = (id: string) => {
    return suppliers.find(supplier => supplier.id === id);
  };

  // Category functions
  const addCategory = async (categoryData: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([categoryData])
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('Categoría creada exitosamente');
      await fetchData(); // Refresh data
    } catch (error: any) {
      console.error('Error adding category:', error);
      toast.error(error.message || 'Error al crear la categoría');
    }
  };

  // Inventory functions
  const addInventoryTransaction = async (transactionData: Omit<InventoryTransaction, 'id' | 'created_at' | 'user_id'>) => {
    try {
      // First, add the transaction
      const { data, error } = await supabase
        .from('inventory_transactions')
        .insert([{
          ...transactionData,
          user_id: user?.id,
        }])
        .select()
        .single();
      
      if (error) throw error;

      // Then update the product stock
      const { error: updateError } = await supabase
        .from('products')
        .update({ stock: transactionData.new_stock })
        .eq('id', transactionData.product_id);
      
      if (updateError) throw updateError;
      
      toast.success('Movimiento de inventario registrado exitosamente');
      await fetchData(); // Refresh data
    } catch (error: any) {
      console.error('Error adding inventory transaction:', error);
      toast.error(error.message || 'Error al registrar el movimiento');
      throw error; // Re-throw to handle in component
    }
  };

  const refreshData = async () => {
    await fetchData();
  };

  const value: AppContextType = {
    products,
    suppliers,
    categories,
    transactions,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    getSupplierById,
    addCategory,
    addInventoryTransaction,
    refreshData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  
  return context;
};