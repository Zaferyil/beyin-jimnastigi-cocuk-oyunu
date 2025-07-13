import React, { useState, useEffect } from 'react';
import { Star, Trophy, Brain, Heart, Smile } from 'lucide-react';

const CognitiveGameForKids = () => {
  const [currentGame, setCurrentGame] = useState('menu');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameData, setGameData] = useState({});
  const [showCelebration, setShowCelebration] = useState(false);

  // Memory Game State
  const [memoryCards, setMemoryCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [canFlip, setCanFlip] = useState(true);

  // Color Sequence Game State
  const [colorSequence, setColorSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [showingSequence, setShowingSequence] = useState(false);
  const [activeColor, setActiveColor] = useState(null);

  // Quick Reaction Game State
  const [balloons, setBalloons] = useState([]);
  const [targetColor, setTargetColor] = useState('');
  const [reactionScore, setReactionScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  const animals = ['🐱', '🐶', '🐰', '🦊', '🐸', '🐧'];
  const colors = ['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400', 'bg-pink-400'];
  const balloonColors = ['🔴', '🔵', '🟢', '🟡', '🟣', '🟠'];

  const celebrate = () => {
    setShowCelebration(true);
    setScore(prev => prev + 10);
    setTimeout(() => setShowCelebration(false), 2000);
  };

  // Memory Game Functions
  const initMemoryGame = () => {
    const gameAnimals = animals.slice(0, Math.min(3 + level, 6));
    const cards = [...gameAnimals, ...gameAnimals]
      .sort(() => Math.random() - 0.5)
      .map((animal, index) => ({ id: index, animal, flipped: false }));
    setMemoryCards(cards);
    setFlippedCards([]);
    setMatchedPairs([]);
  };

  const flipCard = (cardId) => {
    if (!canFlip || flippedCards.length >= 2 || flippedCards.includes(cardId) || matchedPairs.includes(cardId)) return;

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setCanFlip(false);
      const [first, second] = newFlipped;
      const firstCard = memoryCards.find(card => card.id === first);
      const secondCard = memoryCards.find(card => card.id === second);

      setTimeout(() => {
        if (firstCard.animal === secondCard.animal) {
          setMatchedPairs(prev => [...prev, first, second]);
          celebrate();
          if (matchedPairs.length + 2 === memoryCards.length) {
            setTimeout(() => {
              setLevel(prev => prev + 1);
              initMemoryGame();
            }, 1000);
          }
        }
        setFlippedCards([]);
        setCanFlip(true);
      }, 1000);
    }
  };

  // Color Sequence Game Functions
  const initColorSequence = () => {
    const sequence = [];
    for (let i = 0; i < 2 + level; i++) {
      sequence.push(Math.floor(Math.random() * 4));
    }
    setColorSequence(sequence);
    setPlayerSequence([]);
    showSequence(sequence);
  };

  const showSequence = (sequence) => {
    setShowingSequence(true);
    sequence.forEach((colorIndex, index) => {
      setTimeout(() => {
        setActiveColor(colorIndex);
        setTimeout(() => setActiveColor(null), 400);
      }, (index + 1) * 600);
    });
    setTimeout(() => setShowingSequence(false), sequence.length * 600 + 500);
  };

  const addPlayerColor = (colorIndex) => {
    if (showingSequence) return;
    
    const newSequence = [...playerSequence, colorIndex];
    setPlayerSequence(newSequence);

    if (newSequence[newSequence.length - 1] !== colorSequence[newSequence.length - 1]) {
      // Wrong color
      setTimeout(() => {
        setPlayerSequence([]);
        showSequence(colorSequence);
      }, 500);
      return;
    }

    if (newSequence.length === colorSequence.length) {
      celebrate();
      setTimeout(() => {
        setLevel(prev => prev + 1);
        initColorSequence();
      }, 1000);
    }
  };

  // Quick Reaction Game Functions
  const initReactionGame = () => {
    setReactionScore(0);
    setTimeLeft(30);
    setTargetColor(balloonColors[Math.floor(Math.random() * balloonColors.length)]);
    generateBalloons();

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const balloonGenerator = setInterval(() => {
      if (timeLeft > 0) generateBalloons();
    }, 2000);

    setTimeout(() => {
      clearInterval(timer);
      clearInterval(balloonGenerator);
    }, 30000);
  };

  const generateBalloons = () => {
    const newBalloons = [];
    for (let i = 0; i < 3; i++) {
      newBalloons.push({
        id: Math.random(),
        color: balloonColors[Math.floor(Math.random() * balloonColors.length)],
        x: Math.random() * 80 + 10,
        y: Math.random() * 60 + 20
      });
    }
    setBalloons(newBalloons);
  };

  const popBalloon = (balloon) => {
    if (balloon.color === targetColor) {
      setReactionScore(prev => prev + 1);
      celebrate();
      setTargetColor(balloonColors[Math.floor(Math.random() * balloonColors.length)]);
    }
    setBalloons(prev => prev.filter(b => b.id !== balloon.id));
  };

  useEffect(() => {
    if (currentGame === 'memory') initMemoryGame();
    if (currentGame === 'colors') initColorSequence();
    if (currentGame === 'reaction') initReactionGame();
  }, [currentGame]);

  const GameMenu = () => (
    <div className="text-center space-y-8">
      <div className="mb-8">
        <Brain className="mx-auto text-6xl text-purple-500 mb-4" size={80} />
        <h1 className="text-4xl font-bold text-purple-600 mb-2">Beyin Jimnastiği Macerası!</h1>
        <p className="text-xl text-gray-600">Hangi oyunu oynamak istiyorsun?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <button
          onClick={() => setCurrentGame('memory')}
          className="bg-gradient-to-b from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white p-8 rounded-3xl shadow-lg transform hover:scale-105 transition-all"
        >
          <div className="text-6xl mb-4">🧠</div>
          <h3 className="text-2xl font-bold mb-2">Hafıza Kartları</h3>
          <p className="text-lg">Aynı hayvanları bul!</p>
        </button>

        <button
          onClick={() => setCurrentGame('colors')}
          className="bg-gradient-to-b from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white p-8 rounded-3xl shadow-lg transform hover:scale-105 transition-all"
        >
          <div className="text-6xl mb-4">🌈</div>
          <h3 className="text-2xl font-bold mb-2">Renk Sırası</h3>
          <p className="text-lg">Renkleri tekrarla!</p>
        </button>

        <button
          onClick={() => setCurrentGame('reaction')}
          className="bg-gradient-to-b from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 text-white p-8 rounded-3xl shadow-lg transform hover:scale-105 transition-all"
        >
          <div className="text-6xl mb-4">🎈</div>
          <h3 className="text-2xl font-bold mb-2">Hızlı Tepki</h3>
          <p className="text-lg">Doğru balonu patlat!</p>
        </button>
      </div>

      <div className="flex justify-center items-center space-x-4 mt-8">
        <Star className="text-yellow-400" size={24} />
        <span className="text-2xl font-bold text-purple-600">Puan: {score}</span>
        <Trophy className="text-orange-400" size={24} />
        <span className="text-2xl font-bold text-purple-600">Seviye: {level}</span>
      </div>
    </div>
  );

  const MemoryGame = () => (
    <div className="text-center">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setCurrentGame('menu')}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-bold"
        >
          ← Ana Menü
        </button>
        <h2 className="text-3xl font-bold text-blue-600">Hafıza Kartları</h2>
        <div className="text-xl font-bold text-purple-600">Seviye: {level}</div>
      </div>

      <p className="text-lg mb-6 text-gray-600">Aynı hayvanları bulup eşleştir!</p>

      <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
        {memoryCards.map(card => (
          <button
            key={card.id}
            onClick={() => flipCard(card.id)}
            className={`aspect-square text-4xl rounded-xl shadow-lg transition-all transform hover:scale-105 ${
              flippedCards.includes(card.id) || matchedPairs.includes(card.id)
                ? 'bg-white border-4 border-blue-400'
                : 'bg-gradient-to-b from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700'
            }`}
          >
            {flippedCards.includes(card.id) || matchedPairs.includes(card.id) ? card.animal : '❓'}
          </button>
        ))}
      </div>
    </div>
  );

  const ColorSequenceGame = () => (
    <div className="text-center">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setCurrentGame('menu')}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-bold"
        >
          ← Ana Menü
        </button>
        <h2 className="text-3xl font-bold text-green-600">Renk Sırası</h2>
        <div className="text-xl font-bold text-purple-600">Seviye: {level}</div>
      </div>

      <p className="text-lg mb-6 text-gray-600">
        {showingSequence ? 'Renkleri izle...' : 'Gördüğün sırayla renklere bas!'}
      </p>

      <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
        {colors.slice(0, 4).map((color, index) => (
          <button
            key={index}
            onClick={() => addPlayerColor(index)}
            disabled={showingSequence}
            className={`aspect-square rounded-xl shadow-lg transition-all transform hover:scale-105 ${color} ${
              activeColor === index ? 'ring-8 ring-yellow-300 scale-110' : ''
            } ${showingSequence ? 'cursor-not-allowed' : 'hover:shadow-xl'}`}
          />
        ))}
      </div>

      <div className="mt-6">
        <div className="text-lg font-bold text-gray-600">Senin sıran:</div>
        <div className="flex justify-center space-x-2 mt-2">
          {playerSequence.map((colorIndex, i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-full ${colors[colorIndex]}`}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const ReactionGame = () => (
    <div className="text-center">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setCurrentGame('menu')}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-bold"
        >
          ← Ana Menü
        </button>
        <h2 className="text-3xl font-bold text-red-600">Hızlı Tepki</h2>
        <div className="text-xl font-bold text-purple-600">Süre: {timeLeft}s</div>
      </div>

      <div className="mb-6">
        <p className="text-lg text-gray-600 mb-2">Bu renkli balonu patlat:</p>
        <div className="text-6xl">{targetColor}</div>
        <p className="text-xl font-bold text-green-600 mt-2">Puan: {reactionScore}</p>
      </div>

      <div className="relative bg-gradient-to-b from-blue-200 to-blue-400 rounded-xl h-96 overflow-hidden">
        {balloons.map(balloon => (
          <button
            key={balloon.id}
            onClick={() => popBalloon(balloon)}
            className="absolute text-4xl hover:scale-110 transition-transform"
            style={{ left: `${balloon.x}%`, top: `${balloon.y}%` }}
          >
            {balloon.color}
          </button>
        ))}
      </div>

      {timeLeft === 0 && (
        <div className="mt-4 p-4 bg-yellow-100 rounded-xl">
          <h3 className="text-2xl font-bold text-yellow-800">Oyun Bitti!</h3>
          <p className="text-xl text-yellow-700">Toplam Puan: {reactionScore}</p>
          <button
            onClick={() => initReactionGame()}
            className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-xl font-bold"
          >
            Tekrar Oyna
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Celebration Animation */}
        {showCelebration && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-yellow-400 text-white px-8 py-4 rounded-full text-2xl font-bold animate-bounce shadow-lg">
              🎉 Harika! +10 Puan! 🎉
            </div>
          </div>
        )}

        {/* Game Content */}
        {currentGame === 'menu' && <GameMenu />}
        {currentGame === 'memory' && <MemoryGame />}
        {currentGame === 'colors' && <ColorSequenceGame />}
        {currentGame === 'reaction' && <ReactionGame />}
      </div>
    </div>
  );
};

export default CognitiveGameForKids;