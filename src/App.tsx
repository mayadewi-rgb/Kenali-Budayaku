/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { HeaderNav } from './components/HeaderNav';
import { PageOpening } from './components/PageOpening';
import { PageTebakBudaya } from './components/PageTebakBudaya';
import { PagePetaBudaya } from './components/PagePetaBudaya';
import { PageKelompokkanBudaya } from './components/PageKelompokkanBudaya';
import { PageMancingBudaya } from './components/PageMancingBudaya';
import { PageKuisIndividu } from './components/PageKuisIndividu';
import { PageRefleksi } from './components/PageRefleksi';
import { HelpModal } from './components/HelpModal';
import { BatikBackground } from './components/BatikBackground';
import { sounds } from './utils/audio';

export default function App() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  const totalPages = 7;

  // Toggle audio
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.enabled = next;
  };

  // Toggle fullscreen for IFP screen
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // Listen to fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Keyboard navigation for teachers (Arrow keys & Space)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't intercept if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Allow Mancing Budaya (page 5) to use arrow keys for P2 controller without flipping pages
      if (currentPage === 5) {
        if (e.key === 'Escape') {
          setIsHelpOpen(false);
        }
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
      } else if (e.key === 'Escape') {
        setIsHelpOpen(false);
      }
    },
    [totalPages]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const isFullScreenPage = currentPage === 1 || currentPage === 3 || currentPage === 5;

  return (
    <div className={`relative w-screen h-screen overflow-hidden bg-slate-950 flex flex-col items-center justify-center text-slate-100 font-sans ${isFullScreenPage ? 'p-0' : 'p-0 md:p-2 lg:p-3'}`}>
      {/* Presentation Stage - Optimized for Interactive Flat Panel (IFP) and Projectors */}
      <main className={`relative w-full h-full max-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 overflow-hidden shadow-2xl flex flex-col ${isFullScreenPage ? 'rounded-none border-0 max-w-none' : 'max-w-[1920px] rounded-none md:rounded-2xl border border-white/10'}`}>
        {/* Dynamic Batik & Colorful Atmospheric Accents */}
        {!isFullScreenPage && <BatikBackground />}

        {/* Top Navigation Bar with IFP Controls - completely hidden during Peta Budaya & Mancing Budaya */}
        {!isFullScreenPage && (
          <HeaderNav
            currentPage={currentPage}
            totalPages={totalPages}
            onPageSelect={(p) => setCurrentPage(p)}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            isFullscreen={isFullscreen}
            onToggleFullscreen={handleToggleFullscreen}
            onOpenHelp={() => setIsHelpOpen(true)}
          />
        )}

        {/* Slide Content Area */}
        <div className="relative z-10 flex-1 overflow-hidden flex flex-col">
          {currentPage === 1 && (
            <PageOpening onStart={() => setCurrentPage(2)} />
          )}

          {currentPage === 2 && (
            <PageTebakBudaya
              onBack={() => setCurrentPage(1)}
              onNext={() => setCurrentPage(3)}
            />
          )}

          {currentPage === 3 && (
            <PagePetaBudaya
              onBack={() => setCurrentPage(2)}
              onNext={() => setCurrentPage(4)}
            />
          )}

          {currentPage === 4 && (
            <PageKelompokkanBudaya
              onBack={() => setCurrentPage(3)}
              onNext={() => setCurrentPage(5)}
              onRestart={() => setCurrentPage(1)}
            />
          )}

          {currentPage === 5 && (
            <PageMancingBudaya
              onBack={() => setCurrentPage(4)}
              onNext={() => setCurrentPage(6)}
            />
          )}

          {currentPage === 6 && (
            <PageKuisIndividu
              onBack={() => setCurrentPage(5)}
              onNextRefleksi={() => setCurrentPage(7)}
              onRestart={() => setCurrentPage(1)}
            />
          )}

          {currentPage === 7 && (
            <PageRefleksi
              onBack={() => setCurrentPage(6)}
              onRestart={() => setCurrentPage(1)}
            />
          )}
        </div>
      </main>

      {/* IFP Touch Guide Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
