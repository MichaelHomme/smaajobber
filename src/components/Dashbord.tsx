import React, { useState } from 'react';
import { Screen, Oppdrag } from '../types';
import { Sparkles, ImageIcon, Mic, ArrowRight, Gavel, CheckCircle2, Star, HardDrive, TrendingUp, MoreVertical, MapPin } from 'lucide-react';

interface DashbordProps {
  onNavigate: (screen: Screen, transition?: 'push' | 'push_back' | 'slide_up') => void;
  oppdragList: Oppdrag[];
}

export default function Dashbord({ onNavigate, oppdragList }: DashbordProps) {
  const [aiQuery, setAiQuery] = useState('');
  const [aiWorking, setAiWorking] = useState(false);
  const [aiTip, setAiTip] = useState('');

  const handleAISearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    setAiWorking(true);
    setTimeout(() => {
      let advice = 'Her er et godt tips: For å øke sjansene for å vinne budet på "Plenklipping og hagearbeid", anbefaler jeg å legge til bilder av tidligere utførte hagejobber i profilen din, samt verifisere politiattesten din.';
      const l = aiQuery.toLowerCase();
      if (l.includes('flere') || l.includes('jobb') || l.includes('få')) {
        advice = 'Et lurt AI-tips: Hjelpere som svarer innen 15 minutter har 3 ganger høyere sjanse for å få tilslaget! Skru på push-varslinger så du aldri går glipp av en forespørsel.';
      } else if (l.includes('bud') || l.includes('svar')) {
        advice = 'Budstatus: Ditt bud på 850 kr for plenklipping ligger for øyeblikket til vurdering hos eieren. Eieren har tidligere godkjent bud innen 24 timer.';
      } else if (l.includes('pris') || l.includes('tjene')) {
        advice = 'Prisveiledning: Basert på din erfaring og tilbakemeldinger, kan du øke timesatsen din til 250 kr for fremtidige renholds- og monteringsjobber.';
      }
      setAiTip(advice);
      setAiQuery('');
      setAiWorking(false);
    }, 1000);
  };

  // Extract custom active bids from app state
  const activeBids = oppdragList.filter(o => o.status === 'Venter på svar' || o.status === 'Vurdert av eier' || o.id === 'o1' || o.id === 'o2' || o.id === 'o4');

  return (
    <div className="flex-grow pt-24 pb-12 font-sans bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">

        {/* Centralized Gemini-style AI support bar */}
        <div className="mb-10 max-w-3xl mx-auto w-full">
          <form
            onSubmit={handleAISearchSubmit}
            className="bg-white p-2 rounded-2xl border border-gray-200 shadow-lg flex items-center gap-3 hover:border-blue-500 transition-all font-sans"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#005cbd] to-emerald-600 flex items-center justify-center text-white shrink-0 shadow-xs">
              <Sparkles size={20} className={aiWorking ? 'animate-spin' : ''} />
            </div>

            <input
              type="text"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              placeholder="Spør AI-assistenten om råd eller hjelp til dine oppdrag..."
              className="flex-grow bg-transparent border-none text-sm text-gray-800 placeholder-gray-400 focus:ring-0 px-2 py-3"
            />

            <div className="flex items-center gap-1 shrink-0 pr-1">
              <button type="button" className="p-2 text-gray-400 hover:text-[#005cbd] hover:bg-gray-50 rounded-full transition-colors" title="Bruk tale">
                <Mic size={18} />
              </button>
              <button type="button" className="p-2 text-gray-400 hover:text-[#005cbd] hover:bg-gray-50 rounded-full transition-colors" title="Last opp bilde">
                <ImageIcon size={18} />
              </button>
              <button
                type="submit"
                className="bg-[#005cbd] text-white h-10 w-10 flex items-center justify-center rounded-xl hover:bg-[#004591] transition-all shadow-xs"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </form>

          {/* Render AI Advisor response if exists */}
          {aiTip && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <Sparkles className="text-[#005cbd] shrink-0 mt-0.5" size={18} />
              <div className="font-sans">
                <h5 className="text-xs font-bold text-[#005cbd]">AI Support smart-støtte</h5>
                <p className="text-xs text-gray-700 leading-normal mt-1">{aiTip}</p>
                <button
                  onClick={() => setAiTip('')}
                  className="text-[10px] text-gray-400 mt-2 hover:text-gray-600 block underline"
                >
                  Lukk råd
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Dashboard Welcome Header */}
        <header className="mb-8 font-sans">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 tracking-tight block md:hidden">Hei, Erik</h1>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 tracking-tight hidden md:block">Velkommen tilbake, Erik</h1>
          <p className="text-sm text-gray-500 mt-1">Her er en oversikt over dine småjobber og inntjening.</p>
        </header>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">

          {/* Earnings card (col-span-4) */}
          <div className="md:col-span-4 bg-[#005cbd] text-white p-6 rounded-2xl flex flex-col justify-between overflow-hidden relative shadow-sm min-h-[180px]">
            <div className="z-10 font-sans space-y-1">
              <p className="text-xs font-semibold text-blue-100/90 tracking-wide">Totale inntekter (Denne måneden)</p>
              <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight pt-1">12 450 kr</h2>
              <div className="flex items-center gap-2 pt-4 text-blue-100">
                <TrendingUp size={16} />
                <span className="text-xs font-medium">12% økning fra forrige måned</span>
              </div>
            </div>

            <div className="absolute right-[-24px] bottom-[-24px] text-white/5 pointer-events-none select-none">
              💰
            </div>
          </div>

          {/* Quick counters grid block (col-span-8) */}
          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-[#005cbd] transition-colors cursor-pointer group flex flex-col justify-between h-[100px]">
              <div className="flex justify-between items-start">
                <span className="p-2 bg-blue-50 text-[#005cbd] rounded-xl group-hover:scale-105 transition-transform">
                  <Gavel size={18} />
                </span>
                <span className="text-2xl font-display font-extrabold text-gray-900">4</span>
              </div>
              <p className="text-xs font-bold text-gray-500 font-sans tracking-tight">Aktive bud</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-emerald-600 transition-colors cursor-pointer group flex flex-col justify-between h-[100px]">
              <div className="flex justify-between items-start">
                <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-105 transition-transform">
                  <CheckCircle2 size={18} />
                </span>
                <span className="text-2xl font-display font-extrabold text-gray-900">7</span>
              </div>
              <p className="text-xs font-bold text-gray-500 font-sans tracking-tight">Fullførte jobber</p>
            </div>

            <div className="col-span-2 md:col-span-1 bg-white p-5 rounded-2xl border border-gray-200 hover:border-amber-500 transition-colors cursor-pointer group flex flex-col justify-between h-[100px]">
              <div className="flex justify-between items-start">
                <span className="p-2 bg-amber-50 text-amber-500 rounded-xl group-hover:scale-105 transition-transform">
                  <Star size={18} fill="currentColor" />
                </span>
                <span className="text-2xl font-display font-extrabold text-gray-900">4.9</span>
              </div>
              <p className="text-xs font-bold text-gray-500 font-sans tracking-tight">Din rangering</p>
            </div>
          </div>

          {/* Gigs & Bids detail rows (col-span-8) */}
          <div className="md:col-span-8 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-display font-bold text-lg text-gray-900">Aktive bud</h3>
              <button
                onClick={() => onNavigate('se_oppdrag', 'push')}
                className="text-xs font-bold text-[#005cbd] hover:underline"
              >
                Se alle
              </button>
            </div>

            <div className="space-y-4">
              {activeBids.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-[#005cbd] shrink-0">
                      {item.kategori === 'hage' ? '🌳' : item.kategori === 'vasking' ? '🧼' : item.kategori === 'flytting' ? '🚛' : '🔧'}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-display font-semibold text-sm text-gray-900 leading-snug">{item.tittel}</h4>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <MapPin size={12} />
                        <span>{item.sted}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 font-sans">
                    <div className="text-left md:text-right">
                      <p className="text-xs font-bold text-gray-800">Bud: {item.pris.toLocaleString('no-NO')} kr</p>
                      <p className={`text-[10px] font-semibold mt-0.5 ${item.status === 'Venter på svar' ? 'text-secondary font-bold text-emerald-600' : 'text-[#005cbd]'
                        }`}>
                        {item.status || 'Venter på svar'}
                      </p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-800 p-2 hover:bg-gray-100 rounded-full transition-colors self-center">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar block profile + suggested (col-span-4) */}
          <div className="md:col-span-4 space-y-6">

            {/* Profile progress card */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs font-sans">
              <h4 className="text-xs font-bold text-gray-800 tracking-tight uppercase leading-none font-display">Fullfør din profil</h4>

              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mt-4 mb-2">
                <div className="bg-[#005cbd] h-full" style={{ width: '80%' }}></div>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Legg til politiattest for å få tilgang til flere oppdrag.
              </p>

              <button className="w-full mt-4 bg-[#005cbd] text-white py-2.5 rounded-lg text-xs font-bold hover:bg-[#004591] transition-colors">
                Gyldiggjør politiattest
              </button>
            </div>

            {/* Suggested job alerts */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
              <h4 className="text-xs font-bold text-gray-800 tracking-tight uppercase border-b border-gray-100 pb-2 mb-4 font-display">Foreslåtte jobber</h4>

              <div className="space-y-4">
                <div className="flex gap-4 items-start cursor-pointer group">
                  <div className="w-11 h-11 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center shrink-0">
                    🧼
                  </div>
                  <div className="space-y-1 font-sans">
                    <h5 className="text-xs font-semibold text-gray-800 group-hover:text-[#005cbd] transition-colors leading-snug">Rengjøring av hytte</h5>
                    <p className="text-[10px] text-gray-400 leading-normal line-clamp-1">35 kvm, trenger utvask på åremål.</p>
                    <span className="text-[10px] font-bold text-teal-600 block pt-0.5">Est. 1 500 kr</span>
                  </div>
                </div>

                <div className="flex gap-4 items-start cursor-pointer group">
                  <div className="w-11 h-11 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
                    🐾
                  </div>
                  <div className="space-y-1 font-sans">
                    <h5 className="text-xs font-semibold text-gray-800 group-hover:text-[#005cbd] transition-colors leading-snug">Lufting av mops</h5>
                    <p className="text-[10px] text-gray-400 leading-normal line-clamp-1">Fast avtale, 2 dager i uken fra juni.</p>
                    <span className="text-[10px] font-bold text-teal-600 block pt-0.5">250 kr / gang</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
