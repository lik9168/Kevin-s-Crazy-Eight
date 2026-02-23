import { useState, useEffect, useCallback } from 'react';
import { Card, GameState, PlayerType, Rank, Suit } from '../types';
import { createDeck, shuffle } from '../utils';

export const useCrazyEights = () => {
  const [gameState, setGameState] = useState<GameState>({
    deck: [],
    discardPile: [],
    playerHand: [],
    aiHand: [],
    currentPlayer: 'player',
    activeSuit: null,
    winner: null,
    isWildSelecting: false,
    lastAction: '游戏开始！轮到你了。',
  });

  const getSuitName = (suit: Suit) => {
    switch (suit) {
      case Suit.HEARTS: return '红心';
      case Suit.DIAMONDS: return '方块';
      case Suit.CLUBS: return '梅花';
      case Suit.SPADES: return '黑桃';
      default: return suit;
    }
  };

  const initGame = useCallback(() => {
    const fullDeck = shuffle(createDeck());
    const playerHand = fullDeck.splice(0, 8);
    const aiHand = fullDeck.splice(0, 8);
    
    // Ensure the first discard isn't an 8 for simplicity, or handle it
    let firstDiscard = fullDeck.pop()!;
    while (firstDiscard.rank === Rank.EIGHT) {
      fullDeck.unshift(firstDiscard);
      shuffle(fullDeck);
      firstDiscard = fullDeck.pop()!;
    }

    setGameState({
      deck: fullDeck,
      discardPile: [firstDiscard],
      playerHand,
      aiHand,
      currentPlayer: 'player',
      activeSuit: firstDiscard.suit,
      winner: null,
      isWildSelecting: false,
      lastAction: '游戏开始！轮到你了。',
    });
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const canPlayCard = (card: Card, state: GameState): boolean => {
    if (card.rank === Rank.EIGHT) return true;
    const topCard = state.discardPile[state.discardPile.length - 1];
    return card.suit === state.activeSuit || card.rank === topCard.rank;
  };

  const playCard = (card: Card, player: PlayerType) => {
    if (gameState.currentPlayer !== player || gameState.winner) return;
    if (!canPlayCard(card, gameState)) return;

    setGameState(prev => {
      const isPlayer = player === 'player';
      const hand = isPlayer ? prev.playerHand : prev.aiHand;
      const newHand = hand.filter(c => c.id !== card.id);
      const newDiscardPile = [...prev.discardPile, card];
      
      const isWild = card.rank === Rank.EIGHT;
      const nextPlayer: PlayerType = isWild ? player : (player === 'player' ? 'ai' : 'player');
      
      const newState: GameState = {
        ...prev,
        discardPile: newDiscardPile,
        playerHand: isPlayer ? newHand : prev.playerHand,
        aiHand: !isPlayer ? newHand : prev.aiHand,
        currentPlayer: isWild ? player : nextPlayer,
        activeSuit: isWild ? prev.activeSuit : card.suit,
        isWildSelecting: isWild && isPlayer,
        lastAction: `${player === 'player' ? '你' : 'AI'} 打出了 ${getSuitName(card.suit)} ${card.rank}。`,
      };

      if (newHand.length === 0) {
        newState.winner = player;
        newState.lastAction = `${player === 'player' ? '你' : 'AI'} 赢得了比赛！`;
      }

      return newState;
    });
  };

  const selectWildSuit = (suit: Suit) => {
    setGameState(prev => ({
      ...prev,
      activeSuit: suit,
      isWildSelecting: false,
      currentPlayer: prev.currentPlayer === 'player' ? 'ai' : 'player',
      lastAction: `花色更改为 ${getSuitName(suit)}。轮到 AI 了。`,
    }));
  };

  const drawCard = (player: PlayerType) => {
    if (gameState.currentPlayer !== player || gameState.winner || gameState.isWildSelecting) return;

    setGameState(prev => {
      if (prev.deck.length === 0) {
        return {
          ...prev,
          currentPlayer: player === 'player' ? 'ai' : 'player',
          lastAction: `${player === 'player' ? '你' : 'AI'} 被迫跳过（牌堆已空）。`,
        };
      }

      const newDeck = [...prev.deck];
      const drawnCard = newDeck.pop()!;
      const isPlayer = player === 'player';
      const hand = isPlayer ? prev.playerHand : prev.aiHand;
      const newHand = [...hand, drawnCard];

      return {
        ...prev,
        deck: newDeck,
        playerHand: isPlayer ? newHand : prev.playerHand,
        aiHand: !isPlayer ? newHand : prev.aiHand,
        lastAction: `${player === 'player' ? '你' : 'AI'} 摸了一张牌。`,
      };
    });
  };

  // AI Logic
  useEffect(() => {
    if (gameState.currentPlayer === 'ai' && !gameState.winner && !gameState.isWildSelecting) {
      const timer = setTimeout(() => {
        const playableCards = gameState.aiHand.filter(c => canPlayCard(c, gameState));
        
        if (playableCards.length > 0) {
          // Priority: play non-8s first, then 8s
          const nonEight = playableCards.find(c => c.rank !== Rank.EIGHT);
          const cardToPlay = nonEight || playableCards[0];
          
          playCard(cardToPlay, 'ai');

          // If AI played an 8, it needs to pick a suit
          if (cardToPlay.rank === Rank.EIGHT) {
            // Simple AI: pick the suit it has the most of
            const suitCounts: Record<string, number> = {};
            gameState.aiHand.forEach(c => {
              if (c.id !== cardToPlay.id) {
                suitCounts[c.suit] = (suitCounts[c.suit] || 0) + 1;
              }
            });
            const bestSuit = (Object.keys(suitCounts).sort((a, b) => suitCounts[b] - suitCounts[a])[0] as Suit) || Suit.HEARTS;
            
            setTimeout(() => {
              selectWildSuit(bestSuit);
            }, 1000);
          }
        } else {
          if (gameState.deck.length > 0) {
            drawCard('ai');
          } else {
            setGameState(prev => ({
              ...prev,
              currentPlayer: 'player',
              lastAction: 'AI 被迫跳过（牌堆已空）。轮到你了。',
            }));
          }
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [gameState.currentPlayer, gameState.aiHand, gameState.discardPile, gameState.activeSuit, gameState.winner]);

  const getBestCard = useCallback((hand: Card[], state: GameState): Card | null => {
    const playableCards = hand.filter(c => canPlayCard(c, state));
    if (playableCards.length === 0) return null;

    const nonEights = playableCards.filter(c => c.rank !== Rank.EIGHT);
    if (nonEights.length > 0) {
      // Heuristic: pick the card from the suit the player has the most of
      const suitCounts: Record<string, number> = {};
      hand.forEach(c => {
        suitCounts[c.suit] = (suitCounts[c.suit] || 0) + 1;
      });

      return nonEights.reduce((best, current) => {
        if (!best) return current;
        return suitCounts[current.suit] > suitCounts[best.suit] ? current : best;
      }, null as Card | null);
    }

    return playableCards[0]; // Must be an 8
  }, []);

  return {
    gameState,
    playCard,
    drawCard,
    selectWildSuit,
    initGame,
    getBestCard,
  };
};
