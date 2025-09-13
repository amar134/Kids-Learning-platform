import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Volume2, Star, CheckCircle, X } from 'lucide-react';
import { Grade } from '../App';

interface EnglishZoneProps {
  grade: Grade;
  onAddPoints: (points: number) => void;
  onAddBadge: (badge: string) => void;
  onBack: () => void;
}

export function EnglishZone({ grade, onAddPoints, onAddBadge, onBack }: EnglishZoneProps) {
  const [currentExercise, setCurrentExercise] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // Spelling Bee data by grade
  const spellingWords = {
    1: [
      { word: 'cat', definition: 'A small furry animal that says meow', sentence: 'The cat is sleeping on the mat.', difficulty: 'easy' },
      { word: 'dog', definition: 'A friendly animal that barks and wags its tail', sentence: 'My dog loves to play fetch.', difficulty: 'easy' },
      { word: 'sun', definition: 'The bright star that gives us light and warmth', sentence: 'The sun is shining today.', difficulty: 'easy' },
      { word: 'book', definition: 'Something you read with pages and words', sentence: 'I love reading my favorite book.', difficulty: 'easy' },
      { word: 'tree', definition: 'A tall plant with leaves and branches', sentence: 'The bird built a nest in the tree.', difficulty: 'easy' }
    ],
    2: [
      { word: 'happy', definition: 'Feeling joy and cheerfulness', sentence: 'She was happy to see her friends.', difficulty: 'medium' },
      { word: 'school', definition: 'A place where children go to learn', sentence: 'I walk to school every morning.', difficulty: 'medium' },
      { word: 'friend', definition: 'Someone you like and enjoy spending time with', sentence: 'My best friend lives next door.', difficulty: 'medium' },
      { word: 'water', definition: 'Clear liquid that we drink to stay healthy', sentence: 'Plants need water to grow.', difficulty: 'medium' },
      { word: 'house', definition: 'A building where people live', sentence: 'Our house has a red door.', difficulty: 'medium' }
    ],
    3: [
      { word: 'beautiful', definition: 'Very pretty or lovely to look at', sentence: 'The butterfly has beautiful colors.', difficulty: 'medium' },
      { word: 'elephant', definition: 'A very large gray animal with a long trunk', sentence: 'The elephant sprayed water with its trunk.', difficulty: 'hard' },
      { word: 'rainbow', definition: 'Colorful arc in the sky after rain', sentence: 'We saw a rainbow after the storm.', difficulty: 'medium' },
      { word: 'birthday', definition: 'The day you were born, celebrated each year', sentence: 'Today is my birthday party.', difficulty: 'medium' },
      { word: 'butterfly', definition: 'A colorful insect with large wings', sentence: 'The butterfly landed on the flower.', difficulty: 'hard' }
    ],
    4: [
      { word: 'adventure', definition: 'An exciting and unusual experience', sentence: 'We went on an adventure in the forest.', difficulty: 'hard' },
      { word: 'important', definition: 'Something that matters a lot', sentence: 'It is important to brush your teeth.', difficulty: 'hard' },
      { word: 'different', definition: 'Not the same as something else', sentence: 'Each snowflake is different.', difficulty: 'hard' },
      { word: 'favorite', definition: 'The thing you like best', sentence: 'Pizza is my favorite food.', difficulty: 'medium' },
      { word: 'together', definition: 'With each other, as a group', sentence: 'We played together at recess.', difficulty: 'hard' }
    ],
    5: [
      { word: 'magnificent', definition: 'Extremely beautiful or impressive', sentence: 'The castle looked magnificent in the sunset.', difficulty: 'hard' },
      { word: 'mysterious', definition: 'Strange and difficult to understand', sentence: 'The old house had a mysterious atmosphere.', difficulty: 'hard' },
      { word: 'celebration', definition: 'A special event to mark a happy occasion', sentence: 'The celebration lasted all night.', difficulty: 'hard' },
      { word: 'imagination', definition: 'The ability to create pictures in your mind', sentence: 'Her imagination helped her write amazing stories.', difficulty: 'hard' },
      { word: 'responsibility', definition: 'A duty or task you are expected to do', sentence: 'Taking care of pets is a big responsibility.', difficulty: 'hard' }
    ]
  };

  // Rhyming data
  const rhymingData = {
    1: [
      { 
        word: 'cat', 
        rhymes: ['bat', 'hat', 'mat', 'rat'], 
        type: 'perfect',
        hint: 'Words that end with -at sound'
      },
      { 
        word: 'dog', 
        rhymes: ['log', 'frog', 'hog', 'jog'], 
        type: 'perfect',
        hint: 'Words that end with -og sound'
      },
      { 
        word: 'sun', 
        rhymes: ['fun', 'run', 'bun', 'gun'], 
        type: 'perfect',
        hint: 'Words that end with -un sound'
      }
    ],
    2: [
      { 
        word: 'play', 
        rhymes: ['day', 'way', 'say', 'may'], 
        type: 'perfect',
        hint: 'Words that end with -ay sound'
      },
      { 
        word: 'night', 
        rhymes: ['light', 'bright', 'sight', 'right'], 
        type: 'perfect',
        hint: 'Words that end with -ight sound'
      },
      { 
        word: 'tree', 
        rhymes: ['bee', 'see', 'free', 'key'], 
        type: 'perfect',
        hint: 'Words that end with -ee sound'
      }
    ]
  };

  // Word scramble exercise
  const wordScrambleData = {
    1: [
      { scrambled: 'TAC', answer: 'CAT', hint: '🐱' },
      { scrambled: 'GOD', answer: 'DOG', hint: '🐶' },
      { scrambled: 'NSU', answer: 'SUN', hint: '☀️' },
      { scrambled: 'OTY', answer: 'TOY', hint: '🧸' },
      { scrambled: 'BLA', answer: 'LAB', hint: '🔬' }
    ],
    2: [
      { scrambled: 'KOBO', answer: 'BOOK', hint: '📚' },
      { scrambled: 'REET', answer: 'TREE', hint: '🌳' },
      { scrambled: 'NOOM', answer: 'MOON', hint: '🌙' },
      { scrambled: 'HOUS', answer: 'SHOW', hint: '🎭' },
      { scrambled: 'PALY', answer: 'PLAY', hint: '⚽' }
    ]
  };

  // Vocabulary matching
  const vocabularyData = {
    1: [
      { word: 'Happy', options: ['Sad', 'Joy', 'Angry'], answer: 'Joy', hint: 'How you feel when you smile! 😊' },
      { word: 'Big', options: ['Small', 'Large', 'Tiny'], answer: 'Large', hint: 'Another word for very big!' },
      { word: 'Fast', options: ['Slow', 'Quick', 'Stop'], answer: 'Quick', hint: 'Like a racing car! 🏎️' }
    ],
    2: [
      { word: 'Beautiful', options: ['Ugly', 'Pretty', 'Bad'], answer: 'Pretty', hint: 'Something that looks very nice! 🌸' },
      { word: 'Smart', options: ['Dumb', 'Clever', 'Slow'], answer: 'Clever', hint: 'Someone who knows a lot! 🧠' },
      { word: 'Strong', options: ['Weak', 'Powerful', 'Soft'], answer: 'Powerful', hint: 'Like a superhero! 💪' }
    ]
  };

  const [currentData, setCurrentData] = useState<any[]>([]);

  useEffect(() => {
    if (currentExercise === 'scramble') {
      setCurrentData(wordScrambleData[grade as keyof typeof wordScrambleData] || wordScrambleData[1]);
    } else if (currentExercise === 'vocabulary') {
      setCurrentData(vocabularyData[grade as keyof typeof vocabularyData] || vocabularyData[1]);
    } else if (currentExercise === 'spelling') {
      setCurrentData(spellingWords[grade as keyof typeof spellingWords] || spellingWords[1]);
    } else if (currentExercise === 'rhyming') {
      setCurrentData(rhymingData[grade as keyof typeof rhymingData] || rhymingData[1]);
    }
    setCurrentQuestion(0);
    setScore(0);
    setAttempts(0);
  }, [currentExercise, grade]);

  // Text-to-speech function (simulated)
  const speakWord = (word: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.7;
      utterance.pitch = 1.1;
      speechSynthesis.speak(utterance);
    }
  };

  const handleSubmit = () => {
    if (!currentData[currentQuestion]) return;
    
    let correct = false;
    
    if (currentExercise === 'spelling') {
      correct = userAnswer.toLowerCase().trim() === currentData[currentQuestion].word.toLowerCase();
    } else if (currentExercise === 'rhyming') {
      const validRhymes = currentData[currentQuestion].rhymes;
      correct = validRhymes.some((rhyme: string) => 
        rhyme.toLowerCase() === userAnswer.toLowerCase().trim()
      );
    } else if (currentExercise === 'scramble') {
      correct = userAnswer.toUpperCase() === currentData[currentQuestion].answer.toUpperCase();
    } else if (currentExercise === 'vocabulary') {
      correct = userAnswer === currentData[currentQuestion].answer;
    }
    
    setIsCorrect(correct);
    setShowResult(true);
    setAttempts(attempts + 1);
    
    if (correct) {
      setScore(score + 1);
      const points = currentExercise === 'spelling' ? 25 : currentExercise === 'rhyming' ? 20 : 15;
      onAddPoints(points);
    }

    setTimeout(() => {
      setShowResult(false);
      setUserAnswer('');
      if (currentQuestion < currentData.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        if (score >= Math.ceil(currentData.length * 0.6)) {
          onAddBadge('english-star');
        }
        setCurrentExercise(null);
      }
    }, 2000);
  };

  const englishAreas = [
    {
      id: 'vocabulary',
      title: 'Word Power',
      icon: '📝',
      color: 'from-green-400 to-green-600',
      description: 'Learn new words!'
    },
    {
      id: 'scramble',
      title: 'Word Scramble',
      icon: '🔤',
      color: 'from-blue-400 to-blue-600',
      description: 'Unscramble the letters!'
    },
    {
      id: 'rhyming',
      title: 'Rhyme Time',
      icon: '🎵',
      color: 'from-purple-400 to-purple-600',
      description: 'Find words that rhyme!'
    },
    {
      id: 'spelling',
      title: 'Spelling Bee',
      icon: '🐝',
      color: 'from-yellow-400 to-orange-500',
      description: 'Spell it right!'
    }
  ];

  if (currentExercise && currentData.length > 0) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentExercise(null)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  {currentExercise === 'spelling' && 'Spelling Bee'}
                  {currentExercise === 'rhyming' && 'Rhyme Time'}
                  {currentExercise === 'scramble' && 'Word Scramble'}
                  {currentExercise === 'vocabulary' && 'Word Power'}
                </h2>
                <p className="text-gray-600">Question {currentQuestion + 1} of {currentData.length}</p>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="font-bold">Score: {score}</span>
              </div>
            </div>
          </div>

          {/* Exercise Card */}
          <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">
            {/* Spelling Bee */}
            {currentExercise === 'spelling' && (
              <div className="text-center">
                <div className="mb-6">
                  <button
                    onClick={() => speakWord(currentData[currentQuestion]?.word)}
                    className="flex items-center gap-3 mx-auto mb-4 px-6 py-3 bg-yellow-100 rounded-2xl hover:bg-yellow-200 transition-colors"
                  >
                    <Volume2 className="w-6 h-6 text-yellow-600" />
                    <span className="font-bold text-yellow-800">Listen to the word</span>
                  </button>
                  <div className="text-4xl mb-4">🐝</div>
                </div>
                
                <div className="bg-blue-50 rounded-2xl p-4 mb-6">
                  <h4 className="font-bold text-blue-800 mb-2">Definition:</h4>
                  <p className="text-blue-700 mb-3">{currentData[currentQuestion]?.definition}</p>
                  <h4 className="font-bold text-blue-800 mb-2">Example:</h4>
                  <p className="text-blue-700 italic">"{currentData[currentQuestion]?.sentence}"</p>
                </div>

                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="text-2xl font-bold text-center w-full max-w-md p-4 border-4 border-gray-200 rounded-2xl focus:border-yellow-400 focus:outline-none"
                  placeholder="Type the spelling..."
                  disabled={showResult}
                />
                
                <div className="mt-4 text-sm text-gray-600">
                  Difficulty: <span className={`font-bold ${
                    currentData[currentQuestion]?.difficulty === 'easy' ? 'text-green-600' :
                    currentData[currentQuestion]?.difficulty === 'medium' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {currentData[currentQuestion]?.difficulty?.toUpperCase()}
                  </span>
                </div>
              </div>
            )}

            {/* Rhyme Time */}
            {currentExercise === 'rhyming' && (
              <div className="text-center">
                <div className="text-4xl mb-4">🎵</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Find a word that rhymes with:</h3>
                <div className="text-4xl font-bold text-purple-600 mb-4">
                  {currentData[currentQuestion]?.word}
                </div>
                <button
                  onClick={() => speakWord(currentData[currentQuestion]?.word)}
                  className="mb-4 px-4 py-2 bg-purple-100 rounded-xl hover:bg-purple-200 transition-colors"
                >
                  <Volume2 className="w-4 h-4 inline mr-2" />
                  Hear it
                </button>
                
                <div className="bg-purple-50 rounded-2xl p-4 mb-6">
                  <p className="text-purple-700">
                    <strong>Hint:</strong> {currentData[currentQuestion]?.hint}
                  </p>
                </div>

                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="text-2xl font-bold text-center w-64 p-4 border-4 border-gray-200 rounded-2xl focus:border-purple-400 focus:outline-none"
                  placeholder="Your rhyme..."
                  disabled={showResult}
                />
                
                <div className="mt-4 text-sm text-gray-600">
                  Examples: {currentData[currentQuestion]?.rhymes?.slice(0, 2).join(', ')}...
                </div>
              </div>
            )}

            {/* Word Scramble */}
            {currentExercise === 'scramble' && (
              <div className="text-center">
                <div className="text-6xl mb-4">{currentData[currentQuestion]?.hint}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Unscramble this word:</h3>
                <div className="text-4xl font-bold text-blue-600 mb-6 tracking-widest">
                  {currentData[currentQuestion]?.scrambled}
                </div>
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="text-2xl font-bold text-center w-64 p-4 border-4 border-gray-200 rounded-2xl focus:border-blue-400 focus:outline-none"
                  placeholder="Your answer..."
                  disabled={showResult}
                />
              </div>
            )}

            {/* Vocabulary */}
            {currentExercise === 'vocabulary' && (
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Find a word that means the same as:</h3>
                <div className="text-4xl font-bold text-green-600 mb-4">
                  {currentData[currentQuestion]?.word}
                </div>
                <div className="text-sm text-gray-600 mb-6">{currentData[currentQuestion]?.hint}</div>
                <div className="grid grid-cols-1 gap-3">
                  {currentData[currentQuestion]?.options?.map((option: string) => (
                    <button
                      key={option}
                      onClick={() => setUserAnswer(option)}
                      className={`p-4 text-xl font-bold rounded-2xl border-4 transition-all ${
                        userAnswer === option
                          ? 'border-blue-400 bg-blue-50 text-blue-800'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                      disabled={showResult}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          {!showResult && userAnswer && (
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white text-2xl font-bold py-4 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Check Answer
            </button>
          )}

          {/* Result */}
          {showResult && (
            <div className={`text-center p-8 rounded-3xl shadow-lg ${
              isCorrect ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <div className="text-6xl mb-4">
                {isCorrect ? '🎉' : '🤔'}
              </div>
              <h3 className={`text-3xl font-bold mb-2 ${
                isCorrect ? 'text-green-800' : 'text-red-800'
              }`}>
                {isCorrect ? 'Perfect!' : 'Good Try!'}
              </h3>
              <p className={`text-lg mb-4 ${
                isCorrect ? 'text-green-600' : 'text-red-600'
              }`}>
                {isCorrect 
                  ? `You got it right! +${currentExercise === 'spelling' ? '25' : currentExercise === 'rhyming' ? '20' : '15'} points!` 
                  : currentExercise === 'spelling' 
                    ? `The correct spelling is: ${currentData[currentQuestion]?.word}`
                    : currentExercise === 'rhyming'
                    ? `Some rhymes are: ${currentData[currentQuestion]?.rhymes?.join(', ')}`
                    : `The answer is ${currentData[currentQuestion]?.answer || currentData[currentQuestion]?.word}`
                }
              </p>
              
              {/* Show attempts for spelling bee */}
              {currentExercise === 'spelling' && (
                <div className="bg-yellow-100 rounded-2xl p-3 mt-4">
                  <p className="text-yellow-800 text-sm">
                    Attempts: {attempts} | Keep practicing to improve! 🌟
                  </p>
                </div>
              )}
            </div>
          )}
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
                <BookOpen className="w-8 h-8 text-green-500" />
                English Corner - Grade {grade}
              </h1>
              <p className="text-gray-600">Let's have fun with words!</p>
            </div>
            <div className="w-24"></div>
          </div>
        </div>

        {/* English Areas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {englishAreas.map((area) => (
            <button
              key={area.id}
              onClick={() => setCurrentExercise(area.id)}
              className="bg-white rounded-3xl shadow-lg p-6 transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${area.color} rounded-2xl flex items-center justify-center text-3xl mb-4 mx-auto`}>
                {area.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{area.title}</h3>
              <p className="text-gray-600 text-sm">{area.description}</p>
            </button>
          ))}
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🐝 Spelling Bee Features</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Word pronunciation with audio</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Clear definitions and examples</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Difficulty levels by grade</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Progress tracking</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🎵 Rhyme Time Features</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-purple-500" />
                <span className="text-gray-700">Perfect rhyme matching</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-purple-500" />
                <span className="text-gray-700">Audio pronunciation help</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-purple-500" />
                <span className="text-gray-700">Helpful hints and examples</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-purple-500" />
                <span className="text-gray-700">Grade-appropriate words</span>
              </div>
            </div>
          </div>
        </div>

        {/* Word of the Day */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mt-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📚 Word of the Day!</h2>
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🌟</div>
              <div>
                <h3 className="text-2xl font-bold text-purple-800">Wonderful</h3>
                <p className="text-purple-600">Something that makes you feel amazed and happy!</p>
                <p className="text-sm text-purple-500 mt-2">Example: "What a wonderful day to learn new things!"</p>
              </div>
              <button 
                onClick={() => speakWord('wonderful')}
                className="ml-auto p-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}