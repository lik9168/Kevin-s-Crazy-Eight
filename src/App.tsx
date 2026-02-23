/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { useCrazyEights } from './hooks/useCrazyEights';
import { Card } from './components/Card';
import { SuitSelector } from './components/SuitSelector';
import { GameOver } from './components/GameOver';
import { RulesModal } from './components/RulesModal';
import { getSuitSymbol, getSuitColor } from './utils';
import { Info, HelpCircle, Layers } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function App() {
  const { gameState, playCard, drawCard, selectWildSuit, initGame, getBestCard } = useCrazyEights();
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  // Show rules on first load
  useEffect(() => {
    const hasSeenRules = localStorage.getItem('hasSeenRules');
    if (!hasSeenRules) {
      setIsRulesOpen(true);
      localStorage.setItem('hasSeenRules', 'true');
    }
  }, []);

  const topCard = gameState.discardPile[gameState.discardPile.length - 1];
  const bestCard = getBestCard(gameState.playerHand, gameState);
  
  const canPlayerPlayAny = gameState.playerHand.some(c => {
    if (c.rank === '8') return true;
    if (!topCard) return false;
    return c.suit === gameState.activeSuit || c.rank === topCard.rank;
  });

  return (
    <div className="h-screen w-screen flex flex-col relative overflow-hidden">
      {/* Header */}
      <header className="p-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center text-black font-serif text-2xl italic shadow-lg">K</div>
          <h1 className="text-xl font-serif italic tracking-tight hidden sm:block">KEVIN'S CRAZY EIGHTS</h1>
        </div>
        
        <div className="flex items-center gap-4 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-zinc-400 font-bold">当前花色:</span>
            {gameState.activeSuit && (
              <span className={`text-xl ${getSuitColor(gameState.activeSuit)}`}>
                {getSuitSymbol(gameState.activeSuit)}
              </span>
            )}
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="text-xs uppercase tracking-widest font-bold">
            <span className={gameState.currentPlayer === 'player' ? 'text-yellow-400' : 'text-zinc-400'}>
              {gameState.currentPlayer === 'player' ? "你的回合" : "AI 思考中..."}
            </span>
          </div>
        </div>

        <button 
          onClick={() => setIsRulesOpen(true)}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <HelpCircle className="w-6 h-6 text-zinc-400" />
        </button>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 flex flex-col justify-between p-4 sm:p-8 relative">
        {/* AI Hand */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex justify-center -space-x-8 sm:-space-x-12">
            {gameState.aiHand.map((card, idx) => (
              <motion.div
                key={card.id}
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card card={card} isHidden isSmall />
              </motion.div>
            ))}
            {gameState.aiHand.length === 0 && <div className="h-16" />}
          </div>
          <div className="bg-black/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            AI 手牌: {gameState.aiHand.length} 张
          </div>
        </div>

        {/* Center: Deck & Discard */}
        <div className="flex items-center justify-center gap-8 sm:gap-16">
          {/* Draw Pile */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-yellow-500/5 rounded-full blur-2xl group-hover:bg-yellow-500/10 transition-colors" />
            <div 
              onClick={() => drawCard('player')}
              className={`relative cursor-pointer transition-transform active:scale-95 ${gameState.currentPlayer !== 'player' || canPlayerPlayAny ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="absolute top-1 left-1 w-20 h-28 sm:w-24 sm:h-36 bg-zinc-800 rounded-lg border-2 border-zinc-700" />
              <Card card={gameState.deck[0] || { id: 'back', suit: 'hearts', rank: 'A' } as any} isHidden />
              
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                <Layers className="w-3 h-3" />
                {gameState.deck.length} 张牌
              </div>
            </div>
          </div>

          {/* Discard Pile */}
          <div className="relative">
            <div className="absolute -inset-4 bg-white/5 rounded-full blur-2xl" />
            <AnimatePresence mode="popLayout">
              <motion.div
                key={gameState.discardPile[gameState.discardPile.length - 1]?.id}
                initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 1.2, opacity: 0, rotate: 10 }}
                className="relative"
              >
                {topCard && <Card card={topCard} />}
              </motion.div>
            </AnimatePresence>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              弃牌堆
            </div>
          </div>
        </div>

        {/* Player Hand */}
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 max-w-4xl">
            <AnimatePresence>
              {gameState.playerHand.map((card) => (
                <motion.div
                  key={card.id}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -100, opacity: 0, scale: 0.5 }}
                >
                  <Card 
                    card={card} 
                    onClick={() => playCard(card, 'player')}
                    isPlayable={gameState.currentPlayer === 'player' && (card.rank === '8' || (topCard && (card.suit === gameState.activeSuit || card.rank === topCard.rank)))}
                    isBest={gameState.currentPlayer === 'player' && bestCard?.id === card.id}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {/* Status Message */}
          <div className="flex flex-col items-center gap-2">
            <div className="bg-black/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/5 flex items-center gap-3">
              <Info className="w-4 h-4 text-yellow-500" />
              <p className="text-sm font-medium text-zinc-200">{gameState.lastAction}</p>
            </div>
            {gameState.currentPlayer === 'player' && bestCard && (
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-red-400">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                红色边框提示最佳出牌
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Overlays */}
      <AnimatePresence>
        {gameState.isWildSelecting && (
          <SuitSelector onSelect={selectWildSuit} />
        )}
        {gameState.winner && (
          <GameOver winner={gameState.winner} onRestart={initGame} />
        )}
        <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
      </AnimatePresence>

      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none opacity-5 overflow-hidden">
        <div className="absolute top-1/4 -left-20 text-[20rem] font-serif italic rotate-12">8</div>
        <div className="absolute bottom-1/4 -right-20 text-[20rem] font-serif italic -rotate-12">8</div>
      </div>
    </div>
  );
}
