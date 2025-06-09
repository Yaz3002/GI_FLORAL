import React, { useState } from 'react';
import { useAppContext, Product } from '../context/AppContext';
import ProductCard from '../components/products/ProductCard';
import ProductForm from '../components/products/ProductForm';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { Plus, Search, AlertTriangle } from 'lucide-react';

const Products: React.FC = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct, loading } = useAppContext();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | undefined>(undefined);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  
  // Handle opening the form modal for creating or editing
  const handleOpenModal = (product?: Product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };
  
  // Handle product form submission
  const handleSubmitProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'> | Product) => {
    if ('id' in productData) {
      await updateProduct(productData as Product);
    } else {
      await addProduct(productData);
    }
    setIsModalOpen(false);
  };
  
  // Handle delete confirmation
  const handleDeleteClick = (id: string) => {
    setProductToDelete(id);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    if (productToDelete) {
      await deleteProduct(productToDelete);
      setProductToDelete(null);
    }
  };
  
  // Filter products based on search and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter ? product.category_id === categoryFilter : true;
    
    const matchesStock = 
      stockFilter === 'low' 
        ? product.stock <= product.min_stock_level
        : stockFilter === 'out' 
          ? product.stock === 0
          : true;
    
    return matchesSearch && matchesCategory && matchesStock;
  });
  
  // Count low stock products
  const lowStockCount = products.filter(p => p.stock <= p.min_stock_level).length;

  if (loading) {
    return (
      <div className="page-transition">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          <span className="ml-2">Cargando productos...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="page-transition">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Productos</h1>
        
        <button
          className="btn btn-primary flex items-center gap-2"
          onClick={() => handleOpenModal()}
        >
          <Plus size={18} />
          <span>Nuevo Producto</span>
        </button>
      </div>
      
      {/* Alert for low stock products */}
      {lowStockCount > 0 && (
        <div className="bg-warning-500/10 border border-warning-500/20 text-warning-600 px-4 py-3 rounded-md mb-6 flex items-center gap-2">
          <AlertTriangle size={20} />
          <span>
            <strong>{lowStockCount} producto{lowStockCount !== 1 ? 's' : ''}</strong> con stock por debajo del mínimo recomendado.
          </span>
        </div>
      )}
      
      {/* Filters and search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-neutral-400" />
          </div>
          <input
            type="search"
            className="input pl-10"
            placeholder="Buscar por nombre o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div>
          <select
            className="select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <select
            className="select"
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
          >
            <option value="all">Todos los productos</option>
            <option value="low">Stock bajo</option>
            <option value="out">Sin stock</option>
          </select>
        </div>
      </div>
      
      {/* Product grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleOpenModal}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-neutral-50 rounded-lg">
          <p className="text-neutral-500">No se encontraron productos</p>
          {(searchTerm || categoryFilter || stockFilter !== 'all') && (
            <button
              className="mt-2 text-primary-600 hover:text-primary-700"
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('');
                setStockFilter('all');
              }}
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}
      
      {/* Product Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentProduct ? 'Editar Producto' : 'Nuevo Producto'}
        size="lg"
      >
        <ProductForm
          product={currentProduct}
          onSubmit={handleSubmitProduct}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
      
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar eliminación"
        message="¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
};

export default Products;