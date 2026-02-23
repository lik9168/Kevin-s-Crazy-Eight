import React from 'react';
import { motion } from 'motion/react';
import { Card as CardType } from '../types';
import { getSuitColor, getSuitSymbol } from '../utils';

interface CardProps {
  card: CardType;
  onClick?: () => void;
  isPlayable?: boolean;
  isHidden?: boolean;
  isSmall?: boolean;
  isBest?: boolean;
}

export const Card: React.FC<CardProps> = ({ card, onClick, isPlayable, isHidden, isSmall, isBest }) => {
  if (isHidden) {
    return (
      <motion.div
        layoutId={card.id}
        className={`relative ${isSmall ? 'w-12 h-16' : 'w-20 h-28 sm:w-24 sm:h-36'} bg-white rounded-lg border-2 border-zinc-300 shadow-lg flex items-center justify-center overflow-hidden`}
        whileHover={onClick ? { y: -10 } : {}}
      >
        <div className="absolute inset-1 bg-blue-800 rounded-md border border-blue-600 flex flex-col items-center justify-center overflow-hidden">
          <div className="w-full h-full absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:10px_10px]" />
          <div className="relative flex flex-col items-center gap-1">
            <span className="text-white/40 font-serif text-5xl italic leading-none">K</span>
            <span className="text-white/60 font-sans text-[10px] font-bold tracking-[0.2em] uppercase">
              Kevin SZ
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  const color = getSuitColor(card.suit);
  const symbol = getSuitSymbol(card.suit);

  return (
    <motion.div
      layoutId={card.id}
      onClick={isPlayable ? onClick : undefined}
      className={`
        relative ${isSmall ? 'w-12 h-16' : 'w-20 h-28 sm:w-24 sm:h-36'} 
        bg-white rounded-lg shadow-xl cursor-pointer select-none
        flex flex-col justify-between p-2 sm:p-3
        ${isPlayable ? 'ring-4 ring-yellow-400 ring-offset-2 ring-offset-[#1a4a2e]' : 'opacity-90'}
        ${isBest ? 'ring-4 ring-red-500 ring-offset-2 ring-offset-[#1a4a2e] z-10' : ''}
        ${!isPlayable && onClick ? 'grayscale-[0.5] cursor-not-allowed' : ''}
      `}
      whileHover={isPlayable ? { y: -20, scale: 1.05 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className={`flex flex-col items-start leading-none ${color}`}>
        <span className="text-lg sm:text-2xl font-bold">{card.rank}</span>
        <span className="text-sm sm:text-lg">{symbol}</span>
      </div>
      
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl sm:text-5xl ${color} opacity-20`}>
        {symbol}
      </div>

      {/* Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-45deg] pointer-events-none select-none">
        <span className="text-[10px] sm:text-[12px] font-bold text-zinc-200/30 whitespace-nowrap tracking-widest uppercase">
          Kevin SZ
        </span>
      </div>

      <div className={`flex flex-col items-end leading-none rotate-180 ${color}`}>
        <span className="text-lg sm:text-2xl font-bold">{card.rank}</span>
        <span className="text-sm sm:text-lg">{symbol}</span>
      </div>
    </motion.div>
  );
};
