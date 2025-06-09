import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };
  
  return (
    <div className="min-h-screen flex bg-neutral-50">
      {/* Sidebar - hidden on mobile, visible on desktop */}
      <div className="hidden lg:block">
        <Sidebar isMobile={false} setMobileMenuOpen={setMobileMenuOpen} />
      </div>
      
      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setMobileMenuOpen(false)} />
          <Sidebar isMobile={true} setMobileMenuOpen={setMobileMenuOpen} />
        </div>
      )}
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Header toggleMobileMenu={toggleMobileMenu} />
        
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;