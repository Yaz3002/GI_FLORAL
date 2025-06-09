import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import ReportFilters from '../components/reports/ReportFilters';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { FileText, BarChart2, Download } from 'lucide-react';

interface ReportFilters {
  startDate?: string;
  endDate?: string;
  productId?: string;
  category?: string;
  supplierId?: string;
  transactionType?: 'entry' | 'exit' | 'all';
}

const Reports: React.FC = () => {
  const { transactions, products, categories, loading } = useAppContext();
  const [filters, setFilters] = useState<ReportFilters>({});
  const [activeTab, setActiveTab] = useState<'transactions' | 'stock' | 'categories'>('transactions');
  
  // Format currency for display
  const formatCurrency = (value: number) => {
    return `S/ ${value.toFixed(2)}`;
  };

  // Apply filters to transactions
  const filteredTransactions = transactions.filter(transaction => {
    let matchesFilter = true;
    
    if (filters.startDate) {
      matchesFilter = matchesFilter && new Date(transaction.created_at) >= new Date(filters.startDate);
    }
    
    if (filters.endDate) {
      matchesFilter = matchesFilter && new Date(transaction.created_at) <= new Date(filters.endDate);
    }
    
    if (filters.productId) {
      matchesFilter = matchesFilter && transaction.product_id === filters.productId;
    }
    
    if (filters.category) {
      const product = products.find(p => p.id === transaction.product_id);
      matchesFilter = matchesFilter && product?.category_name === filters.category;
    }
    
    if (filters.supplierId) {
      const product = products.find(p => p.id === transaction.product_id);
      matchesFilter = matchesFilter && product?.supplier_id === filters.supplierId;
    }
    
    if (filters.transactionType && filters.transactionType !== 'all') {
      matchesFilter = matchesFilter && transaction.type === filters.transactionType;
    }
    
    return matchesFilter;
  });
  
  // Group transactions by date for the transaction chart
  const transactionsByDate = filteredTransactions.reduce((acc: Record<string, any>, transaction) => {
    const date = new Date(transaction.created_at).toLocaleDateString('es-ES');
    
    if (!acc[date]) {
      acc[date] = {
        date,
        entries: 0,
        exits: 0,
      };
    }
    
    if (transaction.type === 'entry') {
      acc[date].entries += transaction.quantity;
    } else {
      acc[date].exits += transaction.quantity;
    }
    
    return acc;
  }, {});
  
  const transactionChartData = Object.values(transactionsByDate);
  
  // Prepare stock data by product
  const stockData = products
    .filter(product => {
      let matchesFilter = true;
      
      if (filters.productId) {
        matchesFilter = matchesFilter && product.id === filters.productId;
      }
      
      if (filters.category) {
        matchesFilter = matchesFilter && product.category_name === filters.category;
      }
      
      if (filters.supplierId) {
        matchesFilter = matchesFilter && product.supplier_id === filters.supplierId;
      }
      
      return matchesFilter;
    })
    .map(product => ({
      name: product.name,
      stock: product.stock,
      minStock: product.min_stock_level,
    }))
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 10);
  
  // Prepare category data
  const categoryData = categories.map(category => {
    const categoryProducts = products.filter(p => p.category_name === category.name);
    const totalStock = categoryProducts.reduce((sum, p) => sum + p.stock, 0);
    const totalValue = categoryProducts.reduce((sum, p) => sum + (p.stock * p.purchase_price), 0);
    
    return {
      name: category.name,
      stock: totalStock,
      value: totalValue,
    };
  }).filter(cat => cat.stock > 0); // Only show categories with stock
  
  const COLORS = ['#4CAF50', '#E91E63', '#7269D1', '#10b981', '#f59e0b', '#ef4444'];
  
  // Generate CSV for transactions
  const generateTransactionsCsv = () => {
    const headers = [
      'ID', 'Producto', 'Tipo', 'Cantidad', 'Stock Anterior', 
      'Stock Nuevo', 'Fecha', 'Notas'
    ];
    
    const rows = filteredTransactions.map(t => [
      t.id,
      t.product_name || 'Producto eliminado',
      t.type === 'entry' ? 'Entrada' : 'Salida',
      t.quantity,
      t.previous_stock,
      t.new_stock,
      new Date(t.created_at).toLocaleString('es-ES'),
      t.notes || '',
    ]);
    
    return [headers, ...rows]
      .map(row => row.map(value => `"${value}"`).join(','))
      .join('\n');
  };
  
  const downloadCsv = () => {
    let csvContent = '';
    let filename = '';
    
    if (activeTab === 'transactions') {
      csvContent = generateTransactionsCsv();
      filename = 'movimientos_inventario.csv';
    } else if (activeTab === 'stock') {
      // Generate stock report CSV
      const headers = ['Producto', 'Stock Actual', 'Stock Mínimo', 'Categoría', 'Proveedor'];
      const rows = products
        .filter(product => {
          let matchesFilter = true;
          
          if (filters.productId) {
            matchesFilter = matchesFilter && product.id === filters.productId;
          }
          
          if (filters.category) {
            matchesFilter = matchesFilter && product.category_name === filters.category;
          }
          
          if (filters.supplierId) {
            matchesFilter = matchesFilter && product.supplier_id === filters.supplierId;
          }
          
          return matchesFilter;
        })
        .map(p => [
          p.name,
          p.stock,
          p.min_stock_level,
          p.category_name || '',
          p.supplier_name || '',
        ]);
      
      csvContent = [headers, ...rows]
        .map(row => row.map(value => `"${value}"`).join(','))
        .join('\n');
      
      filename = 'reporte_stock.csv';
    } else {
      // Generate category report CSV
      const headers = ['Categoría', 'Total Stock', 'Valor Total'];
      const rows = categoryData.map(c => [
        c.name,
        c.stock,
        formatCurrency(c.value),
      ]);
      
      csvContent = [headers, ...rows]
        .map(row => row.map(value => `"${value}"`).join(','))
        .join('\n');
      
      filename = 'reporte_categorias.csv';
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="page-transition">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          <span className="ml-2">Cargando reportes...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="page-transition">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Reportes</h1>
        
        <button
          onClick={downloadCsv}
          className="btn btn-primary flex items-center gap-2"
        >
          <Download size={18} />
          <span>Exportar CSV</span>
        </button>
      </div>
      
      {/* Report Filters */}
      <ReportFilters onFilterChange={setFilters} />
      
      {/* Tabs */}
      <div className="flex border-b border-neutral-200 mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'transactions'
              ? 'border-b-2 border-primary-500 text-primary-600'
              : 'text-neutral-500 hover:text-neutral-700'
          }`}
          onClick={() => setActiveTab('transactions')}
        >
          Movimientos
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'stock'
              ? 'border-b-2 border-primary-500 text-primary-600'
              : 'text-neutral-500 hover:text-neutral-700'
          }`}
          onClick={() => setActiveTab('stock')}
        >
          Stock Actual
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'categories'
              ? 'border-b-2 border-primary-500 text-primary-600'
              : 'text-neutral-500 hover:text-neutral-700'
          }`}
          onClick={() => setActiveTab('categories')}
        >
          Por Categorías
        </button>
      </div>
      
      {/* Report Content */}
      <div className="card">
        {activeTab === 'transactions' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Movimientos de Inventario</h2>
            
            {transactionChartData.length > 0 ? (
              <>
                <div className="h-80 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={transactionChartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="entries" name="Entradas" fill="#4CAF50" />
                      <Bar dataKey="exits" name="Salidas" fill="#E91E63" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="table-container">
                  <table className="table">
                    <thead className="table-header">
                      <tr>
                        <th className="table-header-cell">Producto</th>
                        <th className="table-header-cell">Tipo</th>
                        <th className="table-header-cell">Cantidad</th>
                        <th className="table-header-cell">Stock Anterior</th>
                        <th className="table-header-cell">Stock Nuevo</th>
                        <th className="table-header-cell">Fecha</th>
                      </tr>
                    </thead>
                    <tbody className="table-body">
                      {filteredTransactions.slice(0, 10).map(transaction => (
                        <tr key={transaction.id}>
                          <td className="table-body-cell">{transaction.product_name || 'Producto eliminado'}</td>
                          <td className="table-body-cell">
                            <span className={`badge ${
                              transaction.type === 'entry' ? 'badge-success' : 'badge-error'
                            }`}>
                              {transaction.type === 'entry' ? 'Entrada' : 'Salida'}
                            </span>
                          </td>
                          <td className="table-body-cell font-medium">
                            {transaction.quantity} uds.
                          </td>
                          <td className="table-body-cell">
                            {transaction.previous_stock} uds.
                          </td>
                          <td className="table-body-cell">
                            {transaction.new_stock} uds.
                          </td>
                          <td className="table-body-cell text-neutral-500">
                            {new Date(transaction.created_at).toLocaleString('es-ES')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {filteredTransactions.length > 10 && (
                  <div className="mt-4 text-center text-sm text-neutral-500">
                    Mostrando 10 de {filteredTransactions.length} movimientos
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-neutral-500">
                No hay datos disponibles para los filtros seleccionados
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'stock' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Reporte de Stock Actual</h2>
            
            {stockData.length > 0 ? (
              <>
                <div className="h-80 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stockData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={150} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="stock" name="Stock Actual" fill="#4CAF50" />
                      <Bar dataKey="minStock" name="Stock Mínimo" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="table-container">
                  <table className="table">
                    <thead className="table-header">
                      <tr>
                        <th className="table-header-cell">Producto</th>
                        <th className="table-header-cell">Categoría</th>
                        <th className="table-header-cell">Stock Actual</th>
                        <th className="table-header-cell">Stock Mínimo</th>
                        <th className="table-header-cell">Estado</th>
                        <th className="table-header-cell">Valor</th>
                      </tr>
                    </thead>
                    <tbody className="table-body">
                      {products
                        .filter(product => {
                          let matchesFilter = true;
                          
                          if (filters.productId) {
                            matchesFilter = matchesFilter && product.id === filters.productId;
                          }
                          
                          if (filters.category) {
                            matchesFilter = matchesFilter && product.category_name === filters.category;
                          }
                          
                          if (filters.supplierId) {
                            matchesFilter = matchesFilter && product.supplier_id === filters.supplierId;
                          }
                          
                          return matchesFilter;
                        })
                        .slice(0, 10)
                        .map(product => (
                          <tr key={product.id}>
                            <td className="table-body-cell">{product.name}</td>
                            <td className="table-body-cell">
                              <span className="badge badge-neutral">{product.category_name}</span>
                            </td>
                            <td className="table-body-cell font-medium">
                              {product.stock} uds.
                            </td>
                            <td className="table-body-cell">
                              {product.min_stock_level} uds.
                            </td>
                            <td className="table-body-cell">
                              <span className={`badge ${
                                product.stock <= product.min_stock_level
                                  ? 'badge-error'
                                  : product.stock <= product.min_stock_level * 1.5
                                    ? 'badge-warning'
                                    : 'badge-success'
                              }`}>
                                {product.stock <= product.min_stock_level
                                  ? 'Stock Bajo'
                                  : product.stock <= product.min_stock_level * 1.5
                                    ? 'Stock Medio'
                                    : 'Stock Óptimo'}
                              </span>
                            </td>
                            <td className="table-body-cell">
                              {formatCurrency(product.stock * product.purchase_price)}
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-neutral-500">
                No hay datos disponibles para los filtros seleccionados
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'categories' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Análisis por Categorías</h2>
            
            {categoryData.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="h-80">
                    <h3 className="text-base font-medium mb-2 text-center">Distribución de Stock</h3>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="stock"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} unidades`, 'Stock']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="h-80">
                    <h3 className="text-base font-medium mb-2 text-center">Valor de Inventario</h3>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [formatCurrency(value), 'Valor']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="table-container">
                  <table className="table">
                    <thead className="table-header">
                      <tr>
                        <th className="table-header-cell">Categoría</th>
                        <th className="table-header-cell">Productos</th>
                        <th className="table-header-cell">Total Stock</th>
                        <th className="table-header-cell">Valor Inventario</th>
                        <th className="table-header-cell">% del Total</th>
                      </tr>
                    </thead>
                    <tbody className="table-body">
                      {categoryData.map(category => {
                        const categoryProducts = products.filter(p => p.category_name === category.name);
                        const totalStock = categoryProducts.reduce((sum, p) => sum + p.stock, 0);
                        const totalValue = categoryProducts.reduce((sum, p) => sum + (p.stock * p.purchase_price), 0);
                        const totalInventoryValue = products.reduce((sum, p) => sum + (p.stock * p.purchase_price), 0);
                        const percentage = totalInventoryValue > 0 ? (totalValue / totalInventoryValue) * 100 : 0;
                        
                        return (
                          <tr key={category.name}>
                            <td className="table-body-cell">
                              <span className="font-medium">{category.name}</span>
                            </td>
                            <td className="table-body-cell">
                              {categoryProducts.length}
                            </td>
                            <td className="table-body-cell">
                              {totalStock} uds.
                            </td>
                            <td className="table-body-cell font-medium">
                              {formatCurrency(totalValue)}
                            </td>
                            <td className="table-body-cell">
                              {percentage.toFixed(1)}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-neutral-500">
                No hay datos disponibles para los filtros seleccionados
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;