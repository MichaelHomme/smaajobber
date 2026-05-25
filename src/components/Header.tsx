import React, { useState } from 'react';
import { Screen, Bruker } from '../types';
import { Bell, MessageSquare, User, Menu, X } from 'lucide-react';

interface HeaderProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen, transition?: 'push' | 'push_back' | 'slide_up') => void;
  currentUser: Bruker | null;
  authLoading: boolean;
}

export default function Header({ currentScreen, onNavigate, currentUser, authLoading }: HeaderProps) {
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
          {authLoading ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
          ) : currentUser ? (
            <div className="flex items-center gap-3">
              <button className="text-gray-500 hover:text-[#005cbd] p-2 hover:bg-gray-100 rounded-full transition-colors relative">
                <Bell size={20} />
              </button>
              <div 
                onClick={() => handleNav('dashbord', 'push')}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1.5 pr-3 rounded-full transition-colors font-sans"
              >
                <div className="w-8 h-8 rounded-full bg-[#005cbd]/10 text-[#005cbd] flex items-center justify-center font-bold text-xs">
                  {currentUser.navn.charAt(0)}
                </div>
                <span className="hidden md:block text-sm font-semibold text-gray-700">{currentUser.navn}</span>
              </div>
              <button 
                onClick={() => { window.location.href = '/api/auth/logout'; }}
                className="font-sans text-xs text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
              >
                Logg ut
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => { window.location.href = '/api/auth/vipps'; }}
                className="bg-[#ff5b24] text-white px-4 py-2 rounded-full font-sans font-semibold text-xs hover:bg-[#e04e1b] transition-all active:scale-95 flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span className="font-bold">v</span> Logg inn med Vipps
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
            {currentUser ? (
              <>
                <div className="text-xs text-gray-400 text-center font-sans mb-1">
                  Logget inn som <span className="font-semibold text-gray-600">{currentUser.navn}</span>
                </div>
                <button 
                  onClick={() => handleNav('dashbord', 'push')}
                  className="w-full text-[#005cbd] font-sans font-semibold text-sm text-center py-2 border border-gray-200 rounded-full cursor-pointer"
                >
                  Min side (Dashbord)
                </button>
                <button 
                  onClick={() => { window.location.href = '/api/auth/logout'; }}
                  className="w-full bg-red-50 text-red-600 font-sans font-semibold text-sm text-center py-2 rounded-full cursor-pointer hover:bg-red-100 transition-colors"
                >
                  Logg ut
                </button>
              </>
            ) : (
              <button 
                onClick={() => { window.location.href = '/api/auth/vipps'; }}
                className="w-full bg-[#ff5b24] text-white font-sans font-semibold text-sm text-center py-2 rounded-full cursor-pointer"
              >
                Logg inn med Vipps
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
