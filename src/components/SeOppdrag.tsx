import React, { useState, useMemo } from 'react';
import { Screen, Oppdrag } from '../types';
import { Search, MapPin, Calendar, Image as ImageIcon, Mic, Sparkles, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

interface SeOppdragProps {
  onNavigate: (screen: Screen, transition?: 'push' | 'push_back' | 'slide_up') => void;
  oppdragList: Oppdrag[];
  searchQuery: string;
  onSearchQueryChange: (q: string) => void;
}

export default function SeOppdrag({ onNavigate, oppdragList, searchQuery, onSearchQueryChange }: SeOppdragProps) {
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [selectedKategorier, setSelectedKategorier] = useState<string[]>(['alle']);
  const [minPris, setMinPris] = useState<number | ''>('');
  const [maxPris, setMaxPris] = useState<number | ''>('');
  const [sortBy, setSortBy] = useState<'nyeste' | 'laveste_pris' | 'hoyeste_pris'>('nyeste');
  const [activePage, setActivePage] = useState(1);

  // Sync state query with incoming prop if it changes
  React.useEffect(() => {
    setSearchTerm(searchQuery);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchQueryChange(searchTerm);
  };

  const handleCategoryChange = (kat: string) => {
    if (kat === 'alle') {
      setSelectedKategorier(['alle']);
    } else {
      let next = selectedKategorier.filter(x => x !== 'alle');
      if (next.includes(kat)) {
        next = next.filter(x => x !== kat);
        if (next.length === 0) next = ['alle'];
      } else {
        next.push(kat);
      }
      setSelectedKategorier(next);
    }
  };

  const filteredOppdrag = useMemo(() => {
    return oppdragList.filter(item => {
      // Search Box filter
      const term = searchQuery.toLowerCase();
      if (term) {
        const matchesTitle = item.tittel.toLowerCase().includes(term);
        const matchesDesc = item.beskrivelse.toLowerCase().includes(term);
        const matchesLoc = item.sted.toLowerCase().includes(term);
        if (!matchesTitle && !matchesDesc && !matchesLoc) return false;
      }

      // Sidebar Filter text search too
      const sidebarTerm = searchTerm.toLowerCase();
      if (sidebarTerm && sidebarTerm !== searchQuery.toLowerCase()) {
        const matchesTitle = item.tittel.toLowerCase().includes(sidebarTerm);
        const matchesDesc = item.beskrivelse.toLowerCase().includes(sidebarTerm);
        if (!matchesTitle && !matchesDesc) return false;
      }

      // Category filter
      if (!selectedKategorier.includes('alle')) {
        // map kategori enum to the displayed sidebar name
        let itemCategoryVal = item.kategori.toLowerCase();
        // Categorisering i form: hage, flytting, vasking, annet
        // Checkboxes array names are 'hage', 'flytting', 'vasking', 'annet'
        if (!selectedKategorier.includes(itemCategoryVal)) return false;
      }

      // Min/Max price filters
      if (minPris !== '' && item.pris < minPris) return false;
      if (maxPris !== '' && item.pris > maxPris) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'laveste_pris') {
        return a.pris - b.pris;
      }
      if (sortBy === 'hoyeste_pris') {
        return b.pris - a.pris;
      }
      // default: nyeste first (or id sorting)
      return b.opprettetDato.localeCompare(a.opprettetDato);
    });
  }, [oppdragList, searchQuery, searchTerm, selectedKategorier, minPris, maxPris, sortBy]);

  const popularSearches = ['Flyttehjelp', 'Vaske leilighet', 'Male gjerde'];

  return (
    <div className="flex-grow pt-24 pb-12 font-sans bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
        
        {/* Banner with AI Search */}
        <section className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 tracking-tight">Se ledige oppdrag</h1>
          <p className="text-gray-500 text-base mt-2 max-w-xl">
            Bla gjennom tusenvis av oppdrag i ditt nærområde og tjen penger på dine ferdigheter.
          </p>

          <div className="mt-8 max-w-3xl">
            <form onSubmit={handleSearchSubmit} className="bg-white p-2 rounded-2xl border border-blue-100 shadow-md flex items-center gap-2">
              <span className="p-2.5 text-[#005cbd] bg-blue-50 rounded-xl shrink-0">
                <Sparkles size={20} />
              </span>
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Beskriv jobben du leter etter, f.eks. 'Hagearbeid i Oslo neste helg'..."
                className="flex-grow bg-transparent border-none text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-0 px-2 py-3"
              />
              <div className="flex items-center gap-1 border-l border-gray-100 pl-2 shrink-0">
                <button type="button" className="p-2 text-gray-400 hover:text-[#005cbd] hover:bg-gray-50 rounded-full transition-colors" title="Last opp bilde">
                  <ImageIcon size={18} />
                </button>
                <button type="button" className="p-2 text-gray-400 hover:text-[#005cbd] hover:bg-gray-50 rounded-full transition-colors" title="Snakk til meg">
                  <Mic size={18} />
                </button>
                <button type="submit" className="ml-1 bg-[#005cbd] text-white p-2.5 rounded-xl hover:bg-[#004591] transition-all shadow-xs active:scale-95">
                  <Sparkles size={16} className="inline mr-1" /> AI Søk
                </button>
              </div>
            </form>

            <div className="mt-3 flex flex-wrap gap-2 items-center justify-center md:justify-start">
              <span className="text-xs text-gray-400">Populære søk:</span>
              {popularSearches.map((s, idx) => (
                <button 
                  key={idx} 
                  type="button" 
                  onClick={() => { setSearchTerm(s); onSearchQueryChange(s); }}
                  className="text-xs bg-white border border-gray-200 hover:border-[#005cbd] hover:text-[#005cbd] px-3 py-1 rounded-full text-gray-600 transition-colors cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Content columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Area */}
          <aside className="lg:col-span-3 flex flex-col gap-6">
            
            {/* Filters block */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
              <h2 className="font-display font-medium text-sm text-gray-800 border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
                <Filter size={18} className="text-[#005cbd]" />
                Filtre
              </h2>

              {/* Text search input inside filters */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 font-sans label-sm">Fritekst</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Hva leter du etter?"
                    className="w-full bg-white border border-gray-200 rounded-lg py-2 pl-8 pr-4 text-xs focus:ring-1 focus:ring-[#005cbd] focus:border-[#005cbd] outline-none"
                  />
                  <Search size={14} className="absolute left-2.5 top-3 text-gray-400" />
                </div>
              </div>

              {/* Category selector */}
              <div className="mb-5 font-sans">
                <label className="block text-xs font-semibold text-gray-500 mb-2 font-sans label-sm">Kategorier</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700 hover:text-[#005cbd] transition-colors leading-none">
                    <input 
                      type="checkbox" 
                      className="rounded-sm border-gray-300 text-[#005cbd] focus:ring-[#005cbd]"
                      checked={selectedKategorier.includes('alle')}
                      onChange={() => handleCategoryChange('alle')}
                    />
                    <span>Alle kategorier</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700 hover:text-[#005cbd] transition-colors leading-none">
                    <input 
                      type="checkbox" 
                      className="rounded-sm border-gray-300 text-[#005cbd] focus:ring-[#005cbd]"
                      checked={selectedKategorier.includes('hage')}
                      onChange={() => handleCategoryChange('hage')}
                    />
                    <span>Hagearbeid</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700 hover:text-[#005cbd] transition-colors leading-none">
                    <input 
                      type="checkbox" 
                      className="rounded-sm border-gray-300 text-[#005cbd] focus:ring-[#005cbd]"
                      checked={selectedKategorier.includes('flytting')}
                      onChange={() => handleCategoryChange('flytting')}
                    />
                    <span>Flyttehjelp</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700 hover:text-[#005cbd] transition-colors leading-none">
                    <input 
                      type="checkbox" 
                      className="rounded-sm border-gray-300 text-[#005cbd] focus:ring-[#005cbd]"
                      checked={selectedKategorier.includes('vasking')}
                      onChange={() => handleCategoryChange('vasking')}
                    />
                    <span>Rengjøring / Vask</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700 hover:text-[#005cbd] transition-colors leading-none">
                    <input 
                      type="checkbox" 
                      className="rounded-sm border-gray-300 text-[#005cbd] focus:ring-[#005cbd]"
                      checked={selectedKategorier.includes('annet')}
                      onChange={() => handleCategoryChange('annet')}
                    />
                    <span>Montering / Annet</span>
                  </label>
                </div>
              </div>

              {/* Price range selector */}
              <div className="mb-6 font-sans">
                <label className="block text-xs font-semibold text-gray-500 mb-2 font-sans label-sm">Prisområde (kr)</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    placeholder="Fra" 
                    value={minPris}
                    onChange={(e) => setMinPris(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-white border border-gray-200 rounded-lg py-1.5 px-3 text-xs focus:ring-1 focus:ring-[#005cbd] focus:border-[#005cbd]"
                  />
                  <span className="text-gray-400 text-xs">—</span>
                  <input 
                    type="number" 
                    placeholder="Til" 
                    value={maxPris}
                    onChange={(e) => setMaxPris(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-white border border-gray-200 rounded-lg py-1.5 px-3 text-xs focus:ring-1 focus:ring-[#005cbd] focus:border-[#005cbd]"
                  />
                </div>
              </div>

              <button 
                type="button" 
                onClick={() => onSearchQueryChange(searchTerm)}
                className="w-full bg-blue-50 text-[#005cbd] font-sans font-semibold text-xs py-2.5 rounded-lg hover:bg-blue-100 transition-colors"
              >
                Oppdater resultat
              </button>
            </div>

            {/* Sidebar Promo ad matching criteria xpath:
                //a[contains(text(), 'Bli en smaajobber i dag!')]/ancestor::div/a  -> Finn en hjelper */}
            <div className="relative overflow-hidden rounded-xl h-64 bg-teal-500 p-6 flex flex-col justify-end text-white border border-emerald-600/10 shadow-xs">
              <img 
                className="absolute inset-0 w-full h-full object-cover opacity-20" 
                alt="Ad cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNO4XIoPuZPv4Gwts24ESvpSgbf9OohXVCOIbDSh_uVwEBbAIsGck0swyt8ql2B3uttoV9qzLBTaJeDDkTnh-drHJ8Gw6ppdp4vEYCAepxBNStmKd_yDkFjnidZRzaqqCMM6IXtRjgUUc_BTWymnndEgiA0t0bGEXipjwQvoU5NYAEQsLoQY3iv6qQ5hVZf4MBxWDQlSSfgBesveg032P6b-LCEKkovU193IFqf8i1zDaYBn0Z6uH5qN2H8R2Im0yTbrd1EF3q6kU" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-teal-900/40 via-teal-800/10 to-transparent"></div>
              
              <div className="relative z-10 flex flex-col justify-end h-full">
                <p className="font-display font-bold text-xl leading-snug">Bli en smaajobber i dag!</p>
                <p className="text-xs text-teal-100 mt-1 mb-4 leading-normal">Tjen penger på din egen tidsplan.</p>
                <a 
                  href="#finn_hjelper"
                  onClick={(e) => { e.preventDefault(); onNavigate('finn_hjelper', 'push'); }}
                  className="font-sans font-semibold text-center text-[#26676d] bg-white px-4 py-2 rounded-lg text-xs hover:bg-neutral-100 transition-colors duration-200 block shadow-xs"
                >
                  Les mer
                </a>
              </div>
            </div>

          </aside>

          {/* Job listings container */}
          <section className="lg:col-span-9 flex flex-col gap-4">
            
            {/* Catalog Sorting bar */}
            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <span className="text-xs text-gray-500 font-sans">
                Viser <span className="font-bold text-gray-700">{filteredOppdrag.length}</span> oppdrag
              </span>
              
              <div className="flex items-center gap-2 font-sans">
                <span className="text-xs text-gray-400">Sorter etter:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent border-none text-xs font-bold text-[#005cbd] cursor-pointer focus:ring-0 py-0 pl-1"
                >
                  <option value="nyeste">Nyeste først</option>
                  <option value="laveste_pris">Pris: lav - høy</option>
                  <option value="hoyeste_pris">Pris: høy - lav</option>
                </select>
              </div>
            </div>

            {/* List of active gigs */}
            <div className="space-y-4">
              {filteredOppdrag.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center border border-gray-200 shadow-xs">
                  <p className="text-gray-400 text-sm">Fant ingen ledige oppdrag som stemte med filtreringen din.</p>
                  <button 
                    onClick={() => { setSearchTerm(''); onSearchQueryChange(''); setSelectedKategorier(['alle']); setMinPris(''); setMaxPris(''); }}
                    className="mt-4 inline-block text-xs font-semibold text-[#005cbd] hover:underline"
                  >
                    Nullstill filtre og søk på nytt
                  </button>
                </div>
              ) : (
                filteredOppdrag.map((oppdrag) => (
                  <article 
                    key={oppdrag.id}
                    className="bg-white border border-gray-200 rounded-xl p-5 hover:border-[#005cbd] hover:shadow-md transition-all flex flex-col md:flex-row gap-5 group cursor-pointer"
                  >
                    {oppdrag.bilde ? (
                      <div className="w-full md:w-44 h-28 shrink-0 relative overflow-hidden rounded-lg bg-gray-100">
                        <img 
                          alt={oppdrag.tittel} 
                          className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-500" 
                          src={oppdrag.bilde} 
                        />
                        <div className="absolute top-2 left-2 bg-[#005cbd]/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-sans">
                          {oppdrag.kategori === 'hage' ? 'Hage' : oppdrag.kategori === 'vasking' ? 'Hjem' : 'Småjobb'}
                        </div>
                      </div>
                    ) : (
                      <div className="w-full md:w-44 h-28 shrink-0 relative overflow-hidden rounded-lg bg-blue-50/50 flex flex-col items-center justify-center p-3 text-[#005cbd]">
                        <span className="text-[10px] font-bold uppercase tracking-wider font-sans mb-1 px-2 py-0.5 bg-blue-100 rounded-full">
                          {oppdrag.kategori}
                        </span>
                        <p className="text-xs text-center font-display font-semibold line-clamp-2 leading-tight">
                          {oppdrag.tittel}
                        </p>
                      </div>
                    )}

                    <div className="flex-grow flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="font-display font-semibold text-base text-gray-900 group-hover:text-[#005cbd] transition-colors leading-snug">
                            {oppdrag.tittel}
                          </h3>
                          <span className="text-[#005cbd] font-display font-extrabold text-base whitespace-nowrap shrink-0">
                            {oppdrag.pris.toLocaleString('no-NO')} kr
                          </span>
                        </div>
                        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 font-sans pt-1">
                          {oppdrag.beskrivelse}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 font-sans border-t border-gray-100 pt-3">
                        <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                          <MapPin size={14} className="text-gray-300" />
                          <span>{oppdrag.sted}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                          <Calendar size={14} className="text-gray-300" />
                          <span>{oppdrag.dato}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>

            {/* Pagination Controls */}
            {filteredOppdrag.length > 0 && (
              <div className="mt-8 flex justify-center items-center gap-1.5 font-sans">
                <button 
                  onClick={() => setActivePage(1)} 
                  disabled={activePage === 1}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-100 transition-colors disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                </button>
                <button 
                  onClick={() => setActivePage(1)}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg font-semibold text-xs transition-colors ${
                    activePage === 1 
                      ? 'bg-[#005cbd] text-white' 
                      : 'border border-gray-200 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  1
                </button>
                <button 
                  onClick={() => setActivePage(2)}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg font-semibold text-xs transition-colors ${
                    activePage === 2 
                      ? 'bg-[#005cbd] text-white' 
                      : 'border border-gray-200 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  2
                </button>
                <span className="px-1 text-gray-400 text-xs">...</span>
                <button 
                  onClick={() => setActivePage(12)}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg font-semibold text-xs transition-colors ${
                    activePage === 12 
                      ? 'bg-[#005cbd] text-white' 
                      : 'border border-gray-200 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  12
                </button>
                <button 
                  onClick={() => setActivePage(2)}
                  disabled={activePage === 12}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-100 transition-colors disabled:opacity-40"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}

          </section>

        </div>

      </div>
    </div>
  );
}
