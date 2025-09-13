import React, { useState, useEffect } from 'react';
import { ArrowLeft, Gamepad2, Star, RotateCcw } from 'lucide-react';
import { Grade } from '../App';

interface GamesZoneProps {
  grade: Grade;
  onAddPoints: (points: number) => void;
  onAddBadge: (badge: string) => void;
  onBack: () => void;
}

export function GamesZone({ grade, onAddPoints, onAddBadge, onBack }: GamesZoneProps) {
  const [currentGame, setCurrentGame] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  // Memory Game State
  const [cards, setCards] = useState<Array<{id: number, emoji: string, isFlipped: boolean, isMatched: boolean}>>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  // Drag and Drop State
  const [dragItems, setDragItems] = useState<Array<{id: number, text: string, category: string}>>([]);
  const [dropZones, setDropZones] = useState<Array<{category: string, items: any[]}>>([]);
  const [draggedItem, setDraggedItem] = useState<any>(null);

  const memoryEmojis = ['🐱', '🐶', '🐰', '🦊', '🐸', '🐧', '🦋', '🐝'];

  const initializeMemoryGame = () => {
    const gameEmojis = memoryEmojis.slice(0, grade >= 3 ? 8 : 6);
    const shuffledCards = [...gameEmojis, ...gameEmojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false
      }));
    
    setCards(shuffledCards);
    setFlippedCards([]);
    setMoves(0);
  };

  const initializeDragDropGame = () => {
    const animals = [
      { id: 1, text: '🐱 Cat', category: 'animals' },
      { id: 2, text: '🐶 Dog', category: 'animals' },
      { id: 3, text: '🍎 Apple', category: 'fruits' },
      { id: 4, text: '🍌 Banana', category: 'fruits' }
    ];
    
    setDragItems(animals.sort(() => Math.random() - 0.5));
    setDropZones([
      { category: 'animals', items: [] },
      { category: 'fruits', items: [] }
    ]);
  };

  useEffect(() => {
    if (currentGame === 'memory') {
      initializeMemoryGame();
    } else if (currentGame === 'dragdrop') {
      initializeDragDropGame();
    }
  }, [currentGame, grade]);

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2) return;
    if (cards[id].isFlipped || cards[id].isMatched) return;

    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);

    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlippedCards;
      
      if (cards[first].emoji === cards[second].emoji) {
        // Match found
        setTimeout(() => {
          const updatedCards = [...newCards];
          updatedCards[first].isMatched = true;
          updatedCards[second].isMatched = true;
          setCards(updatedCards);
          setFlippedCards([]);
          onAddPoints(25);
          
          // Check if game is complete
          if (updatedCards.every(card => card.isMatched)) {
            onAddBadge('memory-master');
          }
        }, 1000);
      } else {
        // No match
        setTimeout(() => {
          const updatedCards = [...newCards];
          updatedCards[first].isFlipped = false;
          updatedCards[second].isFlipped = false;
          setCards(updatedCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const handleDragStart = (e: React.DragEvent, item: any) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent, category: string) => {
    e.preventDefault();
    if (draggedItem && draggedItem.category === category) {
      setDropZones(prev => prev.map(zone => 
        zone.category === category 
          ? { ...zone, items: [...zone.items, draggedItem] }
          : zone
      ));
      setDragItems(prev => prev.filter(item => item.id !== draggedItem.id));
      onAddPoints(15);
    }
    setDraggedItem(null);
  };

  const games = [
    {
      id: 'memory',
      title: 'Memory Match',
      icon: '🧠',
      color: 'from-purple-400 to-purple-600',
      description: 'Match the pairs!'
    },
    {
      id: 'dragdrop',
      title: 'Sort & Drop',
      icon: '🎯',
      color: 'from-blue-400 to-blue-600',
      description: 'Put things where they belong!'
    },
    {
      id: 'puzzle',
      title: 'Picture Puzzle',
      icon: '🧩',
      color: 'from-green-400 to-green-600',
      description: 'Complete the picture!',
      comingSoon: true
    },
    {
      id: 'quiz',
      title: 'Quick Quiz',
      icon: '⚡',
      color: 'from-yellow-400 to-orange-500',
      description: 'Answer fast questions!',
      comingSoon: true
    }
  ];

  if (currentGame === 'memory') {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentGame(null)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">Memory Match</h2>
                <p className="text-gray-600">Moves: {moves}</p>
              </div>
              <button
                onClick={initializeMemoryGame}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-2xl hover:bg-blue-200 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </button>
            </div>
          </div>

          <div className={`grid ${grade >= 3 ? 'grid-cols-4' : 'grid-cols-3'} gap-4 max-w-2xl mx-auto`}>
            {cards.map((card) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className={`aspect-square rounded-2xl text-4xl font-bold transition-all duration-300 ${
                  card.isFlipped || card.isMatched
                    ? 'bg-white shadow-lg'
                    : 'bg-gradient-to-br from-purple-400 to-purple-600 hover:scale-105'
                } ${card.isMatched ? 'ring-4 ring-green-400' : ''}`}
              >
                {card.isFlipped || card.isMatched ? card.emoji : '?'}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (currentGame === 'dragdrop') {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentGame(null)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">Sort & Drop</h2>
                <p className="text-gray-600">Drag items to the right category!</p>
              </div>
              <button
                onClick={initializeDragDropGame}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-2xl hover:bg-blue-200 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Items to drag */}
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Items to Sort</h3>
              <div className="space-y-3">
                {dragItems.map((item) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item)}
                    className="p-3 bg-gray-100 rounded-2xl cursor-move hover:bg-gray-200 transition-colors text-lg"
                  >
                    {item.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Drop zones */}
            {dropZones.map((zone) => (
              <div
                key={zone.category}
                onDrop={(e) => handleDrop(e, zone.category)}
                onDragOver={(e) => e.preventDefault()}
                className="bg-white rounded-3xl shadow-lg p-6 min-h-64"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4 capitalize">
                  {zone.category} 🏷️
                </h3>
                <div className={`border-4 border-dashed border-gray-300 rounded-2xl p-4 min-h-48 ${
                  draggedItem?.category === zone.category ? 'border-green-400 bg-green-50' : ''
                }`}>
                  <div className="space-y-2">
                    {zone.items.map((item, index) => (
                      <div key={index} className="p-2 bg-green-100 rounded-lg text-lg">
                        {item.text}
                      </div>
                    ))}
                  </div>
                  {zone.items.length === 0 && (
                    <p className="text-gray-500 text-center mt-12">Drop {zone.category} here!</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back Home
            </button>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <Gamepad2 className="w-8 h-8 text-pink-500" />
                Learning Games - Grade {grade}
              </h1>
              <p className="text-gray-600">Let's play and learn together!</p>
            </div>
            <div className="w-24"></div>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map((game) => (
            <button
              key={game.id}
              onClick={() => !game.comingSoon && setCurrentGame(game.id)}
              disabled={game.comingSoon}
              className={`bg-white rounded-3xl shadow-lg p-6 transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                game.comingSoon ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${game.color} rounded-2xl flex items-center justify-center text-3xl mb-4 mx-auto`}>
                {game.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{game.title}</h3>
              <p className="text-gray-600 text-sm">{game.description}</p>
              {game.comingSoon && (
                <p className="text-orange-500 text-xs mt-2 font-bold">Coming Soon!</p>
              )}
            </button>
          ))}
        </div>

        {/* Game Tips */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mt-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🎮 Game Tips!</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4">
              <h3 className="font-bold text-purple-800 mb-2">Memory Games</h3>
              <p className="text-purple-600 text-sm">Try to remember where each card is. Start by flipping cards that are far apart!</p>
            </div>
            <div className="bg-gradient-to-r from-blue-100 to-teal-100 rounded-2xl p-4">
              <h3 className="font-bold text-blue-800 mb-2">Sorting Games</h3>
              <p className="text-blue-600 text-sm">Think about what group each item belongs to. Animals, fruits, colors - they all have their place!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}