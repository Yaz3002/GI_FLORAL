import React from 'react';
import { Product } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import { Edit, Trash2, AlertCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete }) => {
  const isLowStock = product.stock <= product.min_stock_level;
  
  return (
    <div className="card relative transition-all duration-300 animate-fade-in">
      {isLowStock && (
        <div className="absolute -top-2 -right-2 bg-error-500 text-white p-1 rounded-full">
          <AlertCircle size={18} />
        </div>
      )}
      
      <div className="aspect-square rounded-md overflow-hidden bg-neutral-100 mb-3">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name}
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-neutral-200 text-neutral-400">
            Sin imagen
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Link to={`/productos/${product.id}`} className="hover:text-primary-600">
          <h3 className="font-medium">{product.name}</h3>
        </Link>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-neutral-500">Código: {product.code}</span>
          <span className="badge badge-neutral">{product.category_name}</span>
        </div>
        
        <div className="flex justify-between">
          <div>
            <span className="text-sm text-neutral-500">Precio:</span>
            <p className="font-semibold">S/{product.sale_price.toFixed(2)} </p>
          </div>
          
          <div className="text-right">
            <span className="text-sm text-neutral-500">Stock:</span>
            <p className={`font-semibold ${isLowStock ? 'text-error-500' : ''}`}>
              {product.stock} uds.
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between mt-4 pt-3 border-t border-neutral-100">
        <button 
          onClick={() => onEdit(product)}
          className="btn btn-outline btn-sm flex items-center gap-1"
        >
          <Edit size={14} />
          <span>Editar</span>
        </button>
        
        <button 
          onClick={() => onDelete(product.id)}
          className="btn btn-sm bg-error-500/10 text-error-500 hover:bg-error-500/20 focus:ring-error-500 flex items-center gap-1"
        >
          <Trash2 size={14} />
          <span>Eliminar</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;