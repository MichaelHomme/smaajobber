import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import Footer from './components/Footer';
import AIChatWidget from './components/AIChatWidget';
import Landingsside from './components/Landingsside';
import SeOppdrag from './components/SeOppdrag';
import LeggUtOppdrag from './components/LeggUtOppdrag';
import Dashbord from './components/Dashbord';
import FinnHjelper from './components/FinnHjelper';
import { Screen, Oppdrag, Hjelper, Bruker } from './types';

const pageVariants = {
  initial: (transitionType: 'push' | 'push_back' | 'slide_up') => {
    if (transitionType === 'slide_up') {
      return { y: 120, opacity: 0 };
    }
    if (transitionType === 'push') {
      return { x: 120, opacity: 0 };
    }
    return { x: -120, opacity: 0 }; // push_back
  },
  animate: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: { duration: 0.35, ease: 'easeOut' }
  },
  exit: (transitionType: 'push' | 'push_back' | 'slide_up') => {
    if (transitionType === 'slide_up') {
      return { y: -120, opacity: 0 };
    }
    if (transitionType === 'push') {
      return { x: -120, opacity: 0 };
    }
    return { x: 120, opacity: 0 }; // push_back
  }
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landingsside');
  const [transitionType, setTransitionType] = useState<'push' | 'push_back' | 'slide_up'>('push');

  // Dynamic state arrays populated from backend
  const [oppdragList, setOppdragList] = useState<Oppdrag[]>([]);
  const [hjelpereList, setHjelpereList] = useState<Hjelper[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Authentication state
  const [currentUser, setCurrentUser] = useState<Bruker | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Load data and authenticate on mount
  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      try {
        // 1. Check OIDC session
        const authRes = await fetch('/api/auth/me');
        if (authRes.ok) {
          const authData = await authRes.json();
          if (authData.loggedIn) {
            setCurrentUser(authData.user);
          } else {
            setCurrentUser(null);
          }
        }
      } catch (err) {
        console.error('Feil under sjekk av session:', err);
      } finally {
        setAuthLoading(false);
      }

      try {
        // 2. Fetch jobs and helpers
        const [oppdragRes, hjelpereRes] = await Promise.all([
          fetch('/api/oppdrag'),
          fetch('/api/hjelpere')
        ]);
        if (oppdragRes.ok) {
          const oppdragData = await oppdragRes.json();
          setOppdragList(oppdragData);
        }
        if (hjelpereRes.ok) {
          const hjelpereData = await hjelpereRes.json();
          setHjelpereList(hjelpereData);
        }
      } catch (err) {
        console.error('Feil under innlasting av data:', err);
      }
    };

    checkAuthAndLoadData();
  }, []);

  const navigateTo = (screen: Screen, transition?: 'push' | 'push_back' | 'slide_up') => {
    if (transition) {
      setTransitionType(transition);
    } else {
      if (screen === 'landingsside') {
        setTransitionType('push_back');
      } else if (screen === 'legg_ut_oppdrag') {
        setTransitionType('slide_up');
      } else {
        setTransitionType('push');
      }
    }
    setCurrentScreen(screen);
  };

  const handleAddOppdrag = async (newOpp: Omit<Oppdrag, 'id' | 'opprettetDato' | 'status'>) => {
    try {
      const res = await fetch('/api/oppdrag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newOpp)
      });

      if (res.ok) {
        const createdJob = await res.json();
        setOppdragList(prev => [createdJob, ...prev]);
        navigateTo('dashbord', 'push');
        return true;
      } else {
        const errData = await res.json();
        alert(`Kunne ikke opprette oppdrag: ${errData.error}`);
        return false;
      }
    } catch (err) {
      console.error('Feil ved lagring av oppdrag:', err);
      alert('Kunne ikke koble til serveren for å opprette oppdraget.');
      return false;
    }
  };

  // Helper to trigger database reload after AI creation
  const handleReloadOppdrag = async () => {
    try {
      const res = await fetch('/api/oppdrag');
      if (res.ok) {
        const data = await res.json();
        setOppdragList(data);
      }
    } catch (err) {
      console.error('Feil ved oppdatering av oppdrag:', err);
    }
  };

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'landingsside':
        return (
          <Landingsside
            onNavigate={navigateTo}
            onSearchQuery={setSearchQuery}
          />
        );
      case 'se_oppdrag':
        return (
          <SeOppdrag
            onNavigate={navigateTo}
            oppdragList={oppdragList}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
          />
        );
      case 'legg_ut_oppdrag':
        if (!currentUser) {
          return (
            <div className="flex-grow pt-32 pb-16 px-4 bg-gray-50 flex items-center justify-center font-sans">
              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg text-center max-w-md w-full">
                <div className="w-16 h-16 bg-[#ff5b24]/10 text-[#ff5b24] text-3xl font-bold rounded-full flex items-center justify-center mx-auto mb-6">
                  v
                </div>
                <h2 className="text-xl font-display font-bold text-gray-900 mb-2">Innlogging kreves</h2>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                  Du må være logget inn med Vipps eller BankID for å publisere oppdrag og sikre en trygg handel på plattformen.
                </p>
                <button
                  onClick={() => { window.location.href = '/api/auth/vipps'; }}
                  className="w-full bg-[#ff5b24] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#e04e1b] transition-all active:scale-95 shadow-sm cursor-pointer"
                >
                  Logg inn med Vipps
                </button>
              </div>
            </div>
          );
        }
        return (
          <LeggUtOppdrag
            onNavigate={navigateTo}
            onAddOppdrag={handleAddOppdrag}
          />
        );
      case 'dashbord':
        return (
          <Dashbord
            onNavigate={navigateTo}
            oppdragList={oppdragList}
          />
        );
      case 'finn_hjelper':
        return (
          <FinnHjelper
            onNavigate={navigateTo}
            hjelpereList={hjelpereList}
          />
        );
      default:
        return (
          <Landingsside
            onNavigate={navigateTo}
            onSearchQuery={setSearchQuery}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9f9] text-[#1b1b1b]">
      {/* Dynamic top bar navigation */}
      <Header 
        currentScreen={currentScreen} 
        onNavigate={navigateTo} 
        currentUser={currentUser} 
        authLoading={authLoading}
      />

      {/* Main body canvas with animated page transitions */}
      <div className="flex-grow flex flex-col relative overflow-hidden">
        <AnimatePresence mode="wait" custom={transitionType}>
          <motion.div
            key={currentScreen}
            custom={transitionType}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex-grow flex flex-col w-full"
          >
            {renderActiveScreen()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Standalone persistent components */}
      <AIChatWidget currentUser={currentUser} onReloadOppdrag={handleReloadOppdrag} />
      <Footer onNavigate={navigateTo} />
    </div>
  );
}
