import React from 'react';
import { Suit } from '../types';
import { getSuitSymbol, getSuitColor } from '../utils';
import { motion } from 'motion/react';

interface SuitSelectorProps {
  onSelect: (suit: Suit) => void;
}

export const SuitSelector: React.FC<SuitSelectorProps> = ({ onSelect }) => {
  const suits = [Suit.HEARTS, Suit.DIAMONDS, Suit.CLUBS, Suit.SPADES];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-zinc-900 border border-zinc-700 p-8 rounded-3xl shadow-2xl max-w-md w-full text-center"
      >
        <h2 className="text-2xl font-serif italic mb-6 text-yellow-400">请选择新的花色</h2>
        <div className="grid grid-cols-2 gap-4">
          {suits.map((suit) => (
            <button
              key={suit}
              onClick={() => onSelect(suit)}
              className="bg-white hover:bg-zinc-100 transition-colors p-6 rounded-2xl flex flex-col items-center justify-center gap-2 group"
            >
              <span className={`text-5xl ${getSuitColor(suit)} group-hover:scale-110 transition-transform`}>
                {getSuitSymbol(suit)}
              </span>
              <span className="text-zinc-900 font-bold uppercase tracking-widest text-xs">
                {suit === Suit.HEARTS ? '红心' : suit === Suit.DIAMONDS ? '方块' : suit === Suit.CLUBS ? '梅花' : '黑桃'}
              </span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
