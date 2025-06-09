import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import TransactionForm from '../components/inventory/TransactionForm';
import Modal from '../components/common/Modal';
import ProductForm from '../components/products/ProductForm';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { ArrowLeft, Edit, Trash2, PlusCircle, MinusCircle, AlertTriangle, Truck } from 'lucide-react';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProductById, updateProduct, deleteProduct, transactions, getSupplierById, addInventoryTransaction } = useAppContext();
  
  const product = getProductById(id || '');
  const supplier = product ? getSupplierById(product.supplier_id || '') : undefined;
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  
  // Get transactions for this product
  const productTransactions = transactions
    .filter(t => t.product_id === id)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10); // Get last 10 transactions
  
  const handleDeleteProduct = async () => {
    if (product) {
      await deleteProduct(product.id);
      navigate('/productos');
    }
  };
  
  const handleProductUpdate = async (updatedProduct: any) => {
    await updateProduct(updatedProduct);
    setIsEditModalOpen(false);
  };
  
  const handleInventoryTransaction = async (transaction: any) => {
    try {
      await addInventoryTransaction(transaction);
      setIsEntryModalOpen(false);
      setIsExitModalOpen(false);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };
  
  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-4">Producto no encontrado</h2>
        <Link to="/productos" className="btn btn-primary">
          Volver a Productos
        </Link>
      </div>
    );
  }
  
  const isLowStock = product.stock <= product.min_stock_level;
  
  return (
    <div className="page-transition">
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => navigate('/productos')}
          className="text-neutral-500 hover:text-neutral-700"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">{product.name}</h1>
      </div>
      
      {isLowStock && (
        <div className="bg-warning-500/10 border border-warning-500/20 text-warning-600 px-4 py-3 rounded-md mb-6 flex items-center gap-2">
          <AlertTriangle size={20} />
          <span>
            <strong>¡Alerta de stock bajo!</strong> El nivel actual ({product.stock} unidades) está por debajo del mínimo recomendado ({product.min_stock_level} unidades).
          </span>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Product Info */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">Información del Producto</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="btn btn-outline btn-sm flex items-center gap-1"
                >
                  <Edit size={16} />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="btn btn-sm bg-error-500/10 text-error-500 hover:bg-error-500/20 focus:ring-error-500 flex items-center gap-1"
                >
                  <Trash2 size={16} />
                  <span>Eliminar</span>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="aspect-square rounded-md overflow-hidden bg-neutral-100 mb-4">
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
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="badge badge-neutral">{product.category_name}</span>
                  <span className="badge badge-primary">Código: {product.code}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-neutral-500">Precios</h3>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-sm text-neutral-500">Precio de Compra:</p>
                      <p className="font-semibold">S/ {product.purchase_price.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">Precio de Venta:</p>
                      <p className="font-semibold">S/ {product.sale_price.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-neutral-500">Inventario</h3>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-sm text-neutral-500">Stock Actual:</p>
                      <p className={`font-semibold ${isLowStock ? 'text-error-500' : ''}`}>
                        {product.stock} unidades
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">Stock Mínimo:</p>
                      <p className="font-semibold">{product.min_stock_level} unidades</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-neutral-500">Proveedor</h3>
                  {supplier ? (
                    <div className="mt-2">
                      <Link 
                        to={`/proveedores/${supplier.id}`}
                        className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
                      >
                        <Truck size={16} />
                        <span>{supplier.name}</span>
                      </Link>
                      <p className="text-sm text-neutral-500 mt-1">Contacto: {supplier.contact_name}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-neutral-500 mt-2">No hay información del proveedor</p>
                  )}
                </div>
                
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => setIsEntryModalOpen(true)}
                    className="btn btn-sm btn-primary flex items-center gap-1"
                  >
                    <PlusCircle size={16} />
                    <span>Registrar Entrada</span>
                  </button>
                  <button
                    onClick={() => setIsExitModalOpen(true)}
                    className="btn btn-sm bg-error-500 hover:bg-error-600 text-white focus:ring-error-500 flex items-center gap-1"
                    disabled={product.stock === 0}
                  >
                    <MinusCircle size={16} />
                    <span>Registrar Salida</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Transaction History */}
        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Historial de Movimientos</h2>
            
            {productTransactions.length > 0 ? (
              <div className="space-y-4">
                {productTransactions.map(transaction => (
                  <div 
                    key={transaction.id} 
                    className={`p-3 rounded-md border ${
                      transaction.type === 'entry'
                        ? 'border-success-500/20 bg-success-500/5'
                        : 'border-error-500/20 bg-error-500/5'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`badge ${
                          transaction.type === 'entry' ? 'badge-success' : 'badge-error'
                        }`}>
                          {transaction.type === 'entry' ? 'Entrada' : 'Salida'}
                        </span>
                        <p className="mt-1 font-medium">{transaction.quantity} unidades</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-neutral-500">
                          {new Date(transaction.created_at).toLocaleDateString('es-ES')}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {new Date(transaction.created_at).toLocaleTimeString('es-ES')}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between text-sm">
                      <span className="text-neutral-500">Stock anterior: {transaction.previous_stock}</span>
                      <span className="text-neutral-500">Nuevo stock: {transaction.new_stock}</span>
                    </div>
                    {transaction.notes && (
                      <p className="mt-2 text-xs text-neutral-600 border-t border-neutral-200 pt-2">
                        {transaction.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-neutral-500">
                No hay movimientos registrados
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Product Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Producto"
        size="lg"
      >
        <ProductForm
          product={product}
          onSubmit={handleProductUpdate}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>
      
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteProduct}
        title="Confirmar eliminación"
        message="¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
      
      {/* Entry Transaction Modal */}
      <Modal
        isOpen={isEntryModalOpen}
        onClose={() => setIsEntryModalOpen(false)}
        title="Registrar Entrada de Inventario"
      >
        <TransactionForm
          onSubmit={handleInventoryTransaction}
          onCancel={() => setIsEntryModalOpen(false)}
          initialProductId={product.id}
        />
      </Modal>
      
      {/* Exit Transaction Modal */}
      <Modal
        isOpen={isExitModalOpen}
        onClose={() => setIsExitModalOpen(false)}
        title="Registrar Salida de Inventario"
      >
        <TransactionForm
          onSubmit={handleInventoryTransaction}
          onCancel={() => setIsExitModalOpen(false)}
          initialProductId={product.id}
        />
      </Modal>
    </div>
  );
};

export default ProductDetail;