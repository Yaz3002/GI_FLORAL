import React, { useState } from 'react';
import { Bell, Search, Menu, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useAppContext } from '../../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface HeaderProps {
  toggleMobileMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleMobileMenu }) => {
  const { user, signOut } = useAuth();
  const { products, suppliers } = useAppContext();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{
    type: 'product' | 'supplier';
    id: string;
    name: string;
  }>>([]);
  
  const navigate = useNavigate();
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    
    if (term.length < 2) {
      setSearchResults([]);
      return;
    }
    
    const termLower = term.toLowerCase();
    
    // Search in products
    const productResults = products
      .filter(p => 
        p.name.toLowerCase().includes(termLower) ||
        p.code.toLowerCase().includes(termLower)
      )
      .map(p => ({
        type: 'product' as const,
        id: p.id,
        name: p.name
      }));
    
    // Search in suppliers
    const supplierResults = suppliers
      .filter(s => 
        s.name.toLowerCase().includes(termLower) ||
        s.contact_name.toLowerCase().includes(termLower)
      )
      .map(s => ({
        type: 'supplier' as const,
        id: s.id,
        name: s.name
      }));
    
    setSearchResults([...productResults, ...supplierResults].slice(0, 5));
  };
  
  const handleResultClick = (result: typeof searchResults[0]) => {
    setSearchOpen(false);
    setSearchTerm('');
    setSearchResults([]);
    
    if (result.type === 'product') {
      navigate(`/productos/${result.id}`);
    } else {
      navigate(`/proveedores/${result.id}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Sesión cerrada exitosamente');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };
  
  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-md text-neutral-500 lg:hidden"
          >
            <Menu size={22} />
          </button>
          
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-neutral-400" />
            </div>
            <input
              type="search"
              className="bg-neutral-50 text-neutral-700 border border-neutral-200 rounded-md pl-10 pr-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Buscar productos o proveedores..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => setSearchOpen(true)}
            />
            
            {/* Search Results Dropdown */}
            {searchOpen && searchResults.length > 0 && (
              <div className="absolute top-full left-0 w-full mt-1 bg-white rounded-md shadow-lg border border-neutral-200 overflow-hidden">
                {searchResults.map((result) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    className="w-full px-4 py-2 text-left hover:bg-neutral-50 flex items-center gap-2"
                    onClick={() => handleResultClick(result)}
                  >
                    <div>
                      <span className="text-sm font-medium">{result.name}</span>
                      <span className="text-xs text-neutral-500 ml-1">
                        ({result.type === 'product' ? 'Producto' : 'Proveedor'})
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* User info */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-neutral-700">
                {user?.email}
              </p>
              <p className="text-xs text-neutral-500">Usuario</p>
            </div>
            
            <button
              onClick={handleSignOut}
              className="p-2 rounded-full text-neutral-600 hover:bg-neutral-100 flex items-center gap-1"
              title="Cerrar sesión"
            >
              <LogOut size={18} />
            </button>
          </div>
          
          {/* Mobile sign out */}
          <button
            onClick={handleSignOut}
            className="sm:hidden p-2 rounded-full text-neutral-600 hover:bg-neutral-100"
            title="Cerrar sesión"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;