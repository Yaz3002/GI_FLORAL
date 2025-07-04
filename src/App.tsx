import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import { useAuth } from './hooks/useAuth';
import AuthForm from './components/auth/AuthForm';

// Layout
import Layout from './components/layout/Layout';

// Pages
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Inventory from './pages/Inventory';
import Suppliers from './pages/Suppliers';
import SupplierDetail from './pages/SupplierDetail';
import Events from './pages/Events';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-neutral-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="productos" element={<Products />} />
            <Route path="productos/:id" element={<ProductDetail />} />
            <Route path="inventario" element={<Inventory />} />
            <Route path="proveedores" element={<Suppliers />} />
            <Route path="proveedores/:id" element={<SupplierDetail />} />
            <Route path="eventos" element={<Events />} />
            <Route path="reportes" element={<Reports />} />
            <Route path="configuracion" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
};

function App() {
  return (
    <>
      <AppContent />
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#333',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            borderRadius: '0.5rem',
            padding: '0.75rem 1rem',
          },
          success: {
            style: {
              borderLeft: '4px solid #4CAF50',
            },
          },
          error: {
            style: {
              borderLeft: '4px solid #E91E63',
            },
          },
        }}
      />
    </>
  );
}

export default App;