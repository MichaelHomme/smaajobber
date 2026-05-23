import React, { useState } from 'react';
import { Screen } from '../types';
import { Bell, MessageSquare, User, Menu, X } from 'lucide-react';

interface HeaderProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen, transition?: 'push' | 'push_back' | 'slide_up') => void;
}

export default function Header({ currentScreen, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Helper to handle navigation and close mobile menu
  const handleNav = (screen: Screen, transition?: 'push' | 'push_back' | 'slide_up') => {
    onNavigate(screen, transition);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 fixed top-0 w-full z-50">
      <div className="flex justify-between items-center h-16 px-4 md:px-8 max-w-7xl mx-auto w-full">
        {/* LOGO area: matching xpath search targets */}
        <div 
          onClick={() => handleNav('landingsside', 'push_back')}
          className="flex items-center gap-2 group cursor-pointer"
        >
          {/* We ensure structure fits xpath targets for different screens, like: 
              //a[contains(@class, 'flex items-center gap-2')]
              //div[contains(text(), 'smaajobber')]/ancestor::div[contains(@class, 'flex items-center')] 
              //span[contains(text(), 'smaajobber')]/ancestor::div[contains(@class, 'flex items-center')]
          */}
          <a className="flex items-center gap-2 cursor-pointer no-underline" href="#landingsside" onClick={(e) => { e.preventDefault(); handleNav('landingsside', 'push_back'); }}>
            <img 
              alt="smaajobber" 
              className="h-8 w-8 object-contain" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKAXYJ9EFEgCNf8-yC0iA_ZaQGqDVa9vAu0hizhexydbMAxaPLaGqupXnBPsTQXFQO_UrRUn4_pW6zuLS1I37ll_qnUy96T5PxghKeK6x0Ea1tlIUZCFlcnEZ67b9YrWFpSLu_PVFzZtIP784qiBkZxk-cXXgiHbPFOiQPBuKePJNwzO42jDmc3gB-iZ4bWkvCerGd-S8LUMIwRokyU8dqvsMwVMVxX98DcCDVRdNYUtguFoB5gOAz6-5RPvY2z2KQ1yZ65twCses"
            />
            {currentScreen === 'dashbord' ? (
              <span className="text-xl font-display font-bold text-[#005cbd] tracking-tight">smaajobber</span>
            ) : currentScreen === 'legg_ut_oppdrag' ? (
              <div className="text-xl font-display font-bold text-[#005cbd] tracking-tight">smaajobber</div>
            ) : (
              <span className="text-xl font-display font-bold text-[#005cbd] tracking-tight">smaajobber</span>
            )}
          </a>
        </div>

        {/* Navigation Links for Large Screen */}
        <nav className="hidden md:flex items-center gap-8">
          <a 
            href="#oppdrag" 
            onClick={(e) => { e.preventDefault(); handleNav('se_oppdrag', 'push'); }}
            className={`font-sans font-medium text-sm transition-colors duration-200 cursor-pointer ${
              currentScreen === 'se_oppdrag' 
                ? 'text-[#005cbd] border-b-2 border-[#005cbd] pb-1' 
                : 'text-gray-500 hover:text-[#005cbd]'
            }`}
          >
            Se ledige oppdrag
          </a>
          <a 
            href="#leggut" 
            onClick={(e) => { e.preventDefault(); handleNav('legg_ut_oppdrag', 'slide_up'); }}
            className={`font-sans font-medium text-sm transition-colors duration-200 cursor-pointer ${
              currentScreen === 'legg_ut_oppdrag' 
                ? 'text-[#005cbd] border-b-2 border-[#005cbd] pb-1' 
                : 'text-gray-500 hover:text-[#005cbd]'
            }`}
          >
            Legg ut en jobb
          </a>
          <a 
            href="#hjelper" 
            onClick={(e) => { e.preventDefault(); handleNav('finn_hjelper', 'push'); }}
            className={`font-sans font-medium text-sm transition-colors duration-200 cursor-pointer ${
              currentScreen === 'finn_hjelper' 
                ? 'text-[#005cbd] border-b-2 border-[#005cbd] pb-1' 
                : 'text-gray-500 hover:text-[#005cbd]'
            }`}
          >
            Finn en hjelper
          </a>
        </nav>

        {/* Right Corner: User & Quick Info */}
        <div className="flex items-center gap-4">
          {currentScreen === 'dashbord' ? (
            <div className="flex items-center gap-3">
              <button className="text-gray-500 hover:text-[#005cbd] p-2 hover:bg-gray-100 rounded-full transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div 
                onClick={() => handleNav('dashbord', 'push')}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1.5 pr-3 rounded-full transition-colors font-sans"
              >
                <img 
                  className="w-8 h-8 rounded-full object-cover" 
                  alt="Erik Jensen" 
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" 
                />
                <span className="hidden md:block text-sm font-semibold text-gray-700">Erik Jensen</span>
              </div>
            </div>
          ) : currentScreen === 'finn_hjelper' ? (
            // Needs the account_circle ancestor target from Finn en hjelper screen
            <div className="flex items-center gap-2">
              <button className="text-gray-500 hover:text-[#005cbd] p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Bell size={20} />
              </button>
              <button className="text-gray-500 hover:text-[#005cbd] p-2 hover:bg-gray-100 rounded-full transition-colors">
                <MessageSquare size={20} />
              </button>
              <button 
                onClick={() => handleNav('dashbord', 'push')}
                className="text-gray-500 hover:text-[#005cbd] p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center account_circle"
              >
                <User size={22} className="account_circle" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => handleNav('dashbord', 'push')} 
                className="font-sans font-semibold text-sm text-[#005cbd] px-4 py-2 hover:bg-[#005cbd]/5 rounded-full transition-colors duration-200"
              >
                Logg inn
              </button>
              <button 
                onClick={() => handleNav('finn_hjelper', 'push')}
                className="hidden md:block bg-[#005cbd] text-white px-5 py-2 rounded-full font-sans font-semibold text-sm hover:bg-[#004591] transition-colors duration-200 active:scale-95 transition-transform"
              >
                Kom i gang
              </button>
            </div>
          )}

          {/* Mobile Menu Icon */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3 shadow-md animate-slideIn">
          <a 
            href="#oppdrag" 
            onClick={(e) => { e.preventDefault(); handleNav('se_oppdrag', 'push'); }}
            className="block text-gray-600 hover:text-[#005cbd] font-sans font-medium py-1"
          >
            Se ledige oppdrag
          </a>
          <a 
            href="#leggut" 
            onClick={(e) => { e.preventDefault(); handleNav('legg_ut_oppdrag', 'slide_up'); }}
            className="block text-gray-600 hover:text-[#005cbd] font-sans font-medium py-1"
          >
            Legg ut en jobb
          </a>
          <a 
            href="#hjelper" 
            onClick={(e) => { e.preventDefault(); handleNav('finn_hjelper', 'push'); }}
            className="block text-gray-600 hover:text-[#005cbd] font-sans font-medium py-1"
          >
            Finn en hjelper
          </a>
          <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
            <button 
              onClick={() => handleNav('dashbord', 'push')}
              className="w-full text-[#005cbd] font-sans font-semibold text-sm text-center py-2 border border-gray-200 rounded-full"
            >
              Logg inn
            </button>
            <button 
              onClick={() => handleNav('finn_hjelper', 'push')}
              className="w-full bg-[#005cbd] text-white font-sans font-semibold text-sm text-center py-2 rounded-full"
            >
              Kom i gang
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
