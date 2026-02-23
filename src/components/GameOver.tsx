import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw } from 'lucide-react';

interface GameOverProps {
  winner: 'player' | 'ai';
  onRestart: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({ winner, onRestart }) => {
  const isPlayer = winner === 'player';

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-zinc-900 border-2 border-yellow-500/30 p-10 rounded-3xl shadow-[0_0_50px_rgba(234,179,8,0.2)] max-w-sm w-full text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
        
        <div className="mb-6 flex justify-center">
          {isPlayer ? (
            <div className="bg-yellow-500/20 p-4 rounded-full">
              <Trophy className="w-16 h-16 text-yellow-500" />
            </div>
          ) : (
            <div className="bg-red-500/20 p-4 rounded-full">
              <RotateCcw className="w-16 h-16 text-red-400" />
            </div>
          )}
        </div>

        <h2 className="text-4xl font-serif italic mb-2 text-white">
          {isPlayer ? '胜利！' : '失败'}
        </h2>
        <p className="text-zinc-400 mb-8">
          {isPlayer 
            ? "你成功战胜了 AI，清空了手牌！" 
            : "AI 这次更快一步。下局好运！"}
        </p>

        <button
          onClick={onRestart}
          className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20"
        >
          <RotateCcw className="w-5 h-5" />
          再玩一次
        </button>
      </motion.div>
    </div>
  );
};
