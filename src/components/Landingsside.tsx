import React, { useState } from 'react';
import { Screen } from '../types';
import { ArrowRight, ImageIcon, Mic, Search, Hammer, Briefcase } from 'lucide-react';

interface LandingssideProps {
  onNavigate: (screen: Screen, transition?: 'push' | 'push_back' | 'slide_up') => void;
  onSearchQuery?: (query: string) => void;
}

export default function Landingsside({ onNavigate, onSearchQuery }: LandingssideProps) {
  const [query, setQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearchQuery) {
        onSearchQuery(query);
      }
      onNavigate('se_oppdrag', 'push');
    }
  };

  const handleSuggestedPrompt = (promptText: string) => {
    setQuery(promptText);
    if (onSearchQuery) {
      onSearchQuery(promptText);
    }
    onNavigate('se_oppdrag', 'push');
  };

  return (
    <div className="flex-grow flex flex-col pt-24 pb-12 font-sans">
      <div className="max-w-4xl mx-auto px-4 md:px-8 w-full space-y-12">

        {/* Central AI Interface (Gemini Style) */}
        <div className="flex flex-col items-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pt-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 tracking-tight leading-tight">
              Hva kan jeg hjelpe deg med?
            </h1>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Finn hjelp til hjemmet eller tjen penger på småjobber.
            </p>
          </div>

          {/* AI Search input */}
          <form
            onSubmit={handleSearchSubmit}
            className="w-full relative shadow-xs hover:shadow-md border border-gray-200 focus-within:border-blue-500 rounded-3xl p-2 bg-white transition-all flex items-center gap-2 group max-w-3xl"
          >
            <button
              type="button"
              className="p-3 text-gray-400 hover:text-[#005cbd] hover:bg-gray-50 rounded-full transition-colors shrink-0"
              title="Last opp bilde"
            >
              <ImageIcon size={22} />
            </button>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Trenger du hjelp med å klippe gresset? Eller vil du male for naboen?"
              className="flex-grow bg-transparent border-none text-base text-gray-800 placeholder-gray-400 outline-none focus:ring-0 px-2 py-3 leading-relaxed"
            />
            <div className="flex items-center gap-1 shrink-0 pr-1">
              <button
                type="button"
                className="p-3 text-gray-400 hover:text-[#005cbd] hover:bg-gray-50 rounded-full transition-colors"
                title="Bruk tale"
              >
                <Mic size={22} />
              </button>
              <button
                type="submit"
                className="p-3 bg-[#005cbd] text-white rounded-full hover:bg-[#004591] transition-colors shadow-xs"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </form>

          {/* Suggested prompts in Pills */}
          <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
            <button
              onClick={() => handleSuggestedPrompt('Hvordan fungerer smaajobber?')}
              className="px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-[#005cbd] hover:text-[#005cbd] hover:bg-gray-50 transition-all font-medium cursor-pointer"
            >
              Hvordan fungerer smaajobber?
            </button>
            <button
              onClick={() => handleSuggestedPrompt('Finn vaskehjelp i nærheten')}
              className="px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-[#005cbd] hover:text-[#005cbd] hover:bg-gray-50 transition-all font-medium cursor-pointer"
            >
              Finn vaskehjelp i nærheten
            </button>
            <button
              onClick={() => handleSuggestedPrompt('Male gjerde')}
              className="px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-[#005cbd] hover:text-[#005cbd] hover:bg-gray-50 transition-all font-medium cursor-pointer"
            >
              Ledige malejobber
            </button>
          </div>
        </div>

        {/* Two-Card Layout matching specs and screenshots */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto pt-6">
          {/* Card 1: Jeg trenger hjelp */}
          {/* Must support xpath: `//h2[contains(text(), 'Jeg trenger hjelp')]/ancestor::a` */}
          <a
            href="#legg_ut"
            onClick={(e) => { e.preventDefault(); onNavigate('legg_ut_oppdrag', 'slide_up'); }}
            className="nordic-card group border border-gray-200 bg-white rounded-2xl p-8 min-h-[280px] relative overflow-hidden flex flex-col justify-between cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#005cbd]"
            style={{ textDecoration: 'none' }}
          >
            <div className="absolute inset-0 opacity-5 group-hover:opacity-[0.08] transition-opacity duration-500">
              <img
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600"
                alt="Help"
                className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="relative z-10 w-full space-y-4">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-[#005cbd]">
                <Hammer size={22} />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-gray-900 leading-snug">
                  Jeg trenger hjelp
                </h2>
                <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                  Publiser ditt oppdrag og motta tilbud fra flinke folk.
                </p>
              </div>
            </div>

            <div className="relative z-10 pt-4 self-start">
              {/* Supports matching `//a[contains(text(), 'Legg ut en jobb')]` internally or as target */}
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#005cbd] group-hover:translate-x-1 transition-transform">
                Legg ut en jobb
                <ArrowRight size={16} />
              </span>
            </div>
          </a>

          {/* Card 2: Jeg vil jobbe */}
          {/* Must support xpath: `//h2[contains(text(), 'Jeg vil jobbe')]/ancestor::a` */}
          <a
            href="#se_jobber"
            onClick={(e) => { e.preventDefault(); onNavigate('se_oppdrag', 'push'); }}
            className="nordic-card group border border-gray-200 bg-white rounded-2xl p-8 min-h-[280px] relative overflow-hidden flex flex-col justify-between cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#005cbd]"
            style={{ textDecoration: 'none' }}
          >
            <div className="absolute inset-0 opacity-5 group-hover:opacity-[0.08] transition-opacity duration-500">
              <img
                src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600"
                alt="Worker"
                className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="relative z-10 w-full space-y-4">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <Briefcase size={22} />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-gray-900 leading-snug">
                  Jeg vil jobbe
                </h2>
                <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                  Bruk dine ferdigheter til å hjelpe andre og tjen ekstra penger.
                </p>
              </div>
            </div>

            <div className="relative z-10 pt-4 self-start">
              {/* Supports matching `//a[contains(text(), 'Se ledige oppdrag')]` internally or as target */}
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 group-hover:translate-x-1 transition-transform">
                Se ledige oppdrag
                <ArrowRight size={16} />
              </span>
            </div>
          </a>
        </div>

      </div>
    </div>
  );
}
