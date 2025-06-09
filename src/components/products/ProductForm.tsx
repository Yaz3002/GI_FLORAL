import React, { useState, useEffect } from 'react';
import { useAppContext, Product } from '../../context/AppContext';

interface ProductFormProps {
  product?: Product;
  onSubmit: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'> | Product) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit, onCancel }) => {
  const { suppliers, categories } = useAppContext();
  
  const [formData, setFormData] = useState<Omit<Product, 'id' | 'created_at' | 'updated_at'>>({
    name: '',
    code: '',
    category_id: null,
    supplier_id: null,
    purchase_price: 0,
    sale_price: 0,
    stock: 0,
    min_stock_level: 0,
    image_url: '',
  });

  // If editing, load the product data
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        code: product.code,
        category_id: product.category_id,
        supplier_id: product.supplier_id,
        purchase_price: product.purchase_price,
        sale_price: product.sale_price,
        stock: product.stock,
        min_stock_level: product.min_stock_level,
        image_url: product.image_url || '',
      });
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle number inputs
    if (type === 'number') {
      setFormData(prev => ({ 
        ...prev, 
        [name]: parseFloat(value) || 0 
      }));
    } else if (name === 'category_id' || name === 'supplier_id') {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value === '' ? null : value 
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For existing products, preserve the id, created_at, and updated_at
    if (product) {
      onSubmit({
        ...product,
        ...formData,
      });
    } else {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="form-group">
          <label htmlFor="name" className="form-label">Nombre del Producto</label>
          <input
            type="text"
            id="name"
            name="name"
            className="input"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="code" className="form-label">Código del Producto</label>
          <input
            type="text"
            id="code"
            name="code"
            className="input"
            value={formData.code}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="category_id" className="form-label">Categoría</label>
          <select
            id="category_id"
            name="category_id"
            className="select"
            value={formData.category_id || ''}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar categoría</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="supplier_id" className="form-label">Proveedor</label>
          <select
            id="supplier_id"
            name="supplier_id"
            className="select"
            value={formData.supplier_id || ''}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar proveedor</option>
            {suppliers.map(supplier => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="purchase_price" className="form-label">Precio de Compra (S/)</label>
          <input
            type="number"
            id="purchase_price"
            name="purchase_price"
            className="input"
            value={formData.purchase_price}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="sale_price" className="form-label">Precio de Venta (S/)</label>
          <input
            type="number"
            id="sale_price"
            name="sale_price"
            className="input"
            value={formData.sale_price}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="stock" className="form-label">Stock Actual</label>
          <input
            type="number"
            id="stock"
            name="stock"
            className="input"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="min_stock_level" className="form-label">Nivel Mínimo de Stock</label>
          <input
            type="number"
            id="min_stock_level"
            name="min_stock_level"
            className="input"
            value={formData.min_stock_level}
            onChange={handleChange}
            min="0"
            required
          />
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="image_url" className="form-label">URL de Imagen (opcional)</label>
        <input
          type="url"
          id="image_url"
          name="image_url"
          className="input"
          value={formData.image_url || ''}
          onChange={handleChange}
          placeholder="https://ejemplo.com/imagen.jpg"
        />
      </div>
      
      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          className="btn btn-outline"
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary"
        >
          {product ? 'Actualizar Producto' : 'Crear Producto'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;