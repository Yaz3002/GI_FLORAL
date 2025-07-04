import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          start_date: string;
          end_date: string;
          location: string | null;
          category: string;
          status: string;
          created_by: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          start_date: string;
          end_date: string;
          location?: string | null;
          category: string;
          status?: string;
          created_by?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          start_date?: string;
          end_date?: string;
          location?: string | null;
          category?: string;
          status?: string;
          created_by?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      user_settings: {
        Row: {
          id: string;
          user_id: string;
          settings: any;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          settings?: any;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          settings?: any;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          email: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          description: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      suppliers: {
        Row: {
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
        };
        Insert: {
          id?: string;
          name: string;
          contact_name: string;
          email: string;
          phone: string;
          address: string;
          rating?: number;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          contact_name?: string;
          email?: string;
          phone?: string;
          address?: string;
          rating?: number;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
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
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          category_id?: string | null;
          supplier_id?: string | null;
          purchase_price?: number;
          sale_price?: number;
          stock?: number;
          min_stock_level?: number;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          code?: string;
          category_id?: string | null;
          supplier_id?: string | null;
          purchase_price?: number;
          sale_price?: number;
          stock?: number;
          min_stock_level?: number;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      inventory_transactions: {
        Row: {
          id: string;
          product_id: string | null;
          type: string;
          quantity: number;
          previous_stock: number;
          new_stock: number;
          notes: string;
          user_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id?: string | null;
          type: string;
          quantity: number;
          previous_stock?: number;
          new_stock?: number;
          notes?: string;
          user_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string | null;
          type?: string;
          quantity?: number;
          previous_stock?: number;
          new_stock?: number;
          notes?: string;
          user_id?: string | null;
          created_at?: string;
        };
      };
    };
  };
}