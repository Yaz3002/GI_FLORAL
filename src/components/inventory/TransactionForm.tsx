import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Product } from '../../context/AppContext';
import { useAuth } from '../../hooks/useAuth';

interface TransactionFormProps {
  onSubmit: (transaction: any) => void;
  onCancel: () => void;
  initialProductId?: string;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit, onCancel, initialProductId }) => {
  const { products } = useAppContext();
  const { user } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const [formData, setFormData] = useState({
    product_id: initialProductId || '',
    type: 'entry' as 'entry' | 'exit',
    quantity: 1,
    notes: '',
  });

  // When product changes, update the selected product
  useEffect(() => {
    if (formData.product_id) {
      const product = products.find(p => p.id === formData.product_id);
      if (product) {
        setSelectedProduct(product);
      }
    } else {
      setSelectedProduct(null);
    }
  }, [formData.product_id, products]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData(prev => ({ 
        ...prev, 
        [name]: parseInt(value) || 0 
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct) return;
    
    // Calculate previous and new stock
    const previousStock = selectedProduct.stock;
    const newStock = formData.type === 'entry'
      ? previousStock + formData.quantity
      : previousStock - formData.quantity;
    
    // Validate that we don't go below 0 for exits
    if (formData.type === 'exit' && newStock < 0) {
      alert('No hay suficiente stock para realizar esta salida.');
      return;
    }
    
    onSubmit({
      product_id: formData.product_id,
      type: formData.type,
      quantity: formData.quantity,
      previous_stock: previousStock,
      new_stock: newStock,
      notes: formData.notes,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="form-group">
        <label htmlFor="product_id" className="form-label">Producto</label>
        <select
          id="product_id"
          name="product_id"
          className="select"
          value={formData.product_id}
          onChange={handleChange}
          required
          disabled={!!initialProductId}
        >
          <option value="">Seleccionar producto</option>
          {products.map(product => (
            <option key={product.id} value={product.id}>
              {product.name} - Stock actual: {product.stock}
            </option>
          ))}
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="form-group">
          <label htmlFor="type" className="form-label">Tipo de Movimiento</label>
          <select
            id="type"
            name="type"
            className="select"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="entry">Entrada</option>
            <option value="exit">Salida</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="quantity" className="form-label">Cantidad</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            className="input"
            value={formData.quantity}
            onChange={handleChange}
            min="1"
            required
          />
        </div>
      </div>
      
      {selectedProduct && (
        <div className="bg-neutral-50 p-4 rounded-md mb-4">
          <h4 className="font-medium mb-2">Resumen</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-neutral-500">Stock Actual:</span>
              <p className="font-medium">{selectedProduct.stock} unidades</p>
            </div>
            <div>
              <span className="text-neutral-500">Nuevo Stock:</span>
              <p className="font-medium">
                {formData.type === 'entry'
                  ? selectedProduct.stock + formData.quantity
                  : selectedProduct.stock - formData.quantity} unidades
              </p>
            </div>
          </div>
          
          {formData.type === 'exit' && 
           selectedProduct.stock - formData.quantity < selectedProduct.min_stock_level && (
            <div className="mt-3 text-warning-500 text-sm flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span>Este movimiento dejará el stock por debajo del mínimo recomendado ({selectedProduct.min_stock_level}).</span>
            </div>
          )}
        </div>
      )}
      
      <div className="form-group">
        <label htmlFor="notes" className="form-label">Notas</label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          className="input"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Motivo del movimiento, detalles adicionales, etc."
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
          disabled={!selectedProduct || (formData.type === 'exit' && formData.quantity > (selectedProduct?.stock || 0))}
        >
          Registrar Movimiento
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;