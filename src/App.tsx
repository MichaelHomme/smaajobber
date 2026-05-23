import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import Footer from './components/Footer';
import AIChatWidget from './components/AIChatWidget';
import Landingsside from './components/Landingsside';
import SeOppdrag from './components/SeOppdrag';
import LeggUtOppdrag from './components/LeggUtOppdrag';
import Dashbord from './components/Dashbord';
import FinnHjelper from './components/FinnHjelper';
import { Screen, Oppdrag } from './types';
import { INITIAL_OPPDRAG, INITIAL_HJELPERE } from './data';

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

  // DynState arrays for state integrity across screens
  const [oppdragList, setOppdragList] = useState<Oppdrag[]>(INITIAL_OPPDRAG);
  const [hjelpereList] = useState(INITIAL_HJELPERE);
  const [searchQuery, setSearchQuery] = useState('');

  const navigateTo = (screen: Screen, transition?: 'push' | 'push_back' | 'slide_up') => {
    if (transition) {
      setTransitionType(transition);
    } else {
      // Intelligently fallback based on logical hierarchy
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

  const handleAddOppdrag = (newOpp: Omit<Oppdrag, 'id' | 'opprettetDato' | 'status'>) => {
    const freshJob: Oppdrag = {
      ...newOpp,
      id: `job-${Date.now()}`,
      opprettetDato: new Date().toISOString().split('T')[0],
      status: 'Aktiv',
      bilde: newOpp.kategori === 'hage'
        ? 'https://images.unsplash.com/photo-1558905612-df7f833f28cf?auto=format&fit=crop&q=80&w=400'
        : newOpp.kategori === 'vasking'
          ? 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=400'
          : newOpp.kategori === 'flytting'
            ? 'https://images.unsplash.com/photo-1603796846097-bee99e4a60c9?auto=format&fit=crop&q=80&w=400'
            : 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=400'
    };
    setOppdragList(prev => [freshJob, ...prev]);
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
      <Header currentScreen={currentScreen} onNavigate={navigateTo} />

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
      <AIChatWidget />
      <Footer onNavigate={navigateTo} />
    </div>
  );
}
