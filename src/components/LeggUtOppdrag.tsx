import React, { useState } from 'react';
import { Screen, Oppdrag } from '../types';
import { Sparkles, ImageIcon, Mic, ArrowRight, ArrowLeft, Check, Compass, Info } from 'lucide-react';

interface LeggUtOppdragProps {
  onNavigate: (screen: Screen, transition?: 'push' | 'push_back' | 'slide_up') => void;
  onAddOppdrag: (newOpp: Omit<Oppdrag, 'id' | 'opprettetDato' | 'status'>) => Promise<boolean>;
}

export default function LeggUtOppdrag({ onNavigate, onAddOppdrag }: LeggUtOppdragProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [kategori, setKategori] = useState<'hage' | 'flytting' | 'vasking' | 'annet' | ''>('');

  // Step fields
  const [tittel, setTittel] = useState('');
  const [beskrivelse, setBeskrivelse] = useState('');
  const [sted, setSted] = useState('');
  const [dato, setDato] = useState('');
  const [pris, setPris] = useState(500);

  // AI Assistant text input
  const [aiAssistantInput, setAiAssistantInput] = useState('');
  const [aiGeneratedFeedback, setAiGeneratedFeedback] = useState(false);

  const stepTitles = ['Kategori', 'Beskrivelse', 'Sted & Tid', 'Budsjett'];

  // Easy Autofill utilizing mock AI or rule base
  const handleAIFill = () => {
    setAiGeneratedFeedback(true);
    const query = aiAssistantInput.toLowerCase();

    setTimeout(() => {
      if (query.includes('hage') || query.includes('gress') || query.includes('hekk')) {
        setKategori('hage');
        setTittel('Renskjæring og plenklipp i hagen');
        setBeskrivelse('Trenger hjelp til å klippe plenen på cirka 150 kvm, samt beskjære en villroserusk og trimme kantene langs gjerdet. Alt av redskaper som elektrisk klipper og trimmer står klart i garasjen.');
        setSted('Oslo, Nordstrand');
        setDato('Søndag formiddag');
        setPris(850);
      } else if (query.includes('flytt') || query.includes('bær') || query.includes('esker')) {
        setKategori('flytting');
        setTittel('Hjelp til lossing av flytteesker fra lastebil');
        setBeskrivelse('Vi flytter inn i ny leilighet og trenger 2 sterke personer til å bære esker samt noen mindre kommoder opp til 2. etasje (det er heis i bygget). Beregner at det tar cirka 2 timer.');
        setSted('Bergen Sentrum');
        setDato('Innen neste helg');
        setPris(1200);
      } else if (query.includes('vask') || query.includes('rengjør') || query.includes('utvask')) {
        setKategori('vasking');
        setTittel('Grundig vasking av 2-roms leilighet');
        setBeskrivelse('Trenger en skikkelig vask av bad, kjøkkenflater og stuegulv i en 45 kvm leilighet grundig før overdragelse. Alt av vaskeutstyr er tilgjengelig.');
        setSted('Trondheim');
        setDato('Torsdag ettermiddag');
        setPris(1500);
      } else {
        // Fallback default helpful text
        setKategori('annet');
        setTittel('Montering av flatpakker og hylle');
        setBeskrivelse('Hjelp til å montere 1 bokhylle fra IKEA og henge opp et par bilder på gipsvegg. Ta gjerne med egen batteridrill om du har.');
        setSted('Oslo, Majorstuen');
        setDato('Snarest mulig');
        setPris(600);
      }
      // Jump directly to step 2 to review description
      setCurrentStep(2);
      setAiGeneratedFeedback(false);
    }, 900);
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    if (currentStep === 1) return kategori !== '';
    if (currentStep === 2) return tittel.trim().length > 4 && beskrivelse.trim().length > 10;
    if (currentStep === 3) return sted.trim().length > 2 && dato.trim().length > 2;
    return true; // Step 4 price range always valid
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStepValid()) return;

    // Trigger onAddOppdrag logic and await success
    await onAddOppdrag({
      tittel,
      beskrivelse,
      kategori: kategori === '' ? 'annet' : kategori,
      pris,
      sted,
      dato
    });
  };

  return (
    <main className="flex-grow pt-24 pb-12 px-4 font-sans bg-gray-50">
      <div className="max-w-2xl mx-auto">

        {/* Progress indicator */}
        <div className="mb-8 bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#005cbd] uppercase tracking-widest label-sm">
              Steg {currentStep} av 4
            </span>
            <span className="text-xs font-semibold text-gray-500 font-sans">
              {stepTitles[currentStep - 1]}
            </span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#005cbd] transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* AI Assistant autocomplete helper */}
        <div className="mb-6 p-4 bg-blue-50/60 border border-blue-100 rounded-2xl shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#005cbd]/10 text-[#005cbd] shrink-0">
              <Sparkles size={20} className={aiGeneratedFeedback ? 'animate-spin' : ''} />
            </div>
            <div className="flex-grow font-sans">
              <div className="flex bg-white items-center gap-2 rounded-xl px-3 border border-gray-200 focus-within:border-[#005cbd] transition-all">
                <input
                  type="text"
                  value={aiAssistantInput}
                  onChange={(e) => setAiAssistantInput(e.target.value)}
                  placeholder="Trenger du hjelp til å beskrive oppdraget? Skriv f.eks. 'klippe gress'..."
                  className="w-full bg-transparent text-xs py-3 outline-none border-none placeholder-gray-400 focus:ring-0"
                />
                <button
                  type="button"
                  onClick={handleAIFill}
                  disabled={!aiAssistantInput.trim() || aiGeneratedFeedback}
                  className="p-1 px-3 bg-blue-50 hover:bg-blue-100 text-[#005cbd] text-[11px] font-bold rounded-lg transition-colors shrink-0 disabled:opacity-40"
                >
                  {aiGeneratedFeedback ? 'Genererer...' : 'Autofullfør'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Form area */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-xs">

          {/* Step 1: Category */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h1 className="text-2xl font-display font-bold text-gray-900">Hva trenger du hjelp med?</h1>
                <p className="text-gray-500 text-xs mt-1">Velg kategorien som passer best for ditt oppdrag.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: 'hage', title: 'Hagearbeid', desc: 'Plenklipp, raking, felling', icon: 'yard' },
                  { value: 'flytting', title: 'Flyttehjelp', desc: 'Bære, pakke, flyttebil', icon: 'local_shipping' },
                  { value: 'vasking', title: 'Rengjøring', desc: 'Utvask, ukentlig vask', icon: 'mop' },
                  { value: 'annet', title: 'Annet', desc: 'Montering, maling, diverse', icon: 'more_horiz' }
                ].map((item) => (
                  <label
                    key={item.value}
                    onClick={() => setKategori(item.value as any)}
                    className={`group relative flex flex-col items-center text-center p-6 border rounded-xl cursor-pointer transition-all ${kategori === item.value
                      ? 'border-[#005cbd] bg-blue-50/20 ring-1 ring-[#005cbd]'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                      }`}
                  >
                    <span className="text-3xl text-[#005cbd] mb-3 group-hover:scale-105 transition-transform font-display text-center block">
                      {item.icon === 'yard' ? '🌳' : item.icon === 'local_shipping' ? '🚛' : item.icon === 'mop' ? '🧼' : '🔧'}
                    </span>
                    <span className="font-semibold text-sm text-gray-800 tracking-tight">{item.title}</span>
                    <span className="text-[10px] text-gray-400 mt-1 leading-normal">{item.desc}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Title and Description */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 font-sans">
              <div>
                <h1 className="text-2xl font-display font-bold text-gray-900">Beskriv oppdraget</h1>
                <p className="text-gray-500 text-xs mt-1">Lag en beskrivende tittel og detaljert forklaring.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 label-md">Tittel på jobben</label>
                  <input
                    type="text"
                    value={tittel}
                    onChange={(e) => setTittel(e.target.value)}
                    placeholder="F.eks. Klippe gress og luke ugress"
                    className="w-full px-4 py-3 text-sm rounded-lg border border-gray-200 focus:outline-hidden focus:border-[#005cbd] focus:ring-1 focus:ring-[#005cbd]/20"
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">Tittelen bør være kort, tydelig og fristende. (Minst 5 tegn)</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 label-md">Detaljert beskrivelse</label>
                  <textarea
                    value={beskrivelse}
                    onChange={(e) => setBeskrivelse(e.target.value)}
                    placeholder="Forklar grundig hva som skal gjøres, når det passer best, og om hjelperen må stille med eget eller om utstyr er klart..."
                    rows={5}
                    className="w-full px-4 py-3 text-sm rounded-lg border border-gray-200 focus:outline-hidden focus:border-[#005cbd] focus:ring-1 focus:ring-[#005cbd]/20"
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">Jo mer detaljert du beskriver jobben, jo mer presise pristilbud vil du motta. (Minst 10 tegn)</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Location and Time */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 font-sans">
              <div>
                <h1 className="text-2xl font-display font-bold text-gray-900">Hvor og når?</h1>
                <p className="text-gray-500 text-xs mt-1">Oppgi sted og tidsrom for oppdraget.</p>
              </div>

              {/* Map mockup */}
              <div className="relative h-44 w-full rounded-xl overflow-hidden mb-4 border border-gray-100">
                <img
                  alt="Minimalist Map of neighborhood"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzLX80POjZSR02pi6k1tE-f-4ihpgYHW6tKgxt9CljNJxu_bJpgtKGCNRJZoE6fREPwBxibVsO8fb8F0lGe7uNoVAzfpBC_1aGm4syr1H0-vcy1HrfbZMrgq-zerWLc3es0FkxbBM9C0UguMYIq7waIrfO8Ls3aw0JJ3mXqEg9wxbo_Xm-6AALHU1lA0iAbJxxT6JVHW4KJRcTEcSfRtnkf4QIVVb3DAzyjk20XfWsV400YtxeM89VXCDRw2Sf4rDhv1iTBJsq4Y0"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-blue-900/5"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center bg-[#005cbd]/20 rounded-full animate-ping"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 bg-[#005cbd] text-white rounded-full flex items-center justify-center shadow-md">
                  📍
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 label-md">Adresse og postnummer</label>
                  <input
                    type="text"
                    value={sted}
                    onChange={(e) => setSted(e.target.value)}
                    placeholder="F.eks. Nordstrandveien 14, 1163 Oslo"
                    className="w-full px-4 py-3 text-sm rounded-lg border border-gray-200 focus:outline-hidden focus:border-[#005cbd] focus:ring-1 focus:ring-[#005cbd]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 label-md">Når skal jobben utføres?</label>
                  <input
                    type="text"
                    value={dato}
                    onChange={(e) => setDato(e.target.value)}
                    placeholder="F.eks. Snarest mulig, eller innen 15. juni"
                    className="w-full px-4 py-3 text-sm rounded-lg border border-gray-200 focus:outline-hidden focus:border-[#005cbd] focus:ring-1 focus:ring-[#005cbd]/20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Option 4: Price Slider */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 font-sans">
              <div>
                <h1 className="text-2xl font-display font-bold text-gray-900">Sett et budsjett</h1>
                <p className="text-gray-500 text-xs mt-1">Hva er du villig til å tilby for dette oppdraget?</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-150">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-semibold font-sans text-gray-600">Estimert budsjett</span>
                  <span id="priceDisplay" className="text-xl font-bold text-[#005cbd]">{pris.toLocaleString('no-NO')} kr</span>
                </div>

                <input
                  type="range"
                  min={200}
                  max={10000}
                  step={100}
                  value={pris}
                  onChange={(e) => setPris(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#005cbd]"
                />

                <div className="flex justify-between mt-2 text-[10px] text-gray-400 font-semibold font-sans">
                  <span>200 kr</span>
                  <span>10 000 kr+</span>
                </div>
              </div>

              {/* Estimate guidance note */}
              <div className="flex gap-3 p-4 bg-[#005cbd]/5 rounded-lg border border-[#005cbd]/10">
                <Info size={16} className="text-[#005cbd] shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600 leading-normal">
                  Husk at dyktige hjelpere oftere velger oppdrag med rimelig og rettferdig betaling. Du kan alltids forhandle og justere prisen i direkte dialog senere.
                </p>
              </div>
            </div>
          )}

          {/* Steer buttons */}
          <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-150">
            <button
              type="button"
              onClick={handleBack}
              className={`flex items-center gap-2 font-display font-semibold text-xs text-gray-500 hover:text-gray-800 px-5 py-2.5 rounded-full hover:bg-gray-100 transition-colors ${currentStep === 1 ? 'invisible' : ''
                }`}
            >
              <ArrowLeft size={14} /> Tilbake
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!isStepValid()}
                className={`ml-auto flex items-center gap-2 font-display font-semibold text-xs text-white bg-[#005cbd] px-6 py-2.5 rounded-full hover:bg-[#004591] transition-all active:scale-95 duration-100 ${!isStepValid() ? 'opacity-40 cursor-not-allowed' : ''
                  }`}
              >
                Neste <ArrowRight size={14} />
              </button>
            ) : (
              // Spec Xpath target matching: `//button[@id='submitBtn']` -> `dashbord` (push transition)
              <button
                type="submit"
                id="submitBtn"
                disabled={!isStepValid()}
                className="ml-auto bg-emerald-600 text-white font-display font-semibold text-xs px-8 py-3 rounded-full hover:bg-emerald-700 transition-all active:scale-95 duration-100 shadow-sm"
              >
                Publiser oppdrag
              </button>
            )}
          </div>

        </form>

      </div>
    </main>
  );
}
