import React, { useState } from 'react';
import { Screen, Hjelper } from '../types';
import { Search, Sparkles, BookOpen, Music, Dog, Hammer, Trash2, Calendar, Star, Send, User, ChevronDown } from 'lucide-react';

interface FinnHjelperProps {
  onNavigate: (screen: Screen, transition?: 'push' | 'push_back' | 'slide_up') => void;
  hjelpereList: Hjelper[];
}

export default function FinnHjelper({ onNavigate, hjelpereList }: FinnHjelperProps) {
  const [searchVal, setSearchVal] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<'rating' | 'pris_lav' | 'naermest'>('rating');

  const filteredHjelpere = React.useMemo(() => {
    return hjelpereList.filter(item => {
      if (searchVal) {
        const text = searchVal.toLowerCase();
        const matchesName = item.navn.toLowerCase().includes(text);
        const matchesRolle = item.rolle.toLowerCase().includes(text);
        const matchesDesc = item.beskrivelse.toLowerCase().includes(text);
        if (!matchesName && !matchesRolle && !matchesDesc) return false;
      }
      if (selectedCategory) {
        const cat = selectedCategory.toLowerCase();
        const role = item.rolle.toLowerCase();
        const bio = item.beskrivelse.toLowerCase();
        if (!role.includes(cat) && !bio.includes(cat)) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'pris_lav') {
        return a.pris - b.pris;
      }
      // default sortBy rating
      return b.rating - a.rating;
    });
  }, [hjelpereList, searchVal, selectedCategory, sortBy]);

  const categories = [
    { id: 'leksehjelp', label: 'Leksehjelp', icon: '📖' },
    { id: 'piano', label: 'Pianolærer', icon: '🎹' },
    { id: 'hund', label: 'Hundepass', icon: '🐕' },
    { id: 'vaktmester', label: 'Vaktmester', icon: '🔧' },
    { id: 'vask', label: 'Vaskehjelp', icon: '🧹' },
    { id: 'hage', label: 'Hagearbeid', icon: '🌳' },
    { id: 'flytte', label: 'Flyttehjelp', icon: '🚛' },
    { id: 'trening', label: 'Trening', icon: '💪' },
  ];

  return (
    <div className="flex-grow pt-24 pb-12 font-sans bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">

        {/* Banner with AI Search & Legg ut et oppdrag prompt */}
        <section className="mb-14">
          <div className="bg-gradient-to-tr from-[#primary-container] to-blue-50 bg-blue-100/40 rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col items-center text-center shadow-xs border border-blue-100/50">
            {/* Ambient gradients */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-emerald-100/40 rounded-full opacity-50 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-48 h-48 bg-purple-100/40 rounded-full opacity-50 blur-3xl"></div>

            <h1 className="text-3xl md:text-5xl font-display font-black text-gray-900 mb-3 tracking-tight max-w-2xl leading-tight">
              Hvem trenger du hjelp av i dag?
            </h1>
            <p className="text-sm md:text-base text-gray-500 mb-8 max-w-lg leading-relaxed">
              Fra leksehjelp til hundepass – finn de flinkeste i enten i nabolaget ditt eller i hele Norge.
            </p>

            {/* AI assisted search input bar */}
            <div className="w-full max-w-2xl relative z-10 flex flex-col md:flex-row gap-3">
              <div className="flex-grow relative shadow-xs">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#005cbd]">
                  <Sparkles size={18} />
                </span>
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Prøv: Jeg trenger en pianolærer for min sønn på 8 år..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-none shadow-md text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#005cbd] bg-white bg-opacity-100 focus:bg-white transition-all outline-hidden leading-relaxed"
                />
              </div>
              <button
                onClick={() => setSelectedCategory('')}
                className="bg-[#005cbd] text-white px-8 py-4 rounded-xl font-display font-semibold text-xs shadow-md flex items-center justify-center gap-2 hover:bg-[#004591] transition-all active:scale-95 shrink-0"
              >
                <Search size={16} /> Søk nå
              </button>
            </div>

            {/* Quick searches */}
            <div className="mt-4 flex flex-wrap gap-2 overflow-x-auto no-scrollbar pb-2 z-10">
              <span className="text-xs text-gray-400 self-center">Populære søk:</span>
              <button onClick={() => setSearchVal('Flyttehjelp')} className="text-xs text-[#005cbd] hover:underline font-semibold">Flyttehjelp</button>
              <button onClick={() => setSearchVal('Vask')} className="text-xs text-[#005cbd] hover:underline font-semibold">Vasking</button>
              <button onClick={() => setSearchVal('Hage')} className="text-xs text-[#005cbd] hover:underline font-semibold">Hagearbeid</button>
            </div>

            {/* Main "Legg ut et oppdrag" button target matching spec: 
                //button[contains(text(), 'Legg ut et oppdrag')] -> Legg ut et oppdrag (slide_up transition) */}
            <div className="mt-6 z-10">
              <button
                onClick={() => onNavigate('legg_ut_oppdrag', 'slide_up')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-display font-semibold text-xs py-2 px-6 rounded-full shadow-xs hover:shadow-sm active:scale-95 transition-all text-center border border-emerald-600/10"
              >
                Legg ut et oppdrag
              </button>
            </div>
          </div>
        </section>

        {/* Categories block */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg md:text-xl font-display font-bold text-gray-900 tracking-tight">Utforsk kategorier</h2>
            <button onClick={() => setSelectedCategory('')} className="text-[#005cbd] font-sans font-semibold text-xs hover:underline cursor-pointer">
              Se alle
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  if (selectedCategory === cat.id) {
                    setSelectedCategory('');
                  } else {
                    setSelectedCategory(cat.id);
                  }
                }}
                className={`flex flex-col items-center gap-2.5 min-w-[90px] group cursor-pointer`}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all shadow-xs border ${selectedCategory === cat.id
                  ? 'bg-[#005cbd] border-[#005cbd] text-white scale-105'
                  : 'bg-white border-gray-200 group-hover:border-[#005cbd] group-hover:bg-[#005cbd]/5'
                  }`}>
                  {cat.icon}
                </div>
                <span className={`text-xs font-semibold tracking-tight transition-colors ${selectedCategory === cat.id ? 'text-[#005cbd] font-bold' : 'text-gray-500 group-hover:text-[#005cbd]'
                  }`}>
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Catalog grid */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg md:text-xl font-display font-bold text-gray-900 tracking-tight">Anbefalte hjelpere i nærheten</h2>

            <div className="flex items-center gap-1 font-sans">
              <span className="text-xs text-gray-400">Sorter etter:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent border-none text-xs font-bold text-[#005cbd] cursor-pointer focus:ring-0 py-0 pr-6"
              >
                <option value="rating">Beste vurdering</option>
                <option value="pris_lav">Pris (lav-høy)</option>
              </select>
            </div>
          </div>

          {filteredHjelpere.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
              <p className="text-gray-400 text-sm">Fant ingen hjelpere i nærheten som stemte med valgte filter.</p>
              <button onClick={() => { setSearchVal(''); setSelectedCategory(''); }} className="mt-4 text-xs font-semibold text-[#005cbd] hover:underline">
                Vis alle hjelpere
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHjelpere.map((h) => (
                <article
                  key={h.id}
                  className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden hover:shadow-lg transition-all flex flex-col group h-full shadow-xs"
                >
                  <div className="h-36 relative overflow-hidden bg-gray-100 shrink-0">
                    <img
                      alt={h.navn}
                      className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-500"
                      src={h.bilde}
                    />
                    {h.fremhevet && (
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full text-[10px] font-bold text-[#005cbd] shadow-xs uppercase tracking-wider font-sans">
                        Topprangert
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-grow justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <div>
                          <h3 className="font-display font-bold text-base text-gray-900 group-hover:text-[#005cbd] transition-colors leading-snug">
                            {h.navn}
                          </h3>
                          <p className="text-xs font-medium text-[#005cbd] mt-0.5">{h.rolle}</p>
                        </div>
                        <div className="flex flex-col items-end font-sans">
                          <span className="font-extrabold text-[#005cbd] text-base leading-none">
                            {h.pris},-
                          </span>
                          <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-wide">
                            {h.enhet}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 mb-3 font-sans">
                        <Star size={14} className="text-amber-400 shrink-0" fill="currentColor" />
                        <span className="font-bold text-xs text-gray-800">{h.rating.toFixed(1)}</span>
                        <span className="text-gray-400 text-[10px]">({h.antallVurderinger} vurderinger)</span>
                      </div>

                      <p className="text-gray-500 text-xs leading-relaxed line-clamp-3 font-sans mb-6">
                        {h.beskrivelse}
                      </p>
                    </div>

                    <div className="flex gap-2 font-sans pt-4 border-t border-gray-100 mt-auto">
                      <button className="flex-grow bg-[#005cbd] text-white py-2.5 rounded-lg text-xs font-semibold hover:bg-[#004591] transition-all active:scale-95 shadow-xs">
                        Send melding
                      </button>
                      <button
                        onClick={() => onNavigate('dashbord', 'push')}
                        className="px-3 border border-gray-200 text-gray-400 hover:text-[#005cbd] hover:border-[#005cbd]/30 hover:bg-[#005cbd]/5 rounded-lg flex items-center justify-center transition-all active:scale-95"
                        title="Se profil"
                      >
                        <User size={14} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Show more button */}
          <div className="mt-8 flex justify-center">
            <button className="border border-gray-200 hover:border-[#005cbd] hover:text-[#005cbd] text-gray-600 px-8 py-2.5 rounded-xl text-xs font-semibold hover:bg-gray-50 transition-colors active:scale-95">
              Last inn flere hjelpere
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
