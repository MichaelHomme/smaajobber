import React from 'react';
import { Screen } from '../types';

interface FooterProps {
  onNavigate?: (screen: Screen, transition?: 'push' | 'push_back' | 'slide_up') => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start">
          <div 
            onClick={() => onNavigate?.('landingsside', 'push_back')}
            className="flex items-center gap-2 cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
          >
            <img 
              alt="smaajobber" 
              className="h-5 w-5 grayscale opacity-70" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKAXYJ9EFEgCNf8-yC0iA_ZaQGqDVa9vAu0hizhexydbMAxaPLaGqupXnBPsTQXFQO_UrRUn4_pW6zuLS1I37ll_qnUy96T5PxghKeK6x0Ea1tlIUZCFlcnEZ67b9YrWFpSLu_PVFzZtIP784qiBkZxk-cXXgiHbPFOiQPBuKePJNwzO42jDmc3gB-iZ4bWkvCerGd-S8LUMIwRokyU8dqvsMwVMVxX98DcCDVRdNYUtguFoB5gOAz6-5RPvY2z2KQ1yZ65twCses" 
            />
            <span className="text-sm font-display font-semibold text-gray-700">smaajobber</span>
          </div>
          <p className="font-sans text-xs text-gray-500 mt-2 text-center md:text-left">
            © 2024 smaajobber AS - Nordisk enkelhet for en enklere hverdag. All rights reserved.
          </p>
        </div>

        <nav className="flex flex-wrap justify-center gap-6">
          <a className="font-sans text-xs text-gray-500 hover:text-[#005cbd] transition-colors" href="#om">Om oss</a>
          <a className="font-sans text-xs text-gray-500 hover:text-[#005cbd] transition-colors" href="#sikkerhet">Sikkerhet</a>
          <a className="font-sans text-xs text-gray-500 hover:text-[#005cbd] transition-colors" href="#vilkar">Vilkår</a>
          <a className="font-sans text-xs text-gray-500 hover:text-[#005cbd] transition-colors" href="#personvern">Personvern</a>
        </nav>
      </div>
    </footer>
  );
}
