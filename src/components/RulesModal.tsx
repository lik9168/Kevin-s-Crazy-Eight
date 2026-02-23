import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, Info } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-zinc-900 border border-zinc-700 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <BookOpen className="w-6 h-6 text-yellow-500" />
                </div>
                <h2 className="text-2xl font-serif italic text-white">游戏规则</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto space-y-6 text-zinc-300">
              <section>
                <h3 className="text-yellow-500 font-bold mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" /> 游戏目标
                </h3>
                <p>率先清空手中的所有牌即为获胜。</p>
              </section>

              <section>
                <h3 className="text-yellow-500 font-bold mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" /> 出牌规则
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>你可以打出与弃牌堆顶端卡牌<span className="text-white font-medium">花色相同</span>或<span className="text-white font-medium">点数相同</span>的牌。</li>
                  <li><span className="text-white font-medium">8 点是万能牌</span>：可以在任何时候打出（除非正在选择花色）。</li>
                  <li>打出 8 点后，你可以<span className="text-white font-medium">指定一种新的花色</span>。</li>
                </ul>
              </section>

              <section>
                <h3 className="text-yellow-500 font-bold mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" /> 摸牌规则
                </h3>
                <p>如果你没有可打出的牌，必须从牌堆中摸一张牌。如果摸到的牌可以打出，你可以立即打出它。</p>
              </section>

              <section>
                <h3 className="text-yellow-500 font-bold mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" /> 智能提示
                </h3>
                <p>游戏中会用<span className="text-red-500 font-bold">红色边框</span>提示你当前手牌中的最佳选择，帮助你更快获胜！</p>
              </section>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-zinc-800 bg-zinc-800/30">
              <button
                onClick={onClose}
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-yellow-500/10"
              >
                我知道了，开始游戏
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
